// ═══════════════════════════════════════════════════════════════════════════
// GalvánDesk · Servidor del centro
// ═══════════════════════════════════════════════════════════════════════════
// Sirve la aplicación y guarda los datos en una base de datos SQLite que vive
// solo en este ordenador. No usa servicios externos ni envía nada fuera.
//
// Necesita Node.js 22.13 o posterior (trae SQLite incorporado). Sin dependencias.
// Configuración por variables de entorno (ver instalar-max.sh y la GUÍA):
//   PUERTO        puerto de escucha (443 con HTTPS)
//   DATOS         carpeta de la base de datos y las copias (por defecto ./datos)
//   APP           carpeta con la aplicación compilada (por defecto ../dist)
//   CERT, CLAVE   certificado y clave privada HTTPS (si faltan, arranca sin HTTPS)
//   ADMIN         nombre de la primera persona con cargo de Dirección
//   CENTRO        nombre del centro (solo informativo)
//   COPIAS_DIAS   días que se guardan las copias diarias (por defecto 30)

import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const PUERTO = Number(process.env.PUERTO || 8443);
const DATOS = path.resolve(process.env.DATOS || path.join(aqui, "datos"));
const APP = path.resolve(process.env.APP || path.join(aqui, "..", "dist"));
const CERT = process.env.CERT, CLAVE = process.env.CLAVE;
const ADMIN = (process.env.ADMIN || "").trim();
const CENTRO = process.env.CENTRO || "IES Enrique Tierno Galván";
const COPIAS_DIAS = Number(process.env.COPIAS_DIAS || 30);
const DURACION_SESION = 7 * 24 * 3600 * 1000;      // una semana
const MAX_CUERPO = 25 * 1024 * 1024;               // 25 MB por petición
const CARGOS_ADMIN = ["direccion", "secretaria", "tic"];

// Solo se guardan estas claves (las que usa la aplicación)
const CLAVES = new Set(["partes", "banos", "alertas", "mensajes", "alumnos", "tutores", "informes", "profesores", "guardias",
  "cuadrante", "ausencias", "apoyos_guardia", "sustitutos_guardia", "profesores_guardia", "cuentas", "firmas_guardia",
  "listas_guardia", "planes_guardia"]);

// ─── Base de datos ───────────────────────────────────────────────────────────
fs.mkdirSync(path.join(DATOS, "copias"), { recursive: true });
const RUTA_DB = path.join(DATOS, "galvandesk.db");
const db = new DatabaseSync(RUTA_DB);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA busy_timeout = 5000;
  CREATE TABLE IF NOT EXISTS datos (clave TEXT PRIMARY KEY, valor TEXT NOT NULL, version INTEGER NOT NULL, autor TEXT, ts TEXT);
  CREATE TABLE IF NOT EXISTS claves (nombre TEXT PRIMARY KEY, sal TEXT NOT NULL, huella TEXT NOT NULL, ts TEXT);
  CREATE TABLE IF NOT EXISTS sesiones (token TEXT PRIMARY KEY, nombre TEXT NOT NULL, caduca INTEGER NOT NULL);
  CREATE TABLE IF NOT EXISTS registro (id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT, nombre TEXT, accion TEXT, detalle TEXT);
  CREATE TABLE IF NOT EXISTS contador (id INTEGER PRIMARY KEY CHECK (id = 1), seq INTEGER NOT NULL);
  INSERT OR IGNORE INTO contador (id, seq) VALUES (1, 0);
`);
const q = {
  leer: db.prepare("SELECT valor, version FROM datos WHERE clave = ?"),
  todo: db.prepare("SELECT clave, valor, version FROM datos"),
  cambios: db.prepare("SELECT clave, valor, version FROM datos WHERE version > ?"),
  guardar: db.prepare("INSERT INTO datos (clave, valor, version, autor, ts) VALUES (?, ?, ?, ?, ?) ON CONFLICT(clave) DO UPDATE SET valor = excluded.valor, version = excluded.version, autor = excluded.autor, ts = excluded.ts"),
  seq: db.prepare("UPDATE contador SET seq = seq + 1 WHERE id = 1 RETURNING seq"),
  seqActual: db.prepare("SELECT seq FROM contador WHERE id = 1"),
  clave: db.prepare("SELECT sal, huella FROM claves WHERE nombre = ?"),
  ponerClave: db.prepare("INSERT INTO claves (nombre, sal, huella, ts) VALUES (?, ?, ?, ?) ON CONFLICT(nombre) DO UPDATE SET sal = excluded.sal, huella = excluded.huella, ts = excluded.ts"),
  quitarClave: db.prepare("DELETE FROM claves WHERE nombre = ?"),
  nombresConClave: db.prepare("SELECT nombre FROM claves"),
  sesion: db.prepare("SELECT nombre, caduca FROM sesiones WHERE token = ?"),
  nuevaSesion: db.prepare("INSERT INTO sesiones (token, nombre, caduca) VALUES (?, ?, ?)"),
  alargar: db.prepare("UPDATE sesiones SET caduca = ? WHERE token = ?"),
  borrarSesion: db.prepare("DELETE FROM sesiones WHERE token = ?"),
  borrarSesionesDe: db.prepare("DELETE FROM sesiones WHERE nombre = ?"),
  limpiarSesiones: db.prepare("DELETE FROM sesiones WHERE caduca < ?"),
  anotar: db.prepare("INSERT INTO registro (ts, nombre, accion, detalle) VALUES (?, ?, ?, ?)"),
  limpiarRegistro: db.prepare("DELETE FROM registro WHERE ts < ?"),
};
const ahoraISO = () => new Date().toISOString();
const leer = clave => { const f = q.leer.get(clave); return f ? { valor: JSON.parse(f.valor), version: f.version } : null; };
function escribir(clave, valor, autor) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const { seq } = q.seq.get();
    q.guardar.run(clave, JSON.stringify(valor), seq, autor, ahoraISO());
    db.exec("COMMIT");
    return seq;
  } catch (e) { db.exec("ROLLBACK"); throw e; }
}
const anotar = (nombre, accion, detalle = "") => q.anotar.run(ahoraISO(), nombre, accion, detalle);

// Primera puesta en marcha: la persona de ADMIN entra con cargo de Dirección
if (ADMIN && !leer("profesores")) {
  escribir("profesores", [ADMIN], "instalación");
  escribir("cuentas", { [ADMIN]: { cargo: "direccion" } }, "instalación");
  anotar("instalación", "inicio", `Primera persona con cargo de Dirección: ${ADMIN}`);
  console.log(`Primera puesta en marcha: ${ADMIN} tiene cargo de Dirección.`);
}

// ─── Claves: el navegador envía la huella SHA-256 y aquí se vuelve a proteger con scrypt ─
const protegerClave = (huella, sal) => crypto.scryptSync(huella, sal, 32).toString("hex");
function comprobarClave(nombre, huella) {
  const f = q.clave.get(nombre);
  if (!f) return null; // sin clave todavía
  const a = Buffer.from(protegerClave(huella, f.sal), "hex"), b = Buffer.from(f.huella, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function ponerClave(nombre, huella) {
  const sal = crypto.randomBytes(16).toString("hex");
  q.ponerClave.run(nombre, sal, protegerClave(huella, sal), ahoraISO());
}
// Las cuentas se envían sin huellas: solo si la persona tiene clave (true) o no
function cuentasPublicas(cuentas = {}) {
  const conClave = new Set(q.nombresConClave.all().map(f => f.nombre));
  const r = {};
  for (const [n, c] of Object.entries(cuentas || {})) r[n] = { ...c, clave: conClave.has(n) ? true : null };
  for (const n of conClave) if (!r[n]) r[n] = { clave: true };
  return r;
}
const cargoDe = nombre => leer("cuentas")?.valor?.[nombre]?.cargo || "profesor";
const esAdmin = nombre => CARGOS_ADMIN.includes(cargoDe(nombre));

// Intentos fallidos: tras 8 en 15 minutos, esa persona espera
const fallos = new Map();
function bloqueado(nombre) {
  const f = (fallos.get(nombre) || []).filter(t => Date.now() - t < 15 * 60 * 1000);
  fallos.set(nombre, f);
  return f.length >= 8;
}

// ─── Copias de seguridad diarias ─────────────────────────────────────────────
function copiaDiaria() {
  const hoy = new Date().toLocaleDateString("sv-SE"); // AAAA-MM-DD
  const destino = path.join(DATOS, "copias", `galvandesk-${hoy}.db`);
  try {
    if (!fs.existsSync(destino)) {
      db.exec(`VACUUM INTO '${destino.replace(/'/g, "''")}'`);
      console.log(`Copia de seguridad: ${destino}`);
    }
    const limite = Date.now() - COPIAS_DIAS * 86400000;
    for (const f of fs.readdirSync(path.join(DATOS, "copias"))) {
      const p = path.join(DATOS, "copias", f);
      if (/^galvandesk-\d{4}-\d{2}-\d{2}\.db$/.test(f) && fs.statSync(p).mtimeMs < limite) fs.unlinkSync(p);
    }
    q.limpiarSesiones.run(Date.now());
    q.limpiarRegistro.run(new Date(Date.now() - 400 * 86400000).toISOString()); // el registro de accesos se guarda ~13 meses
  } catch (e) { console.error("No se pudo hacer la copia de seguridad:", e.message); }
}
copiaDiaria();
setInterval(copiaDiaria, 3600 * 1000);

// ─── Utilidades HTTP ─────────────────────────────────────────────────────────
const CABECERAS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};
function responder(res, estado, cuerpo) {
  res.writeHead(estado, { ...CABECERAS, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(cuerpo));
}
function leerCuerpo(req) {
  return new Promise((ok, mal) => {
    let tam = 0; const trozos = [];
    req.on("data", c => { tam += c.length; if (tam > MAX_CUERPO) { mal(Object.assign(new Error("demasiado grande"), { estado: 413 })); req.destroy(); } else trozos.push(c); });
    req.on("end", () => { try { ok(trozos.length ? JSON.parse(Buffer.concat(trozos).toString("utf8")) : {}); } catch { mal(Object.assign(new Error("JSON no válido"), { estado: 400 })); } });
    req.on("error", mal);
  });
}
function quienEs(req) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const s = q.sesion.get(token);
  if (!s || s.caduca < Date.now()) { if (s) q.borrarSesion.run(token); return null; }
  q.alargar.run(Date.now() + DURACION_SESION, token);
  return { nombre: s.nombre, token };
}

// Al guardar las cuentas: nadie puede tocar huellas, y solo Administración cambia cargos o restablece claves
function filtrarCuentas(nuevas, autor) {
  const guardadas = leer("cuentas")?.valor || {};
  const admin = esAdmin(autor);
  const r = {};
  for (const [n, c] of Object.entries(nuevas || {})) {
    const antes = guardadas[n] || {};
    const { clave, ...resto } = c || {};
    r[n] = admin ? resto : { ...resto, cargo: antes.cargo };
    if (r[n].cargo === undefined) delete r[n].cargo;
    if (admin && clave === null && q.clave.get(n)) { q.quitarClave.run(n); q.borrarSesionesDe.run(n); anotar(autor, "restablece clave", n); }
  }
  if (!admin) for (const [n, c] of Object.entries(guardadas)) if (!r[n]) r[n] = c; // solo Administración borra cuentas
  return r;
}

// ─── API ─────────────────────────────────────────────────────────────────────
async function api(req, res, url) {
  const ruta = url.pathname;

  if (ruta === "/api/estado" && req.method === "GET")
    return responder(res, 200, { servidor: true, centro: CENTRO, seq: q.seqActual.get().seq });

  // Datos mínimos para la pantalla de entrada: nombres y si ya tienen clave
  if (ruta === "/api/entrada" && req.method === "GET") {
    const cuentas = cuentasPublicas(leer("cuentas")?.valor);
    for (const c of Object.values(cuentas)) delete c.email;
    return responder(res, 200, { profesores: leer("profesores")?.valor || [], cuentas });
  }

  if (ruta === "/api/entrar" && req.method === "POST") {
    const { nombre, huella } = await leerCuerpo(req);
    if (typeof nombre !== "string" || typeof huella !== "string" || !/^[0-9a-f]{64}$/.test(huella)) return responder(res, 400, { error: "Datos no válidos." });
    if (!(leer("profesores")?.valor || []).includes(nombre)) return responder(res, 403, { error: "Ese nombre no está en la lista del profesorado." });
    if (bloqueado(nombre)) return responder(res, 429, { error: "Demasiados intentos. Espera 15 minutos o pide a Administración que restablezca tu clave." });
    const ok = comprobarClave(nombre, huella);
    let primera = false;
    if (ok === null) { ponerClave(nombre, huella); primera = true; anotar(nombre, "crea su clave"); }
    else if (!ok) { fallos.get(nombre).push(Date.now()); anotar(nombre, "clave incorrecta"); return responder(res, 401, { error: "Clave incorrecta." }); }
    fallos.delete(nombre);
    const token = crypto.randomBytes(32).toString("hex");
    q.nuevaSesion.run(token, nombre, Date.now() + DURACION_SESION);
    anotar(nombre, "entra");
    return responder(res, 200, { token, nombre, primera });
  }

  const yo = quienEs(req);
  if (!yo) return responder(res, 401, { error: "Tu sesión ha caducado. Vuelve a entrar." });

  if (ruta === "/api/salir" && req.method === "POST") { q.borrarSesion.run(yo.token); anotar(yo.nombre, "sale"); return responder(res, 200, { ok: true }); }

  if (ruta === "/api/datos" && req.method === "GET") {
    const datos = {};
    for (const f of q.todo.all()) datos[f.clave] = { valor: f.clave === "cuentas" ? cuentasPublicas(JSON.parse(f.valor)) : JSON.parse(f.valor), version: f.version };
    return responder(res, 200, { yo: yo.nombre, seq: q.seqActual.get().seq, datos });
  }

  if (ruta === "/api/cambios" && req.method === "GET") {
    const desde = Number(url.searchParams.get("desde") || 0);
    const cambios = q.cambios.all(desde).map(f => ({ clave: f.clave, version: f.version, valor: f.clave === "cuentas" ? cuentasPublicas(JSON.parse(f.valor)) : JSON.parse(f.valor) }));
    return responder(res, 200, { seq: q.seqActual.get().seq, cambios });
  }

  const m = ruta.match(/^\/api\/datos\/([a-z_]+)$/);
  if (m && req.method === "PUT") {
    const clave = m[1];
    if (!CLAVES.has(clave)) return responder(res, 400, { error: "Clave desconocida." });
    const { valor, version } = await leerCuerpo(req);
    if (valor === undefined) return responder(res, 400, { error: "Falta el valor." });
    const actual = leer(clave);
    // Si otra persona ha guardado antes, se devuelve lo que hay para que el navegador lo combine
    if ((actual?.version || 0) !== (version || 0))
      return responder(res, 409, { valor: clave === "cuentas" ? cuentasPublicas(actual?.valor) : actual?.valor ?? null, version: actual?.version || 0 });
    const aGuardar = clave === "cuentas" ? filtrarCuentas(valor, yo.nombre) : valor;
    const nueva = escribir(clave, aGuardar, yo.nombre);
    if (["cuentas", "profesores", "alumnos"].includes(clave)) anotar(yo.nombre, "modifica", clave);
    return responder(res, 200, { version: nueva, valor: clave === "cuentas" ? cuentasPublicas(aGuardar) : undefined });
  }

  return responder(res, 404, { error: "No encontrado." });
}

// ─── Archivos de la aplicación ───────────────────────────────────────────────
const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".json": "application/json", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json", ".crt": "application/x-x509-ca-cert" };
function estatico(req, res, url) {
  // El certificado del centro se puede descargar para instalarlo en los equipos
  if (url.pathname === "/certificado" && CERT && fs.existsSync(CERT)) {
    res.writeHead(200, { ...CABECERAS, "Content-Type": TIPOS[".crt"], "Content-Disposition": 'attachment; filename="galvandesk-centro.crt"' });
    return fs.createReadStream(process.env.CERT_CA || CERT).pipe(res);
  }
  let rel = decodeURIComponent(url.pathname);
  let archivo = path.join(APP, rel);
  if (!archivo.startsWith(APP)) { res.writeHead(403); return res.end(); }
  if (!fs.existsSync(archivo) || fs.statSync(archivo).isDirectory()) archivo = path.join(APP, "index.html");
  if (!fs.existsSync(archivo)) { res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" }); return res.end("Falta compilar la aplicación (npm run build)."); }
  const ext = path.extname(archivo);
  res.writeHead(200, { ...CABECERAS, "Content-Type": TIPOS[ext] || "application/octet-stream",
    "Cache-Control": archivo.includes(`${path.sep}assets${path.sep}`) ? "public, max-age=31536000, immutable" : "no-cache" });
  fs.createReadStream(archivo).pipe(res);
}

async function atender(req, res) {
  const url = new URL(req.url, "http://localhost");
  try {
    if (url.pathname.startsWith("/api/")) return await api(req, res, url);
    if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405); return res.end(); }
    return estatico(req, res, url);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) responder(res, e.estado || 500, { error: e.estado ? e.message : "Error del servidor." });
  }
}

const conHTTPS = CERT && CLAVE && fs.existsSync(CERT) && fs.existsSync(CLAVE);
const servidor = conHTTPS
  ? https.createServer({ cert: fs.readFileSync(CERT), key: fs.readFileSync(CLAVE) }, atender)
  : http.createServer(atender);
servidor.listen(PUERTO, () => {
  console.log(`GalvánDesk en marcha: ${conHTTPS ? "https" : "http"}://<este-servidor>:${PUERTO}`);
  console.log(`Datos en: ${RUTA_DB}`);
  if (!conHTTPS) console.warn("AVISO: sin certificado HTTPS. Las claves solo funcionan con HTTPS (o desde este mismo equipo con localhost).");
});
const parar = () => { console.log("Parando GalvánDesk…"); servidor.close(); db.close(); process.exit(0); };
process.on("SIGTERM", parar);
process.on("SIGINT", parar);
