import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
// ─── Paleta de colores ───────────────────────────────────────────────────────
const C = {
  cream: "#F4F0E4", teal: "#44A194", blue: "#00B7B5", salmon: "#EC8F8D",
  dark: "#2C4A52", white: "#FFFFFF", gray: "#64748b", light: "#F8F6F0",
  amber: "#d97706", amberBg: "#fef3c7",
};

// ─── Datos demo ──────────────────────────────────────────────────────────────
const DEMO_ALUMNOS = [
  { id: 1, nombre: "Lucía Martínez García",    curso: "1º ESO A", tutor: "Carmen López",   email: "familia.martinez@email.com", telefono: "612345678", nia: "" },
  { id: 2, nombre: "Marcos Fernández Ruiz",    curso: "1º ESO A", tutor: "Carmen López",   email: "familia.fernandez@email.com", telefono: "623456789", nia: "" },
  { id: 3, nombre: "Sara González Pérez",      curso: "2º ESO B", tutor: "Pedro Sánchez",  email: "familia.gonzalez@email.com", telefono: "634567890", nia: "" },
  { id: 4, nombre: "Alejandro Torres Díaz",    curso: "2º ESO B", tutor: "Pedro Sánchez",  email: "familia.torres@email.com", telefono: "645678901", nia: "" },
  { id: 5, nombre: "Paula Ramírez Moreno",     curso: "3º ESO A", tutor: "Ana Jiménez",    email: "familia.ramirez@email.com", telefono: "656789012", nia: "" },
  { id: 6, nombre: "Diego Sánchez Blanco",     curso: "3º ESO A", tutor: "Ana Jiménez",    email: "familia.sanchez@email.com", telefono: "667890123", nia: "" },
  { id: 7, nombre: "Elena Romero Castro",      curso: "4º ESO C", tutor: "Luis García",    email: "familia.romero@email.com", telefono: "678901234", nia: "" },
  { id: 8, nombre: "Adrián López Vega",        curso: "4º ESO C", tutor: "Luis García",    email: "familia.lopez@email.com", telefono: "689012345", nia: "" },
];

const DEMO_PROFESORES = [
  "Carmen López", "Pedro Sánchez", "Ana Jiménez", "Luis García",
  "Carlos Moreno", "María Fernández", "Jorge Ruiz", "Laura Torres",
  "Sofía Martín", "Pablo Díaz", "Elena Vega", "Roberto Castro",
  "Beatriz Navarro", "Javier Ortega", "Rocío Herrera", "Miguel Romero",
  "Nuria Gil", "Óscar Molina", "Raquel Serrano", "Sergio Delgado",
  "Inés Prieto", "Álvaro Cano", "Marta Rubio", "David Ibáñez",
];

const GRAVEDAD = [
  { id: "leve",      label: "🟡 Leve",      color: C.teal,   bg: "#E8F5F3", desc: "Reglamento de Centro" },
  { id: "grave",     label: "⚠️ Grave",     color: C.amber,  bg: C.amberBg, desc: "Normativa CAM" },
  { id: "muy_grave", label: "🔴 Muy Grave", color: C.salmon, bg: "#FDF0EF", desc: "Normativa CAM (nivel superior)" },
];

// ─── Tipificación normativa ───────────────────────────────────────────────────
const TIPIFICACION = {
  leve: [
    { id: "1L",  label: "1. Perturbación del normal desarrollo de las actividades de la clase" },
    { id: "2L",  label: "2L. Falta de colaboración sistemática en la realización de las actividades de clase o ausencia de material" },
    { id: "3L",  label: "3L. Faltas injustificadas de puntualidad o faltas injustificadas de asistencia a clase" },
    { id: "4L",  label: "4L. Permanecer fuera del aula sin permiso del profesorado o por el cambio de clase" },
    { id: "5L",  label: "5L. Impedir o dificultar el estudio de sus compañeros" },
    { id: "6L",  label: "6L. Actuaciones incorrectas hacia algún miembro de la comunidad educativa" },
    { id: "7L",  label: "7L. Daños en instalaciones o documentos del centro o pertenencias de un miembro" },
    { id: "8L",  label: "8. Uso del teléfono móvil o cualquier dispositivo electrónico sin permiso del profesorado" },
    { id: "9L",  label: "9L. Incumplimiento de la sanción impuesta por una falta leve" },
    { id: "10L", label: "10L. Otras (especificar)" },
  ],
  grave: [
    { id: "aG", label: "a) Las faltas reiteradas de puntualidad o de asistencia a clase que, a juicio del tutor, no estén justificadas" },
    { id: "bG", label: "b) Las conductas que impidan o dificulten a otros compañeros el ejercicio del derecho o el cumplimiento del deber del estudio" },
    { id: "cG", label: "c) Los actos de incorrección o desconsideración con compañeros u otros miembros de la comunidad escolar" },
    { id: "dG", label: "d) Los actos de indisciplina y los que perturben el desarrollo normal de las actividades del centro" },
    { id: "eG", label: "e) Los daños causados en las instalaciones o el material del centro" },
    { id: "fG", label: "f) La sustracción, daño u ocultación de los bienes o pertenencias de los miembros de la comunidad educativa" },
    { id: "gG", label: "g) La incitación a la comisión de una falta grave contraria a las normas de convivencia" },
    { id: "hG", label: "h) La participación en riñas mutuamente aceptadas" },
    { id: "iG", label: "i) La alteración grave e intencionada del normal desarrollo de la actividad escolar que no constituya falta muy grave" },
    { id: "jG", label: "j) La reiteración en el mismo trimestre de dos o más faltas leves" },
    { id: "kG", label: "k) Los actos que impidan la correcta evaluación del aprendizaje o falseen los resultados académicos" },
    { id: "lG", label: "l) La omisión del deber de comunicar al personal del centro situaciones de acoso o que puedan poner en riesgo grave la integridad física o moral de otros miembros" },
    { id: "mG", label: "m) La difusión por cualquier medio de imágenes o informaciones de ámbito escolar o personal que menoscaben la imagen personal de miembros de la comunidad educativa" },
    { id: "nG", label: "n) El incumplimiento de una medida correctora impuesta por la comisión de una falta leve, así como el incumplimiento de las medidas dirigidas a reparar los daños o asumir su coste" },
  ],
  muy_grave: [
    { id: "aMG", label: "a) Los actos graves de indisciplina, desconsideración, insultos, amenazas, falta de respeto o actitudes desafiantes, cometidos hacia los profesores y demás personal del centro" },
    { id: "bMG", label: "b) El acoso físico o moral a los compañeros" },
    { id: "cMG", label: "c) El uso de la intimidación o la violencia, las agresiones, las ofensas graves y los actos que atenten gravemente contra el derecho a la intimidad, al honor o a la propia imagen o la salud" },
    { id: "dMG", label: "d) La discriminación, las vejaciones o las humillaciones a cualquier miembro de la comunidad educativa, por razón de nacimiento, raza, sexo, religión, orientación sexual, opinión u otras circunstancias" },
    { id: "eMG", label: "e) La grabación, publicidad o difusión, a través de cualquier medio o soporte, de agresiones o humillaciones cometidas o con contenido vejatorio para los miembros de la comunidad educativa" },
    { id: "fMG", label: "f) Los daños graves causados intencionadamente o por uso indebido en las instalaciones, materiales y documentos del centro o en las pertenencias de otros miembros de la comunidad" },
    { id: "gMG", label: "g) La suplantación de personalidad y la falsificación o sustracción de documentos académicos" },
    { id: "hMG", label: "h) El uso, la incitación al mismo, la introducción en el centro o el comercio de objetos o sustancias perjudiciales para la salud o peligrosas para la integridad personal" },
    { id: "iMG", label: "i) El acceso indebido o sin autorización a documentos, ficheros y servidores del centro" },
    { id: "jMG", label: "j) La grave perturbación del normal desarrollo de las actividades del centro y en general cualquier incumplimiento grave de las normas de conducta" },
    { id: "kMG", label: "k) La reiteración en el mismo trimestre de dos o más faltas graves" },
    { id: "lMG", label: "l) La incitación o estímulo a la comisión de una falta muy grave contraria a las normas de convivencia" },
    { id: "mMG", label: "m) El incumplimiento de una medida correctora impuesta por la comisión de una falta grave, así como el incumplimiento de las medidas dirigidas a reparar los daños o asumir su coste" },
  ],
};

const TIPOS   = ["Comportamiento", "Ausencia", "Académico", "Otro"];
// ─── Horario del centro ──────────────────────────────────────────────────────
// Los nombres ("1ª hora", "Recreo"...) son la clave con la que se guardan los datos;
// el intervalo solo se muestra. La 7ª hora es solo para algunos grupos.
const HORARIO = {
  "1ª hora": "8:30 – 9:25",
  "2ª hora": "9:25 – 10:20",
  "3ª hora": "10:20 – 11:15",
  "Recreo":  "11:15 – 11:45",
  "4ª hora": "11:45 – 12:40",
  "5ª hora": "12:40 – 13:35",
  "6ª hora": "13:35 – 14:30",
  "7ª hora": "14:30 – 15:25",
};
const HORAS = Object.keys(HORARIO);
const conTramo = h => HORARIO[h] ? `${h} · ${HORARIO[h]}` : h;
// Hora del horario en curso ahora mismo (o null fuera del horario)
function horaEnCurso(ahora = new Date()) {
  const min = ahora.getHours() * 60 + ahora.getMinutes();
  const aMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  return HORAS.find(h => { const [ini, fin] = HORARIO[h].split("–").map(x => aMin(x.trim())); return min >= ini && min < fin; }) || null;
}
const MODULOS = ["Módulo A", "Módulo B", "Módulo C"];
const MOTIVOS = ["Enfermedad", "Asunto personal", "Formación", "Baja médica", "Otro"];
const ZONAS_GUARDIA = ["Patio A", "Patio B", "Pasillo Planta Baja", "Pasillo 1ª Planta", "Pasillo 2ª Planta", "Biblioteca", "Sala de Usos Múltiples", "Aula asignada", "Otra zona"];

// ─── CSV import ──────────────────────────────────────────────────────────────
const COLUMN_MAP = {
  nombre:   ["nombre", "alumno", "apellidos y nombre", "nombre y apellidos", "nombre completo", "alumno/a", "nombre alumno"],
  curso:    ["curso", "grupo", "unidad", "curso/grupo", "nivel", "clase"],
  tutor:    ["tutor", "tutor/a", "profesor tutor", "tutor grupo"],
  email:    ["email", "correo", "e-mail", "correo electrónico", "email familia", "correo familia", "email tutor"],
  telefono: ["teléfono", "telefono", "tel", "móvil", "movil", "teléfono familia", "tel familia", "tfno"],
  nia:      ["nia", "dni", "expediente", "nº expediente", "id alumno", "código alumno"],
};

function detectCol(headers, field) {
  const variants = COLUMN_MAP[field];
  return headers.findIndex(h => variants.some(v => h.toLowerCase().trim().includes(v)));
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  const sep = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(sep).map(h => h.replace(/^"|"$/g, "").trim());
  const cols = {
    nombre:   detectCol(headers, "nombre"),
    curso:    detectCol(headers, "curso"),
    tutor:    detectCol(headers, "tutor"),
    email:    detectCol(headers, "email"),
    telefono: detectCol(headers, "telefono"),
    nia:      detectCol(headers, "nia"),
  };
  return lines.slice(1).map((line, i) => {
    const cells = line.split(sep).map(c => c.replace(/^"|"$/g, "").trim());
    return {
      id: Date.now() + i,
      nombre:   cols.nombre   >= 0 ? cells[cols.nombre]   : "",
      curso:    cols.curso    >= 0 ? cells[cols.curso]    : "",
      tutor:    cols.tutor    >= 0 ? cells[cols.tutor]    : "",
      email:    cols.email    >= 0 ? cells[cols.email]    : "",
      telefono: cols.telefono >= 0 ? cells[cols.telefono] : "",
      nia:      cols.nia      >= 0 ? cells[cols.nia]      : "",
    };
  }).filter(a => a.nombre);
}

// ─── Utilidades ──────────────────────────────────────────────────────────────
const fmt  = d => new Date(d).toLocaleString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
const fmtD = d => new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
const todayStr = () => new Date().toISOString().split("T")[0];
const weekKey  = d => { const dt = new Date(d), day = dt.getDay(), diff = dt.getDate() - day + (day === 0 ? -6 : 1); return new Date(new Date(d).setDate(diff)).toISOString().split("T")[0]; };
const gObj     = g => GRAVEDAD.find(x => x.id === g);

// ─── Storage ──────────────────────────────────────────────────────────────────
// Mientras la app no esté autorizada y en el servidor del centro, se muestra
// un aviso para no introducir datos reales. Poner a false cuando se autorice.
const MODO_DEMO = true;

const PERFILES = [
  { id: "profesor", label: "👨‍🏫 Profesor" },
  { id: "jefatura", label: "📊 Jefatura y Dirección" },
  { id: "admin",    label: "⚙️ Administración" },
];
const tabInicial = id => id === "jefatura" ? "dashboard" : id === "admin" ? "admin_panel" : "partes";

// ─── Cargos y acceso ─────────────────────────────────────────────────────────
// Cada profesor tiene un cargo, y el cargo decide a qué perfiles puede entrar.
const CARGOS = [
  { id: "profesor",   label: "Profesor/a",           perfiles: ["profesor"] },
  { id: "jefatura",   label: "Jefatura de Estudios", perfiles: ["profesor", "jefatura"] },
  { id: "direccion",  label: "Dirección",            perfiles: ["profesor", "jefatura", "admin"] },
  { id: "secretaria", label: "Secretaría",           perfiles: ["profesor", "admin"] },
  { id: "tic",        label: "Coordinación TIC",     perfiles: ["profesor", "admin"] },
];
// Cargos de ejemplo (profesorado ficticio); el resto es Profesor/a
const CUENTAS_DEMO = { "Luis García": { cargo: "direccion" }, "Ana Jiménez": { cargo: "jefatura" }, "Elena Vega": { cargo: "tic" } };
const cargoDe = (cuentas, nombre) => CARGOS.find(c => c.id === (cuentas?.[nombre]?.cargo || "profesor")) || CARGOS[0];
const perfilesPermitidos = (cuentas, nombre) => PERFILES.filter(p => cargoDe(cuentas, nombre).perfiles.includes(p.id));
const MIN_CLAVE = 6;
// Las claves nunca se guardan tal cual: solo su huella SHA-256 (requiere conexión segura HTTPS).
// En esta versión de demostración se guardan en el navegador; en el servidor del centro irán al servidor.
async function hashClave(nombre, clave) {
  if (!window.crypto?.subtle) throw new Error("sin-https");
  const buf = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(`galvandesk|${nombre}|${clave}`));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// ─── Pantalla de entrada: nombre → clave → perfil ───────────────────────────
function PantallaEntrada({ profesores, cuentas, setCuentas, onEntrar, onCargarEjemplo, nombreSugerido, tutoraDemo }) {
  // Demostración: globo de bienvenida con los pasos, la primera vez en esta pestaña
  const [globo, setGlobo] = useState(() => { try { return MODO_DEMO && !sessionStorage.getItem("galvandesk:globo"); } catch { return MODO_DEMO; } });
  const [ejemploListo, setEjemploListo] = useState(() => { try { return !!sessionStorage.getItem("galvandesk:ejemplo"); } catch { return false; } });
  const cerrarGlobo = () => { setGlobo(false); try { sessionStorage.setItem("galvandesk:globo", "1"); } catch { /* sin almacenamiento */ } };
  const cargarEjemplo = () => { onCargarEjemplo(); setEjemploListo(true); try { sessionStorage.setItem("galvandesk:ejemplo", "1"); } catch { /* sin almacenamiento */ } };
  const [paso, setPaso] = useState("nombre");
  const [nombre, setNombre] = useState(nombreSugerido || "");
  const [clave, setClave] = useState("");
  const [clave2, setClave2] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { if (nombreSugerido) { setNombre(nombreSugerido); setPaso("nombre"); setError(""); } }, [nombreSugerido]);

  const tieneClave = !!cuentas[nombre]?.clave;
  const permitidos = perfilesPermitidos(cuentas, nombre);
  const cargo = cargoDe(cuentas, nombre);

  function continuar() {
    const n = nombre.trim();
    if (!profesores.includes(n)) { setError("Ese nombre no está en la lista del profesorado. Elígelo de la lista o pide a Administración que te añada."); return; }
    setNombre(n); setError(""); setClave(""); setClave2(""); setPaso("clave");
  }
  async function entrar() {
    try {
      if (!tieneClave) {
        if (clave.length < MIN_CLAVE) { setError(`La clave debe tener al menos ${MIN_CLAVE} caracteres.`); return; }
        if (clave !== clave2) { setError("Las dos claves no coinciden."); return; }
        const h = await hashClave(nombre, clave);
        setCuentas(prev => ({ ...prev, [nombre]: { ...(prev[nombre] || {}), clave: h } }));
      } else if (await hashClave(nombre, clave) !== cuentas[nombre].clave) {
        setError("Clave incorrecta."); setClave(""); return;
      }
    } catch { setError("La conexión no es segura (HTTPS): no se pueden comprobar las claves."); return; }
    setError(""); setClave(""); setClave2("");
    if (permitidos.length === 1) onEntrar(nombre, permitidos[0]); else setPaso("perfil");
  }

  const inp = { width: "100%", padding: "12px 14px", borderRadius: 10, border: `2px solid ${C.cream}`, fontSize: 15, fontFamily: "inherit", boxSizing: "border-box", marginBottom: 10 };
  const lbl = { display: "block", fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 8 };
  const btnPrincipal = { display: "block", width: "100%", padding: "14px 20px", marginTop: 6, background: C.teal, color: "#fff", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: 700 };
  const enlace = { background: "none", border: "none", color: C.blue, cursor: "pointer", fontSize: 13, fontWeight: 600, marginTop: 14, padding: 0 };

  const pasoNum = (n, activo) => <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", background: activo ? C.teal : "#cbd5e1", color: "#fff", fontSize: 13, fontWeight: 800, marginRight: 8, flexShrink: 0 }}>{n}</span>;
  const tutora = tutoraDemo || { nombre: "Carmen López", curso: "1º ESO A" };
  const accesoDemo = MODO_DEMO ? (
    <div style={{ background: "#F0FAF7", border: `2px solid ${C.teal}`, borderRadius: 12, padding: 14, marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "center", fontSize: 14, fontWeight: 800, color: C.dark, marginBottom: 8 }}>{pasoNum(1, !ejemploListo)} Carga los datos de ejemplo</div>
      {ejemploListo
        ? <div style={{ background: "#dcfce7", color: "#166534", borderRadius: 10, padding: "10px 12px", fontSize: 13, fontWeight: 700, marginBottom: 14 }}>✅ Datos de ejemplo cargados. Ahora, el paso 2.</div>
        : <button onClick={cargarEjemplo} style={{ width: "100%", background: C.teal, color: "#fff", border: "none", borderRadius: 10, padding: "12px", cursor: "pointer", fontSize: 14, fontWeight: 700, marginBottom: 14, boxShadow: "0 0 0 4px rgba(68,161,148,0.25)" }}>
            🧪 Pulsa aquí para cargar los datos de ejemplo
          </button>}
      <div style={{ display: "flex", alignItems: "center", fontSize: 14, fontWeight: 800, color: C.dark, marginBottom: 2 }}>{pasoNum(2, ejemploListo)} Elige qué quieres probar</div>
      <div style={{ fontSize: 12, color: C.gray, marginBottom: 10, marginLeft: 32 }}>Pulsa uno. No hace falta nombre ni clave.</div>
      {[
        { txt: "👨‍🏫 Profesor/a", sub: `Entras como ${nombreSugerido || "María Fernández"}: poner partes, guardias y Galvángram`, accion: () => onEntrar(nombreSugerido || "María Fernández", PERFILES[0]) },
        { txt: "🏫 Tutor/a de un grupo", sub: `Entras como ${tutora.nombre}, tutor/a de ${tutora.curso}: estadísticas de su grupo e informes para las familias`, accion: () => onEntrar(tutora.nombre, PERFILES[0]), tutora: true },
        { txt: "📊 Jefatura y Dirección", sub: "Entras como Ana Jiménez: convivencia, estadísticas, cuadrante de guardias y ausencias", accion: () => onEntrar("Ana Jiménez", PERFILES[1]) },
        { txt: "⚙️ Administración", sub: "Entras como Elena Vega: alumnado, profesorado, tutorías y cargos", accion: () => onEntrar("Elena Vega", PERFILES[2]) },
      ].map(b => (
        <button key={b.txt} onClick={() => { if (!ejemploListo) cargarEjemplo(); b.accion(); }}
          style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", marginBottom: 8, background: C.cream, border: `2px solid ${C.teal}`, borderRadius: 10, cursor: "pointer" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>{b.txt}</div>
          <div style={{ fontSize: 11, color: C.gray }}>{b.sub}</div>
        </button>
      ))}
      <div style={{ display: "flex", alignItems: "center", fontSize: 14, fontWeight: 800, color: C.dark, margin: "8px 0 2px" }}>{pasoNum(3, false)} Dentro, usa los botones de arriba</div>
      <div style={{ fontSize: 12, color: C.gray, marginLeft: 32 }}>Los botones de colores cambian de pantalla. Para cambiar de perfil, pulsa «Salir» y vuelves aquí.</div>
      <button onClick={() => setGlobo(true)} style={{ ...enlace, marginTop: 10, marginLeft: 32 }}>❓ Ver otra vez las instrucciones</button>
    </div>
  ) : null;

  const globoBienvenida = MODO_DEMO && globo ? (
    <div role="dialog" aria-modal="true" aria-labelledby="gd-globo-titulo" onClick={cerrarGlobo}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 20, maxWidth: 460, width: "100%", padding: "28px 26px", textAlign: "left", boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}>
        <div style={{ fontSize: 40, textAlign: "center" }}>👋</div>
        <h2 id="gd-globo-titulo" style={{ color: C.dark, textAlign: "center", margin: "6px 0 4px", fontSize: 22 }}>Bienvenida/o a la demostración</h2>
        <p style={{ color: C.gray, textAlign: "center", fontSize: 13, margin: "0 0 18px" }}>Todo es ficticio. Sigue estos pasos:</p>
        {[
          ["Carga los datos de ejemplo", "El botón verde de abajo lo hace por ti."],
          ["Elige qué quieres probar", "Profesor/a, Tutor/a, Jefatura o Administración. Solo tienes que pulsar. No escribas nombre ni clave."],
          ["Muévete con los botones de arriba", "Los botones de colores cambian de pantalla. En cada una hay una ayuda «Cómo se usa»."],
          ["Para cambiar de perfil, pulsa «Salir»", "Vuelves a esta pantalla y eliges otro."],
        ].map(([t, d], i) => (
          <div key={t} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            {pasoNum(i + 1, true)}
            <div><div style={{ fontWeight: 700, color: C.dark, fontSize: 14 }}>{t}</div><div style={{ fontSize: 12, color: C.gray }}>{d}</div></div>
          </div>
        ))}
        <button autoFocus onClick={() => { if (!ejemploListo) cargarEjemplo(); cerrarGlobo(); }} style={{ ...btnPrincipal, marginTop: 14 }}>▶ Empezar (cargar los datos de ejemplo)</button>
        <button onClick={cerrarGlobo} style={{ ...enlace, display: "block", margin: "12px auto 0" }}>Cerrar</button>
      </div>
    </div>
  ) : null;

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg,${C.dark},${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,sans-serif", padding: 20 }}>
      <style>{`* { box-sizing: border-box; } body { margin: 0; }`}</style>
      <div style={{ background: C.white, borderRadius: 20, padding: "36px 32px", maxWidth: 420, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ fontSize: 52, marginBottom: 4 }}>🏫</div>
        <div style={{ fontSize: 11, color: C.gray, letterSpacing: 2, marginBottom: 4 }}>IES ENRIQUE TIERNO GALVÁN · MADRID</div>
        <h1 style={{ color: C.dark, margin: "0 0 4px", fontSize: 28 }}>GalvánDesk</h1>
        <p style={{ color: C.gray, marginBottom: 20, fontSize: 13 }}>Sistema de Gestión de Incidencias</p>
        <AvisoDemo />
        {globoBienvenida}

        {paso === "nombre" && (
          <div style={{ textAlign: "left" }}>
            {accesoDemo}
            {MODO_DEMO && <div style={{ fontSize: 12, color: C.gray, marginBottom: 8 }}>En el centro, cada docente entrará con su nombre y su clave:</div>}
            <label style={lbl} htmlFor="gd-nombre">¿Quién eres?</label>
            <input id="gd-nombre" type="text" placeholder="Tu nombre" list="lista-profesores" value={nombre} autoComplete="off"
              onChange={e => { setNombre(e.target.value); setError(""); }} onKeyDown={e => { if (e.key === "Enter") continuar(); }} style={inp} />
            <datalist id="lista-profesores">{profesores.map(p => <option key={p} value={p} />)}</datalist>
            <small style={{ color: C.gray, display: "block", marginBottom: 8 }}>Escribe y elige tu nombre de la lista.</small>
            {error && <div role="alert" style={{ color: "#9f1239", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{error}</div>}
            <button onClick={continuar} style={btnPrincipal}>Continuar</button>
          </div>
        )}

        {paso === "clave" && (
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.dark }}>Hola, {nombre}</div>
            <div style={{ fontSize: 12, color: C.gray, marginBottom: 16 }}>Cargo: {cargo.label}</div>
            {tieneClave ? (
              <>
                <label style={lbl} htmlFor="gd-clave">Tu clave</label>
                <input id="gd-clave" type="password" autoComplete="current-password" autoFocus value={clave}
                  onChange={e => { setClave(e.target.value); setError(""); }} onKeyDown={e => { if (e.key === "Enter") entrar(); }} style={inp} />
              </>
            ) : (
              <>
                <div style={{ background: "#EEF5F8", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: C.blue, marginBottom: 12 }}>
                  Es la primera vez que entras. Crea tu clave personal (mínimo {MIN_CLAVE} caracteres).
                </div>
                <label style={lbl} htmlFor="gd-clave">Nueva clave</label>
                <input id="gd-clave" type="password" autoComplete="new-password" autoFocus value={clave} onChange={e => { setClave(e.target.value); setError(""); }} style={inp} />
                <label style={lbl} htmlFor="gd-clave2">Repite la clave</label>
                <input id="gd-clave2" type="password" autoComplete="new-password" value={clave2}
                  onChange={e => { setClave2(e.target.value); setError(""); }} onKeyDown={e => { if (e.key === "Enter") entrar(); }} style={inp} />
              </>
            )}
            {error && <div role="alert" style={{ color: "#9f1239", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{error}</div>}
            <button onClick={entrar} style={btnPrincipal}>Entrar</button>
            {MODO_DEMO && (
              <button onClick={() => { setError(""); if (permitidos.length === 1) onEntrar(nombre, permitidos[0]); else setPaso("perfil"); }}
                style={{ display: "block", width: "100%", padding: "12px 20px", marginTop: 10, background: C.cream, color: C.dark, border: `2px solid ${C.teal}`, borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                🧪 Entrar sin clave (solo en la demostración)
              </button>
            )}
            {tieneClave && <div style={{ fontSize: 12, color: C.gray, marginTop: 10 }}>¿Has olvidado tu clave? Pide a Administración que la restablezca.</div>}
            <button onClick={() => { setPaso("nombre"); setClave(""); setClave2(""); setError(""); }} style={enlace}>← No soy {nombre}</button>
          </div>
        )}

        {paso === "perfil" && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 4 }}>¿Con qué perfil entras?</div>
            <div style={{ fontSize: 12, color: C.gray, marginBottom: 14 }}>Según tu cargo ({cargo.label}) puedes usar estos perfiles.</div>
            {permitidos.map(p => (
              <button key={p.id} onClick={() => onEntrar(nombre, p)}
                style={{ display: "block", width: "100%", padding: "14px 20px", marginBottom: 12, background: C.cream, border: `2px solid ${C.teal}`, borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: 700, color: C.dark }}>
                {p.label}
              </button>
            ))}
            <button onClick={() => setPaso("nombre")} style={enlace}>← Cambiar de persona</button>
          </div>
        )}
      </div>
    </div>
  );
}
const AvisoDemo = ({ compacto }) => MODO_DEMO ? (
  <div role="note" style={compacto
    ? { background: "#fef3c7", color: "#92400e", fontSize: 12, fontWeight: 600, textAlign: "center", padding: "6px 12px", borderBottom: "1px solid #fbbf24" }
    : { background: "#fef3c7", color: "#92400e", fontSize: 12, fontWeight: 600, borderRadius: 10, padding: "10px 12px", marginBottom: 20, border: "1px solid #fbbf24", lineHeight: 1.4 }}>
    ⚠️ Versión de demostración: no introducir datos reales de alumnos ni familias.
    {!compacto && <div style={{ marginTop: 6, fontWeight: 500 }}>Sigue los pasos <b>1</b> y <b>2</b> del recuadro verde de abajo. No necesitas nombre ni clave.</div>}
  </div>
) : null;

// Guardado en el navegador (localStorage). Los datos se conservan al recargar,
// pero cada navegador/dispositivo guarda los suyos. Paso previo al servidor del centro.
const PREFIJO = "galvandesk:";
async function sGet(k) {
  try { const v = localStorage.getItem(PREFIJO + k); return v ? JSON.parse(v) : null; }
  catch { return null; }
}
async function sSet(k, v) {
  try { localStorage.setItem(PREFIJO + k, JSON.stringify(v)); }
  catch (e) { console.error("No se pudo guardar", k, e); }
}
// Sesión: recuerda quién ha entrado y con qué perfil
function leerSesion() {
  try { const v = localStorage.getItem(PREFIJO + "sesion"); return v ? JSON.parse(v) : null; }
  catch { return null; }
}
function guardarSesion(sesion) {
  try {
    if (sesion) localStorage.setItem(PREFIJO + "sesion", JSON.stringify(sesion));
    else localStorage.removeItem(PREFIJO + "sesion");
  } catch { /* navegador sin almacenamiento: se sigue sin recordar */ }
}

// ─── Componentes base ─────────────────────────────────────────────────────────
const Btn = ({ onClick, disabled, children, color = C.dark, style = {} }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ background: disabled ? "#94a3b8" : color, color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", cursor: disabled ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 14, transition: "opacity .15s", ...style }}>
    {children}
  </button>
);

const Card = ({ children, style = {} }) => (
  <div style={{ background: C.white, borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: 14, ...style }}>{children}</div>
);

const Badge = ({ g }) => {
  const gv = gObj(g);
  return <span style={{ background: gv.bg, color: gv.color, borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>{gv.label}</span>;
};

const InfoRow = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${C.cream}`, fontSize: 14 }}>
    <span style={{ color: C.gray, fontWeight: 600, minWidth: 140 }}>{label}</span>
    <span style={{ color: C.dark, textAlign: "right" }}>{value}</span>
  </div>
);

function CopyBtn({ getText, label = "📋 Copiar texto" }) {
  const [ok, setOk] = useState(false);
  function copy() {
    const t = getText();
    navigator.clipboard.writeText(t)
      .then(() => { setOk(true); setTimeout(() => setOk(false), 2500); })
      .catch(() => {
        const ta = document.createElement("textarea");
        ta.value = t; ta.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(ta); ta.select(); document.execCommand("copy");
        document.body.removeChild(ta); setOk(true); setTimeout(() => setOk(false), 2500);
      });
  }
  return (
    <button onClick={copy} style={{ background: ok ? C.teal : C.cream, color: ok ? C.white : C.dark, border: `1px solid ${ok ? C.teal : "#ccc"}`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 700, fontSize: 13, transition: "all .2s" }}>
      {ok ? "✅ ¡Copiado!" : label}
    </button>
  );
}

// ─── PDF ─────────────────────────────────────────────────────────────────────
// Los PDF se crean como documentos de texto (no como capturas de pantalla):
// se descargan igual en el móvil, en Safari y en Chrome, pesan poco y no cortan columnas.
const OSCURO = [44, 74, 82], VERDE = [68, 161, 148], GRIS = [100, 116, 139];
const sinEmoji = t => String(t ?? "").replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{20E3}]/gu, "").replace(/\s+/g, " ").trim();
const nombreArchivo = t => sinEmoji(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase();
function cabeceraPDF(doc, titulo, subtitulo) {
  const w = doc.internal.pageSize.getWidth();
  doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(...GRIS);
  doc.text("IES ENRIQUE TIERNO GALVÁN · MADRID", w / 2, 14, { align: "center" });
  doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(...OSCURO);
  doc.text(titulo, w / 2, 22, { align: "center" });
  if (subtitulo) { doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(...GRIS); doc.text(sinEmoji(subtitulo), w / 2, 28, { align: "center", maxWidth: w - 28 }); }
  doc.setDrawColor(...VERDE); doc.setLineWidth(0.6); doc.line(14, 32, w - 14, 32);
  doc.setTextColor(0);
  return 38;
}
function guardarPDF(doc, archivo) {
  const n = doc.getNumberOfPages(), w = doc.internal.pageSize.getWidth(), h = doc.internal.pageSize.getHeight();
  const hoy = new Date().toLocaleDateString("es-ES");
  for (let i = 1; i <= n; i++) {
    doc.setPage(i); doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(...GRIS);
    doc.text(`GalvánDesk · IES Enrique Tierno Galván · ${hoy} · Página ${i} de ${n}`, w / 2, h - 8, { align: "center" });
  }
  // Si el visor está abierto en la página, el informe se ve primero en pantalla
  if (visor.pdf) visor.pdf({ url: URL.createObjectURL(doc.output("blob")), archivo, paginas: n });
  else doc.save(archivo);
}

// ─── Visor en pantalla de informes (PDF) y hojas de cálculo (Excel) ──────────
const visor = { pdf: null, excel: null };
const descargarURL = (url, archivo) => { const a = document.createElement("a"); a.href = url; a.download = archivo; document.body.appendChild(a); a.click(); a.remove(); };
export function VisorDocumentos() {
  const [pdf, setPdf] = useState(null);     // { url, archivo, paginas }
  const [excel, setExcel] = useState(null); // { hojas: [{ nombre, cabecera, filas }], archivo, descargar }
  const [hojaSel, setHojaSel] = useState(0);
  const [busca, setBusca] = useState("");
  const marco = useRef(null);
  useEffect(() => {
    visor.pdf = d => setPdf(prev => { if (prev) URL.revokeObjectURL(prev.url); return d; });
    visor.excel = d => { setHojaSel(0); setBusca(""); setExcel(d); };
    return () => { visor.pdf = null; visor.excel = null; };
  }, []);
  const cerrar = () => { if (pdf) URL.revokeObjectURL(pdf.url); setPdf(null); setExcel(null); };
  useEffect(() => {
    if (!pdf && !excel) return;
    const f = e => { if (e.key === "Escape") { e.stopImmediatePropagation(); cerrar(); } };
    window.addEventListener("keydown", f, true); return () => window.removeEventListener("keydown", f, true);
  });
  if (!pdf && !excel) return null;
  const barra = { position: "sticky", top: 0, zIndex: 2, background: `linear-gradient(90deg,${C.dark},${C.blue})`, color: "#fff", padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" };
  const bb = { background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontWeight: 700, fontSize: 13 };
  const fondo = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 400, display: "flex", alignItems: "stretch", justifyContent: "center", padding: "2vh 2vw", fontFamily: "system-ui,sans-serif" };
  const caja = { background: C.white, borderRadius: 14, width: "100%", maxWidth: 1200, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.35)" };

  if (pdf) return (
    <div style={fondo} onClick={cerrar}>
      <div style={caja} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Vista previa del informe">
        <div style={barra}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>👁 Vista previa</div>
            <div style={{ fontSize: 12, opacity: .85, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pdf.archivo} · {pdf.paginas} página(s)</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button style={{ ...bb, background: "#fff", color: C.dark }} onClick={() => descargarURL(pdf.url, pdf.archivo)}>⬇️ Descargar PDF</button>
            <button style={bb} onClick={() => { try { marco.current.contentWindow.focus(); marco.current.contentWindow.print(); } catch { window.open(pdf.url, "_blank"); } }}>🖨 Imprimir</button>
            <button style={bb} onClick={() => window.open(pdf.url, "_blank")}>↗ Abrir en otra pestaña</button>
            <button style={bb} onClick={cerrar} aria-label="Cerrar">✕</button>
          </div>
        </div>
        <iframe ref={marco} title="Vista previa del informe" src={pdf.url} style={{ flex: 1, width: "100%", border: "none", background: "#525659", minHeight: "70vh" }} />
        <div style={{ fontSize: 11, color: C.gray, padding: "6px 14px", background: C.light }}>Si en tu móvil o tablet solo ves la primera página, pulsa «Abrir en otra pestaña».</div>
      </div>
    </div>
  );

  const h = excel.hojas[hojaSel] || excel.hojas[0];
  const t = busca.trim().toLowerCase();
  const filas = t ? h.filas.filter(f => f.some(v => String(v ?? "").toLowerCase().includes(t))) : h.filas;
  const LIMITE = 500;
  return (
    <div style={fondo} onClick={cerrar}>
      <div style={caja} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Vista previa del Excel">
        <div style={barra}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>👁 Vista previa del Excel</div>
            <div style={{ fontSize: 12, opacity: .85 }}>{excel.archivo} · {excel.hojas.length} hojas</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ ...bb, background: "#fff", color: C.dark }} onClick={excel.descargar}>⬇️ Descargar Excel</button>
            <button style={bb} onClick={cerrar} aria-label="Cerrar">✕</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, padding: "10px 14px 0", flexWrap: "wrap", background: C.light, borderBottom: "1px solid #e2e8f0" }}>
          {excel.hojas.map((x, i) => (
            <button key={x.nombre} onClick={() => setHojaSel(i)}
              style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderBottom: "none", borderRadius: "8px 8px 0 0", background: i === hojaSel ? C.white : "transparent", fontWeight: i === hojaSel ? 800 : 500, color: C.dark, cursor: "pointer", fontSize: 13, marginBottom: -1 }}>
              {x.nombre} <span style={{ color: C.gray, fontWeight: 500 }}>({x.filas.length})</span>
            </button>
          ))}
        </div>
        <div style={{ padding: "10px 14px", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="🔎 Buscar en esta hoja (nombre, grupo, falta…)" aria-label="Buscar en la hoja"
            style={{ flex: "1 1 260px", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 }} />
          <span style={{ fontSize: 12, color: C.gray }}>{filas.length} fila(s){filas.length > LIMITE ? ` · se ven las ${LIMITE} primeras; el Excel las tiene todas` : ""}</span>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "0 14px 14px" }}>
          {filas.length === 0 ? <div style={{ padding: 30, textAlign: "center", color: C.gray }}>Sin datos.</div> : (
            <table style={{ borderCollapse: "collapse", fontSize: 12, width: "max-content", minWidth: "100%" }}>
              <thead><tr>{h.cabecera.map(c => <th key={c} style={{ position: "sticky", top: 0, background: C.dark, color: "#fff", padding: "8px 10px", textAlign: "left", whiteSpace: "nowrap", fontWeight: 700 }}>{c}</th>)}</tr></thead>
              <tbody>{filas.slice(0, LIMITE).map((f, i) => (
                <tr key={i} style={{ background: i % 2 ? "#F8F6F0" : C.white }}>
                  {h.cabecera.map((_, j) => <td key={j} style={{ padding: "6px 10px", borderBottom: "1px solid #eef2f4", maxWidth: 420, whiteSpace: String(f[j] ?? "").length > 60 ? "normal" : "nowrap", verticalAlign: "top", color: C.dark }}>{f[j] ?? ""}</td>)}
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
const estiloTabla = { styles: { fontSize: 9, cellPadding: 2, overflow: "linebreak", valign: "top" }, headStyles: { fillColor: OSCURO, textColor: 255, fontStyle: "bold" }, alternateRowStyles: { fillColor: [248, 246, 240] }, margin: { left: 14, right: 14, bottom: 16 } };
const textoTipificacion = p => {
  const t = TIPIFICACION[p.gravedad]?.find(t => t.id === p.tipificacion)?.label;
  return t ? `${t} (${p.gravedad === "leve" ? "Plan de Convivencia del Centro" : "Decreto 32/2019 CAM"})` : "-";
};

// Texto del parte para copiar y pegar en un correo
function textoParte(parte) {
  const g = gObj(parte.gravedad);
  const tip = TIPIFICACION[parte.gravedad]?.find(t => t.id === parte.tipificacion)?.label;
  return `PARTE DE INCIDENCIA — IES Enrique Tierno Galván (Madrid)
Ref.: PARTE-${parte.id}

Alumno/a: ${parte.alumno}
Curso: ${parte.curso}
Tutor/a del grupo: ${parte.tutor || "-"}${parte.tutorEmail ? ` (${parte.tutorEmail})` : ""}
Fecha y hora: ${fmt(parte.ts)} · ${parte.hora || "hora no indicada"}
Profesor/a que pone el parte: ${parte.profesor}
Gravedad: ${sinEmoji(g?.label)} (${g?.desc || ""})${tip ? `\nTipificación: ${tip}` : ""}

Descripción de los hechos:
${parte.descripcion}

Para cualquier aclaración pueden contactar con el tutor/a del grupo o con Jefatura de Estudios.`;
}

function pdfParte(parte) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const g = gObj(parte.gravedad);
  let y = cabeceraPDF(doc, "Parte de incidencia", `Ref. PARTE-${parte.id}`);
  autoTable(doc, { ...estiloTabla, startY: y, theme: "grid", styles: { ...estiloTabla.styles, fontSize: 10 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 48, fillColor: [238, 245, 248] } },
    body: [
      ["Alumno/a", parte.alumno], ["Curso", parte.curso], ["Tutor/a del grupo", parte.tutor || "-"], ["Correo del tutor/a", parte.tutorEmail || "-"],
      ["Tipo de parte", parte.tipo], ["Hora de clase", parte.hora || "-"], ["Fecha y hora", fmt(parte.ts)],
      ["Profesor/a responsable", parte.profesor], ["Gravedad", `${sinEmoji(g?.label)} (${g?.desc || ""})`],
      ["Tipificación", textoTipificacion(parte)],
      ...(parte.esGrupal ? [["Parte de grupo", "Sí"]] : []),
    ].map(([k, v]) => [k, sinEmoji(v)]) });
  y = doc.lastAutoTable.finalY + 8;
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text("Descripción de los hechos", 14, y);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  const lineas = doc.splitTextToSize(sinEmoji(parte.descripcion), doc.internal.pageSize.getWidth() - 28);
  doc.text(lineas, 14, y + 6); y += 6 + lineas.length * 5 + 6;
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text("Contacto de la familia", 14, y);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  doc.text(`Correo: ${parte.email || "-"}    Teléfono: ${parte.telefono || "-"}`, 14, y + 6);
  y += 24;
  doc.setDrawColor(150); doc.setLineWidth(0.3);
  doc.line(14, y, 90, y); doc.line(120, y, 196, y);
  doc.setFontSize(9); doc.setTextColor(...GRIS);
  doc.text("Firma del profesor/a", 14, y + 5); doc.text("Recibí (familia)", 120, y + 5);
  guardarPDF(doc, `parte-${nombreArchivo(parte.alumno)}-${isoLocal(parte.ts)}.pdf`);
}

// Resumen por grupo con su tutor/a (para el informe en pantalla y en PDF)
function resumenPorGrupo(partes, tutores = {}) {
  const grupos = [...new Set(partes.map(p => p.curso))].sort();
  return grupos.map(curso => {
    const pC = partes.filter(p => p.curso === curso);
    const cuenta = g => pC.filter(p => p.gravedad === g).length;
    return { curso, tutor: tutores[curso]?.tutor || pC.find(p => p.tutor)?.tutor || "", email: tutores[curso]?.email || "",
      leve: cuenta("leve"), grave: cuenta("grave"), muy_grave: cuenta("muy_grave"), total: pC.length };
  });
}
const tutorDeParte = (p, tutores = {}) => p.tutor || tutores[p.curso]?.tutor || "";

function pdfInformePartes(partes, filtrosTexto, tutores = {}, fechaInforme) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
  const fecha = new Date(fechaInforme || Date.now()).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
  let y = cabeceraPDF(doc, "Informe de partes", `Generado el ${fecha} · Jefatura de Estudios${filtrosTexto ? ` · ${filtrosTexto}` : ""}`);
  const cuenta = gr => partes.filter(p => p.gravedad === gr).length;
  doc.setFontSize(10); doc.setFont("helvetica", "bold");
  doc.text(`Total: ${partes.length}   ·   Leves: ${cuenta("leve")}   ·   Graves: ${cuenta("grave")}   ·   Muy graves: ${cuenta("muy_grave")}`, 14, y);
  doc.setFontSize(11); doc.setTextColor(...OSCURO); doc.text("Resumen por grupo y tutoría", 14, y + 9); doc.setTextColor(0);
  autoTable(doc, { ...estiloTabla, startY: y + 12,
    head: [["Grupo", "Tutor/a del grupo", "Correo del tutor/a", "Leves", "Graves", "Muy graves", "Total"]],
    body: resumenPorGrupo(partes, tutores).map(r => [r.curso, r.tutor || "Sin registrar", r.email || "-", r.leve, r.grave, r.muy_grave, r.total].map(sinEmoji)),
    columnStyles: { 3: { halign: "center" }, 4: { halign: "center" }, 5: { halign: "center" }, 6: { halign: "center", fontStyle: "bold" } } });
  y = doc.lastAutoTable.finalY + 8;
  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(...OSCURO); doc.text("Detalle de los partes", 14, y); doc.setTextColor(0);
  autoTable(doc, { ...estiloTabla, startY: y + 3,
    head: [["Fecha y hora", "Hora", "Alumno/a", "Curso", "Tutor/a", "Tipo", "Gravedad", "Tipificación", "Profesor/a", "Descripción"]],
    body: partes.map(p => [fmt(p.ts), p.hora || "-", p.alumno + (p.esGrupal ? " (grupo)" : ""), p.curso, tutorDeParte(p, tutores) || "-", p.tipo, sinEmoji(gObj(p.gravedad)?.label), textoTipificacion(p), p.profesor, p.descripcion].map(sinEmoji)),
    columnStyles: { 0: { cellWidth: 25 }, 1: { cellWidth: 14 }, 2: { cellWidth: 30 }, 3: { cellWidth: 18 }, 4: { cellWidth: 24 }, 5: { cellWidth: 27 }, 6: { cellWidth: 19 }, 7: { cellWidth: 40 }, 8: { cellWidth: 24 }, 9: { cellWidth: "auto" } } });
  guardarPDF(doc, `informe-partes-${isoLocal(fechaInforme || new Date())}.pdf`);
}

function pdfInformeBanos(banos, filtrosTexto) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const fecha = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
  const y = cabeceraPDF(doc, "Informe de salidas al baño", `Generado el ${fecha} · Jefatura de Estudios${filtrosTexto ? ` · ${filtrosTexto}` : ""}`);
  doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.text(`Total de salidas: ${banos.length}`, 14, y);
  const dur = b => b.regreso ? `${Math.max(1, Math.round((new Date(b.regreso) - new Date(b.salida)) / 60000))} min` : "Fuera";
  autoTable(doc, { ...estiloTabla, startY: y + 4,
    head: [["Salida", "Regreso", "Duración", "Alumno/a", "Curso", "Autorizado por"]],
    body: banos.map(b => [fmt(b.ts || b.salida), b.regreso ? horaCorta(b.regreso) : "-", dur(b), b.alumno, b.curso, b.profesor || "-"].map(sinEmoji)) });
  guardarPDF(doc, `informe-banos-${isoLocal()}.pdf`);
}

function pdfFirmasYListas(fecha, filas, listasDia) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = cabeceraPDF(doc, "Firmas de guardia y listas", parseISO(fecha).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
  const cuerpo = [];
  filas.forEach(f => {
    if (f.personas.length === 0) cuerpo.push([`${f.hora} (${HORARIO[f.hora]})`, f.zona, "Nadie en la zona", "-"]);
    f.personas.forEach(({ p, firma }) => cuerpo.push([`${f.hora} (${HORARIO[f.hora]})`, f.zona, p, firma ? `Firmada a las ${horaCorta(firma.ts)}` : f.empezada ? "SIN FIRMAR" : "Aún no ha empezado"]));
  });
  autoTable(doc, { ...estiloTabla, startY: y, head: [["Hora", "Zona", "Profesor/a", "Firma"]], body: cuerpo.map(r => r.map(sinEmoji)),
    didParseCell: d => { if (d.section === "body" && d.column.index === 3 && d.cell.raw === "SIN FIRMAR") { d.cell.styles.textColor = [180, 83, 9]; d.cell.styles.fontStyle = "bold"; } } });
  y = doc.lastAutoTable.finalY + 10;
  doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(...OSCURO); doc.text("Listas pasadas en guardia", 14, y);
  autoTable(doc, { ...estiloTabla, startY: y + 3, head: [["Hora", "Grupo", "Profesor/a", "Faltas"]],
    body: listasDia.length ? listasDia.map(l => [l.hora, l.curso, `${l.profesor} (${horaCorta(l.ts)})`, l.ausentes.length ? l.ausentes.map(a => a.nombre).join(", ") : "Sin faltas"].map(sinEmoji)) : [["-", "-", "-", "No se pasó ninguna lista"]] });
  doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(...GRIS);
  doc.text("Las faltas oficiales de asistencia se registran en Raíces.", 14, doc.lastAutoTable.finalY + 6);
  guardarPDF(doc, `firmas-guardia-${fecha}.pdf`);
}

// ─── Vista impresión parte ────────────────────────────────────────────────────
function PrintParte({ parte, onClose }) {
  const g = gObj(parte.gravedad);
  const texto = textoParte(parte);
  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 1000, overflowY: "auto", fontFamily: "Georgia, serif" }}>
      <div className="no-print" style={{ background: C.dark, color: "#fff", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <span style={{ fontWeight: 700, fontSize: 14, fontFamily: "system-ui" }}>GalvánDesk · Vista previa del parte</span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => pdfParte(parte)} style={{ background: "#16a34a", border: "none", color: "#fff", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 700, fontFamily: "system-ui" }}>⬇️ Descargar PDF</button>
          <CopyBtn getText={() => texto} />
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 700 }}>✕ Cerrar</button>
        </div>
      </div>
      <div style={{ maxWidth: 680, margin: "40px auto", padding: "0 24px 60px" }}>
        <div style={{ textAlign: "center", borderBottom: `3px solid ${C.teal}`, paddingBottom: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: C.gray, marginBottom: 4, letterSpacing: 2 }}>IES ENRIQUE TIERNO GALVÁN · MADRID</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.dark, fontFamily: "system-ui" }}>GalvánDesk — Parte de Incidencia</div>
          <div style={{ marginTop: 10 }}>
            <span style={{ display: "inline-block", padding: "6px 20px", borderRadius: 8, fontWeight: 700, fontSize: 15, background: g.bg, color: g.color, border: `2px solid ${g.color}` }}>{g.label} — {g.desc}</span>
          </div>
        </div>
        {[["Alumno/a", parte.alumno], ["Curso / Aula", parte.curso], ["Tutor/a del grupo", parte.tutor || "—"], ["Correo del tutor/a", parte.tutorEmail || "—"], ["Tipo de parte", parte.tipo], ["Hora de clase", parte.hora || "No especificada"], ["Fecha y hora", fmt(parte.ts)], ["Profesor responsable", parte.profesor]].map(([k, v]) => (
          <InfoRow key={k} label={k} value={v} />
        ))}
        {parte.tipificacion && (() => {
          const grav = parte.gravedad;
          const tipObj = TIPIFICACION[grav]?.find(t => t.id === parte.tipificacion);
          const fuente = grav === "leve" ? "Plan de Convivencia del Centro" : "Decreto 32/2019 CAM";
          return (
            <div style={{ margin: "10px 0", padding: "10px 14px", background: "#EEF5F8", borderRadius: 8, border: `1px solid ${C.blue}`, fontSize: 13 }}>
              <span style={{ fontWeight: 700, color: C.blue }}>⚖️ Tipificación normativa </span>
              <span style={{ color: C.gray, fontSize: 11 }}>({fuente})</span>
              <div style={{ marginTop: 4, color: C.dark }}>{tipObj?.label}</div>
            </div>
          );
        })()}
        {parte.esGrupal && <div style={{ marginTop: 8, background: "#e8f5f3", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: C.teal, fontWeight: 600 }}>👥 Parte generado como parte de grupo</div>}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Descripción del incidente:</div>
          <div style={{ background: C.light, padding: 16, borderRadius: 8, fontSize: 14, lineHeight: 1.7, border: `1px solid #e5e7eb` }}>{parte.descripcion}</div>
        </div>
        <div style={{ background: "#EEF5F8", padding: 16, borderRadius: 8, marginTop: 20, fontSize: 14 }}>
          <div style={{ fontWeight: 700, marginBottom: 8, color: C.blue }}>📬 Contacto familia</div>
          <div>✉️ {parte.email}</div>
          <div style={{ marginTop: 4 }}>📱 {parte.telefono}</div>
        </div>
        <div style={{ display: "flex", gap: 40, marginTop: 50 }}>
          {["Firma del Profesor", "Firma Jefatura de Estudios", "Firma del Alumno/a"].map(f => (
            <div key={f} style={{ flex: 1, borderTop: `2px solid ${C.dark}`, paddingTop: 8, textAlign: "center", fontSize: 12, color: "#555" }}>{f}</div>
          ))}
        </div>
        <div style={{ marginTop: 32, textAlign: "center", color: "#aaa", fontSize: 11, borderTop: "1px dashed #ccc", paddingTop: 12 }}>
          GalvánDesk · IES Enrique Tierno Galván · Ref: PARTE-{parte.id}
        </div>
      </div>
      <style>{`@media print{.no-print{display:none!important}}`}</style>
    </div>
  );
}

// ─── Vista impresión informe ──────────────────────────────────────────────────
function PrintInforme({ type = "partes", partes, banos, filtros, tutores = {}, onDescargado, onClose }) {
  const fecha = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
  
  if (type === "partes") {
    const res = {
      leve:      partes.filter(p => p.gravedad === "leve").length,
      grave:     partes.filter(p => p.gravedad === "grave").length,
      muy_grave: partes.filter(p => p.gravedad === "muy_grave").length,
    };
    const filtrosTexto = [
      filtros.filtCurso && `Curso: ${filtros.filtCurso}`,
      filtros.filtCurso && tutores[filtros.filtCurso]?.tutor && `Tutor/a: ${tutores[filtros.filtCurso].tutor}`,
      filtros.filtGravedad && GRAVEDAD.find(g => g.id === filtros.filtGravedad)?.label,
      filtros.filtFechaDesde && `Desde: ${fmtD(filtros.filtFechaDesde)}`,
      filtros.filtFechaHasta && `Hasta: ${fmtD(filtros.filtFechaHasta)}`,
    ].filter(Boolean).join(" · ");
    const textoPlano = `GALVÁNDESK — INFORME DE PARTES\nIES Enrique Tierno Galván · Madrid\nGenerado el ${fecha}\n${filtrosTexto ? `Filtros: ${filtrosTexto}\n` : ""}\nRESUMEN: Total: ${partes.length} | Leves: ${res.leve} | Graves: ${res.grave} | Muy Graves: ${res.muy_grave}\n\n${"─".repeat(90)}\n${partes.map((p, i) => `${i + 1}. ${fmt(p.ts)} | ${p.hora || "-"} | ${p.alumno} | ${p.curso} (tutor/a: ${tutorDeParte(p, tutores) || "-"}) | ${p.tipo} | ${p.gravedad.toUpperCase()} | ${p.profesor}\n   ${p.descripcion}`).join("\n")}\n${"─".repeat(90)}`;
    
    const resumen = resumenPorGrupo(partes, tutores);
    const descargarPDF = () => { pdfInformePartes(partes, filtrosTexto, tutores); onDescargado?.({ tipo: "partes", filtrosTexto, ids: partes.map(p => p.id) }); };
    
    return (
      <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 1000, overflowY: "auto", fontFamily: "system-ui, sans-serif" }}>
        <div className="no-print" style={{ background: C.dark, color: "#fff", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>GalvánDesk — Informe de Partes</span>
          <div style={{ display: "flex", gap: 8 }}>
            <CopyBtn getText={() => textoPlano} />
            <button onClick={descargarPDF} style={{ background: "rgba(76, 175, 80, 0.8)", border: "none", color: "#fff", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 700 }}>⬇️ Descargar PDF</button>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 700 }}>✕ Cerrar</button>
          </div>
        </div>
        <div data-print-informe style={{ maxWidth: 900, margin: "30px auto", padding: "0 24px 60px" }}>
          <div style={{ textAlign: "center", borderBottom: `3px solid ${C.teal}`, paddingBottom: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: C.gray, letterSpacing: 2, marginBottom: 4 }}>IES ENRIQUE TIERNO GALVÁN · MADRID</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.dark }}>GalvánDesk — Informe de Partes</div>
            <div style={{ color: C.gray, fontSize: 13, marginTop: 4 }}>Generado el {fecha} · Jefatura de Estudios</div>
            {filtrosTexto && <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>Filtros: {filtrosTexto}</div>}
          </div>
          <div style={{ display: "flex", gap: 14, marginBottom: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {[{ label: "Total", value: partes.length, color: C.dark }, { label: "🟡 Leves", value: res.leve, color: C.teal }, { label: "⚠️ Graves", value: res.grave, color: C.amber }, { label: "🔴 Muy Graves", value: res.muy_grave, color: C.salmon }].map(s => (
              <div key={s.label} style={{ textAlign: "center", padding: "12px 24px", borderRadius: 10, background: C.light, borderTop: `3px solid ${s.color}`, minWidth: 100 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: C.gray }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontWeight: 700, color: C.dark, fontSize: 15, margin: "0 0 8px" }}>👩‍🏫 Resumen por grupo y tutoría</div>
          <div style={{ overflowX: "auto", marginBottom: 24 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ background: C.blue, color: "#fff" }}>{["Grupo", "Tutor/a del grupo", "Correo", "Leves", "Graves", "Muy graves", "Total"].map(h => <th key={h} style={{ padding: "8px", textAlign: "left" }}>{h}</th>)}</tr></thead>
              <tbody>
                {resumen.map((r, i) => (
                  <tr key={r.curso} style={{ background: i % 2 === 0 ? "#fff" : C.light }}>
                    <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee", fontWeight: 700 }}>{r.curso}</td>
                    <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee" }}>{r.tutor || <span style={{ color: C.salmon }}>Sin registrar</span>}</td>
                    <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee", color: C.gray }}>{r.email || "—"}</td>
                    <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee", textAlign: "center" }}>{r.leve}</td>
                    <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee", textAlign: "center" }}>{r.grave}</td>
                    <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee", textAlign: "center" }}>{r.muy_grave}</td>
                    <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee", textAlign: "center", fontWeight: 800 }}>{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontWeight: 700, color: C.dark, fontSize: 15, margin: "0 0 8px" }}>📋 Detalle de los partes</div>
          <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: C.dark, color: "#fff" }}>
                {["Fecha", "Hora", "Alumno", "Curso", "Tutor/a", "Tipo", "Gravedad", "Profesor", "Descripción"].map(h => (
                  <th key={h} style={{ padding: "9px 8px", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {partes.map((p, i) => {
                const g = gObj(p.gravedad);
                return (
                  <tr key={p.id} style={{ background: i % 2 === 0 ? "#fff" : C.light }}>
                    <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>{fmt(p.ts)}</td>
                    <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>{p.hora || "-"}</td>
                    <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee", fontWeight: 600 }}>{p.alumno}{p.esGrupal ? <span style={{ marginLeft: 4, fontSize: 10, color: C.teal }}>◆grupal</span> : null}</td>
                    <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee" }}>{p.curso}</td>
                    <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee" }}>{tutorDeParte(p, tutores) || "—"}</td>
                    <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee" }}>{p.tipo}</td>
                    <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee" }}><span style={{ background: g.bg, color: g.color, padding: "2px 8px", borderRadius: 6, fontWeight: 700, fontSize: 11 }}>{g.label}</span></td>
                    <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee" }}>{p.profesor}</td>
                    <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee" }}>{p.descripcion.slice(0, 60)}{p.descripcion.length > 60 ? "…" : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
          <div style={{ marginTop: 24, textAlign: "center", color: "#aaa", fontSize: 11, borderTop: "1px dashed #ccc", paddingTop: 10 }}>
            GalvánDesk · IES Enrique Tierno Galván · Madrid · {fecha}
          </div>
        </div>
        <style>{`@media print{.no-print{display:none!important}}`}</style>
      </div>
    );
  } else if (type === "banos") {
    const filtrosTexto = [
      filtros.filtCurso && `Curso: ${filtros.filtCurso}`,
      filtros.filtFechaDesde && `Desde: ${fmtD(filtros.filtFechaDesde)}`,
      filtros.filtFechaHasta && `Hasta: ${fmtD(filtros.filtFechaHasta)}`,
    ].filter(Boolean).join(" · ");
    const textoPlano = `GALVÁNDESK — INFORME DE SALIDAS AL BAÑO\nIES Enrique Tierno Galván · Madrid\nGenerado el ${fecha}\n${filtrosTexto ? `Filtros: ${filtrosTexto}\n` : ""}\nRESUMEN: Total de salidas: ${banos.length}\n\n${"─".repeat(90)}\n${banos.map((b, i) => `${i + 1}. ${fmt(b.ts || b.salida)} | ${b.alumno} | ${b.curso} | Autorizado por: ${b.profesor || "-"}\n   Motivo: ${b.motivo || "-"}`).join("\n")}\n${"─".repeat(90)}`;
    
    const descargarPDF = () => { pdfInformeBanos(banos, filtrosTexto); onDescargado?.({ tipo: "banos", filtrosTexto, ids: banos.map(b => b.id) }); };
    
    return (
      <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 1000, overflowY: "auto", fontFamily: "system-ui, sans-serif" }}>
        <div className="no-print" style={{ background: C.dark, color: "#fff", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>GalvánDesk — Informe de Baños</span>
          <div style={{ display: "flex", gap: 8 }}>
            <CopyBtn getText={() => textoPlano} />
            <button onClick={descargarPDF} style={{ background: "rgba(76, 175, 80, 0.8)", border: "none", color: "#fff", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 700 }}>⬇️ Descargar PDF</button>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 700 }}>✕ Cerrar</button>
          </div>
        </div>
        <div data-print-informe style={{ maxWidth: 900, margin: "30px auto", padding: "0 24px 60px" }}>
          <div style={{ textAlign: "center", borderBottom: `3px solid ${C.blue}`, paddingBottom: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: C.gray, letterSpacing: 2, marginBottom: 4 }}>IES ENRIQUE TIERNO GALVÁN · MADRID</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.dark }}>GalvánDesk — Informe de Salidas al Baño</div>
            <div style={{ color: C.gray, fontSize: 13, marginTop: 4 }}>Generado el {fecha} · Jefatura de Estudios</div>
            {filtrosTexto && <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>Filtros: {filtrosTexto}</div>}
          </div>
          <div style={{ display: "flex", gap: 14, marginBottom: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {[{ label: "Total Salidas", value: banos.length, color: C.blue }].map(s => (
              <div key={s.label} style={{ textAlign: "center", padding: "12px 24px", borderRadius: 10, background: C.light, borderTop: `3px solid ${s.color}`, minWidth: 100 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: C.gray }}>{s.label}</div>
              </div>
            ))}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: C.dark, color: "#fff" }}>
                {["Fecha", "Alumno", "Curso", "Profesor", "Motivo"].map(h => (
                  <th key={h} style={{ padding: "9px 8px", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {banos.map((b, i) => (
                <tr key={b.id} style={{ background: i % 2 === 0 ? "#fff" : C.light }}>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>{fmt(b.ts || b.salida)}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee", fontWeight: 600 }}>{b.alumno}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee" }}>{b.curso}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee" }}>{b.profesor || "-"}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee" }}>{b.motivo || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 24, textAlign: "center", color: "#aaa", fontSize: 11, borderTop: "1px dashed #ccc", paddingTop: 10 }}>
            GalvánDesk · IES Enrique Tierno Galván · Madrid · {fecha}
          </div>
        </div>
        <style>{`@media print{.no-print{display:none!important}}`}</style>
      </div>
    );
  }
}

// ─── Cómo avisar a la familia y a Jefatura ─────────────────────────────────
// La app no envía correos: el profesor lo manda desde su correo del centro.
function ComoAvisar({ parte }) {
  const direcciones = [parte.email, parte.tutorEmail].filter(Boolean).join(", ");
  const btn = { border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontWeight: 700, fontSize: 13 };
  return (
    <div style={{ marginTop: 14, background: "#FFFBEB", border: "1px solid #fcd34d", borderRadius: 10, padding: 14, textAlign: "left" }}>
      <div style={{ fontWeight: 700, color: C.dark, fontSize: 14, marginBottom: 6 }}>📨 Cómo avisar a la familia y a Jefatura</div>
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.55 }}>
        Escribe un correo desde tu cuenta del centro a la familia y a Jefatura (con el tutor/a en copia) y elige una de estas dos formas:
        <ol style={{ margin: "6px 0 10px", paddingLeft: 20 }}>
          <li><strong>Descarga el PDF</strong> y adjúntalo al correo.</li>
          <li><strong>Copia el texto</strong> del parte y pégalo en el cuerpo del correo.</li>
        </ol>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => pdfParte(parte)} style={{ ...btn, background: "#16a34a", color: "#fff" }}>⬇️ Descargar PDF</button>
        <CopyBtn getText={() => textoParte(parte)} label="📋 Copiar texto" />
        {direcciones && <CopyBtn getText={() => direcciones} label="✉️ Copiar correos (familia y tutor/a)" />}
      </div>
      <div style={{ fontSize: 11, color: C.gray, marginTop: 8 }}>La app no envía correos: se mandan desde tu correo del centro, que es el canal oficial.</div>
    </div>
  );
}

// ─── Tarjeta de parte ────────────────────────────────────────────────────────
function ParteCard({ parte, onVer, onPrint }) {
  const g = gObj(parte.gravedad);
  return (
    <div onClick={onVer} role="button" tabIndex={0} title="Pulsa para ver el parte en grande"
      onKeyDown={e => { if (e.key === "Enter" && e.target === e.currentTarget) onVer(); }}
      onMouseOver={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.14)"; }}
      onMouseOut={e => { e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)"; }}
      style={{ background: C.white, borderRadius: 12, padding: 16, marginBottom: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", borderLeft: `4px solid ${g.color}`, cursor: "pointer", transition: "box-shadow .15s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.dark }}>
            {parte.alumno}
            {parte.esGrupal && <span style={{ fontSize: 11, background: "#e8f5f3", color: C.teal, borderRadius: 6, padding: "2px 8px", marginLeft: 6 }}>👥 grupal</span>}
          </div>
          <div style={{ fontSize: 12, color: C.gray, marginTop: 3 }}>
            📚 {parte.curso}{parte.tutor ? ` (tutor/a: ${parte.tutor})` : ""} · {parte.tipo} · ⏰ {parte.hora || "—"} · 📅 {fmt(parte.ts)} · 👤 {parte.profesor}
          </div>
          <div style={{ fontSize: 13, marginTop: 6, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {parte.descripcion}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
          <Badge g={parte.gravedad} />
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={e => { e.stopPropagation(); onVer(); }} style={{ background: "#EEF5F8", color: C.blue, border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>👁 Ver</button>
            <button onClick={e => { e.stopPropagation(); onPrint(); }} style={{ background: "#FDF0EF", color: C.salmon, border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>🖨 PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Gestión de alumnos ───────────────────────────────────────────────────────
// ─── Tutorías de grupo ───────────────────────────────────────────────────────
// Cada grupo tiene su tutor/a. Se usa en los partes nuevos y en los informes.
function TutoriasGrupos({ cursos, tutores, setTutores, setAlumnos, profesores, soloCurso, C, inpStyle }) {
  const lista = soloCurso ? [soloCurso] : [...new Set([...cursos, ...Object.keys(tutores)])].sort();
  function cambiar(curso, campo, valor) {
    setTutores(prev => ({ ...prev, [curso]: { ...(prev[curso] || {}), [campo]: valor } }));
    if (campo === "tutor") setAlumnos(prev => prev.map(a => a.curso === curso ? { ...a, tutor: valor } : a));
  }
  const inp = { ...inpStyle, padding: "8px 10px", fontSize: 13 };
  return (
    <div style={{ background: C.white, borderRadius: 14, padding: 18, marginBottom: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: `1px solid ${C.cream}` }}>
      <div style={{ fontWeight: 700, color: C.dark, fontSize: 15 }}>👩‍🏫 {soloCurso ? `Tutor/a de ${soloCurso}` : "Tutorías de grupo"}</div>
      <div style={{ fontSize: 12, color: C.gray, margin: "4px 0 12px" }}>
        {soloCurso ? "Aparece en el informe. Si lo cambias aquí, queda guardado para el grupo." : "El tutor/a de cada grupo aparece en los partes y en los informes. Los cambios se guardan solos."}
      </div>
      {lista.length === 0 && <div style={{ fontSize: 13, color: C.gray }}>Aún no hay grupos. Añade alumnado primero.</div>}
      {lista.map(curso => (
        <div key={curso} style={{ display: "grid", gridTemplateColumns: soloCurso ? "repeat(auto-fit,minmax(180px,1fr))" : "72px minmax(0,1fr) minmax(0,1fr)", gap: 8, alignItems: "center", marginBottom: 8 }}>
          {!soloCurso && <div style={{ fontWeight: 700, color: C.dark, fontSize: 13 }}>{curso}</div>}
          <select aria-label={`Tutor/a de ${curso}`} value={tutores[curso]?.tutor || ""} onChange={e => cambiar(curso, "tutor", e.target.value)} style={inp}>
            <option value="">— Sin tutor/a —</option>
            {[...new Set([...(profesores || []), tutores[curso]?.tutor].filter(Boolean))].sort().map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <input aria-label={`Correo del tutor/a de ${curso}`} type="email" placeholder="Correo del centro (opcional)" value={tutores[curso]?.email || ""} onChange={e => cambiar(curso, "email", e.target.value)} style={inp} />
        </div>
      ))}
    </div>
  );
}

// ─── Informes guardados ─────────────────────────────────────────────────────
// Cada vez que se descarga un informe queda anotado: quién, cuándo, con qué filtros
// y qué partes contenía. Se puede volver a descargar igual que estaba.
function InformesGuardados({ informes, setInformes, partes, banos, tutores, C }) {
  if (!informes.length) return null;
  function descargar(inf) {
    if (inf.tipo === "banos") pdfInformeBanos(banos.filter(b => inf.ids.includes(b.id)), inf.filtrosTexto);
    else pdfInformePartes(partes.filter(p => inf.ids.includes(p.id)), inf.filtrosTexto, tutores, inf.ts);
  }
  return (
    <div style={{ background: C.white, borderRadius: 14, padding: 18, marginTop: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
      <div style={{ fontWeight: 700, color: C.dark, fontSize: 15 }}>🗂 Informes guardados</div>
      <div style={{ fontSize: 12, color: C.gray, margin: "4px 0 12px" }}>Cada informe descargado queda aquí anotado con sus partes, para volver a sacarlo igual.</div>
      {informes.map(inf => (
        <div key={inf.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "10px 0", borderTop: `1px solid ${C.cream}`, flexWrap: "wrap" }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: C.dark }}>{inf.tipo === "banos" ? "🚻 Salidas al baño" : "📋 Partes"} · {inf.total} registro{inf.total !== 1 ? "s" : ""}</div>
            <div style={{ fontSize: 12, color: C.gray }}>{fmt(inf.ts)} · {inf.autor || "—"}{inf.filtrosTexto ? ` · ${inf.filtrosTexto}` : " · Sin filtros"}</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => descargar(inf)} style={{ background: "#E8F5F3", color: C.teal, border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>⬇️ PDF</button>
            <button aria-label="Quitar del historial" onClick={() => { if (window.confirm("¿Quitar este informe del historial? Los partes no se borran.")) setInformes(prev => prev.filter(x => x.id !== inf.id)); }} style={{ background: "#f3f4f6", color: C.gray, border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12 }}>🗑</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminAlumnos({ alumnos, setAlumnos, inpStyle, C }) {
  const [nuevoAlumno, setNuevoAlumno] = useState({ nombre: "", curso: "", tutor: "", email: "", telefono: "", nia: "" });
  const [preview, setPreview] = useState(null);
  const [importMsg, setImportMsg] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
  const [subTab, setSubTab] = useState("importar");
  const [feedbackAñadir, setFeedbackAñadir] = useState(false); // Nuevo: feedback visual
  const fileRef = useRef();

  async function processFile(file) {
    setImportMsg(null); setPreview(null);
    try {
      if (file.name.match(/\.csv$/i) || file.type === "text/csv") {
        const text = await file.text();
        const rows = parseCSV(text);
        if (!rows.length) { setImportMsg({ type: "error", text: "No se encontraron alumnos en el archivo." }); return; }
        setPreview(rows);
      } else if (file.name.match(/\.xlsx?$/i)) {
        const loadXLSX = () => new Promise((res, rej) => {
          if (window.XLSX) { res(window.XLSX); return; }
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
          s.onload = () => res(window.XLSX); s.onerror = rej;
          document.head.appendChild(s);
        });
        const XLSX = await loadXLSX();
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_csv(ws, { FS: ";" });
        const rows = parseCSV(raw);
        if (!rows.length) { setImportMsg({ type: "error", text: "No se encontraron alumnos en el archivo." }); return; }
        setPreview(rows);
      } else {
        setImportMsg({ type: "error", text: "Formato no soportado. Usa CSV o Excel (.xlsx)." });
      }
    } catch (e) {
      setImportMsg({ type: "error", text: "Error al leer el archivo: " + e.message });
    }
  }

  function confirmarImport() {
    setAlumnos(prev => {
      const existingNias = new Set(prev.map(a => a.nia).filter(Boolean));
      const nuevos = preview.filter(a => !a.nia || !existingNias.has(a.nia));
      return [...prev, ...nuevos];
    });
    setImportMsg({ type: "ok", text: `✅ ${preview.length} alumno(s) importados correctamente.` });
    setPreview(null);
  }

  const stb = active => ({
    padding: "10px 16px", border: "none", background: "none", cursor: "pointer",
    fontSize: 13, fontWeight: 600,
    color: active ? C.teal : C.gray,
    borderBottom: active ? `3px solid ${C.teal}` : "3px solid transparent",
  });

  return (
    <div>
      <h2 style={{ color: C.dark, marginTop: 0 }}>👥 Gestión de Alumnos</h2>
      <div style={{ background: C.white, borderRadius: 12, marginBottom: 14, display: "flex", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderBottom: `2px solid ${C.cream}` }}>
        <button style={stb(subTab === "importar")} onClick={() => setSubTab("importar")}>📥 Importar CSV/Excel</button>
        <button style={stb(subTab === "manual")}   onClick={() => setSubTab("manual")}>✏️ Añadir manual</button>
        <button style={stb(subTab === "lista")}    onClick={() => setSubTab("lista")}>📋 Lista completa</button>
      </div>

      {subTab === "importar" && (
        <div>
          <Card style={{ background: "#EEF5F8", border: `1px solid ${C.blue}`, marginBottom: 14 }}>
            <div style={{ fontWeight: 700, color: C.blue, marginBottom: 8, fontSize: 14 }}>💡 Cómo exportar desde Raíces</div>
            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
              1. Entra en <strong>Raíces → Alumnado → Listados</strong><br />
              2. Exporta en formato <strong>CSV o Excel</strong><br />
              3. Asegúrate de incluir columnas: <em>Nombre, Curso/Grupo, Tutor, Email y Teléfono</em><br />
              4. Arrastra el archivo aquí abajo o pulsa para seleccionarlo
            </div>
          </Card>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); }}
            onClick={() => fileRef.current.click()}
            style={{ border: `2px dashed ${dragging ? C.teal : "#d1d5db"}`, borderRadius: 12, padding: "36px 20px", textAlign: "center", cursor: "pointer", background: dragging ? "#E8F5F3" : C.white, transition: "all .2s", marginBottom: 14 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📂</div>
            <div style={{ fontWeight: 700, color: C.dark, fontSize: 15 }}>Arrastra tu archivo aquí</div>
            <div style={{ color: C.gray, fontSize: 13, marginTop: 4 }}>o haz clic para seleccionar · CSV o Excel (.xlsx)</div>
            <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: "none" }}
              onChange={e => { if (e.target.files[0]) processFile(e.target.files[0]); e.target.value = ""; }} />
          </div>
          {importMsg && (
            <div style={{ background: importMsg.type === "ok" ? "#E8F5F3" : "#FDF0EF", border: `1px solid ${importMsg.type === "ok" ? C.teal : C.salmon}`, borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 600, color: importMsg.type === "ok" ? C.teal : C.salmon, marginBottom: 14 }}>
              {importMsg.text}
            </div>
          )}
          {preview && (
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontWeight: 700, color: C.dark, fontSize: 15 }}>Vista previa — {preview.length} alumnos encontrados</div>
                <button onClick={() => setPreview(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.gray }}>✕</button>
              </div>
              <div style={{ overflowX: "auto", marginBottom: 16 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: C.dark, color: "#fff" }}>
                      {["Nombre", "Curso", "Tutor", "Email", "Teléfono", "NIA"].map(h => (
                        <th key={h} style={{ padding: "8px 10px", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 10).map((a, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : C.light }}>
                        <td style={{ padding: "6px 10px", borderBottom: "1px solid #eee", fontWeight: 600 }}>{a.nombre || <span style={{ color: "#f87171" }}>⚠ vacío</span>}</td>
                        <td style={{ padding: "6px 10px", borderBottom: "1px solid #eee" }}>{a.curso || "—"}</td>
                        <td style={{ padding: "6px 10px", borderBottom: "1px solid #eee" }}>{a.tutor || "—"}</td>
                        <td style={{ padding: "6px 10px", borderBottom: "1px solid #eee" }}>{a.email || "—"}</td>
                        <td style={{ padding: "6px 10px", borderBottom: "1px solid #eee" }}>{a.telefono || "—"}</td>
                        <td style={{ padding: "6px 10px", borderBottom: "1px solid #eee" }}>{a.nia || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {preview.length > 10 && <div style={{ textAlign: "center", color: C.gray, fontSize: 12, padding: "8px 0" }}>… y {preview.length - 10} más</div>}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn onClick={confirmarImport} color={C.teal} style={{ flex: 1 }}>✅ Confirmar importación ({preview.length} alumnos)</Btn>
                <Btn onClick={() => setPreview(null)} color={C.gray}>Cancelar</Btn>
              </div>
            </Card>
          )}
        </div>
      )}

      {subTab === "manual" && (
        <Card>
          <h3 style={{ marginTop: 0, color: C.dark }}>Añadir alumno manualmente</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[["nombre", "Nombre completo *"], ["curso", "Curso / Aula *"], ["tutor", "Tutor de grupo"], ["email", "Email familia"], ["telefono", "Teléfono familia"], ["nia", "NIA / DNI"]].map(([k, ph]) => (
              <input key={k} value={nuevoAlumno[k] || ""} onChange={e => setNuevoAlumno(p => ({ ...p, [k]: e.target.value }))} placeholder={ph} style={inpStyle} />
            ))}
          </div>
          <Btn onClick={() => {
            if (!nuevoAlumno.nombre || !nuevoAlumno.curso) return;
            setAlumnos(prev => [...prev, { ...nuevoAlumno, id: Date.now() }]);
            setNuevoAlumno({ nombre: "", curso: "", tutor: "", email: "", telefono: "", nia: "" });
            // Feedback visual
            setFeedbackAñadir(true);
            setTimeout(() => setFeedbackAñadir(false), 1500);
          }} color={feedbackAñadir ? "#10b981" : C.teal} style={{ marginTop: 12, transition: "all .3s ease" }}>
            {feedbackAñadir ? "✅ ¡Alumno agregado!" : "➕ Añadir Alumno"}
          </Btn>
        </Card>
      )}

      {subTab === "lista" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontWeight: 600, color: C.dark }}>👤 {alumnos.length} alumno(s) en el sistema</div>
            {alumnos.length > 0 && (
              confirmarBorrado
                ? <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: C.salmon, fontWeight: 600 }}>¿Borrar todos al inicio de curso?</span>
                  <Btn onClick={() => { setAlumnos([]); setConfirmarBorrado(false); }} color={C.salmon} style={{ padding: "6px 14px", fontSize: 13 }}>Sí, borrar</Btn>
                  <Btn onClick={() => setConfirmarBorrado(false)} color={C.gray} style={{ padding: "6px 14px", fontSize: 13 }}>Cancelar</Btn>
                </div>
                : <button onClick={() => setConfirmarBorrado(true)} style={{ background: "#FDF0EF", color: C.salmon, border: `1px solid ${C.salmon}`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>🗑 Limpiar lista (nuevo curso)</button>
            )}
          </div>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            {alumnos.length === 0
              ? <div style={{ padding: 30, textAlign: "center", color: C.gray }}>Sin alumnos. Importa un CSV o añádelos manualmente.</div>
              : alumnos.map(a => (
                <div key={a.id} style={{ padding: "12px 20px", borderBottom: `1px solid ${C.cream}`, fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, color: C.dark }}>{a.nombre} <span style={{ color: C.gray, fontWeight: 400 }}>— {a.curso}</span>{a.nia && <span style={{ fontSize: 11, color: C.blue, marginLeft: 6 }}>NIA: {a.nia}</span>}</div>
                    <div style={{ color: C.gray, marginTop: 2 }}>Tutor: {a.tutor || "—"} · ✉️ {a.email || "—"} · 📱 {a.telefono || "—"}</div>
                  </div>
                  <button onClick={() => setAlumnos(prev => prev.filter(x => x.id !== a.id))} style={{ background: "#FDF0EF", color: C.salmon, border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>🗑</button>
                </div>
              ))}
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── Planificador de Guardias ─────────────────────────────────────────────────
function PlanificadorGuardias({ profesores, cursos, inpStyle, selStyle, labelStyle }) {
  const hoy = todayStr();

  // Estado del formulario por módulos
  const [paso, setPaso] = useState(1);

  // Módulo 1 — Fecha y periodo
  const [pgFecha, setPgFecha]       = useState(hoy);
  const [pgFechaFin, setPgFechaFin] = useState(hoy);
  const [pgMultidia, setPgMultidia] = useState(false);
  const [pgNota, setPgNota]         = useState("");

  // Módulo 2 — Profesor ausente
  const [pgProfesor, setPgProfesor]     = useState("");
  const [pgMotivo, setPgMotivo]         = useState("Enfermedad");
  const [pgHoras, setPgHoras]           = useState([]); // horas afectadas
  const [pgCursoHora, setPgCursoHora]   = useState({}); // { hora: curso }
  const [pgMateriaHora, setPgMateriaHora] = useState({}); // { hora: materia }

  // Módulo 3 — Aula y tarea
  const [pgModuloEdificio, setPgModuloEdificio] = useState({}); // { hora: modulo }
  const [pgTareaHora, setPgTareaHora]           = useState({}); // { hora: tarea }
  const [pgMaterialHora, setPgMaterialHora]     = useState({}); // { hora: material_detalle }

  // Módulo 4 — Profesor de guardia
  const [pgGuardiaHora, setPgGuardiaHora]   = useState({}); // { hora: profesor }
  const [pgZonaHora, setPgZonaHora]         = useState({}); // { hora: zona }

  // Resultado
  const [planGuardia, setPlanGuardia]       = useState(null);
  const [planesGuardia, setPlanesGuardia]   = useState([]);
  const [verPlan, setVerPlan]               = useState(null);

  const [planesCargados, setPlanesCargados] = useState(false);
  useEffect(() => {
    async function load() {
      const pg = await sGet("planes_guardia");
      if (pg) setPlanesGuardia(pg);
      setPlanesCargados(true);
    }
    load();
  }, []);

  useEffect(() => {
    if (planesCargados) sSet("planes_guardia", planesGuardia);
  }, [planesGuardia, planesCargados]);

  function toggleHora(h) {
    setPgHoras(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]);
  }

  function setCursoHora(hora, val) { setPgCursoHora(p => ({ ...p, [hora]: val })); }
  function setMateriaHora(hora, val) { setPgMateriaHora(p => ({ ...p, [hora]: val })); }
  function setModuloHora(hora, val) { setPgModuloEdificio(p => ({ ...p, [hora]: val })); }
  function setTareaHora(hora, val) { setPgTareaHora(p => ({ ...p, [hora]: val })); }
  function setMaterialDetalleHora(hora, val) { setPgMaterialHora(p => ({ ...p, [hora]: val })); }
  function setGuardiaHora(hora, val) { setPgGuardiaHora(p => ({ ...p, [hora]: val })); }
  function setZonaHora(hora, val) { setPgZonaHora(p => ({ ...p, [hora]: val })); }

  function validarPaso(n) {
    if (n === 1) return pgFecha && pgProfesor === "" ? false : true; // siempre ok en paso 1
    if (n === 2) return pgProfesor && pgHoras.length > 0;
    if (n === 3) return pgHoras.every(h => pgCursoHora[h]);
    if (n === 4) return pgHoras.every(h => pgGuardiaHora[h]);
    return true;
  }

  function generarPlan() {
    const plan = {
      id: Date.now(),
      fecha: pgFecha,
      fechaFin: pgMultidia ? pgFechaFin : pgFecha,
      multidia: pgMultidia,
      profesorAusente: pgProfesor,
      motivo: pgMotivo,
      nota: pgNota,
      horas: pgHoras.map(h => ({
        hora: h,
        curso: pgCursoHora[h] || "",
        materia: pgMateriaHora[h] || "",
        modulo: pgModuloEdificio[h] || "",
        tarea: pgTareaHora[h] || "",
        materialDetalle: pgMaterialHora[h] || "",
        profesorGuardia: pgGuardiaHora[h] || "",
        zona: pgZonaHora[h] || "",
      })),
      ts: new Date().toISOString(),
    };
    setPlanesGuardia(prev => [plan, ...prev]);
    setPlanGuardia(plan);
    // reset
    setPaso(1); setPgFecha(hoy); setPgFechaFin(hoy); setPgMultidia(false); setPgNota("");
    setPgProfesor(""); setPgMotivo("Enfermedad"); setPgHoras([]);
    setPgCursoHora({}); setPgMateriaHora({}); setPgModuloEdificio({});
    setPgTareaHora({}); setPgMaterialHora({}); setPgGuardiaHora({}); setPgZonaHora({});
  }

  // Colores de paso
  const pasoColor = n => n < paso ? C.teal : n === paso ? C.blue : "#d1d5db";

  // ── Vista detalle de un plan ──
  if (verPlan) return (
    <div>
      <button onClick={() => setVerPlan(null)}
        style={{ marginBottom: 16, background: C.cream, border: `1px solid #ddd`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontSize: 13, color: C.dark }}>
        ← Volver al listado
      </button>
      <div style={{ background: `linear-gradient(90deg,${C.dark},${C.blue})`, borderRadius: "14px 14px 0 0", padding: "20px 24px", color: "#fff" }}>
        <div style={{ fontSize: 11, opacity: .7, letterSpacing: 1, marginBottom: 4 }}>PLAN DE GUARDIA · IES ENRIQUE TIERNO GALVÁN</div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>👤 {verPlan.profesorAusente}</div>
        <div style={{ fontSize: 13, opacity: .85, marginTop: 4 }}>
          📅 {verPlan.multidia ? `${fmtD(verPlan.fecha)} → ${fmtD(verPlan.fechaFin)}` : fmtD(verPlan.fecha)} · {verPlan.motivo}
        </div>
        {verPlan.nota && <div style={{ fontSize: 12, opacity: .75, marginTop: 4, fontStyle: "italic" }}>{verPlan.nota}</div>}
      </div>
      <div style={{ background: C.white, borderRadius: "0 0 14px 14px", padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", marginBottom: 14 }}>
        <div style={{ fontWeight: 700, color: C.dark, marginBottom: 12 }}>Resumen de {verPlan.horas.length} hora(s)</div>
        {verPlan.horas.map((h, i) => (
          <div key={i} style={{ borderRadius: 12, border: `1px solid #e5e7eb`, marginBottom: 10, overflow: "hidden" }}>
            {/* Cabecera hora */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", background: C.cream }}>
              <div style={{ fontWeight: 700, color: C.dark, fontSize: 14 }}>⏰ {h.hora}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {h.curso && <span style={{ background: "#EEF5F8", color: C.blue, borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>🏫 {h.curso}</span>}
                {h.materia && <span style={{ background: C.amberBg, color: C.amber, borderRadius: 6, padding: "2px 10px", fontSize: 12 }}>📚 {h.materia}</span>}
                {h.modulo && <span style={{ background: "#E8F5F3", color: C.teal, borderRadius: 6, padding: "2px 10px", fontSize: 12 }}>🏢 {h.modulo}</span>}
              </div>
            </div>
            {/* Cuerpo */}
            <div style={{ padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13 }}>
              <div>
                <div style={{ color: C.gray, fontWeight: 600, marginBottom: 4 }}>🔄 Profesor de guardia</div>
                <div style={{ color: C.dark, fontWeight: 700 }}>{h.profesorGuardia || <span style={{ color: "#f87171" }}>⚠ Sin asignar</span>}</div>
                {h.zona && <div style={{ color: C.gray, marginTop: 2 }}>📍 {h.zona}</div>}
              </div>
              <div>
                <div style={{ color: C.gray, fontWeight: 600, marginBottom: 4 }}>📋 Tarea para los alumnos</div>
                <div style={{ color: C.dark }}>{h.tarea || <span style={{ color: C.gray, fontStyle: "italic" }}>Sin tarea especificada</span>}</div>
                {h.materialDetalle && <div style={{ color: C.gray, marginTop: 2, fontSize: 12 }}>📎 {h.materialDetalle}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => { setPlanesGuardia(prev => prev.filter(p => p.id !== verPlan.id)); setVerPlan(null); }}
        style={{ background: "#FDF0EF", color: C.salmon, border: `1px solid ${C.salmon}`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
        🗑 Eliminar este plan
      </button>
    </div>
  );

  // ── Vista principal ──
  return (
    <div>
      <h2 style={{ color: C.dark, marginTop: 0 }}>🗓 Planificador de Guardias</h2>

      {planGuardia && (
        <Card style={{ background: "#E8F5F3", border: `2px solid ${C.teal}`, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div>
              <strong style={{ color: C.teal }}>✅ Plan generado correctamente</strong>
              <div style={{ fontSize: 13, color: C.dark, marginTop: 2 }}>
                {planGuardia.profesorAusente} · {fmtD(planGuardia.fecha)} · {planGuardia.horas.length} hora(s)
              </div>
            </div>
            <button onClick={() => { setVerPlan(planGuardia); setPlanGuardia(null); }}
              style={{ background: C.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
              👁 Ver plan
            </button>
          </div>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
        {/* Panel izquierdo — Wizard */}
        <div>
          {/* StepBar inline */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 24, gap: 0 }}>
            {[{ n:1, icon:"📅", label:"Fecha" }, { n:2, icon:"👤", label:"Ausente" }, { n:3, icon:"🏫", label:"Aula / Tarea" }, { n:4, icon:"🔄", label:"Guardia" }].map(({ n, icon, label }, i) => (
              <div key={n} style={{ display:"flex", alignItems:"center", flex:1 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1, cursor: n < paso ? "pointer" : "default" }} onClick={() => n < paso && setPaso(n)}>
                  <div style={{ width:40, height:40, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background: n < paso ? C.teal : n === paso ? C.blue : "#e5e7eb", color: n <= paso ? "#fff" : C.gray, fontSize:18, fontWeight:700, boxShadow: n === paso ? `0 0 0 4px ${C.blue}22` : "none", transition:"all .3s" }}>{n < paso ? "✓" : icon}</div>
                  <div style={{ fontSize:11, fontWeight:600, color: n === paso ? C.blue : n < paso ? C.teal : C.gray, marginTop:4, whiteSpace:"nowrap" }}>{label}</div>
                </div>
                {i < 3 && <div style={{ height:2, flex:1, background: n < paso ? C.teal : "#e5e7eb", transition:"background .3s", marginBottom:18 }} />}
              </div>
            ))}
          </div>

          {/* PASO 1 inline */}
          {paso === 1 && (
            <Card>
              <div style={{ fontWeight:700, color:C.dark, fontSize:16, marginBottom:16 }}>📅 Fecha de la ausencia</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
                <div>
                  <label style={labelStyle}>Fecha de inicio</label>
                  <input type="date" value={pgFecha} onChange={e => setPgFecha(e.target.value)} style={inpStyle} />
                </div>
                <div style={{ display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
                  <label style={{ ...labelStyle, display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                    <input type="checkbox" checked={pgMultidia} onChange={e => setPgMultidia(e.target.checked)} style={{ width:16, height:16, accentColor:C.teal }} />
                    Ausencia de varios días
                  </label>
                </div>
              </div>
              {pgMultidia && (
                <div style={{ marginBottom:16 }}>
                  <label style={labelStyle}>Fecha de fin</label>
                  <input type="date" value={pgFechaFin} min={pgFecha} onChange={e => setPgFechaFin(e.target.value)} style={inpStyle} />
                </div>
              )}
              <div style={{ marginBottom:4 }}>
                <label style={labelStyle}>📝 Nota general (opcional)</label>
                <textarea value={pgNota} onChange={e => setPgNota(e.target.value)} rows={2} placeholder="Observaciones generales sobre la ausencia…" style={{ ...inpStyle, resize:"vertical" }} />
              </div>
              <div style={{ background:"#EEF5F8", borderRadius:8, padding:"10px 14px", fontSize:12, color:C.blue, marginTop:12 }}>
                💡 Si la ausencia abarca varios días, el plan se aplicará a todas las fechas del periodo seleccionado.
              </div>
            </Card>
          )}

          {/* PASO 2 inline */}
          {paso === 2 && (
            <Card>
              <div style={{ fontWeight:700, color:C.dark, fontSize:16, marginBottom:16 }}>👤 Profesor ausente y horas afectadas</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
                <div>
                  <label style={labelStyle}>Profesor ausente *</label>
                  <select value={pgProfesor} onChange={e => setPgProfesor(e.target.value)} style={selStyle}>
                    <option value="">— Seleccionar —</option>
                    {profesores.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Motivo de la ausencia</label>
                  <select value={pgMotivo} onChange={e => setPgMotivo(e.target.value)} style={selStyle}>
                    {MOTIVOS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom:8 }}>
                <label style={{ ...labelStyle, marginBottom:10 }}>⏰ Horas afectadas * <span style={{ color:C.gray, fontWeight:400, fontSize:12 }}>— Selecciona todas las que apliquen</span></label>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:8 }}>
                  {HORAS.map(h => {
                    const sel = pgHoras.includes(h);
                    return (
                      <button key={h} onClick={() => toggleHora(h)}
                        style={{ padding:"10px 8px", borderRadius:10, border:`2px solid ${sel ? C.blue : "#e5e7eb"}`, background: sel ? "#EEF5F8" : C.white, color: sel ? C.blue : C.gray, fontWeight: sel ? 700 : 500, fontSize:13, cursor:"pointer", transition:"all .15s", textAlign:"center" }}>
                        {sel ? "✓ " : ""}{h}
                      </button>
                    );
                  })}
                </div>
              </div>
              {pgHoras.length > 0 && (
                <div style={{ background:"#E8F5F3", borderRadius:8, padding:"8px 14px", fontSize:13, color:C.teal, fontWeight:600, marginTop:12 }}>
                  ✅ {pgHoras.length} hora(s) seleccionada(s): {pgHoras.join(", ")}
                </div>
              )}
            </Card>
          )}

          {/* PASO 3 inline */}
          {paso === 3 && (
            <div>
              <div style={{ fontWeight:700, color:C.dark, fontSize:16, marginBottom:14 }}>🏫 Aula, módulo y tarea por hora</div>
              {pgHoras.map(h => (
                <Card key={h} style={{ borderLeft:`4px solid ${C.blue}`, marginBottom:12 }}>
                  <div style={{ fontWeight:700, color:C.blue, fontSize:15, marginBottom:12 }}>⏰ {conTramo(h)}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:12 }}>
                    <div>
                      <label style={labelStyle}>Grupo / Clase *</label>
                      <select value={pgCursoHora[h] || ""} onChange={e => setCursoHora(h, e.target.value)} style={selStyle}>
                        <option value="">— Seleccionar —</option>
                        {cursos.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Materia</label>
                      <input value={pgMateriaHora[h] || ""} onChange={e => setMateriaHora(h, e.target.value)} placeholder="Ej: Matemáticas" style={inpStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>🏢 Módulo del edificio</label>
                      <select value={pgModuloEdificio[h] || ""} onChange={e => setModuloHora(h, e.target.value)} style={selStyle}>
                        <option value="">— Módulo —</option>
                        {MODULOS.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom:10 }}>
                    <label style={labelStyle}>📋 Tarea / Actividad para los alumnos</label>
                    <textarea value={pgTareaHora[h] || ""} onChange={e => setTareaHora(h, e.target.value)} rows={2} placeholder="Ej: Ejercicios pág. 45 del libro · Lectura silenciosa · Repaso tema 3…" style={{ ...inpStyle, resize:"vertical" }} />
                  </div>
                  <div>
                    <label style={labelStyle}>📎 Material / Recursos disponibles</label>
                    <input value={pgMaterialHora[h] || ""} onChange={e => setMaterialDetalleHora(h, e.target.value)} placeholder="Ej: Fotocopias en conserjería · Libro de texto · Presentación en Drive…" style={inpStyle} />
                  </div>
                  {pgCursoHora[h] && (
                    <div style={{ marginTop:10, background:C.cream, borderRadius:6, padding:"6px 12px", fontSize:12, color:C.gray }}>
                      📍 {pgCursoHora[h]}{pgModuloEdificio[h] ? ` · ${pgModuloEdificio[h]}` : ""}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* PASO 4 inline */}
          {paso === 4 && (
            <div>
              <div style={{ fontWeight:700, color:C.dark, fontSize:16, marginBottom:14 }}>🔄 Asignación de profesores de guardia</div>
              {pgHoras.map(h => (
                <Card key={h} style={{ borderLeft:`4px solid ${C.teal}`, marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, flexWrap:"wrap", gap:8 }}>
                    <div style={{ fontWeight:700, color:C.teal, fontSize:15 }}>⏰ {conTramo(h)}</div>
                    {pgCursoHora[h] && (
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        <span style={{ background:"#EEF5F8", color:C.blue, borderRadius:6, padding:"3px 10px", fontSize:12, fontWeight:600 }}>🏫 {pgCursoHora[h]}</span>
                        {pgMateriaHora[h] && <span style={{ background:C.cream, color:C.dark, borderRadius:6, padding:"3px 10px", fontSize:12 }}>{pgMateriaHora[h]}</span>}
                        {pgModuloEdificio[h] && <span style={{ background:"#E8F5F3", color:C.teal, borderRadius:6, padding:"3px 10px", fontSize:12 }}>🏢 {pgModuloEdificio[h]}</span>}
                      </div>
                    )}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    <div>
                      <label style={labelStyle}>👤 Profesor de guardia *</label>
                      <select value={pgGuardiaHora[h] || ""} onChange={e => setGuardiaHora(h, e.target.value)} style={selStyle}>
                        <option value="">— Seleccionar —</option>
                        {profesores.filter(p => p !== pgProfesor).map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>📍 Zona de guardia</label>
                      <select value={pgZonaHora[h] || ""} onChange={e => setZonaHora(h, e.target.value)} style={selStyle}>
                        <option value="">— Seleccionar zona —</option>
                        {ZONAS_GUARDIA.map(z => <option key={z}>{z}</option>)}
                      </select>
                    </div>
                  </div>
                  {pgGuardiaHora[h] && pgZonaHora[h] && (
                    <div style={{ marginTop:10, background:"#E8F5F3", borderRadius:6, padding:"6px 12px", fontSize:12, color:C.teal, fontWeight:600 }}>
                      ✅ {pgGuardiaHora[h]} — {pgZonaHora[h]}
                    </div>
                  )}
                  {pgTareaHora[h] && (
                    <div style={{ marginTop:8, background:"#FFF8E8", borderRadius:6, padding:"6px 12px", fontSize:12, color:"#92400e" }}>
                      📋 Tarea: {pgTareaHora[h]}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {paso > 1
              ? <button onClick={() => setPaso(p => p - 1)}
                  style={{ background: C.cream, color: C.dark, border: `1px solid #ddd`, borderRadius: 10, padding: "12px 20px", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
                  ← Anterior
                </button>
              : <div />}
            {paso < 4
              ? <Btn onClick={() => setPaso(p => p + 1)}
                  disabled={paso === 2 && (!pgProfesor || pgHoras.length === 0)}
                  color={C.blue}>
                  Siguiente →
                </Btn>
              : <Btn onClick={generarPlan}
                  disabled={!pgHoras.every(h => pgGuardiaHora[h])}
                  color={C.teal}>
                  ✅ Guardar Plan de Guardia
                </Btn>}
          </div>
        </div>

        {/* Panel derecho — Historial de planes */}
        <div>
          <div style={{ fontWeight: 700, color: C.dark, fontSize: 14, marginBottom: 10 }}>
            📋 Planes guardados ({planesGuardia.length})
          </div>
          {planesGuardia.length === 0
            ? <div style={{ background: C.white, borderRadius: 12, padding: 20, textAlign: "center", color: C.gray, fontSize: 13, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                Aún no hay planes creados
              </div>
            : planesGuardia.map(p => (
              <div key={p.id} onClick={() => setVerPlan(p)}
                style={{ background: C.white, borderRadius: 12, padding: 14, marginBottom: 8, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderLeft: `4px solid ${C.blue}`, transition: "box-shadow .15s" }}
                onMouseOver={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)"}
                onMouseOut={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"}>
                <div style={{ fontWeight: 700, color: C.dark, fontSize: 13 }}>👤 {p.profesorAusente}</div>
                <div style={{ fontSize: 12, color: C.gray, marginTop: 2 }}>
                  📅 {p.multidia ? `${fmtD(p.fecha)} → ${fmtD(p.fechaFin)}` : fmtD(p.fecha)}
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                  <span style={{ background: "#EEF5F8", color: C.blue, borderRadius: 6, padding: "2px 8px", fontSize: 11 }}>{p.horas.length} hora(s)</span>
                  <span style={{ background: C.cream, color: C.gray, borderRadius: 6, padding: "2px 8px", fontSize: 11 }}>{p.motivo}</span>
                  {p.horas.map(h => <span key={h.hora} style={{ background: "#E8F5F3", color: C.teal, borderRadius: 6, padding: "2px 8px", fontSize: 11 }}>{h.hora}</span>)}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// ─── App principal ────────────────────────────────────────────────────────────
// ─── Zonas del centro ────────────────────────────────────────────────────────
const ZONAS_CENTRO = [
  { id:"A0-pasillo",  label:"Edificio A · Planta 0 · Pasillo",    edificio:"A", tipo:"pasillo"  },
  { id:"A1-pasillo",  label:"Edificio A · Planta 1 · Pasillo",    edificio:"A", tipo:"pasillo"  },
  { id:"A2-pasillo",  label:"Edificio A · Planta 2 · Pasillo",    edificio:"A", tipo:"pasillo"  },
  { id:"A0-bano-n",   label:"Edificio A · Planta 0 · Baño Niñas", edificio:"A", tipo:"bano"     },
  { id:"A1-bano-c",   label:"Edificio A · Planta 1 · Baño Niños", edificio:"A", tipo:"bano"     },
  { id:"A0-biblio",   label:"Edificio A · Planta 0 · Biblioteca", edificio:"A", tipo:"especial" },
  { id:"A0-maquina",  label:"Edificio A · Planta 0 · Máquina",    edificio:"A", tipo:"especial" },
  { id:"B0-pasillo",  label:"Edificio B · Planta 0 · Pasillo",    edificio:"B", tipo:"pasillo"  },
  { id:"B1-pasillo",  label:"Edificio B · Planta 1 · Pasillo",    edificio:"B", tipo:"pasillo"  },
  { id:"B2-pasillo",  label:"Edificio B · Planta 2 · Pasillo",    edificio:"B", tipo:"pasillo"  },
  { id:"C0-pasillo",  label:"Edificio C · Planta 0 · Pasillo",    edificio:"C", tipo:"pasillo"  },
  { id:"C1-pasillo",  label:"Edificio C · Planta 1 · Pasillo",    edificio:"C", tipo:"pasillo"  },
  { id:"C2-pasillo",  label:"Edificio C · Planta 2 · Pasillo",    edificio:"C", tipo:"pasillo"  },
  { id:"aula",        label:"Aula — Sustitución de clase",         edificio:"-", tipo:"aula"     },
  { id:"rec-puerta",  label:"Recreo · Zona Puerta",               edificio:"-", tipo:"recreo"   },
  { id:"rec-central", label:"Recreo · Patio Central",             edificio:"-", tipo:"recreo"   },
  { id:"rec-coches",  label:"Recreo · Zona Coches",               edificio:"-", tipo:"recreo"   },
  { id:"rec-pistas",  label:"Recreo · Pistas de Fútbol",          edificio:"-", tipo:"recreo"   },
  { id:"rec-bano-n",  label:"Recreo · Baño Niñas",                edificio:"-", tipo:"recreo"   },
  { id:"rec-bano-c",  label:"Recreo · Baño Niños",                edificio:"-", tipo:"recreo"   },
  { id:"rec-biblio",  label:"Recreo · Biblioteca",                edificio:"-", tipo:"recreo"   },
  { id:"rec-maquina", label:"Recreo · Máquina de Bebidas",        edificio:"-", tipo:"recreo"   },
];
const HORAS_GUARDIA = HORAS;
const DIAS_SEMANA   = ["Lunes","Martes","Miércoles","Jueves","Viernes"];
const DIAS_ES = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

// ─── Fechas del cuadrante ────────────────────────────────────────────────────
// El cuadrante cambia cada quincena, así que se guarda por fecha concreta:
// clave "AAAA-MM-DD|hora|profesor" (y "AAAA-MM-DD|hora|zona" para los apoyos).
const pad2 = n => String(n).padStart(2, "0");
function parseISO(s) {
  if (s instanceof Date) return new Date(s.getFullYear(), s.getMonth(), s.getDate());
  const [y, m, d] = String(s).split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, d);
}
// Fecha local AAAA-MM-DD (sin el desfase de toISOString, que usa hora UTC)
const isoLocal = (d = new Date()) => { const x = parseISO(d); return `${x.getFullYear()}-${pad2(x.getMonth() + 1)}-${pad2(x.getDate())}`; };
const sumarDias = (d, n) => { const x = parseISO(d); x.setDate(x.getDate() + n); return x; };
const lunesDe = (d = new Date()) => { const x = parseISO(d); const dow = x.getDay(); return sumarDias(x, dow === 0 ? 1 : 1 - dow); };
const esLectivo = d => { const w = parseISO(d).getDay(); return w !== 0 && w !== 6; };

// ─── Equipo de guardia de cada zona ─────────────────────────────────────────
// Cada zona tiene: titular (en el cuadrante), apoyo y sustituto. El sustituto entra
// si falta el titular o el apoyo. Apoyos y sustitutos: clave "fecha|hora|zona".
// Ningún profesor puede tener más de este número de guardias en un día (sumando titular, apoyo y sustituto)
const MAX_GUARDIAS_DIA = 4;
function guardiasDelDia(fecha, profesor, cuadrante, apoyos = {}, sustitutos = {}) {
  let n = Object.keys(cuadrante).filter(k => k.startsWith(`${fecha}|`) && k.endsWith(`|${profesor}`)).length;
  [apoyos, sustitutos].forEach(m => Object.entries(m).forEach(([k, v]) => { if (v === profesor && k.startsWith(`${fecha}|`)) n++; }));
  return n;
}

const ESTADOS_ZONA = {
  completa:    { label: "🟢 Completa",           color: "#0f766e", bg: "#E8F5F3" },
  sustituto:   { label: "🟠 Entra el sustituto", color: "#b45309", bg: "#fef3c7" },
  una:         { label: "🟡 Solo 1 profesor",    color: "#a16207", bg: "#fefce8" },
  descubierta: { label: "🔴 Descubierta",        color: "#be123c", bg: "#FDF0EF" },
};
function situacionZona({ fecha, hora, zonaId, profesores, cuadrante, apoyos = {}, sustitutos = {}, ausencias = [] }) {
  const k = `${fecha}|${hora}|${zonaId}`;
  const titular = profesores.find(p => cuadrante[`${fecha}|${hora}|${p}`] === zonaId) || "";
  const apoyo = apoyos[k] || "", sustituto = sustitutos[k] || "";
  const falta = p => !!p && ausencias.some(a => isoLocal(a.fecha) === fecha && a.profesor === p && a.horas.includes(hora));
  const tA = falta(titular), aA = falta(apoyo), sA = falta(sustituto);
  const enZona = [];
  if (titular && !tA) enZona.push(titular);
  if (apoyo && !aA) enZona.push(apoyo);
  // Huecos que puede cubrir el sustituto: primero el titular, luego el apoyo
  const hueco = (!titular || tA) ? "titular" : (!apoyo || aA) ? "apoyo" : null;
  let sustituyeA = null;
  if (hueco && sustituto && !sA) {
    enZona.push(sustituto);
    sustituyeA = hueco === "titular" ? (titular || "titular sin asignar") : (apoyo || "apoyo sin asignar");
  }
  const estado = enZona.length === 0 ? "descubierta"
    : (titular && apoyo && !tA && !aA) ? "completa"
    : enZona.length >= 2 ? "sustituto" : "una";
  return { titular, apoyo, sustituto, tA, aA, sA, hueco, sustituyeA, enZona, estado };
}
// Todas las guardias de un profesor en una fecha: como titular, apoyo o sustituto
function guardiasDeProfesor({ fecha, profesor, profesores, cuadrante, apoyos = {}, sustitutos = {}, ausencias = [] }) {
  const lista = [];
  HORAS_GUARDIA.forEach(hora => {
    const zonas = [];
    const zt = cuadrante[`${fecha}|${hora}|${profesor}`];
    if (zt) zonas.push([zt, "titular"]);
    [[apoyos, "apoyo"], [sustitutos, "sustituto"]].forEach(([mapa, rol]) =>
      Object.entries(mapa).forEach(([k, v]) => {
        const [f, h, z] = k.split("|");
        if (v === profesor && f === fecha && h === hora) zonas.push([z, rol]);
      }));
    zonas.forEach(([zonaId, rol]) => {
      const z = ZONAS_CENTRO.find(z => z.id === zonaId);
      lista.push({ hora, zonaId, zona: z ? z.label : zonaId, edificio: z?.edificio, rol,
        sit: situacionZona({ fecha, hora, zonaId, profesores, cuadrante, apoyos, sustitutos, ausencias }) });
    });
  });
  return lista;
}

// Clases sin profesor que afectan a una guardia: a esa hora, en el edificio de la zona,
// o del profesor al que sustituye el sustituto. En el recreo no hay clase.
function tareasDeGuardia(g, fecha, ausencias) {
  if (g.hora === "Recreo") return [];
  return ausencias.filter(a => isoLocal(a.fecha) === fecha && a.horas.includes(g.hora) &&
    (a.profesor === g.sit?.sustituyeA || !a.edificio || !g.edificio || g.edificio === "-" || a.edificio === g.edificio));
}
// Tarjeta con lo que ha dejado el profesor ausente
const TareaAusente = ({ a, C }) => (
  <div style={{ background: "#FFFBEB", border: "1px solid #fbbf24", borderRadius: 8, padding: 10, fontSize: 12, color: "#78350F", lineHeight: 1.5 }}>
    <div style={{ fontWeight: 700, marginBottom: 4 }}>📝 Deja {a.profesor}{a.asignatura ? ` · ${a.asignatura}` : ""}</div>
    {(a.aula || a.edificio) && <div>🏫 Aula {a.aula || "?"}{a.edificio ? ` · Edificio ${a.edificio}` : ""}</div>}
    <div>✏️ {a.tarea ? a.tarea : <em>No ha dejado tarea</em>}</div>
    {a.ubicacion && <div>📍 Material: {a.ubicacion}</div>}
    {a.enlace && <div><a href={a.enlace} target="_blank" rel="noopener noreferrer" style={{ color: C.blue, fontWeight: 600 }}>🔗 Ver recursos</a></div>}
  </div>
);

// ─── Firmar guardia y pasar lista ────────────────────────────────────────────
// Firma: {id, fecha, hora, zonaId, zona, profesor, rol, ts}
// Lista: {id, fecha, hora, curso, profesor, ausentes:[{id, nombre}], ts}
const minutosDe = t => { const [h, m] = t.trim().split(":").map(Number); return h * 60 + m; };
const inicioHora = hora => (HORARIO[hora] || "0:00 – 0:00").split("–")[0].trim();
// ¿Ha empezado ya esa hora en esa fecha? (una fecha pasada, siempre; una futura, nunca)
function horaEmpezada(fecha, hora, ahora = new Date()) {
  const hoy = isoLocal(ahora);
  if (fecha < hoy) return true;
  if (fecha > hoy) return false;
  return ahora.getHours() * 60 + ahora.getMinutes() >= minutosDe(inicioHora(hora));
}
const horaCorta = iso => new Date(iso).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

function PasarLista({ curso, alumnos, existente, onGuardar, onCerrar, C }) {
  const grupo = alumnos.filter(a => a.curso === curso).sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  const [faltan, setFaltan] = useState(() => new Set((existente?.ausentes || []).map(a => a.id)));
  const toggle = id => setFaltan(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <div role="dialog" aria-modal="true" aria-label={`Pasar lista de ${curso}`} onClick={onCerrar}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 120, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 16, width: "min(460px, 100%)", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ background: `linear-gradient(90deg,${C.dark},${C.blue})`, color: "#fff", padding: "14px 18px", borderRadius: "16px 16px 0 0", position: "sticky", top: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>📋 Pasar lista · {curso}</div>
          <div style={{ fontSize: 12, opacity: .85 }}>Marca solo a quien falta. {grupo.length} alumnos.</div>
        </div>
        <div style={{ padding: 12 }}>
          {grupo.length === 0 && <div style={{ padding: 20, color: C.gray, textAlign: "center" }}>No hay alumnos cargados en {curso}.</div>}
          {grupo.map(a => {
            const falta = faltan.has(a.id);
            return (
              <button key={a.id} onClick={() => toggle(a.id)} aria-pressed={falta}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "12px 14px", marginBottom: 6, borderRadius: 10, cursor: "pointer", fontSize: 14, textAlign: "left",
                  border: `2px solid ${falta ? C.salmon : "#e5e7eb"}`, background: falta ? "#FDF0EF" : "#fff", color: C.dark }}>
                <span>{a.nombre}</span>
                <span style={{ fontWeight: 700, fontSize: 12, color: falta ? "#be123c" : C.teal }}>{falta ? "✗ Falta" : "✓ Presente"}</span>
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8, padding: "0 12px 14px" }}>
          <button onClick={onCerrar} style={{ flex: 1, padding: 12, borderRadius: 10, border: "1px solid #d1d5db", background: "#f9fafb", cursor: "pointer", fontWeight: 600 }}>Cancelar</button>
          <button onClick={() => onGuardar(grupo.filter(a => faltan.has(a.id)).map(a => ({ id: a.id, nombre: a.nombre })))}
            style={{ flex: 2, padding: 12, borderRadius: 10, border: "none", background: C.teal, color: "#fff", cursor: "pointer", fontWeight: 700 }}>
            Guardar lista ({faltan.size} {faltan.size === 1 ? "falta" : "faltas"})
          </button>
        </div>
        <div style={{ padding: "0 14px 14px", fontSize: 11, color: C.gray }}>Las faltas oficiales se siguen registrando en Raíces.</div>
      </div>
    </div>
  );
}

// ─── Firmas y listas (Jefatura) ─────────────────────────────────────────────
function FirmasYListas({ profesores, cuadrante, apoyosGuardia, sustitutosGuardia, ausencias, firmas, listas, C, inpStyle }) {
  const [fecha, setFecha] = useState(isoLocal());
  const equipo = { profesores, cuadrante, apoyos: apoyosGuardia, sustitutos: sustitutosGuardia, ausencias };
  // Quién tenía que estar en cada zona y quién ha firmado
  const filas = filasFirmasDia(fecha, equipo, firmas);
  const debidas = filas.filter(f => f.empezada).flatMap(f => f.personas);
  const firmadas = debidas.filter(x => x.firma).length;
  const listasDia = listas.filter(l => l.fecha === fecha).sort((a, b) => HORAS.indexOf(a.hora) - HORAS.indexOf(b.hora));
  const pend = debidas.length - firmadas;
  return (
    <div>
      <h2 style={{ color: C.dark, marginTop: 0 }}>✍️ Firmas de guardia y listas</h2>
      <div className="no-print" style={{ background: C.white, borderRadius: 12, padding: 16, marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", gap: 12, alignItems: "end", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: C.dark, marginBottom: 6 }}>Fecha</label>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value || isoLocal())} style={inpStyle} />
        </div>
        <button onClick={() => pdfFirmasYListas(fecha, filas, listasDia)} style={{ background: C.dark, color: "#fff", border: "none", borderRadius: 10, padding: "11px 18px", cursor: "pointer", fontWeight: 700 }}>⬇️ Descargar PDF</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Firmas esperadas hasta ahora", value: debidas.length, color: C.dark },
          { label: "Guardias firmadas", value: firmadas, color: C.teal },
          { label: "Sin firmar", value: pend, color: pend ? "#b45309" : C.teal },
          { label: "Listas pasadas", value: listasDia.length, color: C.blue },
        ].map(s => (
          <div key={s.label} style={{ background: C.white, borderRadius: 10, padding: 14, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderTop: `4px solid ${s.color}` }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: C.white, borderRadius: 12, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ background: C.dark, color: "#fff", padding: "10px 16px", fontWeight: 700, fontSize: 14 }}>✍️ Firmas de guardia · {parseISO(fecha).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}</div>
        {filas.length === 0 ? <div style={{ padding: 24, textAlign: "center", color: C.gray }}>No hay guardias en el cuadrante para esta fecha.</div> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 560 }}>
              <thead><tr style={{ background: C.light }}>
                {["Hora", "Zona", "Profesores en la zona y firma"].map(h => <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 12, color: C.gray }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {filas.map((f, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${C.cream}` }}>
                    <td style={{ padding: "8px 14px", fontWeight: 600, whiteSpace: "nowrap" }}>{f.hora}<div style={{ fontSize: 10, color: C.gray, fontWeight: 500 }}>{HORARIO[f.hora]}</div></td>
                    <td style={{ padding: "8px 14px" }}>{f.zona}</td>
                    <td style={{ padding: "8px 14px" }}>
                      {f.personas.length === 0 && <span style={{ color: "#be123c", fontWeight: 600 }}>Nadie en la zona</span>}
                      {f.personas.map(({ p, firma }) => (
                        <div key={p} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                          <span>{p}</span>
                          {firma ? <span style={{ color: C.teal, fontWeight: 700, fontSize: 12 }}>✓ firmada a las {horaCorta(firma.ts)}</span>
                            : f.empezada ? <span style={{ color: "#b45309", fontWeight: 700, fontSize: 12 }}>Sin firmar</span>
                            : <span style={{ color: C.gray, fontSize: 12 }}>Aún no ha empezado</span>}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ background: C.blue, color: "#fff", padding: "10px 16px", fontWeight: 700, fontSize: 14 }}>📋 Listas pasadas en guardia</div>
        {listasDia.length === 0 ? <div style={{ padding: 24, textAlign: "center", color: C.gray }}>No se ha pasado ninguna lista este día.</div> : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ background: C.light }}>
              {["Hora", "Grupo", "Profesor", "Faltas"].map(h => <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 12, color: C.gray }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {listasDia.map(l => (
                <tr key={l.id} style={{ borderTop: `1px solid ${C.cream}` }}>
                  <td style={{ padding: "8px 14px", fontWeight: 600 }}>{l.hora}</td>
                  <td style={{ padding: "8px 14px" }}>{l.curso}</td>
                  <td style={{ padding: "8px 14px" }}>{l.profesor}<div style={{ fontSize: 11, color: C.gray }}>a las {horaCorta(l.ts)}</div></td>
                  <td style={{ padding: "8px 14px" }}>{l.ausentes.length === 0 ? <span style={{ color: C.teal }}>Sin faltas</span> : l.ausentes.map(a => a.nombre).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div style={{ padding: "8px 14px", fontSize: 11, color: C.gray }}>Las faltas oficiales se registran en Raíces.</div>
      </div>
    </div>
  );
}

// ─── Ayuda de cada pantalla ──────────────────────────────────────────────────
// Se abre sola la primera vez que se entra en una pantalla (en ese dispositivo)
// y después queda recogida en el botón «Cómo se usa».
const AYUDAS = {
  mis_estadisticas: { titulo: "Mis estadísticas e informes", pasos: [
    "Arriba verás los avisos: alumnado con 3 o más partes este trimestre (los tuyos y, si eres tutor/a, los de tu grupo). Pulsa «Avisar a la familia» y después «Ya he avisado».",
    "Si eres tutor/a, elige «Mi tutoría» para ver todos los partes de tu grupo. Si no, verás los partes que has puesto tú y el alumnado que sale al baño en tus clases.",
    "Elige el periodo: un día, una semana, una quincena, un mes o dos fechas concretas.",
    "Pulsa una columna o una barra para ver esos partes en grande y qué es lo que más se repite.",
    "En «Partes de un alumno/a», elige al alumno y usa «Contactar con la familia»: informe en PDF, texto del correo ya redactado y sus correos.",
    "Escribe a la familia desde tu correo del centro, pega el texto y adjunta el PDF."] },
  estadisticas: { titulo: "Estadísticas y documentos", pasos: [
    "Elige el periodo: un día, una semana, una quincena, un mes o dos fechas concretas.",
    "Con ◀ y ▶ pasas al periodo anterior o siguiente; «Hoy» vuelve al actual.",
    "Verás las cifras de partes, baños, ausencias del profesorado, firmas de guardia y listas, y gráficas por día, grupo, hora y alumnado.",
    "Abajo tienes los informes: al pulsar se abren en pantalla y desde ahí los descargas o imprimes. «Ver y descargar en Excel» muestra una hoja por tema, con nombres, grupos y faltas.",
    "También puedes sacar los partes de un alumno o de un grupo, o las ausencias de un profesor, solo en esas fechas."] },
  partes: { titulo: "Poner un parte", pasos: [
    "Escribe el nombre o el curso del alumno y elígelo de la lista. Verás su tutor, el contacto de la familia y cuántos partes lleva.",
    "Elige la hora, el tipo y la gravedad, y después la falta tipificada de la lista oficial.",
    "Describe lo ocurrido con hechos concretos.",
    "Pulsa «Generar Parte». El parte lleva el tutor/a del grupo y su correo.",
    "Para avisar a la familia y a Jefatura, escribe un correo desde tu cuenta del centro y adjunta el PDF («Descargar PDF») o pega el texto («Copiar texto»). «Copiar correos» te da las direcciones de la familia y del tutor/a."] },
  parte_grupo: { titulo: "Parte de grupo", pasos: [
    "Elige el grupo.",
    "Quita a los alumnos que no estuvieron implicados.",
    "Elige la gravedad y la falta, y escribe una sola descripción.",
    "Pulsa «Generar Parte»: se crea un parte para cada alumno."] },
  bano: { titulo: "Salidas al baño", pasos: [
    "Busca al alumno y pulsa «Registrar Salida».",
    "Cuando vuelva, pulsa «Regresó» en la lista «Fuera ahora».",
    "Si un alumno sale demasiadas veces, Jefatura recibe un aviso automático."] },
  historial: { titulo: "Mis partes", pasos: [
    "Aquí están los partes que has puesto.",
    "Pulsa «Ver» para consultarlo o «PDF» para descargarlo."] },
  mi_guardia: { titulo: "Mi guardia de hoy", pasos: [
    "Cada tarjeta es una guardia de hoy: la hora, la zona y tu papel (titular, apoyo o sustituto).",
    "Si te toca entrar por alguien, aparece en rojo, con la tarea que ha dejado y dónde está el material.",
    "Cuando empiece la guardia, pulsa «Firmar guardia».",
    "Si cubres una clase, pulsa «Pasar lista» y marca solo a quien falta.",
    "Pulsa un día del calendario para ver tus guardias de ese día."] },
  notif_ausencia: { titulo: "Avisar de una ausencia", pasos: [
    "Elige la fecha y marca las horas en que vas a faltar.",
    "Indica el edificio, el aula y la asignatura, para que sepan qué clase cubrir.",
    "Deja la tarea para los alumnos y dónde está el material.",
    "Pulsa «Notificar». Esto completa, no sustituye, el correo de EducaMadrid y la llamada al instituto."] },
  guardias_ver: { titulo: "Guardias del día", pasos: [
    "Todas las zonas de guardia de hoy, hora a hora, con quién está en cada una.",
    "En naranja, las zonas en las que entra el sustituto; en rojo, las que se han quedado sin nadie."] },
  mensajeria: { titulo: "Galvángram", pasos: [
    "Elige a quién va el mensaje.",
    "Toca un mensaje rápido o escribe el tuyo; el texto se puede retocar.",
    "Pulsa «Enviar Mensaje». Lo verá al abrir la app: no llega como notificación al móvil."] },
  dashboard: { titulo: "Resumen del día", pasos: [
    "De un vistazo: partes por gravedad, alumnos fuera del aula, profesores ausentes y alertas.",
    "Debajo, el resumen por curso y los alumnos con más incidencias.",
    "Usa las pestañas de arriba para ver el detalle."] },
  por_curso: { titulo: "Partes por curso", pasos: ["Cada curso muestra sus partes y a sus alumnos, con quién acumula partes."] },
  por_alumno: { titulo: "Partes por alumno", pasos: ["Elige un curso y un alumno para ver su historial completo, con la gravedad y la tipificación de cada parte."] },
  partes_todos: { titulo: "Todos los partes", pasos: [
    "Filtra por curso, alumno, gravedad o fechas.",
    "Pulsa «Ver» para consultar un parte o «PDF» para guardarlo."] },
  bano_live: { titulo: "Baños en tiempo real", pasos: ["Arriba, los alumnos que están fuera del aula ahora mismo; debajo, el historial del día."] },
  alertas: { titulo: "Alertas", pasos: [
    "Avisos automáticos: tercer parte leve, tercer parte de un alumno, parte fuera de horario y salidas al baño repetidas.",
    "Pulsa una alerta para marcarla como leída."] },
  informe: { titulo: "Informes", pasos: [
    "Elige si quieres un informe de partes o de salidas al baño.",
    "Filtra por curso, alumno, gravedad o fechas.",
    "Si eliges un curso, verás su tutor/a: puedes cambiarlo o añadir su correo y queda guardado para el grupo.",
    "Pulsa el botón del informe y después «Descargar PDF». El informe lleva un resumen por grupo con su tutor/a.",
    "Cada informe descargado queda en «Informes guardados», abajo, para volver a sacarlo igual."] },
  cuadrante: { titulo: "Preparar el cuadrante", pasos: [
    "Elige el profesor y el inicio de la quincena.",
    "En cada día y hora, elige la zona de la que es titular.",
    "Asigna el apoyo y el sustituto: lo que falta sale en rojo.",
    "Nadie puede tener más de 4 guardias al día; entre paréntesis, las que ya tiene cada uno.",
    "«Copiar de la quincena anterior» evita empezar de cero. Los cambios se guardan solos."] },
  coordinacion: { titulo: "Coordinación diaria", pasos: [
    "Elige una fecha.",
    "Verás las guardias por edificio y, para cada profesor ausente, quién cubre su clase y qué tarea ha dejado."] },
  parte_dia: { titulo: "Parte del día", pasos: [
    "Todas las zonas de hoy, hora a hora, con titular, apoyo, sustituto y estado.",
    "Actúa en las que aparezcan como «Descubierta» o «Solo 1 profesor»."] },
  ausencias_jef: { titulo: "Ausencias de profesores", pasos: [
    "Aquí llegan las ausencias que notifica el profesorado. Pulsa una para marcarla como leída.",
    "Si alguien llama por teléfono, pulsa «Registrar una ausencia comunicada por teléfono» y rellénala por él."] },
  firmas_jef: { titulo: "Firmas y listas", pasos: [
    "Elige una fecha.",
    "Verás quién ha firmado cada guardia y a qué hora; las que faltan salen en naranja.",
    "Debajo, las listas pasadas en guardia con las faltas. Pulsa «Descargar PDF» para el archivo."] },
  admin_panel: { titulo: "Alumnado", pasos: [
    "Exporta el listado de Raíces a CSV o Excel y arrástralo en «Importar CSV/Excel».",
    "También puedes añadir alumnos uno a uno en «Añadir manual» y revisarlos en «Lista completa».",
    "Arriba, en «Tutorías de grupo», elige el tutor/a de cada grupo (y su correo del centro si quieres). Sale en los partes y en los informes."] },
  admin_profesores: { titulo: "Profesorado", pasos: [
    "Añade a cada profesor con su nombre completo.",
    "Asígnale su cargo: decide a qué perfiles puede entrar.",
    "Si alguien olvida su clave, pulsa «Restablecer clave» y la creará de nuevo al entrar."] },
};
function AyudaPantalla({ id, C }) {
  const clave = PREFIJO + "ayuda:" + id;
  const [abierta, setAbierta] = useState(() => { try { return !localStorage.getItem(clave); } catch { return true; } });
  const ayuda = AYUDAS[id];
  if (!ayuda) return null;
  const cerrar = () => { setAbierta(false); try { localStorage.setItem(clave, "1"); } catch { /* sin almacenamiento */ } };
  if (!abierta) return (
    <div className="no-print" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
      <button onClick={() => setAbierta(true)} style={{ background: "none", border: `1px solid ${C.blue}`, color: C.blue, borderRadius: 20, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>ℹ️ Cómo se usa</button>
    </div>
  );
  return (
    <div className="no-print" role="note" style={{ background: "#EEF5F8", border: `1px solid ${C.blue}`, borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div style={{ fontWeight: 700, color: C.blue, fontSize: 14 }}>ℹ️ Cómo se usa: {ayuda.titulo}</div>
        <button onClick={cerrar} style={{ background: C.blue, color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>Entendido</button>
      </div>
      {ayuda.pasos.length === 1
        ? <p style={{ margin: "8px 0 0", fontSize: 13, color: C.dark, lineHeight: 1.5 }}>{ayuda.pasos[0]}</p>
        : <ol style={{ margin: "8px 0 0", paddingLeft: 20, fontSize: 13, color: C.dark, lineHeight: 1.55 }}>{ayuda.pasos.map((p, i) => <li key={i}>{p}</li>)}</ol>}
    </div>
  );
}

// ─── Datos de ejemplo (solo modo demostración) ───────────────────────────────
// Rellena el cuadrante de la quincena actual y unas ausencias de hoy y mañana,
// con profesores ficticios, para ver cómo funcionan guardias y ausencias.
// ─── Datos de ejemplo de convivencia (todo ficticio) ────────────────────────
// Grupos con su tutor/a, alumnado inventado, partes de todas las gravedades y
// tipificaciones, salidas al baño, alertas e informes guardados.
const GRUPOS_DEMO = [
  { curso: "1º ESO A", tutor: "Carmen López" },  { curso: "1º ESO B", tutor: "Jorge Ruiz" },
  { curso: "2º ESO A", tutor: "Laura Torres" },  { curso: "2º ESO B", tutor: "Pedro Sánchez" },
  { curso: "3º ESO A", tutor: "Ana Jiménez" },   { curso: "3º ESO B", tutor: "Sofía Martín" },
  { curso: "4º ESO A", tutor: "Pablo Díaz" },    { curso: "4º ESO C", tutor: "Luis García" },
];
const correoDemo = nombre => nombre.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, ".") + "@ejemplo.es";
const TUTORES_DEMO = Object.fromEntries(GRUPOS_DEMO.map(g => [g.curso, { tutor: g.tutor, email: correoDemo(g.tutor) }]));
// Tutor/a de un grupo: primero la tutoría registrada; si no, la del alumnado del grupo
const tutorDeGrupo = (tutores, alumnos, curso) => tutores?.[curso]?.tutor || alumnos.find(a => a.curso === curso && a.tutor)?.tutor || "";

const DESCRIPCIONES_DEMO = {
  "1L": "Interrumpe la explicación varias veces con comentarios en voz alta. Se le avisa dos veces y continúa.",
  "2L": "No trae libro ni cuaderno por tercera vez esta semana y no realiza las actividades propuestas.",
  "3L": "Llega 20 minutos tarde a primera hora sin justificación.",
  "4L": "Se queda en el pasillo durante el cambio de clase y entra al aula 10 minutos tarde sin permiso.",
  "5L": "Habla continuamente con los compañeros de mesa e impide que terminen la tarea.",
  "6L": "Contesta de malas formas a un compañero cuando se le pide que devuelva un material.",
  "7L": "Pinta la mesa con rotulador. Se le pide que la limpie al final de la clase.",
  "8L": "Usa el móvil en clase sin permiso. Se le pide que lo guarde y tarda en hacerlo.",
  "9L": "No acude a la recuperación en el recreo impuesta por un parte anterior.",
  "10L": "Lanza bolas de papel a los compañeros durante la explicación.",
  aG: "Acumula faltas de asistencia injustificadas a primera hora durante tres semanas. La tutoría lo comunica a Jefatura.",
  bG: "Impide el desarrollo normal del examen hablando y molestando a los compañeros pese a los avisos.",
  cG: "Insulta a una compañera delante del grupo durante el cambio de clase.",
  dG: "Se niega a cambiarse de sitio cuando se le pide y desafía las indicaciones del profesor ante el grupo.",
  eG: "Rompe intencionadamente la persiana del aula.",
  fG: "Esconde la mochila de un compañero, que la encuentra más tarde en el baño.",
  gG: "Anima a varios compañeros a salir del aula sin permiso durante la clase.",
  hG: "Participa en una pelea en el patio durante el recreo. Ambos alumnos aceptaban la pelea.",
  iG: "Activa sin motivo el pulsador de la alarma de incendios durante la 4ª hora.",
  jG: "Reiteración en el trimestre de faltas leves (tres partes leves registrados).",
  kG: "Se le sorprende copiando en el examen con el móvil.",
  lG: "Sabía que un compañero estaba siendo acosado y no lo comunicó a ningún profesor.",
  mG: "Comparte en un grupo de mensajería una foto de un compañero tomada en clase sin su permiso.",
  nG: "No cumple la medida correctora de reparar el material que había dañado.",
  aMG: "Amenaza e insulta gravemente al profesor cuando se le pide que guarde el móvil.",
  bMG: "Tras la investigación de la tutoría se confirma que lleva semanas humillando a un compañero en el recreo.",
  cMG: "Agrede a un compañero en el pasillo; el compañero necesita atención en la enfermería del centro.",
  dMG: "Dirige insultos discriminatorios a una compañera delante del grupo.",
  eMG: "Graba una pelea en el patio y la difunde en redes sociales.",
  fMG: "Arranca intencionadamente un lavabo de los baños de la planta 1.",
  gMG: "Falsifica la firma de la familia en un justificante de faltas.",
  hMG: "Se le encuentra con un vapeador y lo ofrece a compañeros dentro del centro.",
  iMG: "Entra con la contraseña de un profesor al aula virtual y modifica tareas.",
  jMG: "Provoca un incidente en la cafetería que obliga a desalojarla.",
  kMG: "Reiteración en el mismo trimestre de dos faltas graves.",
  lMG: "Incita a sus compañeros a agredir a otro alumno a la salida del centro.",
  mMG: "Se presenta en el centro durante los días de expulsión que tenía impuestos.",
};
const tipoDeTipificacion = t => ["3L", "aG"].includes(t) ? "Ausencia" : ["2L", "kG"].includes(t) ? "Académico" : t === "10L" ? "Otro" : "Comportamiento";

function datosEjemploConvivencia(profesores) {
  // Generador pseudoaleatorio con semilla: el ejemplo sale igual cada vez
  let semilla = 20260929;
  const azar = () => { semilla = (semilla * 1103515245 + 12345) % 2147483648; return semilla / 2147483648; };
  const elegir = arr => arr[Math.floor(azar() * arr.length)];
  const NOMBRES = ["Hugo", "Martina", "Leo", "Valeria", "Mateo", "Carla", "Iker", "Noa", "Álex", "Julia", "Daniel", "Irene", "Nicolás", "Lola", "Bruno", "Aitana", "Samuel", "Claudia", "Adam", "Vega", "Eric", "Olivia", "Gael", "Alba", "Izan", "Nerea", "Thiago", "Mía", "Rubén", "Ainhoa", "Marco", "Daniela"];
  const APELLIDOS = ["Navarro", "Molina", "Ortiz", "Delgado", "Castro", "Rubio", "Marín", "Sanz", "Iglesias", "Núñez", "Medina", "Garrido", "Cortés", "Santos", "Lozano", "Guerrero", "Cano", "Prieto", "Méndez", "Cruz", "Calvo", "Gallego", "Vidal", "León", "Herrera", "Márquez", "Peña", "Flores", "Cabrera", "Campos", "Vega", "Fuentes"];
  // Alumnado: los 8 de siempre (con su tutor actualizado) y 4 más por grupo
  const alumnos = DEMO_ALUMNOS.map(a => ({ ...a, tutor: TUTORES_DEMO[a.curso]?.tutor || a.tutor }));
  let id = 100, k = 0;
  GRUPOS_DEMO.forEach(g => {
    const yaHay = alumnos.filter(a => a.curso === g.curso).length;
    for (let i = yaHay; i < 5; i++) {
      const nombre = `${NOMBRES[k % NOMBRES.length]} ${APELLIDOS[k % APELLIDOS.length]} ${APELLIDOS[(k * 7 + 3) % APELLIDOS.length]}`;
      const ap = APELLIDOS[k % APELLIDOS.length].normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
      alumnos.push({ id: id++, nombre, curso: g.curso, tutor: g.tutor, email: `familia.${ap}${k}@email.com`, telefono: `6${String(10000000 + k * 7919).slice(0, 8)}`, nia: "" });
      k++;
    }
  });
  // Días lectivos de las últimas 8 semanas, del más antiguo al más reciente
  const hoy = new Date(), hoyISO = isoLocal(hoy);
  const dias = []; // sin hoy
  // Solo días de curso: sin julio ni agosto, y en septiembre desde el día 8
  const deCurso = x => { const m = x.getMonth(); return m !== 6 && m !== 7 && !(m === 8 && x.getDate() < 8); };
  for (let d = 56; d >= 1; d--) { const x = sumarDias(hoy, -d); if (esLectivo(x) && deCurso(x)) dias.push(x); }
  if (dias.length < 5) for (let d = 1; dias.length < 5; d++) { const x = sumarDias(hoy, -d); if (esLectivo(x)) dias.unshift(x); }
  const horasClase = HORAS.filter(h => h !== "Recreo" && h !== "7ª hora");
  const momento = (dia, hora) => {
    const d = parseISO(dia); const [hh, mm] = inicioHora(hora).split(":").map(Number);
    d.setHours(hh, mm + 5 + Math.floor(azar() * 40)); return d;
  };
  const partes = [];
  const nuevoParte = (al, tip, grav, dia, hora, extra = {}) => {
    let ts = momento(dia, hora);
    if (ts > hoy) ts = new Date(hoy.getTime() - 5 * 60000);
    partes.push({ id: 1000 + partes.length, alumnoId: al.id, alumno: al.nombre, curso: al.curso, tutor: al.tutor, tutorEmail: TUTORES_DEMO[al.curso]?.email || "", email: al.email, telefono: al.telefono,
      tipo: tipoDeTipificacion(tip), gravedad: grav, tipificacion: tip, descripcion: DESCRIPCIONES_DEMO[tip],
      profesor: elegir(profesores.filter(p => p !== al.tutor)), hora, ts: ts.toISOString(), ...extra });
  };
  // Un alumno "difícil" por grupo concentra más partes (así se ven las acumulaciones)
  const dificiles = GRUPOS_DEMO.map(g => alumnos.filter(a => a.curso === g.curso)[1]);
  const quien = () => azar() < 0.45 ? elegir(dificiles) : elegir(alumnos);
  // 1) Cada tipificación aparece al menos una vez
  const todas = [...TIPIFICACION.leve.map(t => [t.id, "leve"]), ...TIPIFICACION.grave.map(t => [t.id, "grave"]), ...TIPIFICACION.muy_grave.map(t => [t.id, "muy_grave"])];
  todas.forEach(([tip, grav], i) => nuevoParte(quien(), tip, grav, dias[Math.floor((i / todas.length) * (dias.length - 1))], elegir(horasClase)));
  // 2) Más partes, sobre todo leves, como en un trimestre real
  for (let i = 0; i < 48; i++) {
    const r = azar();
    const grav = r < 0.65 ? "leve" : r < 0.92 ? "grave" : "muy_grave";
    const pool = grav === "leve" ? ["1L", "1L", "2L", "3L", "5L", "5L", "6L", "8L", "8L", "4L"] : grav === "grave" ? ["cG", "dG", "dG", "bG", "hG", "jG"] : ["aMG", "cMG", "bMG"];
    nuevoParte(quien(), elegir(pool), grav, elegir(dias), elegir(horasClase));
  }
  // 3) Dos partes de grupo
  const diaGrupo1 = dias[dias.length - 6] || dias[0], diaGrupo2 = dias[dias.length - 15] || dias[0];
  alumnos.filter(a => a.curso === "3º ESO B").forEach(al => nuevoParte(al, "1L", "leve", diaGrupo1, "5ª hora", { esGrupal: true, descripcion: "Todo el grupo sale del aula antes del timbre y no vuelve cuando se le pide." }));
  alumnos.filter(a => a.curso === "2º ESO A").forEach(al => nuevoParte(al, "5L", "leve", diaGrupo2, "6ª hora", { esGrupal: true, descripcion: "El grupo impide el desarrollo de la clase con ruido constante; no se puede terminar la actividad." }));
  // 4) Partes de hoy, en horas que ya han empezado
  if (esLectivo(hoy)) {
    const empezadas = horasClase.filter(h => horaEmpezada(hoyISO, h));
    [["8L", "leve"], ["1L", "leve"], ["dG", "grave"]].slice(0, empezadas.length).forEach(([tip, grav], i) => nuevoParte(elegir(dificiles), tip, grav, hoy, empezadas[Math.min(i, empezadas.length - 1)]));
  }
  partes.sort((a, b) => b.ts.localeCompare(a.ts));

  // Salidas al baño de las dos últimas semanas (una, fuera ahora mismo)
  const banos = [];
  dias.slice(-10).forEach(dia => {
    const n = 2 + Math.floor(azar() * 3);
    for (let i = 0; i < n; i++) {
      const al = azar() < 0.3 ? dificiles[2] : elegir(alumnos);
      const salida = momento(dia, elegir(horasClase));
      if (salida > hoy) continue;
      const regreso = new Date(salida.getTime() + (3 + Math.floor(azar() * 10)) * 60000);
      banos.push({ id: 5000 + banos.length, alumnoId: al.id, alumno: al.nombre, curso: al.curso, fecha: isoLocal(salida), salida: salida.toISOString(), ts: salida.toISOString(), regreso: regreso.toISOString(), profesor: elegir(profesores) });
    }
  });
  if (esLectivo(hoy)) {
    const al = dificiles[4]; const salida = new Date(hoy.getTime() - 6 * 60000);
    banos.push({ id: 5000 + banos.length, alumnoId: al.id, alumno: al.nombre, curso: al.curso, fecha: hoyISO, salida: salida.toISOString(), ts: salida.toISOString(), regreso: null, profesor: elegir(profesores) });
  }
  banos.sort((a, b) => b.ts.localeCompare(a.ts));

  // Alertas: acumulación de leves y límite de partes (las más antiguas, ya leídas)
  const alertas = [];
  alumnos.forEach(al => {
    const pA = partes.filter(p => p.alumnoId === al.id).sort((a, b) => a.ts.localeCompare(b.ts));
    const leves = pA.filter(p => p.gravedad === "leve");
    if (leves.length >= 3) alertas.push({ id: 7000 + alertas.length, tipo: "acumulacion_leves", alumno: al.nombre, curso: al.curso, msg: "Acumulación de 3 partes leves — Considerar sanción", ts: leves[2].ts, leida: false });
    if (pA.length >= 3) alertas.push({ id: 7000 + alertas.length, tipo: "total_partes", alumno: al.nombre, curso: al.curso, msg: "Ha alcanzado 3 partes en total", ts: pA[2].ts, leida: false });
  });
  const semana = banos.filter(b => b.alumnoId === dificiles[2].id);
  if (semana.length > 3) alertas.push({ id: 7000 + alertas.length, tipo: "bano", alumno: dificiles[2].nombre, curso: dificiles[2].curso, msg: `Ha ido al baño ${semana.length} veces en las dos últimas semanas`, ts: semana[0].ts, leida: false });
  alertas.sort((a, b) => b.ts.localeCompare(a.ts));
  alertas.forEach((a, i) => { if (i >= 5) a.leida = true; });

  // Dos informes ya guardados, como si Jefatura los hubiera descargado
  const hace = n => sumarDias(hoy, -n);
  const informes = [
    { id: 9001, tipo: "partes", ts: new Date(hace(14).setHours(13, 50)).toISOString(), autor: "Ana Jiménez", filtros: { filtCurso: "2º ESO B" }, filtrosTexto: `Curso: 2º ESO B · Tutor/a: ${TUTORES_DEMO["2º ESO B"].tutor}`, ids: partes.filter(p => p.curso === "2º ESO B" && p.ts < hace(14).toISOString()).map(p => p.id) },
    { id: 9002, tipo: "partes", ts: new Date(hace(7).setHours(14, 20)).toISOString(), autor: "Luis García", filtros: { filtGravedad: "grave" }, filtrosTexto: "Graves", ids: partes.filter(p => p.gravedad === "grave" && p.ts < hace(7).toISOString()).map(p => p.id) },
  ];
  informes.forEach(i => { i.total = i.ids.length; });
  return { alumnos, partes, banos, alertas, informes, tutores: TUTORES_DEMO };
}

function datosEjemploGuardias(profesores) {
  const n = profesores.length;
  const zonasClase  = ["A0-pasillo", "A1-pasillo", "B1-pasillo"];
  const zonasRecreo = ["rec-puerta", "rec-central", "rec-pistas"];
  const cuadrante = {}, apoyos = {}, sustitutos = {};
  const lunes = lunesDe();
  const diasQuincena = Array.from({ length: 14 }, (_, i) => sumarDias(lunes, i)).filter(esLectivo);
  // Reparto en rueda: cada hora usa 9 profesores distintos (3 zonas x titular, apoyo y sustituto).
  // Con 24 profesores y 8 horas, cada uno tiene 3 guardias al día.
  diasQuincena.forEach((dia, di) => {
    const f = isoLocal(dia);
    let k = di * 5;
    HORAS_GUARDIA.forEach(hora => {
      const zonas = hora === "Recreo" ? zonasRecreo : zonasClase;
      zonas.forEach(zona => {
        cuadrante[`${f}|${hora}|${profesores[k % n]}`] = zona;
        apoyos[`${f}|${hora}|${zona}`] = profesores[(k + 1) % n];
        sustitutos[`${f}|${hora}|${zona}`] = profesores[(k + 2) % n];
        k += 3;
      });
    });
  });
  // Día de las ausencias: hoy si es lectivo; si no, el próximo lunes
  let dia = parseISO(new Date());
  while (!esLectivo(dia)) dia = sumarDias(dia, 1);
  const diaISO = isoLocal(dia);
  const manana = (() => { let d = sumarDias(dia, 1); while (!esLectivo(d)) d = sumarDias(d, 1); return isoLocal(d); })();
  const quien = (hora, zona) => Object.keys(cuadrante).find(k => k.startsWith(`${diaISO}|${hora}|`) && cuadrante[k] === zona)?.split("|")[2];
  const ausente1 = quien("2ª hora", "A1-pasillo");
  const ausente2 = quien("Recreo", "rec-central");
  const ts = new Date().toISOString();
  const ausencias = [
    { id: 1, profesor: ausente1, motivo: "Enfermedad", fecha: diaISO, horas: ["2ª hora", "3ª hora"], edificio: "A", aula: "2º ESO B", asignatura: "Matemáticas", tarea: "Ejercicios 1 a 10 de la página 54. Se recogen al final de la clase.", ubicacion: "Conserjería", enlace: "", ts, leida: false },
    { id: 2, profesor: ausente2, motivo: "Formación", fecha: diaISO, horas: ["Recreo", "5ª hora"], edificio: "B", aula: "4º ESO C", asignatura: "Inglés", tarea: "Lectura del texto de la unidad 3 y resumen en el cuaderno.", ubicacion: "Mesa del aula", enlace: "", ts, leida: false },
    { id: 3, profesor: profesores[(Math.max(0, profesores.indexOf(ausente1)) + 3) % n], motivo: "Asunto personal", fecha: manana, horas: ["1ª hora"], edificio: "B", aula: "1º ESO A", asignatura: "Música", tarea: "Repaso de figuras rítmicas con la ficha 7.", ubicacion: "Departamento de Música", enlace: "", ts, leida: false },
  ];
  // Profesor recomendado para probar: el sustituto que hoy tiene que entrar por el ausente de 2ª hora
  const sust = sustitutos[`${diaISO}|2ª hora|A1-pasillo`];
  const sugerido = [ausente1, ausente2].includes(sust) ? apoyos[`${diaISO}|2ª hora|A1-pasillo`] : sust;
  // Firmas de ejemplo: todas las horas ya empezadas hoy, menos las del profesor sugerido
  // (para que pruebe a firmar) y una que queda pendiente
  const firmas = [];
  let pendienteDejada = false;
  HORAS_GUARDIA.filter(h => horaEmpezada(diaISO, h)).forEach(hora => {
    Object.entries(cuadrante).filter(([k]) => k.startsWith(`${diaISO}|${hora}|`)).forEach(([k, zonaId]) => {
      const sit = situacionZona({ fecha: diaISO, hora, zonaId, profesores, cuadrante, apoyos, sustitutos, ausencias });
      const z = ZONAS_CENTRO.find(z => z.id === zonaId);
      sit.enZona.forEach(p => {
        if (p === sugerido) return;
        if (!pendienteDejada && hora !== "1ª hora") { pendienteDejada = true; return; }
        const d = parseISO(diaISO); const [hh, mm] = inicioHora(hora).split(":").map(Number); d.setHours(hh, mm + 2 + (p.length % 4));
        firmas.push({ id: firmas.length + 1, fecha: diaISO, hora, zonaId, zona: z?.label || zonaId, profesor: p, rol: p === sit.titular ? "titular" : p === sit.apoyo ? "apoyo" : "sustituto", ts: d.toISOString() });
      });
    });
  });
  return { cuadrante, apoyos, sustitutos, ausencias, firmas, sugerido, ausentes: [ausente1, ausente2] };
}

// ═══════════════════════════════════════════════════════════════════════════
// MI GUARDIA HOY (Profesor)
// ═══════════════════════════════════════════════════════════════════════════
function MiGuardiaHoy({ firmas = [], setFirmas, listas = [], setListas, alumnos = [], profesores, cuadrante, apoyosGuardia, sustitutosGuardia = {}, ausencias, fProfesor, setFProfesor, C, selStyle, labelStyle, usuario, setShowCuadrante, diaSeleccionadoGuardias, setDiaSeleccionadoGuardias }) {
  const hoy     = new Date();
  const diasES  = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const diaHoy  = diasES[hoy.getDay()];
  const esFinde = hoy.getDay() === 0 || hoy.getDay() === 6;
  const hoyISO  = isoLocal(hoy);
  const [listaAbierta, setListaAbierta] = useState(null); // {hora, curso}
  const cursosCentro = [...new Set(alumnos.map(a => a.curso))].sort();
  function firmar(g) {
    setFirmas(prev => [...prev, { id: Date.now(), fecha: hoyISO, hora: g.hora, zonaId: g.zonaId, zona: g.zona, profesor: fProfesor, rol: g.rol, ts: new Date().toISOString() }]);
  }
  const listaDe = (hora, curso) => listas.find(l => l.fecha === hoyISO && l.hora === hora && l.curso === curso && l.profesor === fProfesor);
  function guardarLista(ausentes) {
    const { hora, curso } = listaAbierta;
    setListas(prev => [...prev.filter(l => !(l.fecha === hoyISO && l.hora === hora && l.curso === curso && l.profesor === fProfesor)),
      { id: Date.now(), fecha: hoyISO, hora, curso, profesor: fProfesor, ausentes, ts: new Date().toISOString() }]);
    setListaAbierta(null);
  }

  const equipo = { profesores, cuadrante, apoyos: apoyosGuardia, sustitutos: sustitutosGuardia, ausencias };
  const ahora = horaEnCurso();
  // Guardias de hoy: como titular, apoyo o sustituto
  const guardiasDia = guardiasDeProfesor({ fecha: hoyISO, profesor: fProfesor, ...equipo }).map(g => ({
    ...g,
    // Tareas de las clases sin profesor que afectan a esta guardia
    ausencias: tareasDeGuardia(g, hoyISO, ausencias),
  }));

  return (
    <div>
      {/* BIENVENIDA PERSONALIZADA CON SALUDO POR HORA */}
      {(() => {
        const hora = new Date().getHours();
        let saludo = "";
        if (hora < 12) saludo = "¡Buenos días";
        else if (hora < 18) saludo = "¡Buenas tardes";
        else saludo = "¡Buenas noches";
        
        return (
          <div style={{ background: `linear-gradient(135deg, ${C.blue} 0%, ${C.teal} 100%)`, color: "#fff", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{saludo}, {usuario}! 👋</h1>
                <p style={{ margin: 0, fontSize: 15, opacity: 0.9, lineHeight: 1.5 }}>
                  {guardiasDia.length > 0 ? (
                    <>Hoy tienes <strong>{guardiasDia.length} guardia{guardiasDia.length !== 1 ? 's' : ''}</strong> asignada{guardiasDia.length !== 1 ? 's' : ''}</>
                  ) : esFinde ? (
                    <>¡Hoy es fin de semana! Que descanses</>
                  ) : (
                    <>No tienes guardias hoy. ¡Que disfrutes!</>
                  )}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 48 }}>📚</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}</div>
              </div>
            </div>
          </div>
        );
      })()}

      <h2 style={{ color:C.dark, marginTop:0 }}>🔄 Mi Guardia Hoy</h2>
      <div style={{ background:C.white, borderRadius:12, padding:16, marginBottom:16, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
        <label style={labelStyle}>Soy el/la profesor/a</label>
        <select value={fProfesor} onChange={e => setFProfesor(e.target.value)} style={selStyle} disabled={profesores.includes(usuario)}>
          {profesores.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* AVISO DE AUSENCIAS A CUBRIR */}
      {(() => {
        // Obtener la zona del profesor hoy
        let zonaProfesor = null;
        let edificioProfesor = null;
        
        for (let hora of HORAS_GUARDIA) {
          const key = `${hoyISO}|${hora}|${fProfesor}`;
          const zona = cuadrante[key];
          if (zona) {
            zonaProfesor = zona;
            const zonaObj = ZONAS_CENTRO.find(z => z.id === zona);
            edificioProfesor = zonaObj?.edificio;
            break;
          }
        }
        
        // Buscar ausencias de hoy que el profesor debe cubrir
        const ausenciasACubrir = ausencias.filter(a => {
          const fechaAusencia = a.fecha;
          const hoysStr = hoyISO;
          return fechaAusencia === hoysStr && a.edificio === edificioProfesor;
        });
        
        if (ausenciasACubrir.length > 0 && zonaProfesor) {
          return (
            <div style={{ background: "#FEF3C7", borderRadius: 12, padding: 16, marginBottom: 16, borderLeft: "4px solid #F59E0B", boxShadow: "0 2px 10px rgba(245, 158, 11, 0.15)" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ fontSize: 24 }}>⚠️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "#92400E", marginBottom: 10, fontSize: 15 }}>
                    Tienes {ausenciasACubrir.length} {ausenciasACubrir.length === 1 ? "clase" : "clases"} sin profesor hoy
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {ausenciasACubrir.map((a, idx) => (
                      <div key={idx} style={{ background: "#FFFBEB", borderRadius: 6, padding: 10, fontSize: 13, color: "#78350F" }}>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>
                          {a.horas.join(", ")} - {a.asignatura || "Clase"}
                        </div>
                        <div style={{ fontSize: 12 }}>
                          👤 {a.profesor} · 🏫 Aula {a.aula || "?"} {a.asignatura ? `· 📚 ${a.asignatura}` : ""}
                        </div>
                        {a.tarea && <div style={{ fontSize: 12, marginTop: 4 }}>✏️ Tarea: {a.tarea}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })()}

      {/* CALENDARIO PRÓXIMOS 7 DÍAS */}
      {(() => {
        const proximosDias = [];
        for (let i = 0; i < 7; i++) {
          const fecha = new Date(hoy);
          fecha.setDate(fecha.getDate() + i);
          const dia = diasES[fecha.getDay()];
          
          // Verificar si tiene guardias ese día
          const f = isoLocal(fecha);
          const tieneGuardia = guardiasDeProfesor({ fecha: f, profesor: fProfesor, ...equipo }).length > 0;
          
          proximosDias.push({ dia, fecha, tieneGuardia });
        }
        
        return (
          <div style={{ background:C.white, borderRadius:12, padding:16, marginBottom:16, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize:13, fontWeight:600, color:C.gray, marginBottom:12 }}>📅 Próximos 7 días</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,minmax(0,1fr))", gap:4 }}>
              {proximosDias.map((p, idx) => (
                <div key={idx} 
                  onClick={() => p.tieneGuardia && setDiaSeleccionadoGuardias(p.fecha)}
                  style={{ 
                    textAlign:"center", 
                    padding:"10px 2px", 
                    minWidth:0,
                    borderRadius:10, 
                    background: p.tieneGuardia ? "#E8F5F3" : "#f3f4f6",
                    border: idx === 0 ? `2px solid ${C.teal}` : "2px solid transparent",
                    cursor: p.tieneGuardia ? "pointer" : "default",
                    transition: "all .2s ease",
                    transform: p.tieneGuardia ? "scale(1)" : "scale(1)"
                  }}
                  onMouseOver={e => { if (p.tieneGuardia) { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"; } }}
                  onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ fontSize:11, fontWeight:600, color:C.gray, marginBottom:4 }}>{p.dia.substring(0,3)}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.dark, marginBottom:6 }}>{p.fecha.getDate()}</div>
                  <div style={{ fontSize:20 }}>{p.tieneGuardia ? "✅" : "⭕"}</div>
                  <div style={{ fontSize:9, color: p.tieneGuardia ? C.teal : C.gray, fontWeight:600, marginTop:4, overflow:"hidden", textOverflow:"ellipsis" }}>
                    {p.tieneGuardia ? "Guardia" : "Libre"}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <button onClick={() => setShowCuadrante(true)} style={{
                padding: "10px 20px",
                background: C.blue,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                transition: "all .3s ease"
              }}
              onMouseOver={e => { e.currentTarget.style.background = "#00a399"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseOut={e => { e.currentTarget.style.background = C.blue; e.currentTarget.style.transform = "translateY(0)"; }}>
                📅 Ver Cuadrante Completo
              </button>
            </div>
          </div>
        );
      })()}
      {esFinde ? (
        <div style={{ background:"#E8F5F3", borderRadius:12, padding:30, textAlign:"center", color:C.teal, fontWeight:600, fontSize:16 }}>
          🎉 ¡Hoy es {diaHoy}! No hay guardias.
        </div>
      ) : guardiasDia.length === 0 ? (
        <div style={{ background:C.white, borderRadius:12, padding:30, textAlign:"center", boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize:40, marginBottom:10 }}>✅</div>
          <div style={{ fontWeight:700, color:C.dark, fontSize:16 }}>No tienes guardias asignadas hoy ({diaHoy})</div>
          <div style={{ color:C.gray, fontSize:13, marginTop:6 }}>Consulta con Jefatura si crees que es un error</div>
        </div>
      ) : (
        <div>
          <div style={{ fontWeight:600, color:C.gray, fontSize:13, marginBottom:10 }}>
            📅 {diaHoy} — {guardiasDia.length} guardia(s) asignada(s)
          </div>
          {guardiasDia.map((g, i) => {
            const { sit } = g;
            const ROLES = {
              titular:   { txt: "🛡️ TITULAR DE LA GUARDIA", color: C.teal, bg: "#E8F5F3" },
              apoyo:     { txt: "👥 APOYO",                  color: C.blue, bg: "#EEF5F8" },
              sustituto: { txt: "🔁 SUSTITUTO",              color: "#7c3aed", bg: "#f3e8ff" },
            };
            const r = ROLES[g.rol];
            const esAhora = ahora === g.hora;
            const nombre = (p, falta) => p
              ? <span style={{ textDecoration: falta ? "line-through" : "none", color: falta ? C.salmon : C.dark }}>{p}{falta ? " (ausente)" : ""}</span>
              : <span style={{ color: "#9f1239" }}>sin asignar</span>;
            // Aviso principal según el papel
            let aviso = null;
            const rojo = { background: "#FDF0EF", border: `2px solid ${C.salmon}`, color: "#9f1239" };
            const ambar = { background: "#fef3c7", border: "1px solid #f59e0b", color: "#92400e" };
            const azul = { background: "#EEF5F8", border: `1px solid ${C.blue}`, color: C.blue };
            if (g.rol === "sustituto") {
              aviso = sit.sustituyeA
                ? { estilo: rojo, txt: `⚠️ Hoy entras tú: sustituyes a ${sit.sustituyeA} (${sit.hueco})` }
                : { estilo: azul, txt: "Estás de reserva: solo entras si falta el titular o el apoyo" };
            } else if (g.rol === "apoyo") {
              if (sit.tA) aviso = sit.sustituyeA
                ? { estilo: ambar, txt: `Falta el titular ${sit.titular}: entra el sustituto ${sit.sustituto}` }
                : { estilo: rojo, txt: `⚠️ Falta el titular ${sit.titular} y no hay sustituto: cubres tú la zona` };
            } else {
              if (!sit.apoyo || sit.aA) aviso = sit.sustituyeA
                ? { estilo: ambar, txt: `${sit.aA ? `Tu apoyo ${sit.apoyo} falta` : "No tienes apoyo asignado"}: entra el sustituto ${sit.sustituto}` }
                : { estilo: rojo, txt: `⚠️ ${sit.aA ? `Tu apoyo ${sit.apoyo} falta` : "No tienes apoyo asignado"} y no hay sustituto: estás solo/a en la zona` };
            }
            return (
              <div key={i} style={{ background:C.white, borderRadius:12, padding:18, marginBottom:12, boxShadow: esAhora ? `0 0 0 3px ${r.color}` : "0 2px 10px rgba(0,0,0,0.06)", borderLeft:`5px solid ${r.color}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap" }}>
                  <div>
                    <div style={{ fontWeight:800, fontSize:18, color:C.dark }}>{g.hora} <span style={{ fontSize:14, fontWeight:600, color:C.gray }}>· {HORARIO[g.hora]}</span></div>
                    <div style={{ fontSize:15, color:r.color, fontWeight:600, marginTop:4 }}>📍 {g.zona}</div>
                  </div>
                  {esAhora && <span style={{ background:r.color, color:"#fff", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:700 }}>⏱ AHORA</span>}
                </div>
                <div style={{ marginTop:12, padding:"6px 12px", background:r.bg, borderRadius:8, fontSize:12, fontWeight:700, color:r.color, display:"inline-block" }}>{r.txt}</div>
                {aviso && <div style={{ marginTop:10, padding:"10px 12px", borderRadius:8, fontSize:13, fontWeight:700, ...aviso.estilo }}>{aviso.txt}</div>}
                <div style={{ marginTop:10, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:6, fontSize:12, color:C.gray }}>
                  <div>🛡️ Titular: {nombre(sit.titular, sit.tA)}</div>
                  <div>👥 Apoyo: {nombre(sit.apoyo, sit.aA)}</div>
                  <div>🔁 Sustituto: {nombre(sit.sustituto, sit.sA)}</div>
                </div>
                {g.ausencias.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 6 }}>📚 Deberes y tareas de las clases sin profesor</div>
                    <div style={{ display: "grid", gap: 8 }}>{g.ausencias.map(a => <TareaAusente key={a.id} a={a} C={C} />)}</div>
                  </div>
                )}
                {/* Firmar la guardia y pasar lista */}
                {(() => {
                  const firma = firmas.find(f => f.fecha === hoyISO && f.hora === g.hora && f.zonaId === g.zonaId && f.profesor === fProfesor);
                  const empezada = horaEmpezada(hoyISO, g.hora);
                  const cursosTarea = [...new Set(g.ausencias.map(a => a.aula).filter(c => cursosCentro.includes(c)))];
                  const btn = { borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 700, fontSize: 13, border: "none" };
                  return (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.cream}`, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      {firma
                        ? <span style={{ ...btn, background: "#E8F5F3", color: C.teal, cursor: "default" }}>✅ Guardia firmada a las {horaCorta(firma.ts)}</span>
                        : <button onClick={() => firmar(g)} disabled={!empezada} title={empezada ? "Registra que has hecho esta guardia" : `Se puede firmar desde las ${inicioHora(g.hora)}`}
                            style={{ ...btn, background: empezada ? C.teal : "#e5e7eb", color: empezada ? "#fff" : "#6b7280", cursor: empezada ? "pointer" : "not-allowed" }}>
                            ✍️ {empezada ? "Firmar guardia" : `Firmar desde las ${inicioHora(g.hora)}`}
                          </button>}
                      {g.hora !== "Recreo" && cursosTarea.map(curso => {
                        const l = listaDe(g.hora, curso);
                        return (
                          <button key={curso} onClick={() => setListaAbierta({ hora: g.hora, curso })}
                            style={{ ...btn, background: l ? "#EEF5F8" : C.blue, color: l ? C.blue : "#fff" }}>
                            📋 {l ? `Lista de ${curso}: ${l.ausentes.length} ${l.ausentes.length === 1 ? "falta" : "faltas"}` : `Pasar lista · ${curso}`}
                          </button>
                        );
                      })}
                      {g.hora !== "Recreo" && (
                        <select aria-label="Pasar lista de otro grupo" value="" onChange={e => e.target.value && setListaAbierta({ hora: g.hora, curso: e.target.value })}
                          style={{ padding: "9px 10px", borderRadius: 10, border: "1px solid #d1d5db", fontSize: 12, color: C.gray, background: "#fff" }}>
                          <option value="">📋 Pasar lista de otro grupo…</option>
                          {cursosCentro.map(c => <option key={c} value={c}>{c}{listaDe(g.hora, c) ? " (pasada)" : ""}</option>)}
                        </select>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          })}
          {listaAbierta && (
            <PasarLista curso={listaAbierta.curso} alumnos={alumnos} existente={listaDe(listaAbierta.hora, listaAbierta.curso)}
              onGuardar={guardarLista} onCerrar={() => setListaAbierta(null)} C={C} />
          )}
          <div style={{ background:"#FFF8E8", borderRadius:10, padding:14, marginTop:8, fontSize:13, color:C.dark, border:"1px solid #fbbf24" }}>
            ⚠️ Si no puedes asistir, notifícalo en <strong>Notificar Ausencia</strong>.
          </div>
        </div>
      )}
      
      {/* PANEL LATERAL: Guardias del día seleccionado */}
      {diaSeleccionadoGuardias && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 50 }} onClick={() => setDiaSeleccionadoGuardias(null)}>
          <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: "min(400px, 100vw)", background: C.white, boxShadow: "-4px 0 20px rgba(0,0,0,0.15)", overflowY: "auto", animation: "slideIn 0.3s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`, color: "#fff", padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>📅 {diaSeleccionadoGuardias.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" })}</div>
                <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>Guardias asignadas</div>
              </div>
              {(() => {
                const diasES = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
                const diaHoy = diasES[diaSeleccionadoGuardias.getDay()];
                const fechaISO = isoLocal(diaSeleccionadoGuardias);
                const ausenciasDelDia = ausencias.filter(a => {
                  const fechaAus = a.fecha.split("T")[0];
                  return fechaAus === fechaISO;
                });
                const totalAusencias = ausenciasDelDia.length;
                
                return totalAusencias > 0 ? (
                  <div style={{ background: "rgba(239, 68, 68, 0.9)", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, marginRight: 10 }}>
                    {totalAusencias}
                  </div>
                ) : null;
              })()}
              <button onClick={() => setDiaSeleccionadoGuardias(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 18, fontWeight: 700 }}>✕</button>
            </div>
            
            <div style={{ padding: 20 }}>
              {(() => {
                const guardiasDelDia = [];
                
                // Convertir la fecha a nombre del día y a formato ISO
                const diasES = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
                const diaHoy = diasES[diaSeleccionadoGuardias.getDay()];
                const fechaISO = isoLocal(diaSeleccionadoGuardias);
                
                guardiasDeProfesor({ fecha: fechaISO, profesor: fProfesor, ...equipo }).forEach(g => {
                  // Tareas de las clases sin profesor que afectan a esta guardia
                  const ausenciasHora = tareasDeGuardia(g, fechaISO, ausencias);
                  guardiasDelDia.push({ ...g, ausencias: ausenciasHora });
                });
                
                return guardiasDelDia.length === 0 ? (
                  <div style={{ textAlign: "center", color: C.gray, padding: 20 }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
                    <div>No tienes guardias asignadas este día</div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {guardiasDelDia.map((g, idx) => (
                      <div key={idx} style={{ background: "#f9fafb", borderRadius: 10, padding: 14, borderLeft: `4px solid ${C.teal}` }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: C.dark, marginBottom: 8 }}>🕐 {conTramo(g.hora)}</div>
                        <div style={{ fontSize: 13, color: C.teal, fontWeight: 600, marginBottom: 10 }}>📍 {g.zona}</div>
                        
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.blue, marginBottom: 6 }}>
                          {g.rol === "titular" ? "🛡️ Titular" : g.rol === "apoyo" ? "👥 Apoyo" : "🔁 Sustituto"}
                        </div>
                        <div style={{ background: "#EEF5F8", borderRadius: 6, padding: "6px 10px", fontSize: 12, color: C.dark, marginBottom: 8, lineHeight: 1.6 }}>
                          🛡️ Titular: {g.sit.titular || "—"}{g.sit.tA ? " (ausente)" : ""}<br/>
                          👥 Apoyo: {g.sit.apoyo || "sin asignar"}{g.sit.aA ? " (ausente)" : ""}<br/>
                          🔁 Sustituto: {g.sit.sustituto || "sin asignar"}{g.sit.sA ? " (ausente)" : ""}
                          {g.sit.sustituyeA && <div style={{ color: "#92400e", fontWeight: 700 }}>Entra el sustituto por {g.sit.sustituyeA}</div>}
                        </div>
                        
                        {g.ausencias.length > 0 && (
                          <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #e5e7eb" }}>
                            <div style={{ fontWeight: 600, color: "#d97706", fontSize: 12, marginBottom: 8 }}>⚠️ AUSENCIAS A CUBRIR:</div>
                            {g.ausencias.map((a, i) => (
                              <div key={i} style={{ background: "#FFF8E8", borderRadius: 6, padding: 10, marginBottom: 8, borderLeft: `3px solid #fbbf24` }}>
                                <div style={{ fontWeight: 600, color: C.dark, fontSize: 12, marginBottom: 6 }}>👤 {a.profesor}</div>
                                {a.asignatura && <div style={{ fontSize: 11, color: "#555", marginBottom: 3 }}><strong>📚 Asignatura:</strong> {a.asignatura}</div>}
                                {a.aula && <div style={{ fontSize: 11, color: "#555", marginBottom: 3 }}><strong>🏫 Aula:</strong> {a.aula}</div>}
                                {a.tarea && <div style={{ fontSize: 11, color: "#555", marginBottom: 3 }}><strong>✏️ Tarea:</strong> {a.tarea}</div>}
                                {a.enlace && <div style={{ fontSize: 11, marginBottom: 3 }}><a href={a.enlace} target="_blank" rel="noopener noreferrer" style={{ color: C.blue, textDecoration: "underline" }}>🔗 Ver recursos</a></div>}
                                {a.ubicacion && <div style={{ fontSize: 11, color: "#555" }}><strong>📍 Ubicación:</strong> {a.ubicacion}</div>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
            
            <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICAR AUSENCIA (Profesor)
// ═══════════════════════════════════════════════════════════════════════════
function NotificarAusencia({ usuario, modoJefatura = false, profesores, ausencias, setAusencias, ausProfesor, setAusProfesor, ausMotivo, setAusMotivo, ausFecha, setAusFecha, ausHoras, setAusHoras, ausTarea, setAusTarea, ausEnlace, setAusEnlace, ausUbicacion, setAusUbicacion, ausAula, setAusAula, ausAsignatura, setAusAsignatura, fProfesor, C, inpStyle, selStyle, labelStyle, fmt }) {
  const [enviado, setEnviado] = useState(false);
  const [ausEdificio, setAusEdificio] = useState("");

  function toggleHora(h) {
    setAusHoras(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]);
  }

  function enviar() {
    if (!ausProfesor || !ausFecha || ausHoras.length === 0) return;
    const nueva = { id:Date.now(), profesor:ausProfesor, motivo:ausMotivo, fecha:ausFecha, horas:ausHoras, tarea:ausTarea, enlace:ausEnlace, ubicacion:ausUbicacion, aula:ausAula, asignatura:ausAsignatura, edificio:ausEdificio, ts:new Date().toISOString(), leida:false,
      ...(modoJefatura && ausProfesor !== usuario ? { registradaPor: usuario } : {}) };
    setAusencias(prev => [nueva, ...prev]);
    setEnviado(true);
    setAusFecha(""); setAusHoras([]); setAusTarea(""); setAusEnlace(""); setAusUbicacion(""); setAusAula(""); setAusAsignatura(""); setAusEdificio("");
    setTimeout(() => setEnviado(false), 4000);
  }

  const misAusencias = modoJefatura ? [] : ausencias.filter(a => a.profesor === fProfesor);

  return (
    <div>
      <h2 style={{ color:C.dark, marginTop:0 }}>{modoJefatura ? "📞 Registrar una ausencia comunicada por teléfono" : "📢 Notificar Ausencia"}</h2>
      {modoJefatura && <p style={{ marginTop: -6, color: C.gray, fontSize: 13 }}>Para cuando un profesor llama al instituto y no puede avisar desde la app. Su guardia y la tarea llegan igual a quien le cubre.</p>}
      {enviado && (
        <div style={{ background:"#E8F5F3", border:`2px solid ${C.teal}`, borderRadius:12, padding:16, marginBottom:16, fontWeight:700, color:C.teal, fontSize:15 }}>
          ✅ Ausencia notificada. Jefatura ha sido informada.
        </div>
      )}
      <div style={{ background:C.white, borderRadius:12, padding:20, boxShadow:"0 2px 10px rgba(0,0,0,0.06)", marginBottom:16 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
          <div>
            <label style={labelStyle}>Soy el/la profesor/a *</label>
            <select value={ausProfesor} onChange={e => setAusProfesor(e.target.value)} style={selStyle} disabled={!modoJefatura && profesores.includes(usuario)}>
              <option value="">— Seleccionar —</option>
              {profesores.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Fecha de ausencia *</label>
            <input type="date" value={ausFecha} onChange={e => setAusFecha(e.target.value)} style={inpStyle} />
          </div>
          <div style={{ gridColumn:"1/-1" }}>
            <label style={labelStyle}>Motivo</label>
            <select value={ausMotivo} onChange={e => setAusMotivo(e.target.value)} style={selStyle}>
              {MOTIVOS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={labelStyle}>Horas afectadas * (selecciona todas las que correspondan)</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:6 }}>
            {HORAS_GUARDIA.map(h => {
              const sel = ausHoras.includes(h);
              return (
                <button key={h} onClick={() => toggleHora(h)}
                  style={{ padding:"8px 14px", borderRadius:8, border:`2px solid ${sel?C.teal:"#d1d5db"}`, background:sel?C.teal:C.white, color:sel?"#fff":C.dark, cursor:"pointer", fontWeight:600, fontSize:13, transition:"all .15s", lineHeight:1.2 }}>
                  {h}<br/><span style={{ fontSize:11, fontWeight:500, opacity:.8 }}>{HORARIO[h]}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={labelStyle}>Tarea para el profesor sustituto (opcional)</label>
          <textarea value={ausTarea} onChange={e => setAusTarea(e.target.value)} rows={3}
            placeholder="Describe qué deben hacer los alumnos, qué material hay preparado..."
            style={{ ...inpStyle, resize:"vertical" }} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:14, marginBottom:20 }}>
          <div>
            <label style={labelStyle}>Edificio del aula</label>
            <select value={ausEdificio} onChange={e => setAusEdificio(e.target.value)} style={selStyle}>
              <option value="">— Seleccionar —</option>
              {["A","B","C"].map(e => <option key={e} value={e}>Edificio {e}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Aula donde imparto clase (importante para el profesor de guardia)</label>
            <input type="text" value={ausAula} onChange={e => setAusAula(e.target.value)}
              placeholder="3ºB, Sala 5, Taller 2..."
              style={inpStyle} />
          </div>
          <div>
            <label style={labelStyle}>Asignatura o función</label>
            <input type="text" value={ausAsignatura} onChange={e => setAusAsignatura(e.target.value)}
              placeholder="Matemáticas, Inglés, Tutoría..."
              style={inpStyle} />
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
          <div>
            <label style={labelStyle}>Enlace a recursos (opcional)</label>
            <input type="url" value={ausEnlace} onChange={e => setAusEnlace(e.target.value)}
              placeholder="https://drive.google.com/..."
              style={inpStyle} />
          </div>
          <div>
            <label style={labelStyle}>Ubicación del material (opcional)</label>
            <input type="text" value={ausUbicacion} onChange={e => setAusUbicacion(e.target.value)}
              placeholder="Conserjería, Mi despacho, Fotocopias..."
              style={inpStyle} />
          </div>
        </div>
        <button onClick={enviar} disabled={!ausProfesor || !ausFecha || ausHoras.length === 0}
          style={{ width:"100%", padding:14, borderRadius:10, border:"none", background:(!ausProfesor||!ausFecha||ausHoras.length===0)?"#94a3b8":C.salmon, color:"#fff", fontWeight:700, fontSize:15, cursor:(!ausProfesor||!ausFecha||ausHoras.length===0)?"not-allowed":"pointer" }}>
          {modoJefatura ? "📞 Registrar la ausencia" : "📢 Notificar Ausencia a Jefatura"}
        </button>
      </div>
      {misAusencias.length > 0 && (
        <div>
          <h3 style={{ color:C.dark }}>Mis ausencias notificadas</h3>
          {misAusencias.map(a => (
            <div key={a.id} style={{ background:C.white, borderRadius:10, padding:14, marginBottom:10, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", borderLeft:`4px solid ${C.salmon}` }}>
              <div style={{ fontWeight:700, color:C.dark }}>📅 {new Date(a.fecha).toLocaleDateString("es-ES")} · {a.motivo}</div>
              <div style={{ fontSize:13, color:C.gray, marginTop:4 }}>Horas: {a.horas.join(", ")}</div>
              {a.aula && <div style={{ fontSize:13, color:C.dark, marginTop:4, background:C.light, borderRadius:6, padding:"6px 10px" }}>🏫 Aula: {a.aula}</div>}
              {a.asignatura && <div style={{ fontSize:13, color:C.dark, marginTop:4, background:C.light, borderRadius:6, padding:"6px 10px" }}>📚 Asignatura: {a.asignatura}</div>}
              {a.tarea && <div style={{ fontSize:13, color:C.dark, marginTop:4, background:C.light, borderRadius:6, padding:"6px 10px" }}>📝 Tarea: {a.tarea}</div>}
              {a.enlace && <div style={{ fontSize:13, color:C.blue, marginTop:4, background:"#EEF5F8", borderRadius:6, padding:"6px 10px" }}>🔗 <a href={a.enlace} target="_blank" rel="noopener noreferrer" style={{ color:C.blue, textDecoration:"underline" }}>Ver recursos</a></div>}
              {a.ubicacion && <div style={{ fontSize:13, color:C.dark, marginTop:4, background:C.light, borderRadius:6, padding:"6px 10px" }}>📍 Ubicación: {a.ubicacion}</div>}
              <div style={{ fontSize:11, color:C.gray, marginTop:4 }}>Notificado el {fmt(a.ts)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CUADRANTE DE GUARDIAS (Jefatura)
// ═══════════════════════════════════════════════════════════════════════════
function CuadranteGuardias({ profesores, cuadrante, setCuadrante, apoyosGuardia, setApoyosGuardia, sustitutosGuardia = {}, setSustitutosGuardia, profesoresGuardia, setProfesoresGuardia, ausencias, quinceInicio, setQInicio, quinceProfesor, setQProf, C, inpStyle, selStyle, labelStyle }) {
  function setZona(dia, hora, profesorSel, zonaId) {
    const key = `${dia}|${hora}|${profesorSel}`;
    const anterior = cuadrante[key];
    setCuadrante(prev => { const next={...prev}; if(zonaId==="") delete next[key]; else next[key]=zonaId; return next; });
    // El apoyo y el sustituto acompañan al titular si se le cambia de zona
    if (anterior && anterior !== zonaId) {
      const mover = prev => {
        const next = { ...prev }, kOld = `${dia}|${hora}|${anterior}`;
        if (next[kOld] !== undefined) { if (zonaId) next[`${dia}|${hora}|${zonaId}`] = next[kOld]; delete next[kOld]; }
        return next;
      };
      setApoyosGuardia(mover); setSustitutosGuardia?.(mover);
    }
  }
  
  function setApoyo(dia, hora, zonaId, profesorApoyo) {
    const key = `${dia}|${hora}|${zonaId}`;
    setApoyosGuardia(prev => { const next={...prev}; if(profesorApoyo==="") delete next[key]; else next[key]=profesorApoyo; return next; });
  }

  function setSustituto(dia, hora, zonaId, profesor) {
    const key = `${dia}|${hora}|${zonaId}`;
    setSustitutosGuardia?.(prev => { const next={...prev}; if(profesor==="") delete next[key]; else next[key]=profesor; return next; });
  }
  
  const profesorSel = quinceProfesor || "";
  const inicio = quinceInicio || isoLocal(lunesDe());

  // Quincena = dos semanas (14 días) desde el inicio; se muestran solo los días lectivos (L-V)
  const dias = [];
  for (let i = 0; i < 14; i++) {
    const d = sumarDias(inicio, i);
    if (!esLectivo(d)) continue;
    dias.push({ dia: `${DIAS_ES[d.getDay()].substring(0,3)} ${d.getDate()}/${d.getMonth()+1}`, fecha: d, key: isoLocal(d) });
  }

  // Copia a esta quincena las guardias y apoyos de la quincena anterior (14 días antes), de todos los profesores
  function copiarQuincenaAnterior() {
    if (!window.confirm("¿Copiar a esta quincena las guardias de la quincena anterior?\nSe sustituirán las guardias ya asignadas en estas fechas, de todos los profesores.")) return;
    const destino = new Set(dias.map(d => d.key));
    const origenADestino = Object.fromEntries(dias.map(d => [isoLocal(sumarDias(d.fecha, -14)), d.key]));
    const copiar = prev => {
      const next = {};
      Object.entries(prev).forEach(([k, v]) => { if (!destino.has(k.split("|")[0])) next[k] = v; });
      Object.entries(prev).forEach(([k, v]) => {
        const [f, ...resto] = k.split("|");
        if (origenADestino[f]) next[[origenADestino[f], ...resto].join("|")] = v;
      });
      return next;
    };
    setCuadrante(copiar); setApoyosGuardia(copiar); setSustitutosGuardia?.(copiar);
  }
  
  return (
    <div>
      <h2 style={{ color:C.dark, marginTop:0 }}>📅 Cuadrante de Guardias</h2>
      
      {/* SELECTOR DE PROFESOR */}
      <div style={{ background:C.white, borderRadius:12, padding:20, marginBottom:16, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
        <label style={{ ...labelStyle, fontSize: 16, fontWeight: 700, marginBottom: 10, display: "block" }}>👤 Seleccionar Profesor para Configurar su Cuadrante</label>
        <select value={profesorSel} onChange={e => setQProf(e.target.value)} style={{ ...selStyle, fontSize: 14, padding: "10px 12px" }}>
          <option value="">— Elige un profesor —</option>
          {profesores.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      
      {/* SI NO HAY PROFESOR: MENSAJE */}
      {!profesorSel && (
        <div style={{ background:C.white, borderRadius:12, padding:40, textAlign:"center", boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👤</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: C.dark, marginBottom: 8 }}>Por favor, selecciona un profesor</div>
          <div style={{ fontSize: 14, color: C.gray }}>Para configurar su cuadrante de guardias de 15 días</div>
        </div>
      )}
      
      {/* SI HAY PROFESOR: CUADRANTE DE 15 DÍAS */}
      {profesorSel && (
        <div style={{ background:C.white, borderRadius:12, padding:16, boxShadow:"0 2px 10px rgba(0,0,0,0.06)", overflowX:"auto" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Inicio de quincena</label>
            <input type="date" value={inicio} onChange={e => setQInicio(e.target.value)} style={inpStyle} />
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              <button onClick={() => setQInicio(isoLocal(sumarDias(inicio, -14)))} style={{ background: C.cream, border: "1px solid #ddd", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600, color: C.dark }}>← Quincena anterior</button>
              <button onClick={() => setQInicio(isoLocal(sumarDias(inicio, 14)))} style={{ background: C.cream, border: "1px solid #ddd", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600, color: C.dark }}>Quincena siguiente →</button>
              <button onClick={copiarQuincenaAnterior} style={{ background: "#EEF5F8", border: `1px solid ${C.blue}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600, color: C.blue }}>📋 Copiar de la quincena anterior</button>
            </div>
            {dias.length > 0 && <div style={{ fontSize: 12, color: C.gray, marginTop: 6 }}>Del {dias[0].fecha.toLocaleDateString("es-ES")} al {dias[dias.length - 1].fecha.toLocaleDateString("es-ES")}</div>}
          </div>
          
          <div style={{ fontWeight:700, color:C.dark, marginBottom:4, fontSize:14 }}>📅 Cuadrante: <strong>{profesorSel}</strong></div>
          <div style={{ fontSize:12, color:C.gray, marginBottom:8 }}>En cada guardia: <strong>📍 zona</strong> del titular, <strong>👥 apoyo</strong> y <strong>🔁 sustituto</strong> (entra si falta el titular o el apoyo). Máximo {MAX_GUARDIAS_DIA} guardias por profesor y día; entre paréntesis, las que ya tiene ese día.</div>
          {(() => {
            const incompletas = dias.reduce((n, d) => n + HORAS_GUARDIA.filter(h => { const z = cuadrante[`${d.key}|${h}|${profesorSel}`]; const k = `${d.key}|${h}|${z}`; return z && (!apoyosGuardia[k] || !sustitutosGuardia[k]); }).length, 0);
            return incompletas > 0
              ? <div style={{ marginBottom: 14, padding: "8px 12px", background: "#FDF0EF", border: `1px solid ${C.salmon}`, borderRadius: 8, fontSize: 12, color: "#9f1239", fontWeight: 600, display: "inline-block" }}>⚠️ {incompletas} guardia(s) de esta quincena sin apoyo o sin sustituto</div>
              : <div style={{ marginBottom: 14 }} />;
          })()}
          
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11, minWidth: 90 + 150 * dias.length }}>
            <thead>
              <tr style={{ background:C.dark }}>
                <th style={{ padding:"8px 8px", color:"#fff", textAlign:"left", width:80 }}>Hora</th>
                {dias.map((d, idx) => {
                  const nd = guardiasDelDia(d.key, profesorSel, cuadrante, apoyosGuardia, sustitutosGuardia);
                  return (
                    <th key={idx} style={{ padding:"8px 8px", color:"#fff", textAlign:"center", whiteSpace:"nowrap" }}>
                      {d.dia}
                      <div title="Guardias de este profesor ese día (titular, apoyo y sustituto)" style={{ fontSize:10, fontWeight:600, marginTop:2, color: nd >= MAX_GUARDIAS_DIA ? "#fecaca" : "rgba(255,255,255,0.75)" }}>{nd}/{MAX_GUARDIAS_DIA} guardias</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {HORAS_GUARDIA.map((hora, i) => (
                <tr key={hora} style={{ background:i%2===0?"#fff":C.light }}>
                  <td style={{ padding:"6px 8px", fontWeight:700, color:C.dark, fontSize:12, whiteSpace:"nowrap" }}>{hora}<div style={{ fontSize:10, fontWeight:500, color:C.gray }}>{HORARIO[hora]}</div></td>
                  {dias.map((d, idx) => {
                    const zona = cuadrante[`${d.key}|${hora}|${profesorSel}`] || "";
                    const zonaObj = ZONAS_CENTRO.find(z => z.id === zona);
                    const apoyo = zona ? apoyosGuardia[`${d.key}|${hora}|${zona}`] || "" : "";
                    const sustituto = zona ? sustitutosGuardia[`${d.key}|${hora}|${zona}`] || "" : "";
                    // Quien ya tiene una guardia a esa hora (titular, apoyo o sustituto) no puede estar en otra
                    const pref = `${d.key}|${hora}|`;
                    const nDia = p => guardiasDelDia(d.key, p, cuadrante, apoyosGuardia, sustitutosGuardia);
                    const lleno = p => nDia(p) >= MAX_GUARDIAS_DIA;
                    const selBloqueado = !zona && lleno(profesorSel);
                    const ocupados = new Set([
                      ...profesores.filter(p => cuadrante[`${pref}${p}`]),
                      ...Object.entries(apoyosGuardia).filter(([k]) => k.startsWith(pref)).map(([, v]) => v),
                      ...Object.entries(sustitutosGuardia).filter(([k]) => k.startsWith(pref)).map(([, v]) => v),
                    ]);
                    
                    return (
                      <td key={idx} style={{ padding:"4px 6px", minWidth: 140 }}>
                        <div style={{ display:"flex", flexDirection:"column", gap:"3px" }}>
                          <select value={zona} onChange={e => setZona(d.key, hora, profesorSel, e.target.value)} disabled={selBloqueado}
                            title={selBloqueado ? `Ya tiene ${MAX_GUARDIAS_DIA} guardias este día` : "Zona de la que es titular"}
                            style={{ width:"100%", padding:"4px 4px", borderRadius:4, border:`1px solid ${zona?"#00B7B5":"#d1d5db"}`, fontSize:10, background: selBloqueado ? "#f3f4f6" : zona?"#E8F5F3":"#fff", color: selBloqueado ? "#9ca3af" : C.dark, cursor: selBloqueado ? "not-allowed" : "pointer", fontWeight: zona ? 600 : 400 }}>
                            <option value="">{selBloqueado ? `Máx. ${MAX_GUARDIAS_DIA} al día` : "📍 Zona"}</option>
                            <optgroup label="── Edificio A">{ZONAS_CENTRO.filter(z=>z.edificio==="A").map(z=><option key={z.id} value={z.id}>{z.label}</option>)}</optgroup>
                            <optgroup label="── Edificio B">{ZONAS_CENTRO.filter(z=>z.edificio==="B").map(z=><option key={z.id} value={z.id}>{z.label}</option>)}</optgroup>
                            <optgroup label="── Edificio C">{ZONAS_CENTRO.filter(z=>z.edificio==="C").map(z=><option key={z.id} value={z.id}>{z.label}</option>)}</optgroup>
                            <optgroup label="── Aula / Recreo">{ZONAS_CENTRO.filter(z=>z.edificio==="-").map(z=><option key={z.id} value={z.id}>{z.label}</option>)}</optgroup>
                          </select>
                          {zona && (
                            <select value={apoyo} onChange={e => setApoyo(d.key, hora, zona, e.target.value)} title={apoyo ? "Profesor de apoyo" : "Falta asignar el profesor de apoyo"}
                              style={{ width:"100%", padding:"4px 4px", borderRadius:4, border:`1px solid ${apoyo ? "#00B7B5" : C.salmon}`, fontSize:10, background: apoyo ? "#e0f7f6" : "#FDF0EF", color: apoyo ? C.dark : "#9f1239", cursor:"pointer", fontWeight: 600 }}>
                              <option value="">⚠️ Falta apoyo</option>
                              {profesores.filter(p => p !== profesorSel && ((!ocupados.has(p) && !lleno(p)) || p === apoyo)).map(p => <option key={p} value={p}>👥 {p} ({nDia(p)})</option>)}
                            </select>
                          )}
                          {zona && (
                            <select value={sustituto} onChange={e => setSustituto(d.key, hora, zona, e.target.value)} title={sustituto ? "Sustituto: entra si falta el titular o el apoyo" : "Falta asignar el sustituto"}
                              style={{ width:"100%", padding:"4px 4px", borderRadius:4, border:`1px solid ${sustituto ? "#7c3aed" : C.salmon}`, fontSize:10, background: sustituto ? "#f3e8ff" : "#FDF0EF", color: sustituto ? C.dark : "#9f1239", cursor:"pointer", fontWeight: 600 }}>
                              <option value="">⚠️ Falta sustituto</option>
                              {profesores.filter(p => p !== profesorSel && ((!ocupados.has(p) && !lleno(p)) || p === sustituto)).map(p => <option key={p} value={p}>🔁 {p} ({nDia(p)})</option>)}
                            </select>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ marginTop:14, fontSize:12, color:C.gray }}>💾 Los cambios se guardan automáticamente.</div>
          <div style={{ marginTop:8, padding: "10px 12px", background: "#E8F5F3", borderRadius: 8, fontSize: 12, color: C.teal, fontWeight: 600, display: "inline-block" }}>✅ Cambios guardados correctamente</div>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// PARTE DEL DÍA (Jefatura)
// ═══════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════
// COORDINACIÓN DIARIA DE AUSENCIAS
// ═══════════════════════════════════════════════════════════════════════════
function CoordinacionAusencias({ profesores, ausencias, cuadrante, apoyosGuardia, sustitutosGuardia = {}, profesoresGuardia, HORAS_GUARDIA, ZONAS_CENTRO, DIAS_SEMANA, C, inpStyle, selStyle, labelStyle, fechaCoordinacion, setFechaCoordinacion }) {
  
  const diasES = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  
  // Obtener ausencias del día seleccionado
  const ausenciasDelDia = ausencias.filter(a => {
    if (!fechaCoordinacion) return false;
    const fechaAus = isoLocal(a.fecha);
    const fechaSel = isoLocal(fechaCoordinacion);
    return fechaAus === fechaSel;
  });
  
  // Obtener guardias del día seleccionado
  const guardiasDia = [];
  if (fechaCoordinacion) {
    const fechaSel = isoLocal(fechaCoordinacion);
    
    HORAS_GUARDIA.forEach(hora => {
      profesores.forEach(profesorGuardia => {
        // Zona asignada a este profesor en esa fecha y hora
        const zona = ZONAS_CENTRO.find(z => z.id === cuadrante[`${fechaSel}|${hora}|${profesorGuardia}`]);
        
        if (zona) {
          const apoyo = apoyosGuardia[`${fechaSel}|${hora}|${zona.id}`] || "";
          const sit = situacionZona({ fecha: fechaSel, hora, zonaId: zona.id, profesores, cuadrante, apoyos: apoyosGuardia, sustitutos: sustitutosGuardia, ausencias });
          guardiasDia.push({
            sit,
            hora,
            zona: zona.label,
            zonaId: zona.id,
            edificio: zona.edificio,
            profesor: profesorGuardia,
            apoyo: apoyo
          });
        }
      });
    });
  }
  
  // Agrupar guardias por edificio
  const guardiasEdificios = {};
  guardiasDia.forEach(g => {
    if (!guardiasEdificios[g.edificio]) {
      guardiasEdificios[g.edificio] = [];
    }
    guardiasEdificios[g.edificio].push(g);
  });
  
  return (
    <div>
      <h2 style={{ color: C.dark, marginTop: 0 }}>🔄 Coordinación Diaria de Ausencias</h2>
      
      {/* SELECTOR DE FECHA */}
      <div style={{ background: C.white, borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
        <label style={{ ...labelStyle, fontSize: 14 }}>Selecciona una fecha</label>
        <input type="date" value={fechaCoordinacion} onChange={e => setFechaCoordinacion(e.target.value)} style={inpStyle} />
        {fechaCoordinacion && (
          <div style={{ marginTop: 10, fontSize: 13, color: C.gray }}>
            📅 {parseISO(fechaCoordinacion).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        )}
      </div>
      
      {!fechaCoordinacion ? (
        <div style={{ background: C.white, borderRadius: 12, padding: 40, textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: C.dark }}>Selecciona una fecha</div>
          <div style={{ fontSize: 13, color: C.gray, marginTop: 8 }}>Para ver el cuadrante de guardias y ausencias de ese día</div>
        </div>
      ) : (
        <>
          {/* CUADRANTE DE GUARDIAS */}
          <div style={{ background: C.white, borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: 700, color: C.dark, marginBottom: 14, fontSize: 14 }}>🛡️ Cuadrante de Guardias - {parseISO(fechaCoordinacion).toLocaleDateString("es-ES")}</div>
            
            {Object.keys(guardiasEdificios).length === 0 ? (
              <div style={{ color: C.gray, fontSize: 13, padding: 20, textAlign: "center" }}>
                No hay guardias configuradas para este día
              </div>
            ) : (
              Object.entries(guardiasEdificios).map(([edificio, guardias]) => (
                <div key={edificio} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #e5e7eb" }}>
                  <div style={{ fontWeight: 600, color: C.teal, marginBottom: 10, fontSize: 13 }}>
                    🏢 Edificio {edificio} {edificio === "-" ? "- Otros" : ""}
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "#f3f4f6" }}>
                        <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #d1d5db" }}>Hora</th>
                        <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #d1d5db" }}>Zona</th>
                        <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #d1d5db" }}>Titular</th>
                        <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #d1d5db" }}>Apoyo</th>
                        <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #d1d5db" }}>Sustituto</th>
                        <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #d1d5db" }}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guardias.map((g, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                          <td style={{ padding: "8px", fontWeight: 600, color: C.dark, whiteSpace: "nowrap" }}>{g.hora}<div style={{ fontSize: 10, fontWeight: 500, color: C.gray }}>{HORARIO[g.hora]}</div></td>
                          <td style={{ padding: "8px", color: "#555" }}>{g.zona}</td>
                          {[[g.sit.titular, g.sit.tA, "titular"], [g.sit.apoyo, g.sit.aA, "apoyo"], [g.sit.sustituto, g.sit.sA, "sustituto"]].map(([p, falta, rol]) => {
                            const entra = rol === "sustituto" && g.sit.sustituyeA;
                            return (
                              <td key={rol} style={{ padding: "8px", color: !p ? "#9f1239" : falta ? C.salmon : (rol === "titular" ? C.teal : "#555"), fontWeight: (rol === "titular" || entra || !p) ? 600 : 400 }}>
                                {p || "⚠️ Sin asignar"}
                                {falta && <span style={{ marginLeft: 6, fontSize: 11, background: "#FDF0EF", color: C.salmon, borderRadius: 6, padding: "1px 6px", whiteSpace: "nowrap" }}>🔴 Ausente</span>}
                                {entra && <div style={{ fontSize: 11, color: "#b45309" }}>🟠 entra por {g.sit.sustituyeA}</div>}
                              </td>
                            );
                          })}
                          <td style={{ padding: "8px" }}>
                            <span style={{ color: ESTADOS_ZONA[g.sit.estado].color, background: ESTADOS_ZONA[g.sit.estado].bg, borderRadius: 8, padding: "2px 8px", fontWeight: 700, fontSize: 11, whiteSpace: "nowrap" }}>{ESTADOS_ZONA[g.sit.estado].label}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            )}
          </div>
          
          {/* AUSENCIAS Y ASIGNACIONES */}
          <div style={{ background: C.white, borderRadius: 12, padding: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: 700, color: C.dark, marginBottom: 14, fontSize: 14 }}>⚠️ Profesores Ausentes y Sustituciones</div>
            
            {ausenciasDelDia.length === 0 ? (
              <div style={{ color: C.gray, fontSize: 13, padding: 20, textAlign: "center" }}>
                ✅ Sin ausencias registradas para este día
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {ausenciasDelDia.map((a, idx) => {
                  // Buscar guardia del edificio de la ausencia
                  const guardiaEdificio = guardiasDia.filter(g => g.edificio === a.edificio && a.horas.includes(g.hora))[0];
                  
                  return (
                    <div key={idx} style={{ background: "#FFF8E8", borderRadius: 8, padding: 12, borderLeft: "4px solid #fbbf24" }}>
                      <div style={{ fontWeight: 600, color: "#d97706", marginBottom: 8 }}>👤 {a.profesor} <span style={{ fontSize: 11, color: "#666" }}>({a.motivo})</span></div>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10, fontSize: 12 }}>
                        <div>
                          <div style={{ color: "#555", marginBottom: 4 }}>🕐 <strong>Horas:</strong> {a.horas.join(", ")}</div>
                          {a.aula && <div style={{ color: "#555", marginBottom: 4 }}>🏫 <strong>Aula:</strong> {a.aula}</div>}
                          {a.asignatura && <div style={{ color: "#555", marginBottom: 4 }}>📚 <strong>Asignatura:</strong> {a.asignatura}</div>}
                        </div>
                        <div>
                          {a.edificio && <div style={{ color: "#555", marginBottom: 4 }}>🏢 <strong>Edificio:</strong> {a.edificio}</div>}
                          {a.tarea && <div style={{ color: "#555", marginBottom: 4 }}>✏️ <strong>Tarea:</strong> {a.tarea}</div>}
                          {a.ubicacion && <div style={{ color: "#555", marginBottom: 4 }}>📍 <strong>Material:</strong> {a.ubicacion}</div>}
                        </div>
                      </div>
                      
                      {/* ASIGNACIÓN */}
                      <div style={{ background: "#E8F5F3", borderRadius: 6, padding: 10, marginTop: 10 }}>
                        {guardiaEdificio ? (
                          <div style={{ fontSize: 12, color: C.teal, fontWeight: 600 }}>
                            ✅ <strong>CUBRE:</strong> {guardiaEdificio.profesor} (Guardia {guardiaEdificio.zona})
                            {guardiaEdificio.apoyo && <div style={{ fontSize: 11, marginTop: 4, color: C.blue }}>👥 Apoyo disponible: {guardiaEdificio.apoyo}</div>}
                          </div>
                        ) : (
                          <div style={{ fontSize: 12, color: "#d97706", fontWeight: 600 }}>
                            ⚠️ No hay guardia asignada en el Edificio {a.edificio} para esta hora
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// GALVÁNGRAM - MENSAJERÍA RÁPIDA
// ═══════════════════════════════════════════════════════════════════════════
function Galvangramm({ mensajes, setMensajes, usuario, esJefatura, profesores, C, inpStyle, selStyle, labelStyle }) {
  const [destinatario, setDestinatario] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [mensajePersonalizado, setMensajePersonalizado] = useState("");
  const [tab, setTab] = useState("enviar"); // "enviar" o "historial"
  
  const mensajesPredefinidos = esJefatura ? [
    { id: 1, label: "Cambio de guardia", texto: "Necesito que cambies tu turno de guardia" },
    { id: 2, label: "Falta un profesor", texto: "Falta un profesor, necesito cobertura" },
    { id: 3, label: "Urgencia en aula", texto: "Hay una urgencia en el aula, ven rápido" },
    { id: 4, label: "Reunión importante", texto: "Necesito verte en despacho urgentemente" },
  ] : [
    { id: 1, label: "Alumno enfermo", texto: "Tengo un alumno enfermo en clase" },
    { id: 2, label: "Emergencia", texto: "Hay una emergencia en el aula" },
    { id: 3, label: "Falta material", texto: "Necesito material urgente" },
    { id: 4, label: "Alumno derivado", texto: "Envío alumno a jefatura" },
  ];
  
  const handleEnviar = () => {
    if (!destinatario) {
      alert("Selecciona destinatario");
      return;
    }
    
    // El texto escrito (o el del mensaje rápido elegido, que se copia al cuadro de texto)
    const textoFinal = mensajePersonalizado.trim() || (mensajesPredefinidos.find(m => m.id === tipoMensaje)?.texto || "");
    
    if (!textoFinal.trim()) {
      alert("Escribe un mensaje");
      return;
    }
    
    const nuevoMensaje = {
      id: Date.now(),
      remitente: usuario,
      destinatario: destinatario,
      texto: textoFinal,
      ts: new Date().toISOString(),
      leido: false
    };
    
    setMensajes(prev => [nuevoMensaje, ...prev]);
    setDestinatario("");
    setTipoMensaje("");
    setMensajePersonalizado("");
    alert("✅ Mensaje enviado");
  };
  
  const mensajesNoLeidos = mensajes.filter(m => !m.leido && m.destinatario === usuario).length;
  
  return (
    <div>
      <h2 style={{ color: C.dark, marginTop: 0 }}>💬 Galvángram</h2>
      
      {/* TABS */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, borderBottom: `2px solid ${C.light}` }}>
        <button 
          onClick={() => setTab("enviar")}
          style={{ 
            padding: "10px 16px", 
            background: "none", 
            border: "none", 
            borderBottom: tab === "enviar" ? `3px solid ${C.blue}` : "none",
            color: tab === "enviar" ? C.blue : C.gray,
            fontWeight: tab === "enviar" ? 700 : 500,
            cursor: "pointer",
            fontSize: 14
          }}>
          ✉️ Enviar Mensaje
        </button>
        <button 
          onClick={() => setTab("historial")}
          style={{ 
            padding: "10px 16px", 
            background: "none", 
            border: "none", 
            borderBottom: tab === "historial" ? `3px solid ${C.blue}` : "none",
            color: tab === "historial" ? C.blue : C.gray,
            fontWeight: tab === "historial" ? 700 : 500,
            cursor: "pointer",
            fontSize: 14,
            position: "relative"
          }}>
          📜 Historial
          {mensajesNoLeidos > 0 && (
            <div style={{ position: "absolute", top: 0, right: 0, background: "#ef4444", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
              {mensajesNoLeidos}
            </div>
          )}
        </button>
      </div>
      
      {/* ENVIAR MENSAJE */}
      {tab === "enviar" && (
        <div style={{ background: C.white, borderRadius: 12, padding: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Destinatario</label>
            <select value={destinatario} onChange={e => setDestinatario(e.target.value)} style={selStyle}>
              <option value="">— Selecciona profesor —</option>
              {profesores.filter(p => p !== usuario).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Tipo de Mensaje</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {mensajesPredefinidos.map(m => (
                <button
                  key={m.id}
                  onClick={() => { setTipoMensaje(m.id); setMensajePersonalizado(m.texto); }}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `2px solid ${tipoMensaje === m.id ? C.blue : C.light}`,
                    background: tipoMensaje === m.id ? "#E8F5F3" : "#fff",
                    color: C.dark,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: tipoMensaje === m.id ? 600 : 400,
                    textAlign: "left"
                  }}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Mensaje Personalizado</label>
            <textarea 
              value={mensajePersonalizado}
              onChange={e => setMensajePersonalizado(e.target.value)}
              placeholder="O escribe tu propio mensaje..."
              style={{ ...inpStyle, minHeight: 80, fontFamily: "inherit" }}
            />
          </div>
          
          <button
            onClick={handleEnviar}
            style={{
              width: "100%",
              padding: "12px",
              background: C.blue,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer"
            }}>
            📤 Enviar Mensaje
          </button>
        </div>
      )}
      
      {/* HISTORIAL */}
      {tab === "historial" && (
        <div style={{ background: C.white, borderRadius: 12, padding: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
          {mensajes.length === 0 ? (
            <div style={{ textAlign: "center", color: C.gray, padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>💬</div>
              <div>Sin mensajes</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mensajes.map(m => (
                <div key={m.id} style={{ background: m.destinatario === usuario ? "#E8F5F3" : "#FEF3C7", borderRadius: 10, padding: 12, borderLeft: `4px solid ${m.destinatario === usuario ? C.teal : C.blue}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, color: C.dark, fontSize: 13 }}>
                      {m.remitente === usuario ? "📤 A: " : "📥 De: "}{m.remitente === usuario ? m.destinatario : m.remitente}
                    </div>
                    <div style={{ fontSize: 11, color: C.gray }}>
                      {new Date(m.ts).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "#333", lineHeight: 1.5 }}>
                    {m.texto}
                  </div>
                  {m.destinatario === usuario && !m.leido && (
                    <div style={{ marginTop: 8, fontSize: 11, color: C.teal, fontWeight: 600 }}>
                      ✉️ Sin leer
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


function ParteDia({ profesores, cuadrante, apoyosGuardia = {}, sustitutosGuardia = {}, ausencias, C }) {
  const hoy      = new Date();
  const diasES   = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const diaHoy   = diasES[hoy.getDay()];
  const fechaHoy = isoLocal(hoy);
  const ausHoy   = ausencias.filter(a => isoLocal(a.fecha) === fechaHoy);

  const asignaciones = [];
  HORAS_GUARDIA.forEach(hora => {
    profesores.forEach(prof => {
      const zona = cuadrante[`${fechaHoy}|${hora}|${prof}`];
      if (!zona) return;
      const z = ZONAS_CENTRO.find(z => z.id === zona);
      const sit = situacionZona({ fecha: fechaHoy, hora, zonaId: zona, profesores, cuadrante, apoyos: apoyosGuardia, sustitutos: sustitutosGuardia, ausencias });
      asignaciones.push({ hora, zona: z?.label || zona, sit, estado: sit.estado });
    });
  });

  const porHora = HORAS_GUARDIA.map(hora => ({ hora, items:asignaciones.filter(a=>a.hora===hora) })).filter(h=>h.items.length>0);

  return (
    <div>
      <h2 style={{ color:C.dark, marginTop:0 }}>🔄 Parte del Día — {diaHoy}</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:12, marginBottom:16 }}>
        {[
          { label:"Zonas de guardia",   value:asignaciones.length,                                   color:C.dark   },
          { label:"Completas",          value:asignaciones.filter(a=>a.estado==="completa").length,    color:C.teal   },
          { label:"Entra el sustituto", value:asignaciones.filter(a=>a.estado==="sustituto").length,   color:C.amber  },
          { label:"Solo 1 profesor",    value:asignaciones.filter(a=>a.estado==="una").length,         color:"#a16207" },
          { label:"Descubiertas",       value:asignaciones.filter(a=>a.estado==="descubierta").length, color:C.salmon },
        ].map(s => (
          <div key={s.label} style={{ background:C.white, borderRadius:10, padding:14, textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", borderTop:`4px solid ${s.color}` }}>
            <div style={{ fontSize:26, fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:11, color:C.gray, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      {ausHoy.length > 0 && (
        <div style={{ background:"#FDF0EF", border:`1px solid ${C.salmon}`, borderRadius:10, padding:12, marginBottom:16, fontSize:13 }}>
          <strong style={{ color:C.salmon }}>⚠️ Ausencias notificadas hoy:</strong>
          {ausHoy.map(a => (
            <div key={a.id} style={{ marginTop:4, color:C.dark }}>· {a.profesor} — {a.horas.join(", ")} — {a.motivo}{a.tarea&&<span style={{color:C.gray}}> · Tarea: {a.tarea.slice(0,50)}</span>}</div>
          ))}
        </div>
      )}
      {porHora.length === 0 ? (
        <div style={{ background:C.white, borderRadius:12, padding:30, textAlign:"center", color:C.gray, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
          No hay guardias configuradas para hoy.<br/><span style={{fontSize:13}}>Ve a <strong>Cuadrante Guardias</strong> para asignar zonas.</span>
        </div>
      ) : porHora.map(({ hora, items }) => (
        <div key={hora} style={{ background:C.white, borderRadius:12, marginBottom:12, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", overflow:"hidden" }}>
          <div style={{ background:hora==="Recreo"?C.blue:C.dark, color:"#fff", padding:"10px 16px", fontWeight:700, fontSize:14 }}>
            {hora==="Recreo"?"🏃 ":"⏰ "}{conTramo(hora)}
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ background:C.light }}>
              <th style={{ padding:"7px 16px", textAlign:"left", fontSize:12, color:C.gray, fontWeight:600 }}>Zona</th>
              <th style={{ padding:"7px 16px", textAlign:"left", fontSize:12, color:C.gray, fontWeight:600 }}>Titular</th>
              <th style={{ padding:"7px 16px", textAlign:"left", fontSize:12, color:C.gray, fontWeight:600 }}>Apoyo</th>
              <th style={{ padding:"7px 16px", textAlign:"left", fontSize:12, color:C.gray, fontWeight:600 }}>Sustituto</th>
              <th style={{ padding:"7px 16px", textAlign:"center", fontSize:12, color:C.gray, fontWeight:600 }}>Estado</th>
            </tr></thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} style={{ borderBottom:`1px solid ${C.cream}` }}>
                  <td style={{ padding:"10px 16px", fontSize:13, color:C.dark }}>{item.zona}</td>
                  {[[item.sit.titular, item.sit.tA, "titular"], [item.sit.apoyo, item.sit.aA, "apoyo"], [item.sit.sustituto, item.sit.sA, "sustituto"]].map(([p, falta, rol]) => {
                    const entra = rol === "sustituto" && item.sit.sustituyeA;
                    return (
                      <td key={rol} style={{ padding:"10px 16px", fontSize:13, color: !p ? "#9f1239" : falta ? C.salmon : C.dark, textDecoration: falta ? "line-through" : "none", fontWeight: entra ? 700 : 400 }}>
                        {p || "⚠️ Sin asignar"}{entra && <div style={{ fontSize:11, color:"#b45309", textDecoration:"none" }}>entra por {item.sit.sustituyeA}</div>}
                      </td>
                    );
                  })}
                  <td style={{ padding:"10px 16px", textAlign:"center" }}>
                    <span style={{ color:ESTADOS_ZONA[item.estado].color, background:ESTADOS_ZONA[item.estado].bg, borderRadius:8, padding:"3px 8px", fontWeight:700, fontSize:12, whiteSpace:"nowrap" }}>{ESTADOS_ZONA[item.estado].label}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GESTIÓN DE AUSENCIAS (Jefatura)
// ═══════════════════════════════════════════════════════════════════════════
function GestionAusencias({ ausencias, setAusencias, profesores, C, fmt }) {
  const [filtFecha, setFiltFecha] = useState("");
  const [filtProf,  setFiltProf]  = useState("");
  const ausFiltradas = ausencias.filter(a => (!filtFecha||a.fecha===filtFecha) && (!filtProf||a.profesor===filtProf));

  return (
    <div>
      <h2 style={{ color:C.dark, marginTop:0 }}>📢 Gestión de Ausencias</h2>
      <div style={{ background:C.white, borderRadius:12, padding:16, marginBottom:14, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={{ display:"block", fontWeight:600, fontSize:13, color:C.dark, marginBottom:6 }}>Filtrar por fecha</label>
            <input type="date" value={filtFecha} onChange={e=>setFiltFecha(e.target.value)} style={{ width:"100%", padding:"8px 12px", borderRadius:8, border:"1px solid #d1d5db", fontSize:13, boxSizing:"border-box" }}/>
          </div>
          <div>
            <label style={{ display:"block", fontWeight:600, fontSize:13, color:C.dark, marginBottom:6 }}>Filtrar por profesor</label>
            <select value={filtProf} onChange={e=>setFiltProf(e.target.value)} style={{ width:"100%", padding:"8px 12px", borderRadius:8, border:"1px solid #d1d5db", fontSize:13 }}>
              <option value="">Todos</option>{profesores.map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <button onClick={()=>{setFiltFecha("");setFiltProf("");}} style={{ marginTop:10, background:"none", border:"1px solid #d1d5db", borderRadius:8, padding:"6px 14px", cursor:"pointer", fontSize:12, color:C.gray }}>Limpiar filtros</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:16 }}>
        {[
          { label:"Total",         value:ausencias.length,                                    color:C.dark   },
          { label:"Sin leer",      value:ausencias.filter(a=>!a.leida).length,                color:C.salmon },
          { label:"Con tarea",     value:ausencias.filter(a=>a.tarea&&a.tarea.trim()).length, color:C.teal   },
        ].map(s=>(
          <div key={s.label} style={{ background:C.white, borderRadius:10, padding:14, textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", borderTop:`4px solid ${s.color}` }}>
            <div style={{ fontSize:24, fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:11, color:C.gray, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      {ausFiltradas.length === 0
        ? <div style={{ background:C.white, borderRadius:12, padding:30, textAlign:"center", color:C.gray }}>No hay ausencias notificadas</div>
        : ausFiltradas.map(a => (
          <div key={a.id} onClick={()=>setAusencias(prev=>prev.map(x=>x.id===a.id?{...x,leida:true}:x))}
            style={{ background:a.leida?C.white:"#FFF8E8", borderRadius:12, padding:16, marginBottom:10, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", borderLeft:`4px solid ${a.leida?"#e5e7eb":C.salmon}`, cursor:"pointer" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
              <div>
                <div style={{ fontWeight:700, color:C.dark, fontSize:15 }}>
                  👨‍🏫 {a.profesor}
                  {!a.leida && <span style={{ marginLeft:8, fontSize:11, background:C.salmon, color:"#fff", borderRadius:6, padding:"2px 8px" }}>Sin leer</span>}
                </div>
                <div style={{ fontSize:13, color:C.gray, marginTop:3 }}>📅 {new Date(a.fecha).toLocaleDateString("es-ES")} · {a.motivo}</div>
                <div style={{ fontSize:13, color:C.dark, marginTop:3 }}>⏰ Horas: <strong>{a.horas.join(", ")}</strong></div>
                {a.tarea && <div style={{ fontSize:13, marginTop:6, background:C.light, borderRadius:6, padding:"6px 10px" }}>📝 {a.tarea}</div>}
              </div>
              <div style={{ fontSize:11, color:C.gray, whiteSpace:"nowrap", textAlign:"right" }}>Notificado: {fmt(a.ts)}{a.registradaPor && <div>📞 Registrada por {a.registradaPor}</div>}</div>
            </div>
          </div>
        ))
      }
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ESTADÍSTICAS Y DOCUMENTOS POR FECHA (Jefatura)
// ═══════════════════════════════════════════════════════════════════════════
// Filas de firmas de guardia de un día (quién tenía que estar en cada zona y quién ha firmado)
function filasFirmasDia(fecha, { profesores, cuadrante, apoyos = {}, sustitutos = {}, ausencias = [] }, firmas = []) {
  const filas = [];
  HORAS_GUARDIA.forEach(hora => {
    profesores.forEach(prof => {
      const zonaId = cuadrante[`${fecha}|${hora}|${prof}`];
      if (!zonaId) return;
      const z = ZONAS_CENTRO.find(z => z.id === zonaId);
      const sit = situacionZona({ fecha, hora, zonaId, profesores, cuadrante, apoyos, sustitutos, ausencias });
      const personas = sit.enZona.map(p => ({ p, firma: firmas.find(f => f.fecha === fecha && f.hora === hora && f.zonaId === zonaId && f.profesor === p) }));
      filas.push({ hora, zona: z?.label || zonaId, personas, empezada: horaEmpezada(fecha, hora) });
    });
  });
  return filas;
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const PERIODOS = [
  { id: "dia", label: "Día" },
  { id: "semana", label: "Semana" },
  { id: "quincena", label: "Quincena" },
  { id: "mes", label: "Mes" },
  { id: "rango", label: "Entre fechas" },
];
// Devuelve { desde, hasta, texto } (fechas AAAA-MM-DD) del periodo que contiene la fecha de referencia
function calcularPeriodo(tipo, ref, desdeLibre, hastaLibre) {
  const d = parseISO(ref);
  const y = d.getFullYear(), m = d.getMonth();
  const finMes = new Date(y, m + 1, 0).getDate();
  const largo = x => parseISO(x).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  if (tipo === "dia") return { desde: isoLocal(d), hasta: isoLocal(d), texto: largo(d) };
  if (tipo === "semana") {
    const l = lunesDe(d), v = sumarDias(l, 4);
    return { desde: isoLocal(l), hasta: isoLocal(v), texto: `Semana del ${fmtD(l)} al ${fmtD(v)}` };
  }
  if (tipo === "quincena") {
    const primera = d.getDate() <= 15;
    const ini = new Date(y, m, primera ? 1 : 16), fin = new Date(y, m, primera ? 15 : finMes);
    return { desde: isoLocal(ini), hasta: isoLocal(fin), texto: `${primera ? "1ª" : "2ª"} quincena de ${MESES[m]} de ${y} (${fmtD(ini)} – ${fmtD(fin)})` };
  }
  if (tipo === "mes") return { desde: isoLocal(new Date(y, m, 1)), hasta: isoLocal(new Date(y, m, finMes)), texto: `${MESES[m][0].toUpperCase() + MESES[m].slice(1)} de ${y}` };
  const a = desdeLibre || isoLocal(d), b = hastaLibre || a;
  const [desde, hasta] = a <= b ? [a, b] : [b, a];
  return { desde, hasta, texto: desde === hasta ? largo(desde) : `Del ${fmtD(parseISO(desde))} al ${fmtD(parseISO(hasta))}` };
}
// Mueve la fecha de referencia al periodo anterior (-1) o siguiente (+1)
function moverPeriodo(tipo, ref, dir) {
  const d = parseISO(ref);
  if (tipo === "dia") { let x = sumarDias(d, dir); while (!esLectivo(x)) x = sumarDias(x, dir); return isoLocal(x); }
  if (tipo === "semana") return isoLocal(sumarDias(d, 7 * dir));
  if (tipo === "quincena") {
    if (d.getDate() <= 15) return isoLocal(dir > 0 ? new Date(d.getFullYear(), d.getMonth(), 16) : new Date(d.getFullYear(), d.getMonth() - 1, 16));
    return isoLocal(dir > 0 ? new Date(d.getFullYear(), d.getMonth() + 1, 1) : new Date(d.getFullYear(), d.getMonth(), 1));
  }
  return isoLocal(new Date(d.getFullYear(), d.getMonth() + dir, 1));
}
const diasEntre = (desde, hasta) => { const r = []; for (let x = parseISO(desde); isoLocal(x) <= hasta; x = sumarDias(x, 1)) r.push(isoLocal(x)); return r; };
const contarPor = (lista, clave) => {
  const m = {};
  lista.forEach(x => { const k = typeof clave === "function" ? clave(x) : x[clave]; if (k) m[k] = (m[k] || 0) + 1; });
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
};
const minutosBano = b => b.regreso ? Math.max(1, Math.round((new Date(b.regreso) - new Date(b.salida || b.ts)) / 60000)) : null;
const etiquetaTip = p => TIPIFICACION[p.gravedad]?.find(t => t.id === p.tipificacion)?.label || "";

// Calcula todas las cifras del periodo
function estadisticasPeriodo({ desde, hasta, partes, banos, ausencias, firmas, listas, equipo, tutores }) {
  const enRango = f => f && f >= desde && f <= hasta;
  const pP = partes.filter(p => enRango(isoLocal(p.ts))).sort((a, b) => new Date(a.ts) - new Date(b.ts));
  const bP = banos.filter(b => enRango(isoLocal(b.ts || b.salida))).sort((a, b) => new Date(a.ts || a.salida) - new Date(b.ts || b.salida));
  const aP = ausencias.filter(a => enRango(isoLocal(a.fecha))).sort((a, b) => isoLocal(a.fecha).localeCompare(isoLocal(b.fecha)));
  const lP = listas.filter(l => enRango(l.fecha));
  const dias = diasEntre(desde, hasta);
  const lectivos = dias.filter(esLectivo);
  let debidas = 0, firmadas = 0;
  const hoyISO = isoLocal();
  lectivos.filter(f => f <= hoyISO).forEach(f => {
    filasFirmasDia(f, equipo, firmas).filter(x => x.empezada).forEach(x => x.personas.forEach(pe => { debidas++; if (pe.firma) firmadas++; }));
  });
  const minutos = bP.map(minutosBano).filter(Boolean);
  const porDia = lectivos.map(f => ({
    fecha: f,
    leve: pP.filter(p => isoLocal(p.ts) === f && p.gravedad === "leve").length,
    grave: pP.filter(p => isoLocal(p.ts) === f && p.gravedad === "grave").length,
    muy_grave: pP.filter(p => isoLocal(p.ts) === f && p.gravedad === "muy_grave").length,
    banos: bP.filter(b => isoLocal(b.ts || b.salida) === f).length,
    ausencias: aP.filter(a => isoLocal(a.fecha) === f).length,
    horasAusencia: aP.filter(a => isoLocal(a.fecha) === f).reduce((s, a) => s + (a.horas?.length || 0), 0),
  })).map(d => ({ ...d, partes: d.leve + d.grave + d.muy_grave }));
  return {
    partes: pP, banos: bP, ausencias: aP, listas: lP, dias, lectivos, porDia,
    gravedad: { leve: pP.filter(p => p.gravedad === "leve").length, grave: pP.filter(p => p.gravedad === "grave").length, muy_grave: pP.filter(p => p.gravedad === "muy_grave").length },
    alumnosConParte: new Set(pP.map(p => p.alumnoId ?? p.alumno)).size,
    porGrupo: resumenPorGrupo(pP, tutores),
    porHora: HORAS.map(h => [h, pP.filter(p => p.hora === h).length]).filter(([, n]) => n > 0),
    porAlumno: contarPor(pP, p => `${p.alumno} (${p.curso})`).slice(0, 10),
    porTipificacion: contarPor(pP, etiquetaTip).slice(0, 8),
    porProfesorParte: contarPor(pP, "profesor").slice(0, 10),
    banosPorGrupo: contarPor(bP, "curso"),
    banosPorAlumno: contarPor(bP, b => `${b.alumno} (${b.curso})`).slice(0, 10),
    banoMedio: minutos.length ? Math.round(minutos.reduce((a, b) => a + b, 0) / minutos.length) : 0,
    banosLargos: minutos.filter(m => m > 10).length,
    ausenciasPorMotivo: contarPor(aP, "motivo"),
    ausenciasPorProfesor: contarPor(aP, "profesor"),
    horasAusencia: aP.reduce((s, a) => s + (a.horas?.length || 0), 0),
    profesoresAusentes: new Set(aP.map(a => a.profesor)).size,
    guardiasDebidas: debidas, guardiasFirmadas: firmadas,
    listasPasadas: lP.length, faltasEnListas: lP.reduce((s, l) => s + (l.ausentes?.length || 0), 0),
  };
}

// ─── PDF: estadísticas del periodo ───────────────────────────────────────────
function pdfEstadisticas(est, periodo, autor = "") {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = cabeceraPDF(doc, autor ? "Estadísticas de convivencia" : "Estadísticas del centro", `${periodo.texto} · ${autor || "Jefatura de Estudios"}`);
  const tituloSec = t => {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(...OSCURO); doc.text(t, 14, y); doc.setTextColor(0); y += 3;
  };
  const tabla = (head, body, extra = {}) => {
    autoTable(doc, { ...estiloTabla, startY: y, head: [head], body: body.length ? body.map(r => r.map(sinEmoji)) : [[...head.map((_, i) => i === 0 ? "Sin datos en este periodo" : "")]], ...extra });
    y = doc.lastAutoTable.finalY + 9;
  };
  const pct = (a, b) => b ? `${Math.round(100 * a / b)} %` : "-";
  tituloSec("Resumen");
  tabla(["Indicador", "Valor"], [
    ["Días lectivos del periodo", est.lectivos.length],
    ["Partes (total)", est.partes.length],
    ["   Leves / Graves / Muy graves", `${est.gravedad.leve} / ${est.gravedad.grave} / ${est.gravedad.muy_grave}`],
    ["Alumnos/as con algún parte", est.alumnosConParte],
    ["Media de partes por día lectivo", est.lectivos.length ? (est.partes.length / est.lectivos.length).toFixed(1) : "-"],
    ["Salidas al baño", est.banos.length],
    ["   Duración media / salidas de más de 10 min", `${est.banoMedio || "-"} min / ${est.banosLargos}`],
    ...(autor ? [] : [["Ausencias del profesorado", `${est.ausencias.length} (${est.horasAusencia} horas, ${est.profesoresAusentes} profesores/as)`],
    ["Firmas de guardia", `${est.guardiasFirmadas} de ${est.guardiasDebidas} (${pct(est.guardiasFirmadas, est.guardiasDebidas)})`],
    ["Listas pasadas en guardia / faltas anotadas", `${est.listasPasadas} / ${est.faltasEnListas}`]]),
  ].map(r => r.map(String)), { columnStyles: { 0: { cellWidth: 110, fontStyle: "bold" }, 1: { halign: "center" } } });
  if (est.porDia.length > 1) {
    tituloSec("Evolución por día");
    tabla(["Día", "Leves", "Graves", "Muy graves", "Partes", "Baños", ...(autor ? [] : ["Ausencias prof.", "Horas aus."])],
      est.porDia.map(d => [parseISO(d.fecha).toLocaleDateString("es-ES", { weekday: "short", day: "2-digit", month: "2-digit" }), d.leve, d.grave, d.muy_grave, d.partes, d.banos, ...(autor ? [] : [d.ausencias, d.horasAusencia])].map(String)),
      { styles: { ...estiloTabla.styles, halign: "center" } });
  }
  tituloSec("Partes por grupo y tutoría");
  tabla(["Grupo", "Tutor/a", "Leves", "Graves", "Muy graves", "Total"], est.porGrupo.map(r => [r.curso, r.tutor || "-", r.leve, r.grave, r.muy_grave, r.total].map(String)));
  tituloSec("Partes por hora de clase");
  tabla(["Hora", "Partes"], est.porHora.map(([h, n]) => [h, String(n)]));
  tituloSec("Alumnado con más partes");
  tabla(["Alumno/a", "Partes"], est.porAlumno.map(([k, n]) => [k, String(n)]));
  tituloSec("Faltas más frecuentes");
  tabla(["Tipificación", "Partes"], est.porTipificacion.map(([k, n]) => [k, String(n)]), { columnStyles: { 1: { cellWidth: 20, halign: "center" } } });
  tituloSec("Salidas al baño por grupo");
  tabla(["Grupo", "Salidas"], est.banosPorGrupo.map(([k, n]) => [k, String(n)]));
  if (!autor) {
  tituloSec("Ausencias del profesorado por motivo");
  tabla(["Motivo", "Ausencias"], est.ausenciasPorMotivo.map(([k, n]) => [k, String(n)]));
  tituloSec("Ausencias por profesor/a");
  tabla(["Profesor/a", "Ausencias"], est.ausenciasPorProfesor.map(([k, n]) => [k, String(n)]));
  }
  guardarPDF(doc, `estadisticas-${periodo.desde}${periodo.hasta !== periodo.desde ? `-a-${periodo.hasta}` : ""}.pdf`);
}

// ─── PDF: ausencias del profesorado ──────────────────────────────────────────
function pdfAusencias(ausencias, periodo) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
  let y = cabeceraPDF(doc, "Ausencias del profesorado", `${periodo.texto} · Jefatura de Estudios`);
  const horas = ausencias.reduce((s, a) => s + (a.horas?.length || 0), 0);
  doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.text(`Total: ${ausencias.length} ausencias · ${horas} horas lectivas · ${new Set(ausencias.map(a => a.profesor)).size} profesores/as`, 14, y);
  autoTable(doc, { ...estiloTabla, startY: y + 4,
    head: [["Fecha", "Profesor/a", "Motivo", "Horas", "Grupo / aula", "Asignatura", "Tarea para el alumnado", "Dónde está la tarea"]],
    body: ausencias.length ? ausencias.map(a => [fmtD(parseISO(a.fecha)), a.profesor, a.motivo, (a.horas || []).join(", "), a.aula || "-", a.asignatura || "-", a.tarea || "-", [a.ubicacion, a.enlace].filter(Boolean).join(" · ") || "-"].map(sinEmoji)) : [["-", "No hay ausencias en este periodo", "", "", "", "", "", ""]],
    columnStyles: { 0: { cellWidth: 22 }, 1: { cellWidth: 34 }, 2: { cellWidth: 26 }, 3: { cellWidth: 30 }, 4: { cellWidth: 24 }, 5: { cellWidth: 26 }, 7: { cellWidth: 34 } } });
  guardarPDF(doc, `ausencias-profesorado-${periodo.desde}${periodo.hasta !== periodo.desde ? `-a-${periodo.hasta}` : ""}.pdf`);
}

// ─── Excel (.xlsx) con todos los datos del periodo, una hoja por tema ─────────
// La librería se carga solo al pulsar el botón, para que la aplicación no pese más.
// No incluye el contacto de las familias (RGPD): solo lo necesario para analizar.
async function excelPeriodo(est, periodo, tutores = {}, alumnos = [], soloAlumnado = false) {
  // Primero se preparan las hojas; luego se ven en pantalla y/o se descargan
  const hojas = [];
  const hoja = (nombre, cabecera, filas, anchos) => hojas.push({ nombre, cabecera, filas, anchos });
  const fecha = d => fmtD(parseISO(d));
  const gLabel = g => ({ leve: "Leve", grave: "Grave", muy_grave: "Muy grave" })[g] || g;

  hoja("Resumen", ["Indicador", "Valor"], [
    ["Periodo", periodo.texto], ["Días lectivos", est.lectivos.length],
    ["Partes", est.partes.length], ["Leves", est.gravedad.leve], ["Graves", est.gravedad.grave], ["Muy graves", est.gravedad.muy_grave],
    ["Alumnos/as con parte", est.alumnosConParte], ["Salidas al baño", est.banos.length], ["Duración media del baño (min)", est.banoMedio || ""],
    ...(soloAlumnado ? [] : [["Ausencias del profesorado", est.ausencias.length], ["Horas de ausencia", est.horasAusencia],
    ["Guardias firmadas", est.guardiasFirmadas], ["Guardias que había que firmar", est.guardiasDebidas],
    ["Listas pasadas en guardia", est.listasPasadas], ["Faltas anotadas en esas listas", est.faltasEnListas]]),
  ], [34, 50]);

  hoja("Por día", ["Fecha", "Día", "Partes leves", "Partes graves", "Partes muy graves", "Total partes", "Salidas al baño", ...(soloAlumnado ? [] : ["Ausencias profesorado", "Horas de ausencia"])],
    est.porDia.map(d => [fecha(d.fecha), DIAS_ES[parseISO(d.fecha).getDay()], d.leve, d.grave, d.muy_grave, d.partes, d.banos, ...(soloAlumnado ? [] : [d.ausencias, d.horasAusencia])]),
    [12, 11, 12, 12, 16, 12, 14, 20, 16]);

  hoja("Partes", ["Ref.", "Fecha", "Hora registro", "Hora de clase", "Alumno/a", "Grupo", "Tutor/a", "Correo del tutor/a", "Tipo", "Gravedad", "Falta tipificada", "Normativa", "Profesor/a", "Descripción", "Parte de grupo"],
    est.partes.map(p => [`PARTE-${p.id}`, fecha(p.ts), horaCorta(p.ts), p.hora || "", p.alumno, p.curso, tutorDeParte(p, tutores), p.tutorEmail || tutores[p.curso]?.email || "",
      p.tipo || "", gLabel(p.gravedad), etiquetaTip(p), p.gravedad === "leve" ? "Plan de Convivencia" : "Decreto 32/2019 CAM", p.profesor || "", p.descripcion || "", p.esGrupal ? "Sí" : "No"]),
    [12, 11, 8, 10, 28, 10, 20, 28, 16, 10, 50, 18, 20, 60, 8]);

  // Una fila por alumno con parte o salida al baño en el periodo
  const claves = new Map();
  [...est.partes, ...est.banos].forEach(x => { const k = `${x.alumno}|${x.curso}`; if (!claves.has(k)) claves.set(k, { alumno: x.alumno, curso: x.curso }); });
  const filasAlumno = [...claves.values()].map(({ alumno, curso }) => {
    const pa = est.partes.filter(p => p.alumno === alumno && p.curso === curso);
    const ba = est.banos.filter(b => b.alumno === alumno && b.curso === curso);
    const cuenta = g => pa.filter(p => p.gravedad === g).length;
    const faltaTop = contarPor(pa, etiquetaTip)[0];
    const tutor = tutores[curso]?.tutor || alumnos.find(a => a.nombre === alumno)?.tutor || "";
    return [alumno, curso, tutor, cuenta("leve"), cuenta("grave"), cuenta("muy_grave"), pa.length, faltaTop ? faltaTop[0] : "", ba.length,
      pa.length ? fecha(pa.reduce((m, p) => p.ts > m ? p.ts : m, pa[0].ts)) : ""];
  }).sort((a, b) => b[6] - a[6] || b[8] - a[8] || a[1].localeCompare(b[1]) || a[0].localeCompare(b[0]));
  hoja("Por alumno", ["Alumno/a", "Grupo", "Tutor/a", "Leves", "Graves", "Muy graves", "Total partes", "Falta más repetida", "Salidas al baño", "Último parte"],
    filasAlumno, [28, 10, 20, 7, 7, 10, 11, 50, 13, 12]);

  hoja("Por grupo", ["Grupo", "Tutor/a", "Correo del tutor/a", "Leves", "Graves", "Muy graves", "Total partes", "Salidas al baño"],
    est.porGrupo.map(r => [r.curso, r.tutor || "", r.email || "", r.leve, r.grave, r.muy_grave, r.total, est.banos.filter(b => b.curso === r.curso).length]),
    [10, 22, 28, 7, 7, 10, 11, 13]);

  hoja("Baños", ["Fecha", "Salida", "Regreso", "Minutos fuera", "Alumno/a", "Grupo", "Autorizado por"],
    est.banos.map(b => [fecha(b.ts || b.salida), horaCorta(b.salida || b.ts), b.regreso ? horaCorta(b.regreso) : "Sin regreso", minutosBano(b) ?? "", b.alumno, b.curso, b.profesor || ""]),
    [11, 8, 11, 12, 28, 10, 22]);

  if (!soloAlumnado) hoja("Ausencias profesorado", ["Fecha", "Día", "Profesor/a", "Motivo", "Horas", "Nº de horas", "Grupo / aula", "Edificio", "Asignatura", "Tarea para el alumnado", "Dónde está la tarea", "Enlace"],
    est.ausencias.map(a => [fecha(a.fecha), DIAS_ES[parseISO(a.fecha).getDay()], a.profesor, a.motivo || "", (a.horas || []).join(", "), (a.horas || []).length, a.aula || "", a.edificio || "", a.asignatura || "", a.tarea || "", a.ubicacion || "", a.enlace || ""]),
    [11, 10, 22, 16, 26, 10, 12, 8, 16, 50, 22, 30]);

  if (!soloAlumnado) hoja("Listas de guardia", ["Fecha", "Hora", "Grupo", "Profesor/a de guardia", "Pasada a las", "Nº de faltas", "Alumnado que faltaba"],
    est.listas.slice().sort((a, b) => a.fecha.localeCompare(b.fecha) || HORAS.indexOf(a.hora) - HORAS.indexOf(b.hora))
      .map(l => [fecha(l.fecha), l.hora, l.curso, l.profesor, horaCorta(l.ts), (l.ausentes || []).length, (l.ausentes || []).map(x => x.nombre).join(", ")]),
    [11, 9, 10, 22, 11, 11, 60]);

  const archivo = `galvandesk-datos-${periodo.desde}${periodo.hasta !== periodo.desde ? `-a-${periodo.hasta}` : ""}.xlsx`;
  const descargar = async () => {
    const XLSX = await import("xlsx");
    const libro = XLSX.utils.book_new();
    hojas.forEach(({ nombre, cabecera, filas, anchos }) => {
      const h = XLSX.utils.aoa_to_sheet([cabecera, ...(filas.length ? filas : [["Sin datos en este periodo"]])]);
      h["!cols"] = anchos.map(w => ({ wch: w }));
      h["!autofilter"] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: Math.max(1, filas.length), c: cabecera.length - 1 } }) };
      XLSX.utils.book_append_sheet(libro, h, nombre);
    });
    XLSX.writeFile(libro, archivo);
  };
  if (visor.excel) visor.excel({ hojas, archivo, descargar: () => descargar().catch(() => window.alert("No se ha podido crear el Excel. Inténtalo de nuevo.")) });
  else await descargar();
}

// Barras horizontales sencillas
function Barras({ datos, color = "#44a194", vacio = "Sin datos en este periodo.", onClick }) {
  const max = Math.max(1, ...datos.map(d => d[1]));
  if (!datos.length) return <div style={{ fontSize: 13, color: "#64748b" }}>{vacio}</div>;
  return (
    <div>
      {datos.map(([k, n, clave]) => (
        <div key={k} onClick={onClick ? () => onClick(clave ?? k, k) : undefined} role={onClick ? "button" : undefined} title={onClick ? "Pulsa para ver estos partes" : undefined}
          onMouseOver={onClick ? e => { e.currentTarget.style.background = "#f1f5f9"; } : undefined} onMouseOut={onClick ? e => { e.currentTarget.style.background = "transparent"; } : undefined}
          style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(60px,1.2fr) 34px", gap: 8, alignItems: "center", marginBottom: 2, padding: "2px 4px", borderRadius: 6, fontSize: 12, cursor: onClick ? "pointer" : "default" }}>
          <div title={k} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#2c4a52" }}>{k}</div>
          <div style={{ background: "#eef2f4", borderRadius: 6, height: 12 }}><div style={{ width: `${(100 * n) / max}%`, background: color, height: "100%", borderRadius: 6 }} /></div>
          <div style={{ textAlign: "right", fontWeight: 700, color: "#2c4a52" }}>{n}</div>
        </div>
      ))}
    </div>
  );
}

// Ventana con el detalle de un conjunto de partes (un día, un grupo, una falta…)
function DetallePartes({ titulo, subtitulo, partes, tutores, onVerParte, onCerrar, C }) {
  useEffect(() => { const f = e => { if (e.key === "Escape") onCerrar(); }; window.addEventListener("keydown", f); return () => window.removeEventListener("keydown", f); }, [onCerrar]);
  const g = { leve: partes.filter(p => p.gravedad === "leve").length, grave: partes.filter(p => p.gravedad === "grave").length, muy_grave: partes.filter(p => p.gravedad === "muy_grave").length };
  const faltas = contarPor(partes, etiquetaTip);
  const top = faltas[0];
  const h3 = { margin: "0 0 10px", color: C.dark, fontSize: 15 };
  const caja = { background: C.white, borderRadius: 12, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" };
  const ordenados = [...partes].sort((a, b) => new Date(a.ts) - new Date(b.ts));
  return (
    <div onClick={onCerrar} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 150, display: "flex", alignItems: "stretch", justifyContent: "center", padding: "3vh 2vw" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.cream, borderRadius: 16, width: "100%", maxWidth: 1200, overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 2, background: `linear-gradient(90deg,${C.dark},${C.blue})`, color: "#fff", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{titulo}</div>
            {subtitulo && <div style={{ fontSize: 12, opacity: .85 }}>{subtitulo}</div>}
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            {partes.length > 0 && <button onClick={() => pdfInformePartes(ordenados, `${titulo}${subtitulo ? ` · ${subtitulo}` : ""}`, tutores)} style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>⬇️ PDF</button>}
            <button onClick={onCerrar} aria-label="Cerrar" style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>
        </div>
        <div style={{ padding: 20 }}>
          {partes.length === 0 ? <div style={{ ...caja, textAlign: "center", color: C.gray }}>No hay partes.</div> : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 14 }}>
                {[{ n: partes.length, t: "Partes", c: C.dark }, { n: g.leve, t: "Leves", c: C.teal }, { n: g.grave, t: "Graves", c: C.amber }, { n: g.muy_grave, t: "Muy graves", c: C.salmon }, { n: new Set(partes.map(p => p.alumnoId ?? p.alumno)).size, t: "Alumnos/as", c: C.blue }].map(k => (
                  <div key={k.t} style={{ ...caja, borderTop: `4px solid ${k.c}`, padding: 12 }}><div style={{ fontSize: 26, fontWeight: 800, color: C.dark }}>{k.n}</div><div style={{ fontSize: 13, fontWeight: 700, color: C.gray }}>{k.t}</div></div>
                ))}
              </div>
              {top && (
                <div style={{ ...caja, marginBottom: 14, borderLeft: `5px solid ${C.amber}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.amber, textTransform: "uppercase", letterSpacing: .5 }}>La falta que más se repite</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginTop: 4 }}>{top[0]}</div>
                  <div style={{ fontSize: 13, color: C.gray, marginTop: 2 }}>{top[1]} de {partes.length} partes ({Math.round(100 * top[1] / partes.length)} %)</div>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14, marginBottom: 14 }}>
                <div style={caja}><h3 style={h3}>📑 Motivos (faltas tipificadas)</h3><Barras datos={faltas} color={C.amber} vacio="Sin tipificar." /></div>
                <div style={caja}><h3 style={h3}>🏫 Por grupo</h3><Barras datos={contarPor(partes, "curso")} /></div>
                <div style={caja}><h3 style={h3}>🕐 Por hora de clase</h3><Barras datos={HORAS.map(h => [h, partes.filter(p => p.hora === h).length]).filter(([, n]) => n)} color={C.blue} /></div>
                <div style={caja}><h3 style={h3}>👤 Alumnado</h3><Barras datos={contarPor(partes, p => `${p.alumno} (${p.curso})`).slice(0, 10)} color={C.salmon} /></div>
                <div style={caja}><h3 style={h3}>👨‍🏫 Profesorado que pone el parte</h3><Barras datos={contarPor(partes, "profesor").slice(0, 10)} color="#8b5cf6" /></div>
              </div>
              <h3 style={{ ...h3, marginTop: 6 }}>📋 Los {partes.length} partes <span style={{ fontWeight: 500, fontSize: 12, color: C.gray }}>· pulsa uno para verlo en grande</span></h3>
              {ordenados.map(p => <ParteCard key={p.id} parte={p} onVer={() => onVerParte(p)} onPrint={() => pdfParte(p)} />)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Informe para la familia de un alumno/a (PDF y texto para el correo) ─────
function datosFamilia(alumno, partes, banos) {
  const g = gr => partes.filter(p => p.gravedad === gr).length;
  return { leve: g("leve"), grave: g("grave"), muy_grave: g("muy_grave"), faltas: contarPor(partes, etiquetaTip), banos: banos.length,
    tutor: partes.find(p => p.tutor)?.tutor || alumno.tutor || "", ordenados: [...partes].sort((a, b) => new Date(a.ts) - new Date(b.ts)) };
}
function textoInformeFamilia(alumno, partes, banos, periodo, remitente, tutores = {}) {
  const d = datosFamilia(alumno, partes, banos);
  const tutor = tutores[alumno.curso]?.tutor || d.tutor;
  const lineas = d.ordenados.map(p => `• ${fmtD(p.ts)} (${p.hora || "hora no indicada"}) · ${sinEmoji(gObj(p.gravedad)?.label)} · ${etiquetaTip(p) || p.tipo}\n  ${p.descripcion}`).join("\n");
  const firma = remitente || tutor || "El equipo docente";
  return `Estimada familia de ${alumno.nombre} (${alumno.curso}):

Les escribimos desde el IES Enrique Tierno Galván para informarles de la convivencia de ${alumno.nombre} durante ${periodo.texto}.

Resumen:
- Partes: ${partes.length} (${d.leve} leves, ${d.grave} graves y ${d.muy_grave} muy graves)${d.faltas[0] ? `\n- Lo que más se repite: ${d.faltas[0][0]} (${d.faltas[0][1]} ${d.faltas[0][1] === 1 ? "vez" : "veces"})` : ""}
- Salidas al baño durante las clases: ${d.banos}
${partes.length ? `\nDetalle de los partes:\n${lineas}\n` : "\nNo tiene ningún parte en este periodo.\n"}${banos.length ? `\nSalidas al baño durante las clases:\n${[...banos].sort((a, b) => new Date(a.salida || a.ts) - new Date(b.salida || b.ts)).map(b => `• ${fmtD(b.salida || b.ts)} · salió a las ${horaCorta(b.salida || b.ts)}${b.regreso ? `, volvió a las ${horaCorta(b.regreso)} (${minutosBano(b)} min)` : ""}${b.profesor ? ` · con ${b.profesor}` : ""}`).join("\n")}\n` : ""}
Nos gustaría hablar con ustedes para trabajar juntos. Pueden responder a este correo para concertar una cita.

Un saludo,
${firma}${tutor && firma !== tutor ? `\n(Tutor/a del grupo: ${tutor})` : tutor ? "\nTutor/a del grupo" : ""}`;
}
function pdfInformeFamilia(alumno, partes, banos, periodo, tutores = {}, remitente = "") {
  const d = datosFamilia(alumno, partes, banos);
  const tutor = tutores[alumno.curso]?.tutor || d.tutor;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  let y = cabeceraPDF(doc, "Informe de convivencia para la familia", periodo.texto[0].toUpperCase() + periodo.texto.slice(1));
  autoTable(doc, { ...estiloTabla, startY: y, theme: "grid", columnStyles: { 0: { fontStyle: "bold", cellWidth: 48, fillColor: [238, 245, 248] } },
    body: [["Alumno/a", alumno.nombre], ["Grupo", alumno.curso], ["Tutor/a", tutor || "-"], ["Correo del tutor/a", tutores[alumno.curso]?.email || "-"]].map(r => r.map(sinEmoji)) });
  y = doc.lastAutoTable.finalY + 8;
  doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(...OSCURO); doc.text("Resumen", 14, y); doc.setTextColor(0);
  autoTable(doc, { ...estiloTabla, startY: y + 3, head: [["Partes", "Leves", "Graves", "Muy graves", "Salidas al baño"]],
    body: [[partes.length, d.leve, d.grave, d.muy_grave, d.banos].map(String)], styles: { ...estiloTabla.styles, halign: "center", fontSize: 11 } });
  y = doc.lastAutoTable.finalY + 6;
  if (d.faltas.length) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.text("Conductas que más se repiten:", 14, y); y += 5;
    doc.setFont("helvetica", "normal");
    d.faltas.slice(0, 3).forEach(([k, n]) => { const l = doc.splitTextToSize(`• ${sinEmoji(k)} (${n})`, w - 28); doc.text(l, 14, y); y += l.length * 5; });
    y += 3;
  }
  doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(...OSCURO); doc.text("Detalle de los partes", 14, y); doc.setTextColor(0);
  autoTable(doc, { ...estiloTabla, startY: y + 3, head: [["Fecha", "Hora", "Gravedad", "Conducta", "Profesor/a", "Qué ocurrió"]],
    body: d.ordenados.length ? d.ordenados.map(p => [fmtD(p.ts), p.hora || "-", sinEmoji(gObj(p.gravedad)?.label), etiquetaTip(p) || p.tipo, p.profesor, p.descripcion].map(sinEmoji)) : [["-", "-", "-", "Ningún parte en este periodo", "-", "-"]],
    columnStyles: { 0: { cellWidth: 19 }, 1: { cellWidth: 15 }, 2: { cellWidth: 18 }, 3: { cellWidth: 45 }, 4: { cellWidth: 26 } } });
  y = doc.lastAutoTable.finalY + 8;
  if (banos.length) {
    if (y > 250) { doc.addPage(); y = 24; }
    const ordB = [...banos].sort((a, b) => new Date(a.salida || a.ts) - new Date(b.salida || b.ts));
    const mins = ordB.map(minutosBano).filter(Boolean);
    doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(...OSCURO);
    doc.text(`Salidas al baño durante las clases (${banos.length}${mins.length ? ` · ${Math.round(mins.reduce((a, b) => a + b, 0) / mins.length)} min de media` : ""})`, 14, y); doc.setTextColor(0);
    autoTable(doc, { ...estiloTabla, startY: y + 3, head: [["Fecha", "Salida", "Regreso", "Minutos fuera", "Con el profesor/a"]],
      body: ordB.map(b => [fmtD(b.salida || b.ts), horaCorta(b.salida || b.ts), b.regreso ? horaCorta(b.regreso) : "Sin anotar", minutosBano(b) ?? "-", b.profesor || "-"].map(v => sinEmoji(String(v)))),
      didParseCell: c => { if (c.section === "body" && c.column.index === 3 && Number(c.cell.raw) > 10) { c.cell.styles.textColor = [180, 83, 9]; c.cell.styles.fontStyle = "bold"; } } });
    y = doc.lastAutoTable.finalY + 8;
  }
  if (y > 240) { doc.addPage(); y = 24; }
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  const cierre = doc.splitTextToSize("Les enviamos este informe para mantenerles informados y trabajar juntos. Pueden solicitar una reunión con el tutor/a o con Jefatura de Estudios.", w - 28);
  doc.text(cierre, 14, y); y += cierre.length * 5 + 18;
  doc.setDrawColor(150); doc.setLineWidth(0.3); doc.line(14, y, 90, y); doc.line(120, y, 196, y);
  doc.setFontSize(9); doc.setTextColor(...GRIS);
  doc.text(sinEmoji(remitente || tutor || "Tutor/a"), 14, y + 5); doc.text("Recibí (familia)", 120, y + 5);
  guardarPDF(doc, `informe-familia-${nombreArchivo(alumno.nombre)}-${periodo.desde}.pdf`);
}

// Botones para contactar con la familia de un alumno/a
function ContactoFamilia({ alumno, partes, banos, periodo, tutores, remitente, C }) {
  const [copiado, setCopiado] = useState("");
  const copiar = async (texto, que) => {
    try { await navigator.clipboard.writeText(texto); setCopiado(que); setTimeout(() => setCopiado(""), 2000); }
    catch { window.prompt("Copia el texto:", texto); }
  };
  if (!alumno) return null;
  const correos = [alumno.email, tutores[alumno.curso]?.email].filter(Boolean).join(", ");
  const btn = { flex: "1 1 150px", padding: "10px 12px", borderRadius: 10, border: `2px solid ${C.teal}`, background: "#F0FAF7", color: C.dark, fontWeight: 700, fontSize: 12, cursor: "pointer" };
  return (
    <div style={{ background: "#FFFBEB", border: "1px solid #fcd34d", borderRadius: 10, padding: 12, marginTop: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, marginBottom: 2 }}>📨 Contactar con la familia</div>
      <div style={{ fontSize: 12, color: C.gray, marginBottom: 8 }}>✉️ {alumno.email || "sin correo"} · 📱 {alumno.telefono || "sin teléfono"}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button style={btn} onClick={() => pdfInformeFamilia(alumno, partes, banos, periodo, tutores, remitente)}>📄 Ver informe para la familia</button>
        <button style={btn} onClick={() => copiar(textoInformeFamilia(alumno, partes, banos, periodo, remitente, tutores), "texto")}>{copiado === "texto" ? "✅ Copiado" : "📋 Copiar texto del correo"}</button>
        <button style={btn} disabled={!correos} onClick={() => copiar(correos, "correos")}>{copiado === "correos" ? "✅ Copiado" : "📧 Copiar correos"}</button>
      </div>
      <div style={{ fontSize: 11, color: C.gray, marginTop: 8 }}>Escribe desde tu correo del centro: pega el texto y adjunta el PDF. «Copiar correos» incluye la familia y el tutor/a.</div>
    </div>
  );
}

// ─── Avisos a familias: alumnado con muchos partes en el trimestre ───────────
const UMBRAL_AVISO = 3;
// Trimestres del curso: septiembre-diciembre, enero-marzo y abril-junio
function trimestreDe(fecha = new Date()) {
  const d = parseISO(fecha), y = d.getFullYear(), m = d.getMonth();
  const [n, ini, fin] = m >= 8 ? [1, new Date(y, 8, 1), new Date(y, 11, 31)] : m <= 2 ? [2, new Date(y, 0, 1), new Date(y, 2, 31)] : [3, new Date(y, 3, 1), new Date(y, 7, 31)];
  const texto = `el ${n}º trimestre (${n === 1 ? "septiembre a diciembre" : n === 2 ? "enero a marzo" : "abril a junio"} de ${y})`;
  return { n, desde: isoLocal(ini), hasta: isoLocal(fin), texto, clave: `${y}-T${n}` };
}
// Devuelve el alumnado que ha llegado al umbral: por los partes que he puesto yo y, si soy tutor/a, por los de mi grupo
function alumnosParaAvisar({ partes, usuario, tutores = {}, avisos = {}, umbral = UMBRAL_AVISO }) {
  const tri = trimestreDe();
  const misTutorias = Object.entries(tutores).filter(([, t]) => t?.tutor === usuario).map(([c]) => c);
  const delTri = partes.filter(p => { const f = isoLocal(p.ts); return f >= tri.desde && f <= tri.hasta; });
  const lista = [];
  const agrupar = (ps, ambito) => {
    const porAlumno = new Map();
    ps.forEach(p => { const k = p.alumnoId ?? p.alumno; if (!porAlumno.has(k)) porAlumno.set(k, []); porAlumno.get(k).push(p); });
    porAlumno.forEach((ps2, k) => {
      if (ps2.length < umbral) return;
      const id = `${usuario}|${ambito}|${k}|${tri.clave}`;
      const aviso = avisos[id];
      lista.push({ id, alumnoId: ps2[0].alumnoId, alumno: ps2[0].alumno, curso: ps2[0].curso, ambito, partes: ps2, n: ps2.length,
        graves: ps2.filter(p => p.gravedad !== "leve").length, aviso, pendiente: !aviso || ps2.length > aviso.n });
    });
  };
  agrupar(delTri.filter(p => p.profesor === usuario), "mios");
  misTutorias.forEach(c => agrupar(delTri.filter(p => p.curso === c), `tutoria:${c}`));
  return { tri, lista: lista.sort((a, b) => b.pendiente - a.pendiente || b.n - a.n) };
}

function PanelAvisos({ partes, alumnos, banos, usuario, tutores, avisos, setAvisos, onVerPartes, C }) {
  const { tri, lista } = alumnosParaAvisar({ partes, usuario, tutores, avisos });
  const [abierto, setAbierto] = useState(null);
  const [verHechos, setVerHechos] = useState(false);
  const pendientes = lista.filter(x => x.pendiente), hechos = lista.filter(x => !x.pendiente);
  const marcar = x => setAvisos(prev => ({ ...prev, [x.id]: { n: x.n, ts: new Date().toISOString(), por: usuario } }));
  const deshacer = x => setAvisos(prev => { const r = { ...prev }; delete r[x.id]; return r; });
  const tarjeta = (x) => {
    const al = alumnos.find(a => a.id === x.alumnoId) || { id: x.alumnoId, nombre: x.alumno, curso: x.curso };
    const banosAl = banos.filter(b => b.alumno === x.alumno && b.curso === x.curso && isoLocal(b.ts || b.salida) >= tri.desde && isoLocal(b.ts || b.salida) <= tri.hasta);
    return (
      <div key={x.id} style={{ background: C.white, borderRadius: 10, padding: 12, marginBottom: 8, borderLeft: `4px solid ${x.pendiente ? C.salmon : C.teal}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, color: C.dark, fontSize: 15 }}>{x.alumno} <span style={{ fontWeight: 500, color: C.gray, fontSize: 13 }}>· {x.curso}</span></div>
            <div style={{ fontSize: 12, color: C.gray }}>
              <b style={{ color: C.salmon }}>{x.n} partes</b> este trimestre{x.graves ? ` (${x.graves} graves o muy graves)` : ""} · {x.ambito === "mios" ? "puestos por ti" : `en tu tutoría`}
              {x.aviso && <> · {x.pendiente ? `avisada con ${x.aviso.n}, hay ${x.n - x.aviso.n} nuevo(s)` : `✅ familia avisada el ${fmtD(x.aviso.ts)}`}</>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button onClick={() => onVerPartes(x)} style={{ background: "#EEF5F8", color: C.blue, border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>👁 Ver partes</button>
            <button onClick={() => setAbierto(abierto === x.id ? null : x.id)} style={{ background: "#FFFBEB", color: "#92400e", border: "1px solid #fcd34d", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>📨 Avisar a la familia</button>
            {x.pendiente
              ? <button onClick={() => marcar(x)} style={{ background: C.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>✅ Ya he avisado</button>
              : <button onClick={() => deshacer(x)} style={{ background: "none", color: C.gray, border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 12 }}>Deshacer</button>}
          </div>
        </div>
        {abierto === x.id && <ContactoFamilia alumno={al} partes={x.partes} banos={banosAl} periodo={tri} tutores={tutores} remitente={usuario} C={C} />}
      </div>
    );
  };
  return (
    <div className="no-print" style={{ background: pendientes.length ? "#FDF0EF" : "#F0FAF7", border: `2px solid ${pendientes.length ? C.salmon : C.teal}`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
      <div style={{ fontWeight: 800, color: C.dark, fontSize: 16, marginBottom: 4 }}>
        🔔 {pendientes.length ? `${pendientes.length} alumno/a(s) con ${UMBRAL_AVISO} o más partes: conviene avisar a su familia` : "Avisos a familias"}
      </div>
      <div style={{ fontSize: 12, color: C.gray, marginBottom: 10 }}>
        Alumnado con {UMBRAL_AVISO} o más partes en {tri.texto}: los que has puesto tú{Object.values(tutores).some(t => t?.tutor === usuario) ? " y los de tu tutoría" : ""}. Cuando avises, pulsa «Ya he avisado». Si luego tiene más partes, volverá a aparecer.
      </div>
      {pendientes.length === 0 && <div style={{ fontSize: 13, color: C.teal, fontWeight: 700, marginBottom: hechos.length ? 8 : 0 }}>✅ No tienes avisos pendientes.</div>}
      {pendientes.map(tarjeta)}
      {hechos.length > 0 && (
        <>
          <button onClick={() => setVerHechos(v => !v)} style={{ background: "none", border: "none", color: C.blue, cursor: "pointer", fontSize: 13, fontWeight: 700, padding: 0, marginTop: 4 }}>
            {verHechos ? "▾" : "▸"} Familias ya avisadas ({hechos.length})
          </button>
          {verHechos && <div style={{ marginTop: 8 }}>{hechos.map(tarjeta)}</div>}
        </>
      )}
    </div>
  );
}

function EstadisticasDocumentos({ avisos = {}, setAvisos, modo = "jefatura", usuario = "", partes: partesTodos, banos: banosTodos, ausencias: ausTodas, firmas: firmasTodas, listas: listasTodas, alumnos: alumnosTodos, profesores, cuadrante, apoyosGuardia, sustitutosGuardia, tutores, onVerParte, C, inpStyle, selStyle, labelStyle }) {
  const [detalle, setDetalle] = useState(null); // { titulo, subtitulo, partes }
  // Profesorado: solo ve los partes que ha puesto y, si es tutor/a, los de su grupo
  const esProfe = modo === "profesor";
  const misTutorias = esProfe ? Object.entries(tutores || {}).filter(([, t]) => t?.tutor === usuario).map(([c]) => c).sort() : [];
  const [ambito, setAmbito] = useState(() => misTutorias[0] || "mios");
  const ambitoOk = ambito === "mios" || misTutorias.includes(ambito) ? ambito : "mios";
  const partes = !esProfe ? partesTodos : ambitoOk === "mios" ? partesTodos.filter(p => p.profesor === usuario) : partesTodos.filter(p => p.curso === ambitoOk);
  const banos = !esProfe ? banosTodos : ambitoOk === "mios" ? banosTodos.filter(b => b.profesor === usuario) : banosTodos.filter(b => b.curso === ambitoOk);
  const ausencias = esProfe ? [] : ausTodas, firmas = esProfe ? [] : firmasTodas, listas = esProfe ? [] : listasTodas;
  const alumnos = !esProfe ? alumnosTodos : ambitoOk === "mios" ? alumnosTodos.filter(a => partes.some(p => p.alumnoId === a.id) || banos.some(b => b.alumno === a.nombre && b.curso === a.curso)) : alumnosTodos.filter(a => a.curso === ambitoOk);
  const [tipo, setTipo] = useState("dia");
  const [ref, setRef] = useState(isoLocal());
  const [desdeLibre, setDesdeLibre] = useState(isoLocal(sumarDias(new Date(), -14)));
  const [hastaLibre, setHastaLibre] = useState(isoLocal());
  const [alumnoDoc, setAlumnoDoc] = useState("");
  const [grupoDoc, setGrupoDoc] = useState("");
  const [profDoc, setProfDoc] = useState("");
  const periodo = calcularPeriodo(tipo, ref, desdeLibre, hastaLibre);
  const equipo = { profesores, cuadrante: esProfe ? {} : cuadrante, apoyos: apoyosGuardia, sustitutos: sustitutosGuardia, ausencias };
  const est = estadisticasPeriodo({ ...periodo, partes, banos, ausencias, firmas, listas, equipo, tutores });
  const cursos = [...new Set(alumnos.map(a => a.curso))].sort();
  const pct = (a, b) => b ? Math.round(100 * a / b) : null;
  const maxDia = Math.max(1, ...est.porDia.map(d => d.partes));
  const periodoTxt = periodo.texto[0].toUpperCase() + periodo.texto.slice(1);
  const abrirDia = f => setDetalle({ titulo: `Partes del ${parseISO(f).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`, partes: est.partes.filter(p => isoLocal(p.ts) === f) });
  const abrir = (titulo, filtro) => setDetalle({ titulo, subtitulo: periodoTxt, partes: est.partes.filter(filtro) });

  const tarjeta = { background: C.white, borderRadius: 12, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 14 };
  const h3 = { margin: "0 0 12px", color: C.dark, fontSize: 15 };
  const btnDoc = (activo = true) => ({ display: "block", width: "100%", textAlign: "left", padding: "11px 14px", borderRadius: 10, border: `2px solid ${activo ? C.teal : "#e2e8f0"}`, background: activo ? "#F0FAF7" : "#f8fafc", color: activo ? C.dark : C.gray, cursor: activo ? "pointer" : "not-allowed", fontWeight: 700, fontSize: 13 });
  const sub = { display: "block", fontWeight: 500, fontSize: 11, color: C.gray, marginTop: 2 };

  const partesAlumno = est.partes.filter(p => String(p.alumnoId) === alumnoDoc);
  const partesGrupo = est.partes.filter(p => p.curso === grupoDoc);
  const ausProf = est.ausencias.filter(a => a.profesor === profDoc);
  const alumnoObj = alumnos.find(a => String(a.id) === alumnoDoc);
  const nombreAlumno = alumnoObj?.nombre || "";
  const banosAlumno = est.banos.filter(b => alumnoObj && b.alumno === alumnoObj.nombre && b.curso === alumnoObj.curso);

  return (
    <div>
      <h2 style={{ color: C.dark, marginTop: 0 }}>📈 {esProfe ? "Mis estadísticas e informes" : "Estadísticas y documentos"}</h2>
      {esProfe && (
        <div className="no-print" style={{ ...tarjeta, borderLeft: `5px solid ${C.teal}` }}>
          <label style={labelStyle}>¿Qué partes quieres analizar?</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[...misTutorias.map(c => ({ id: c, txt: `🏫 Mi tutoría: ${c}`, sub: "Todos los partes del grupo, los ponga quien los ponga" })), { id: "mios", txt: "👤 Los partes que he puesto yo", sub: "En todos los grupos a los que doy clase" }].map(o => (
              <button key={o.id} onClick={() => { setAmbito(o.id); setAlumnoDoc(""); setGrupoDoc(""); }}
                style={{ flex: "1 1 220px", textAlign: "left", padding: "10px 14px", borderRadius: 10, border: `2px solid ${ambitoOk === o.id ? C.teal : "#e2e8f0"}`, background: ambitoOk === o.id ? "#F0FAF7" : C.white, cursor: "pointer" }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.dark }}>{o.txt}</div>
                <div style={{ fontSize: 11, color: C.gray }}>{o.sub}</div>
              </button>
            ))}
          </div>
          {!misTutorias.length && <div style={{ fontSize: 12, color: C.gray, marginTop: 8 }}>Si eres tutor/a y no aparece tu grupo, pide a Administración que te asigne la tutoría.</div>}
        </div>
      )}
      {detalle && <DetallePartes {...detalle} tutores={tutores} onVerParte={onVerParte} onCerrar={() => setDetalle(null)} C={C} />}
      {esProfe && setAvisos && <PanelAvisos partes={partesTodos} alumnos={alumnosTodos} banos={banosTodos} usuario={usuario} tutores={tutores} avisos={avisos} setAvisos={setAvisos} C={C}
        onVerPartes={x => setDetalle({ titulo: `Partes de ${x.alumno} (${x.curso})`, subtitulo: `${trimestreDe().texto[0].toUpperCase()}${trimestreDe().texto.slice(1)} · ${x.ambito === "mios" ? `puestos por ${usuario}` : "tutoría"}`, partes: x.partes })} />}

      {/* Selector de periodo */}
      <div className="no-print" style={tarjeta}>
        <label style={labelStyle}>¿De qué periodo?</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {PERIODOS.map(p => (
            <button key={p.id} onClick={() => setTipo(p.id)}
              style={{ padding: "8px 14px", borderRadius: 20, border: `2px solid ${tipo === p.id ? C.teal : "#e2e8f0"}`, background: tipo === p.id ? C.teal : C.white, color: tipo === p.id ? "#fff" : C.dark, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              {p.label}
            </button>
          ))}
        </div>
        {tipo === "rango" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
            <div><label style={{ fontSize: 12, color: C.gray }}>Desde</label><input type="date" value={desdeLibre} onChange={e => setDesdeLibre(e.target.value)} style={inpStyle} /></div>
            <div><label style={{ fontSize: 12, color: C.gray }}>Hasta</label><input type="date" value={hastaLibre} onChange={e => setHastaLibre(e.target.value)} style={inpStyle} /></div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={() => setRef(moverPeriodo(tipo, ref, -1))} aria-label="Periodo anterior" style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid #e2e8f0`, background: C.white, cursor: "pointer", fontWeight: 700 }}>◀</button>
            <input type="date" value={ref} onChange={e => setRef(e.target.value || isoLocal())} style={{ ...inpStyle, width: "auto", flex: "1 1 160px", marginBottom: 0 }} aria-label="Fecha" />
            <button onClick={() => setRef(moverPeriodo(tipo, ref, 1))} aria-label="Periodo siguiente" style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid #e2e8f0`, background: C.white, cursor: "pointer", fontWeight: 700 }}>▶</button>
            <button onClick={() => setRef(isoLocal())} style={{ padding: "10px 14px", borderRadius: 10, border: "none", background: C.cream, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Hoy</button>
          </div>
        )}
        <div style={{ marginTop: 12, fontSize: 14, fontWeight: 700, color: C.blue }}>📅 {periodo.texto[0].toUpperCase() + periodo.texto.slice(1)} · {est.lectivos.length} día(s) lectivo(s)</div>
      </div>

      {/* Cifras principales */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 14 }}>
        {[
          { n: est.partes.length, t: "Partes", s: `${est.gravedad.leve} leves · ${est.gravedad.grave} graves · ${est.gravedad.muy_grave} muy graves`, c: C.teal, click: () => abrir("Todos los partes", () => true) },
          { n: est.alumnosConParte, t: "Alumnos/as con parte", s: est.lectivos.length ? `${(est.partes.length / est.lectivos.length).toFixed(1)} partes por día` : "", c: C.blue },
          { n: est.banos.length, t: "Salidas al baño", s: est.banoMedio ? `${est.banoMedio} min de media · ${est.banosLargos} de más de 10 min` : "", c: "#10b981" },
          ...(esProfe ? [
            { n: est.gravedad.grave + est.gravedad.muy_grave, t: "Graves y muy graves", s: "Pulsa para verlos", c: C.salmon, click: () => abrir("Partes graves y muy graves", p => p.gravedad !== "leve") },
          ] : [
            { n: est.ausencias.length, t: "Ausencias profesorado", s: `${est.horasAusencia} horas · ${est.profesoresAusentes} profesores/as`, c: C.salmon },
            { n: est.guardiasDebidas ? `${pct(est.guardiasFirmadas, est.guardiasDebidas)} %` : "-", t: "Guardias firmadas", s: `${est.guardiasFirmadas} de ${est.guardiasDebidas}`, c: C.amber },
            { n: est.listasPasadas, t: "Listas en guardia", s: `${est.faltasEnListas} faltas anotadas`, c: "#8b5cf6" },
          ]),
        ].map(k => (
          <div key={k.t} onClick={k.click} title={k.click ? "Pulsa para verlos en detalle" : undefined} style={{ background: C.white, borderRadius: 12, padding: 14, borderTop: `4px solid ${k.c}`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: k.click ? "pointer" : "default" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.dark }}>{k.n}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{k.t}</div>
            <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>{k.s}</div>
          </div>
        ))}
      </div>

      {/* Evolución por día */}
      {est.porDia.length > 1 && (
        <div style={tarjeta}>
          <h3 style={h3}>Partes por día</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 140, overflowX: "auto", paddingBottom: 4 }}>
            {est.porDia.map(d => (
              <div key={d.fecha} title={`${fmtD(parseISO(d.fecha))}: ${d.partes} partes (${d.leve} leves, ${d.grave} graves, ${d.muy_grave} muy graves) · ${d.banos} baños · ${d.ausencias} ausencias. Pulsa para ver el detalle.`}
                role="button" tabIndex={0} onClick={() => abrirDia(d.fecha)} onKeyDown={e => { if (e.key === "Enter") abrirDia(d.fecha); }}
                onMouseOver={e => { e.currentTarget.style.background = "#f1f5f9"; }} onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}
                style={{ flex: "1 0 22px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", cursor: "pointer", borderRadius: 6 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.dark }}>{d.partes || ""}</div>
                <div style={{ width: "100%", maxWidth: 34, display: "flex", flexDirection: "column-reverse", height: `${(100 * d.partes) / maxDia}%`, minHeight: d.partes ? 3 : 0, borderRadius: "4px 4px 0 0", overflow: "hidden" }}>
                  <div style={{ flex: d.leve, background: C.teal }} /><div style={{ flex: d.grave, background: C.amber }} /><div style={{ flex: d.muy_grave, background: C.salmon }} />
                </div>
                <div style={{ fontSize: 10, color: C.gray, marginTop: 3 }}>{parseISO(d.fecha).getDate()}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, fontSize: 11, color: C.gray, marginTop: 8, flexWrap: "wrap" }}>
            <span><span style={{ display: "inline-block", width: 10, height: 10, background: C.teal, borderRadius: 2 }} /> Leves</span>
            <span><span style={{ display: "inline-block", width: 10, height: 10, background: C.amber, borderRadius: 2 }} /> Graves</span>
            <span><span style={{ display: "inline-block", width: 10, height: 10, background: C.salmon, borderRadius: 2 }} /> Muy graves</span>
            <span><b>Pulsa una columna</b> para ver ese día en grande: motivos, faltas que más se repiten y cada parte.</span>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
        <div style={tarjeta}><h3 style={h3}>🏫 Partes por grupo</h3><Barras datos={est.porGrupo.map(r => [`${r.curso}${r.tutor ? ` · ${r.tutor}` : ""}`, r.total, r.curso])} onClick={c => abrir(`Partes de ${c}`, p => p.curso === c)} /></div>
        <div style={tarjeta}><h3 style={h3}>🕐 Partes por hora de clase</h3><Barras datos={est.porHora} color={C.blue} onClick={h => abrir(`Partes a ${h}`, p => p.hora === h)} /></div>
        <div style={tarjeta}><h3 style={h3}>👤 Alumnado con más partes</h3><Barras datos={est.porAlumno} color={C.salmon} onClick={k => abrir(`Partes de ${k}`, p => `${p.alumno} (${p.curso})` === k)} /></div>
        <div style={tarjeta}><h3 style={h3}>📑 Faltas más frecuentes</h3><Barras datos={est.porTipificacion} color={C.amber} onClick={k => abrir(k, p => etiquetaTip(p) === k)} /></div>
        <div style={tarjeta}><h3 style={h3}>🚻 Salidas al baño por grupo</h3><Barras datos={est.banosPorGrupo} color="#10b981" /></div>
        {esProfe
          ? <div style={tarjeta}><h3 style={h3}>🚻 Alumnado que más sale al baño</h3><Barras datos={est.banosPorAlumno} color="#10b981" /></div>
          : <div style={tarjeta}><h3 style={h3}>📢 Ausencias del profesorado por motivo</h3><Barras datos={est.ausenciasPorMotivo} color="#8b5cf6" /></div>}
      </div>

      {/* Documentos */}
      <div className="no-print" style={tarjeta}>
        <h3 style={h3}>📄 Documentos de este periodo</h3>
        <div style={{ fontSize: 12, color: C.gray, marginBottom: 12 }}>Al pulsar, el informe se abre <b>en pantalla</b>; desde ahí lo descargas o lo imprimes. Usan las fechas elegidas arriba.</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 10 }}>
          <button style={btnDoc()} onClick={() => pdfEstadisticas(est, periodo, esProfe ? `${ambitoOk === "mios" ? "Partes puestos por" : `Tutoría de ${ambitoOk} ·`} ${usuario}` : "")}>
            📊 Estadísticas del periodo<span style={sub}>Resumen, evolución por día, grupos, alumnado, faltas y profesorado</span>
          </button>
          <button style={btnDoc(est.partes.length > 0)} disabled={!est.partes.length} onClick={() => pdfInformePartes(est.partes, periodo.texto, tutores)}>
            📋 Todos los partes<span style={sub}>{est.partes.length} parte(s) con su detalle y resumen por grupo</span>
          </button>
          <button style={btnDoc(est.banos.length > 0)} disabled={!est.banos.length} onClick={() => pdfInformeBanos(est.banos, periodo.texto)}>
            🚻 Salidas al baño<span style={sub}>{est.banos.length} salida(s) con hora y duración</span>
          </button>
          {!esProfe && <button style={btnDoc(est.ausencias.length > 0)} disabled={!est.ausencias.length} onClick={() => pdfAusencias(est.ausencias, periodo)}>
            📢 Ausencias del profesorado<span style={sub}>{est.ausencias.length} ausencia(s) con horas, grupo y tarea</span>
          </button>}
          {tipo === "dia" && !esProfe && (
            <button style={btnDoc()} onClick={() => pdfFirmasYListas(periodo.desde, filasFirmasDia(periodo.desde, equipo, firmas), est.listas.slice().sort((a, b) => HORAS.indexOf(a.hora) - HORAS.indexOf(b.hora)))}>
              ✍️ Firmas de guardia y listas<span style={sub}>Quién tenía guardia, quién firmó y las listas pasadas</span>
            </button>
          )}
          <button style={btnDoc()} onClick={() => excelPeriodo(est, periodo, tutores, alumnos, esProfe).catch(() => window.alert("No se ha podido crear el Excel. Comprueba la conexión e inténtalo de nuevo."))}>
            📥 Ver y descargar en Excel<span style={sub}>{esProfe ? "Partes con alumno, grupo, falta y profesor; resumen por alumno, por grupo y baños" : "Partes con alumno, grupo, tutor, falta y profesor; por alumno, por grupo, baños, ausencias y listas"}</span>
          </button>
        </div>

        <div style={{ borderTop: `1px dashed ${C.cream}`, marginTop: 16, paddingTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
          <div>
            <label style={labelStyle}>👤 Partes de un alumno/a</label>
            <select value={alumnoDoc} onChange={e => setAlumnoDoc(e.target.value)} style={{ ...selStyle, marginBottom: 8 }}>
              <option value="">Elige alumno/a…</option>
              {[...alumnos].sort((a, b) => a.curso.localeCompare(b.curso) || a.nombre.localeCompare(b.nombre)).map(a => {
                const n = est.partes.filter(p => p.alumnoId === a.id).length;
                return <option key={a.id} value={String(a.id)}>{a.nombre} ({a.curso}){n ? ` · ${n}` : ""}</option>;
              })}
            </select>
            <button style={btnDoc(partesAlumno.length > 0)} disabled={!partesAlumno.length} onClick={() => pdfInformePartes(partesAlumno, `${nombreAlumno} · ${periodo.texto}`, tutores)}>
              ⬇️ {alumnoDoc ? `${partesAlumno.length} parte(s) en este periodo` : "Descargar"}
            </button>
            {alumnoObj && <ContactoFamilia alumno={alumnoObj} partes={partesAlumno} banos={banosAlumno} periodo={periodo} tutores={tutores} remitente={esProfe ? usuario : ""} C={C} />}
          </div>
          {(!esProfe || ambitoOk === "mios") && <div>
            <label style={labelStyle}>🏫 Partes de un grupo</label>
            <select value={grupoDoc} onChange={e => setGrupoDoc(e.target.value)} style={{ ...selStyle, marginBottom: 8 }}>
              <option value="">Elige grupo…</option>
              {(esProfe ? [...new Set(partes.map(p => p.curso))].sort() : cursos).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button style={btnDoc(partesGrupo.length > 0)} disabled={!partesGrupo.length} onClick={() => pdfInformePartes(partesGrupo, `Grupo ${grupoDoc} · ${periodo.texto}`, tutores)}>
              ⬇️ {grupoDoc ? `${partesGrupo.length} parte(s) en este periodo` : "Descargar"}
            </button>
          </div>}
          {!esProfe && <div>
            <label style={labelStyle}>👨‍🏫 Ausencias de un profesor/a</label>
            <select value={profDoc} onChange={e => setProfDoc(e.target.value)} style={{ ...selStyle, marginBottom: 8 }}>
              <option value="">Elige profesor/a…</option>
              {[...profesores].sort().map(p => { const n = est.ausencias.filter(a => a.profesor === p).length; return <option key={p} value={p}>{p}{n ? ` · ${n}` : ""}</option>; })}
            </select>
            <button style={btnDoc(ausProf.length > 0)} disabled={!ausProf.length} onClick={() => pdfAusencias(ausProf, { ...periodo, texto: `${profDoc} · ${periodo.texto}` })}>
              ⬇️ {profDoc ? `${ausProf.length} ausencia(s) en este periodo` : "Descargar"}
            </button>
          </div>}
        </div>
        <div style={{ fontSize: 11, color: C.gray, marginTop: 12 }}>Las faltas oficiales de asistencia del alumnado se registran en Raíces; aquí solo aparecen las anotadas en las listas de guardia.</div>
      </div>
    </div>
  );
}

export default function App() {
  const [perfil, setPerfil]       = useState(null);
  const [usuario, setUsuario]     = useState(null);
  const [tab, setTab]             = useState("partes");
  const [alumnos, setAlumnos]     = useState(DEMO_ALUMNOS);
  const [profesores, setProfesores] = useState(DEMO_PROFESORES);
  const [partes, setPartes]       = useState([]);
  const [banos, setBanos]         = useState([]);
  const [alertas, setAlertas]     = useState([]);
  const [mensajes, setMensajes]   = useState([]);
  const [guardias, setGuardias]   = useState([]);
  const [tutores, setTutores]     = useState(TUTORES_DEMO); // {curso: {tutor, email}}
  const [informes, setInformes]   = useState([]);           // informes descargados
  const [loading, setLoading]     = useState(true);
  const [showParte, setShowParte] = useState(null);
  const [avisosFamilia, setAvisosFamilia] = useState({}); // avisos a familias ya hechos: {id: {n, ts, por}}
  const [parteGrande, setParteGrande] = useState(false); // parte a pantalla completa
  useEffect(() => {
    if (!showParte) return;
    const f = e => { if (e.key === "Escape") { e.stopImmediatePropagation(); setShowParte(null); } };
    window.addEventListener("keydown", f, true); return () => window.removeEventListener("keydown", f, true);
  }, [showParte]);
  const [showCoordinacion, setShowCoordinacion] = useState(false);
  const [fechaCoordinacion, setFechaCoordinacion] = useState("");
  const [showAlerta, setShowAlerta] = useState(null);
  const [printParte, setPrintParte] = useState(null);
  const [printInforme, setPrintInforme] = useState(false);
  const [showCuadrante, setShowCuadrante] = useState(false); // Nuevo: modal cuadrante
  const [semanaCuadrante, setSemanaCuadrante] = useState(0); // 0 = esta semana, 1 = la siguiente...

  // Filtros generales
  const [filtCurso, setFiltCurso]           = useState("");
  const [filtAlumno, setFiltAlumno]         = useState("");
  const [filtGravedad, setFiltGravedad]     = useState("");
  const [filtFechaDesde, setFiltFechaDesde] = useState("");
  const [filtFechaHasta, setFiltFechaHasta] = useState("");
  const [informeType, setInformeType]       = useState("partes");  // "partes" | "banos"

  // Formulario nuevo parte
  const [fAlumno, setFAlumno]     = useState("");
  const [fBusqueda, setFBusqueda] = useState("");
  const [fTipo, setFTipo]                 = useState("Comportamiento");
  const [fGravedad, setFGravedad]         = useState("leve");
  const [fTipificacion, setFTipificacion] = useState("");
  const [fDesc, setFDesc]                 = useState("");
  const [fHora, setFHora]                 = useState("1ª hora");
  const [fProfesor, setFProfesor]         = useState(DEMO_PROFESORES[4]);
  const [moduloProfesor, setModuloProfesor] = useState("alumnos");   // "alumnos" | "guardias"
  const [moduloJefatura, setModuloJefatura] = useState("alumnos");   // "alumnos" | "guardias"
  const [parteGenerado, setParteGenerado] = useState(null);

  // Parte de grupo
  const [gCurso, setGCurso]         = useState("");
  const [gTipo, setGTipo]           = useState("Comportamiento");
  const [gGravedad, setGGravedad]       = useState("leve");
  const [gTipificacion, setGTipificacion] = useState("");
  const [gDesc, setGDesc]           = useState("");
  const [gHora, setGHora]           = useState("1ª hora");
  const [gExcluidos, setGExcluidos] = useState([]);
  const [grupoGenerado, setGrupoGenerado] = useState(null);

  // Baños
  const [bAlumno, setBAlumno]     = useState("");
  const [bBusqueda, setBBusqueda] = useState("");

  // Guardias
  const [guProfesorAusente, setGuProfesorAusente] = useState("");
  const [guHora, setGuHora]                       = useState("1ª hora");
  const [guModulo, setGuModulo]                   = useState("Módulo A");
  const [guCurso, setGuCurso]                     = useState("");
  const [guMateria, setGuMateria]                 = useState("");
  const [guProfesorGuardia, setGuProfesorGuardia] = useState("");
  const [guMotivo, setGuMotivo]                   = useState("Enfermedad");
  const [guMaterial, setGuMaterial]               = useState("");
  const [guardiaGenerada, setGuardiaGenerada]     = useState(null);
  const [nuevoProfesor, setNuevoProfesor]         = useState("");
  const [feedbackAñadirProfesor, setFeedbackAñadirProfesor] = useState(false); // Nuevo: feedback visual

  // Guardias — nuevo sistema
  const [cuadrante, setCuadrante]     = useState({});
  const [apoyosGuardia, setApoyosGuardia] = useState({}); // {fecha|hora|zona: profesor}
  const [sustitutosGuardia, setSustitutosGuardia] = useState({}); // {fecha|hora|zona: profesor}
  const [cuentas, setCuentas] = useState(CUENTAS_DEMO); // {nombre: {cargo, clave}}
  const [firmas, setFirmas] = useState([]);   // firmas de guardia
  const [listas, setListas] = useState([]);   // listas pasadas en guardia
  const [registroTelefono, setRegistroTelefono] = useState(false); // Jefatura registra una ausencia por teléfono
  const [profesoresGuardia, setProfesoresGuardia] = useState({}); // Nuevo: {dia|hora|zona: profesor}
  const [ausencias, setAusencias]     = useState([]);
  const [quinceInicio, setQInicio]    = useState("");
  const [quinceProfesor, setQProf]    = useState("");
  const [ausMotivo, setAusMotivo]     = useState("Enfermedad");
  const [ausFecha, setAusFecha]       = useState("");
  const [ausHoras, setAusHoras]       = useState([]);
  const [ausTarea, setAusTarea]       = useState("");
  const [ausEnlace, setAusEnlace]     = useState("");
  const [ausUbicacion, setAusUbicacion] = useState("");
  const [ausAula, setAusAula]         = useState("");
  const [ausAsignatura, setAusAsignatura] = useState("");
  const [ausProfesor, setAusProfesor] = useState("");
  const [diaSeleccionadoGuardias, setDiaSeleccionadoGuardias] = useState(null);

  // Carga
  useEffect(() => {
    async function load() {
      setLoading(true);
      const p  = await sGet("partes");    if (p)  setPartes(p);
      const b  = await sGet("banos");     if (b)  setBanos(b);
      const a  = await sGet("alertas");   if (a)  setAlertas(a);
      const m  = await sGet("mensajes");  if (m)  setMensajes(m);
      const al = await sGet("alumnos");   if (al) setAlumnos(al);
      const tu = await sGet("tutores");   if (tu) setTutores(tu);
      const inf = await sGet("informes"); if (inf) setInformes(inf);
      // Primera visita a la demostración: se cargan partes, baños y alertas de ejemplo
      if (MODO_DEMO && !p) {
        const ej = datosEjemploConvivencia(DEMO_PROFESORES);
        setAlumnos(ej.alumnos); setPartes(ej.partes); setBanos(ej.banos); setAlertas(ej.alertas); setInformes(ej.informes); setTutores(ej.tutores);
      }
      const pr = await sGet("profesores");if (pr) setProfesores(pr);
      const g  = await sGet("guardias");    if (g)  setGuardias(g);
      const cq = await sGet("cuadrante");   if (cq) setCuadrante(cq);
      const au = await sGet("ausencias");   if (au) setAusencias(au);
      const ap = await sGet("apoyos_guardia");     if (ap) setApoyosGuardia(ap);
      const su = await sGet("sustitutos_guardia"); if (su) setSustitutosGuardia(su);
      const pg = await sGet("profesores_guardia"); if (pg) setProfesoresGuardia(pg);
      const cu = await sGet("cuentas"); if (cu) setCuentas(cu);
      const fi = await sGet("firmas_guardia"); if (fi) setFirmas(fi);
      const li = await sGet("listas_guardia"); if (li) setListas(li);
      const avf = await sGet("avisos_familia"); if (avf) setAvisosFamilia(avf);
      const cuentasActuales = cu || CUENTAS_DEMO;
      const ses = leerSesion();
      // Solo se recupera la sesión si esa persona tiene clave y su cargo permite ese perfil
      if (ses?.usuario && ses?.perfil && (cuentasActuales[ses.usuario]?.clave || MODO_DEMO) &&
          perfilesPermitidos(cuentasActuales, ses.usuario).some(p => p.id === ses.perfil.id)) {
        setUsuario(ses.usuario); setPerfil(ses.perfil);
        if ((pr || DEMO_PROFESORES).includes(ses.usuario)) setFProfesor(ses.usuario);
        setTab(ses.perfil.id === "jefatura" ? "dashboard" : ses.perfil.id === "admin" ? "admin_panel" : "partes");
      }
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => { if (!loading) sSet("partes", partes); },     [partes, loading]);
  useEffect(() => { if (!loading) sSet("banos", banos); },       [banos, loading]);
  useEffect(() => { if (!loading) sSet("alertas", alertas); },   [alertas, loading]);
  useEffect(() => { if (!loading) sSet("mensajes", mensajes); }, [mensajes, loading]);
  useEffect(() => { if (!loading) sSet("alumnos", alumnos); },   [alumnos, loading]);
  useEffect(() => { if (!loading) sSet("tutores", tutores); },   [tutores, loading]);
  useEffect(() => { if (!loading) sSet("informes", informes); }, [informes, loading]);
  useEffect(() => { if (!loading) sSet("profesores", profesores); }, [profesores, loading]);
  useEffect(() => { if (!loading) sSet("guardias",   guardias);   }, [guardias,   loading]);
  useEffect(() => { if (!loading) sSet("cuadrante", cuadrante); }, [cuadrante, loading]);
  useEffect(() => { if (!loading) sSet("ausencias", ausencias); }, [ausencias, loading]);
  useEffect(() => { if (!loading) sSet("apoyos_guardia", apoyosGuardia); }, [apoyosGuardia, loading]);
  useEffect(() => { if (!loading) sSet("sustitutos_guardia", sustitutosGuardia); }, [sustitutosGuardia, loading]);
  useEffect(() => { if (!loading) sSet("cuentas", cuentas); }, [cuentas, loading]);
  useEffect(() => { if (!loading) sSet("firmas_guardia", firmas); }, [firmas, loading]);
  useEffect(() => { if (!loading) sSet("listas_guardia", listas); }, [listas, loading]);
  useEffect(() => { if (!loading) sSet("avisos_familia", avisosFamilia); }, [avisosFamilia, loading]);
  // Cada profesor actúa siempre en su propio nombre
  const identidadFija = !!usuario && profesores.includes(usuario);
  useEffect(() => { if (identidadFija) { setFProfesor(usuario); setAusProfesor(usuario); } }, [usuario, identidadFija]);
  useEffect(() => { if (!loading) sSet("profesores_guardia", profesoresGuardia); }, [profesoresGuardia, loading]);

  // Derivados
  const cursos        = [...new Set(alumnos.map(a => a.curso))].sort();
  const alumnoSel     = alumnos.find(a => a.id === parseInt(fAlumno));
  const banoActivos   = banos.filter(b => !b.regreso);
  const alertasNoLeidas = alertas.filter(a => !a.leida).length;
  const partesDeAlumno = id => partes.filter(p => p.alumnoId === id);
  // Completa un parte con el tutor/a y su correo (los partes antiguos no los guardaban)
  const completar = p => p && ({ ...p, tutor: p.tutor || tutores[p.curso]?.tutor || "", tutorEmail: p.tutorEmail || tutores[p.curso]?.email || "" });
  const partesLeves    = id => partesDeAlumno(id).filter(p => p.gravedad === "leve").length;
  const partesFiltrados = partes.filter(p => {
    if (filtCurso     && p.curso    !== filtCurso)              return false;
    if (filtAlumno    && p.alumnoId !== parseInt(filtAlumno))   return false;
    if (filtGravedad  && p.gravedad !== filtGravedad)           return false;
    if (filtFechaDesde && p.ts.split("T")[0] < filtFechaDesde) return false;
    if (filtFechaHasta && p.ts.split("T")[0] > filtFechaHasta) return false;
    return true;
  });

  const banosFiltrados = banos.filter(b => {
    if (filtCurso && b.curso !== filtCurso) return false;
    const fb = (b.ts || b.salida || "").split("T")[0];
    if (filtFechaDesde && fb < filtFechaDesde) return false;
    if (filtFechaHasta && fb > filtFechaHasta) return false;
    return true;
  });

  function cargarEjemploGuardias() {
    const conv = datosEjemploConvivencia(DEMO_PROFESORES);
    setAlumnos(conv.alumnos); setPartes(conv.partes); setBanos(conv.banos); setAlertas(conv.alertas); setInformes(conv.informes); setTutores(conv.tutores);
    // El ejemplo usa los profesores ficticios de demostración; se añaden a la lista si faltan
    const lista = [...new Set([...profesores, ...DEMO_PROFESORES])];
    setProfesores(lista);
    const ej = datosEjemploGuardias(DEMO_PROFESORES);
    setCuadrante(ej.cuadrante); setApoyosGuardia(ej.apoyos); setSustitutosGuardia(ej.sustitutos); setAusencias(ej.ausencias);
    setFirmas(ej.firmas); setListas([]);
    if (ej.sugerido) setUsuario(ej.sugerido);
    // Sin avisos emergentes: la pantalla de entrada muestra que los datos están cargados
  }

  function cambiarPerfil(id) {
    const p = perfilesPermitidos(cuentas, usuario).find(x => x.id === id);
    if (!p || p.id === perfil?.id) return;
    guardarSesion({ usuario, perfil: p });
    setPerfil(p); setTab(tabInicial(p.id));
    setModuloProfesor("alumnos"); setModuloJefatura("alumnos");
    setShowParte(null); setShowAlerta(null);
    window.scrollTo(0, 0);
  }

  function salir() {
    guardarSesion(null);
    setPerfil(null); setUsuario(null); setTab("partes"); setShowParte(null); setPrintParte(null);
    setPrintInforme(false); setShowAlerta(null);
    setFAlumno(""); setFBusqueda(""); setFDesc(""); setParteGenerado(null);
    setGCurso(""); setGDesc(""); setGExcluidos([]); setGrupoGenerado(null);
    setBAlumno(""); setBBusqueda("");
    setGuProfesorAusente(""); setGuMateria(""); setGuProfesorGuardia(""); setGuMaterial(""); setGuardiaGenerada(null);
    setFiltCurso(""); setFiltAlumno(""); setFiltGravedad(""); setFiltFechaDesde(""); setFiltFechaHasta("");
  }

  function generarAlertasParte(parte, partesActuales) {
    const nuevasAlertas = [];
    const total = partesActuales.filter(p => p.alumnoId === parte.alumnoId).length + 1;
    const leves  = partesActuales.filter(p => p.alumnoId === parte.alumnoId && p.gravedad === "leve").length + (parte.gravedad === "leve" ? 1 : 0);
    const hora   = new Date(parte.ts).getHours();
    const fueraHorario = hora < 8 || hora >= 15;
    if (leves === 3)       nuevasAlertas.push({ id: Date.now() + 1, tipo: "acumulacion_leves", alumno: parte.alumno, curso: parte.curso, msg: `Acumulación de 3 partes leves — Considerar sanción`, ts: parte.ts, leida: false });
    if (total === 3)       nuevasAlertas.push({ id: Date.now() + 2, tipo: "total_partes",      alumno: parte.alumno, curso: parte.curso, msg: `Ha alcanzado 3 partes en total`, ts: parte.ts, leida: false });
    if (fueraHorario)      nuevasAlertas.push({ id: Date.now() + 3, tipo: "fuera_horario",     alumno: parte.alumno, curso: parte.curso, msg: `Parte generado fuera del horario habitual (${new Date(parte.ts).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })})`, ts: parte.ts, leida: false });
    if (nuevasAlertas.length > 0) { setAlertas(prev => [...nuevasAlertas, ...prev]); setShowAlerta(nuevasAlertas[0]); }
  }

  function crearParte() {
    if (!fAlumno || !fDesc.trim()) return;
    const al = alumnos.find(a => a.id === parseInt(fAlumno));
    const p = { id: Date.now(), alumnoId: al.id, alumno: al.nombre, curso: al.curso, tutor: tutorDeGrupo(tutores, alumnos, al.curso) || al.tutor, tutorEmail: tutores[al.curso]?.email || "", email: al.email, telefono: al.telefono, tipo: fTipo, gravedad: fGravedad, tipificacion: fTipificacion, descripcion: fDesc, profesor: fProfesor, hora: fHora, ts: new Date().toISOString() };
    generarAlertasParte(p, partes);
    setPartes(prev => [p, ...prev]);
    setParteGenerado(p);
    setFAlumno(""); setFBusqueda(""); setFDesc(""); setFTipo("Comportamiento"); setFGravedad("leve"); setFTipificacion("");
  }

  function crearParteGrupo() {
    if (!gCurso || !gDesc.trim()) return;
    const grupo = alumnos.filter(a => a.curso === gCurso && !gExcluidos.includes(a.id));
    const ts = new Date().toISOString();
    const nuevos = grupo.map(al => ({ id: Date.now() + al.id, alumnoId: al.id, alumno: al.nombre, curso: al.curso, tutor: tutorDeGrupo(tutores, alumnos, al.curso) || al.tutor, tutorEmail: tutores[al.curso]?.email || "", email: al.email, telefono: al.telefono, tipo: gTipo, gravedad: gGravedad, tipificacion: gTipificacion, descripcion: gDesc, profesor: fProfesor, hora: gHora, ts, esGrupal: true }));
    const partesTemp = [...partes]; nuevos.forEach(p => generarAlertasParte(p, partesTemp));
    setPartes(prev => [...nuevos, ...prev]);
    setGrupoGenerado({ curso: gCurso, total: nuevos.length, ts });
    setGDesc(""); setGExcluidos([]); setGTipo("Comportamiento"); setGGravedad("leve"); setGTipificacion("");
  }

  function crearGuardia() {
    if (!guProfesorAusente || !guCurso || !guProfesorGuardia) return;
    const g = { id: Date.now(), profesorAusente: guProfesorAusente, hora: guHora, modulo: guModulo, curso: guCurso, materia: guMateria, profesorGuardia: guProfesorGuardia, motivo: guMotivo, material: guMaterial, ts: new Date().toISOString(), fecha: todayStr() };
    setGuardias(prev => [g, ...prev]);
    setGuardiaGenerada(g);
    setGuProfesorAusente(""); setGuMateria(""); setGuProfesorGuardia(""); setGuMaterial("");
  }

  function checkAbusoBano(alumnoId) {
    const al = alumnos.find(a => a.id === alumnoId);
    const hoy = todayStr(), sem = weekKey(new Date());
    const sal = banos.filter(b => b.alumnoId === alumnoId);
    const hoyC = sal.filter(b => b.fecha === hoy).length + 1;
    const semC = sal.filter(b => weekKey(b.fecha) === sem).length + 1;
    const msgs = [];
    if (hoyC > 2) msgs.push(`Ha ido al baño ${hoyC} veces hoy`);
    if (semC > 3) msgs.push(`Ha ido al baño ${semC} veces esta semana`);
    if (msgs.length > 0) {
      const al2 = { id: Date.now(), tipo: "bano", alumno: al.nombre, curso: al.curso, msg: msgs.join(" · "), msgs, ts: new Date().toISOString(), leida: false };
      setAlertas(prev => [al2, ...prev]); setShowAlerta(al2);
    }
  }

  function registrarSalida() {
    if (!bAlumno) return;
    const id = parseInt(bAlumno); checkAbusoBano(id);
    const al = alumnos.find(a => a.id === id);
    const ahora = new Date().toISOString();
    setBanos(prev => [{ id: Date.now(), alumnoId: id, alumno: al.nombre, curso: al.curso, fecha: todayStr(), salida: ahora, ts: ahora, profesor: usuario || "", regreso: null }, ...prev]);
    setBAlumno(""); setBBusqueda("");
  }

  // Estilos base
  const inpStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid #d1d5db`, fontSize: 14, boxSizing: "border-box", background: C.white, outline: "none" };
  const selStyle = { ...inpStyle };
  const labelStyle = { display: "block", fontWeight: 600, marginBottom: 6, color: C.dark, fontSize: 13 };

  // ── Pantalla de carga ──
  if (loading) return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg,${C.dark},${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,sans-serif" }}>
      <div style={{ color: "#fff", textAlign: "center" }}>
        <div style={{ fontSize: 52 }}>🏫</div>
        <div style={{ fontSize: 18, fontWeight: 600, marginTop: 12 }}>Cargando GalvánDesk…</div>
      </div>
    </div>
  );

  if (printParte)   return <PrintParte parte={printParte} onClose={() => setPrintParte(null)} />;
  if (printInforme) return <PrintInforme type={informeType} partes={partesFiltrados} banos={banosFiltrados} tutores={tutores}
    filtros={{ filtCurso, filtAlumno, filtGravedad, filtFechaDesde, filtFechaHasta }}
    onDescargado={inf => setInformes(prev => [{ id: Date.now(), ts: new Date().toISOString(), autor: usuario || "", total: inf.ids.length, ...inf }, ...prev].slice(0, 100))}
    onClose={() => setPrintInforme(false)} />;

  // ── Pantalla de entrada ──
  if (!perfil) return (
    <PantallaEntrada profesores={profesores} cuentas={cuentas} setCuentas={setCuentas}
      nombreSugerido={usuario} onCargarEjemplo={cargarEjemploGuardias}
      tutoraDemo={(() => { const t = Object.entries(tutores).filter(([, v]) => v?.tutor && profesores.includes(v.tutor) && v.tutor !== usuario && !["Ana Jiménez", "Elena Vega"].includes(v.tutor)).sort(([a], [b]) => a.localeCompare(b))[0]; return t ? { nombre: t[1].tutor, curso: t[0] } : null; })()}
      onEntrar={(nombre, p) => {
        setUsuario(nombre); if (profesores.includes(nombre)) setFProfesor(nombre);
        guardarSesion({ usuario: nombre, perfil: p }); setPerfil(p); setTab(tabInicial(p.id));
      }} />
  );

  const avisosPendientes = perfil.id === "profesor" && usuario ? alumnosParaAvisar({ partes, usuario, tutores, avisos: avisosFamilia }).lista.filter(x => x.pendiente).length : 0;
  const tabs = perfil.id === "profesor"
    ? moduloProfesor === "alumnos"
      ? [
          { id: "partes",      label: "📋 Nuevo Parte", color: "#06b6d4" },
          { id: "parte_grupo", label: "👥 Parte de Grupo", color: "#ec4899" },
          { id: "bano",        label: "🚻 Baños", color: "#10b981" },
          { id: "historial",   label: "🗂 Mis Partes", color: "#8b5cf6" },
          { id: "mis_estadisticas", label: `📈 Estadísticas${avisosPendientes ? ` · 🔔 ${avisosPendientes}` : ""}`, color: "#06b6d4" },
        ]
      : moduloProfesor === "guardias"
      ? [
          { id: "mi_guardia",     label: "🔄 Mi Guardia Hoy", color: "#06b6d4" },
          { id: "notif_ausencia", label: "📢 Notificar Ausencia", color: "#ec4899" },
          { id: "guardias_ver",   label: "📄 Ver Guardias", color: "#10b981" },
        ]
      : [] // Galvángram no tiene tabs adicionales
    : perfil.id === "jefatura"
    ? moduloJefatura === "alumnos"
      ? [
          { id: "dashboard",    label: "📊 Dashboard", color: "#06b6d4" },
          { id: "por_curso",    label: "🏫 Por Curso", color: "#ec4899" },
          { id: "por_alumno",   label: "👤 Por Alumno", color: "#10b981" },
          { id: "partes_todos", label: "📋 Partes", color: "#8b5cf6" },
          { id: "bano_live",    label: "🚻 Baños", color: "#06b6d4" },
          { id: "alertas",      label: `🔔${alertasNoLeidas > 0 ? ` (${alertasNoLeidas})` : ""} Alertas`, color: "#ec4899" },
          { id: "informe",      label: "📤 Informe", color: "#10b981" },
          { id: "estadisticas", label: "📈 Estadísticas", color: "#8b5cf6" },
        ]
      : moduloJefatura === "guardias"
      ? [
          { id: "cuadrante",     label: "📅 Cuadrante", color: "#06b6d4" },
          { id: "coordinacion",  label: "🔄 Coordinación Diaria", color: "#8b5cf6" },
          { id: "parte_dia",     label: "🔄 Parte del Día", color: "#ec4899" },
          { id: "ausencias_jef", label: "📢 Ausencias de Profesores", color: "#10b981" },
          { id: "firmas_jef",    label: "✍️ Firmas y listas", color: "#06b6d4" },
          { id: "estadisticas",  label: "📈 Estadísticas", color: "#8b5cf6" },
        ]
      : [] // Galvángram no tiene tabs adicionales
    : [
        // Admin no necesita tabs adicionales, solo usa los módulos
      ];

  return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: "system-ui,sans-serif", width: "100%" }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        @media print { .no-print { display: none !important; } }
        @media (max-width: 600px) {
          .gd-header { padding: 10px 12px !important; }
          .gd-header-izq { gap: 8px !important; }
          .gd-logo { display: none; }
          .gd-header select { max-width: 120px !important; }
          .gd-modulos { padding: 10px 8px !important; gap: 6px !important; }
          .gd-modulos button { flex: 1 1 0; min-width: 0; padding: 10px 6px !important; font-size: 13px !important; }
        }
      `}</style>
      <AvisoDemo compacto />
      {/* Header — ancho completo CON BOTÓN HOME */}
      <div className="gd-header" style={{ background: `linear-gradient(90deg,${C.dark},${C.blue})`, color: "#fff", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 8 }}>
        <div className="gd-header-izq" style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
          <button onClick={() => { 
            setTab(perfil.id === "jefatura" ? "dashboard" : perfil.id === "admin" ? "admin_panel" : "partes"); 
            if (perfil.id === "profesor") setModuloProfesor("alumnos"); 
            if (perfil.id === "jefatura") setModuloJefatura("alumnos"); 
          }} 
            onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.35)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; }}
            style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 18, fontWeight: 600, transition: "background .2s", display: "flex", alignItems: "center", justifyContent: "center" }}>
            ↩️
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="gd-logo" style={{ fontSize: 26 }}>🏫</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: .5 }}>GalvánDesk</div>
              <div style={{ fontSize: 11, opacity: .8 }}>IES Enrique Tierno Galván · {perfil.label}</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {perfilesPermitidos(cuentas, usuario).length > 1 && <select value={perfil.id} onChange={e => cambiarPerfil(e.target.value)} aria-label="Cambiar de perfil" title="Cambiar de perfil"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: 8, padding: "6px 8px", cursor: "pointer", fontSize: 13, fontWeight: 600, maxWidth: 210 }}>
            {perfilesPermitidos(cuentas, usuario).map(p => <option key={p.id} value={p.id} style={{ color: C.dark }}>{p.label}</option>)}
          </select>}
          <button onClick={salir} 
            onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "background .2s" }}>
            Salir
          </button>
        </div>
      </div>

      {/* Selector módulo Profesor */}
      {perfil.id === "profesor" && (
        <div className="gd-modulos" style={{ background: "#f0f4f7", display: "flex", justifyContent: "center", gap: 12, padding: "12px 24px", borderBottom: `1px solid #e2e8f0` }}>
          {[
            { id: "alumnos",  label: "👨‍🎓 Partes",  icon: "📋" },
            { id: "guardias", label: "🔄 Guardias",  icon: "⏰" },
            { id: "galvangramm", label: "💬 Galvángram", icon: "💬" },
          ].map(m => (
            <button key={m.id}
              onClick={() => { setModuloProfesor(m.id); setTab(m.id === "alumnos" ? "partes" : (m.id === "guardias" ? "mi_guardia" : "mensajeria")); }}
              style={{ 
                padding: "12px 28px", 
                border: "2px solid transparent",
                cursor: "pointer", 
                fontWeight: 700, 
                fontSize: 15,
                borderRadius: 10,
                background: moduloProfesor === m.id ? "#FFE52A" : "#ffffff",
                color: moduloProfesor === m.id ? "#2C4A52" : "#64748b",
                transition: "all .3s ease",
                boxShadow: moduloProfesor === m.id ? "0 4px 12px rgba(255, 229, 42, 0.3)" : "0 2px 6px rgba(0,0,0,0.05)",
                transform: moduloProfesor === m.id ? "translateY(-2px)" : "translateY(0)"
              }}>
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Selector módulo Jefatura */}
      {perfil.id === "jefatura" && (
        <div className="gd-modulos" style={{ background: "#f0f4f7", display: "flex", justifyContent: "center", gap: 12, padding: "12px 24px", borderBottom: `1px solid #e2e8f0` }}>
          {[
            { id: "alumnos",  label: "📋 Partes & Alumnos" },
            { id: "guardias", label: "🔄 Guardias & Ausencias" },
            { id: "galvangramm", label: "💬 Galvángram" },
          ].map(m => (
            <button key={m.id}
              onClick={() => { setModuloJefatura(m.id); setTab(m.id === "alumnos" ? "dashboard" : (m.id === "guardias" ? "cuadrante" : "mensajeria")); }}
              style={{ 
                padding: "12px 28px", 
                border: "2px solid transparent",
                cursor: "pointer", 
                fontWeight: 700, 
                fontSize: 15,
                borderRadius: 10,
                background: moduloJefatura === m.id ? "#FFE52A" : "#ffffff",
                color: moduloJefatura === m.id ? "#2C4A52" : "#64748b",
                transition: "all .3s ease",
                boxShadow: moduloJefatura === m.id ? "0 4px 12px rgba(255, 229, 42, 0.3)" : "0 2px 6px rgba(0,0,0,0.05)",
                transform: moduloJefatura === m.id ? "translateY(-2px)" : "translateY(0)"
              }}>
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Selector módulo Admin */}
      {perfil.id === "admin" && (
        <div className="gd-modulos" style={{ background: "#f0f4f7", display: "flex", justifyContent: "center", gap: 12, padding: "12px 24px", borderBottom: `1px solid #e2e8f0` }}>
          {[
            { id: "alumnos",  label: "👥 Alumnos", color: "#06b6d4" },
            { id: "guardias", label: "👨‍🏫 Profesores", color: "#ec4899" },
          ].map(m => (
            <button key={m.id}
              onClick={() => { setModuloJefatura(m.id); setTab(m.id === "alumnos" ? "admin_panel" : "admin_profesores"); }}
              style={{ 
                padding: "12px 28px", 
                border: "2px solid transparent",
                cursor: "pointer", 
                fontWeight: 700, 
                fontSize: 15,
                borderRadius: 10,
                background: moduloJefatura === m.id ? m.color : "#ffffff",
                color: moduloJefatura === m.id ? "#ffffff" : "#64748b",
                transition: "all .3s ease",
                boxShadow: moduloJefatura === m.id ? `0 4px 12px ${m.color}44` : "0 2px 6px rgba(0,0,0,0.05)",
                transform: moduloJefatura === m.id ? "translateY(-2px)" : "translateY(0)"
              }}>
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Tabs — ancho completo con mejor responsive y diseño mejorado */}
      <div style={{ background: "#ffffff", borderBottom: `1px solid #e2e8f0`, display: "flex", overflowX: "auto", padding: "8px 24px", gap: 8, WebkitOverflowScrolling: "touch", alignItems: "center" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ 
              padding: "10px 20px", 
              border: "2px solid transparent",
              cursor: "pointer", 
              fontSize: 14, 
              fontWeight: tab === t.id ? 700 : 500,
              minHeight: 40,
              borderRadius: 8,
              background: tab === t.id ? t.color : "#FF7F11",
              color: tab === t.id ? "#ffffff" : "#ffffff",
              whiteSpace: "nowrap", 
              transition: "all .3s ease",
              flexShrink: 0,
              boxShadow: tab === t.id ? `0 4px 12px ${t.color}44` : "0 1px 3px rgba(0,0,0,0.05)",
              transform: tab === t.id ? "translateY(-1px)" : "translateY(0)"
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenido — centrado con max-width */}
      <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto", padding: "20px 24px" }}>

        {/* Aviso al profesorado: alumnado con 3 o más partes para avisar a su familia */}
        {perfil.id === "profesor" && avisosPendientes > 0 && tab !== "mis_estadisticas" && (
          <div role="status" className="no-print" style={{ background: "#FDF0EF", border: `2px solid ${C.salmon}`, borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ color: C.dark, fontSize: 14 }}>
              <b>🔔 {avisosPendientes} alumno/a(s) con {UMBRAL_AVISO} o más partes este trimestre.</b>
              <div style={{ fontSize: 12, color: C.gray }}>Conviene avisar a su familia. Tienes el informe y el correo preparados.</div>
            </div>
            <button onClick={() => { setModuloProfesor("alumnos"); setTab("mis_estadisticas"); window.scrollTo(0, 0); }}
              style={{ background: C.salmon, color: "#fff", border: "none", borderRadius: 10, padding: "10px 16px", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>Ver avisos →</button>
          </div>
        )}

        {/* Ayuda de la pantalla */}
        <AyudaPantalla key={tab} id={tab} C={C} />

        {/* Alerta flotante */}
        {showAlerta && (
          <div style={{ background: "#FFF8E8", border: `2px solid ${C.salmon}`, borderRadius: 12, padding: 16, marginBottom: 16, position: "relative", boxShadow: "0 4px 12px rgba(236,143,141,0.2)" }}>
            <strong style={{ color: C.dark }}>⚠️ {showAlerta.alumno} — {showAlerta.curso}</strong>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#555" }}>{showAlerta.msg || showAlerta.msgs?.join(" · ")}</p>
            <button onClick={() => setShowAlerta(null)} style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.gray }}>✕</button>
          </div>
        )}

        {/* ── Nuevo Parte ── */}
        {tab === "partes" && (
          <div>
            {/* BIENVENIDA PERSONALIZADA CON SALUDO POR HORA */}
            {(() => {
              const hora = new Date().getHours();
              let saludo = "";
              if (hora < 12) saludo = "¡Buenos días";
              else if (hora < 18) saludo = "¡Buenas tardes";
              else saludo = "¡Buenas noches";
              
              const partesHoy = partes.filter(p => p.ts.split("T")[0] === todayStr() && p.profesor === usuario).length;
              const banoHoy = banos.filter(b => (b.ts || b.salida || "").split("T")[0] === todayStr() && b.profesor === usuario).length;
              
              // Calcular guardias pendientes del profesor
              const diasES  = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
              const diaHoy  = diasES[new Date().getDay()];
              const guardiasHoy = guardiasDeProfesor({ fecha: isoLocal(), profesor: usuario, profesores, cuadrante, apoyos: apoyosGuardia, sustitutos: sustitutosGuardia, ausencias }).length;
              
              return (
                <div style={{ background: `linear-gradient(135deg, ${C.blue} 0%, ${C.teal} 100%)`, color: "#fff", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{saludo}, {usuario}! 👋</h1>
                      <p style={{ margin: 0, fontSize: 15, opacity: 0.9, lineHeight: 1.5 }}>
                        Hoy has registrado <strong>{partesHoy} parte{partesHoy !== 1 ? 's' : ''}</strong>
                        {banoHoy > 0 && <> y <strong>{banoHoy} salida{banoHoy !== 1 ? 's' : ''}</strong> al baño</>}
                        {partesHoy === 0 && banoHoy === 0 && <>. ¡Buen día!</>}
                      </p>
                      {guardiasHoy > 0 && (
                        <div style={{ marginTop: 12, background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "8px 12px", border: "1px solid rgba(255,255,255,0.3)" }}>
                          <strong style={{ fontSize: 14 }}>🔔 Alerta: Tienes {guardiasHoy} guardia{guardiasHoy !== 1 ? 's' : ''} hoy</strong>
                          <div style={{ fontSize: 12, marginTop: 4, opacity: 0.9 }}>Ve a la sección "Mi Guardia Hoy" para verlas</div>
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 48 }}>📚</div>
                      <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <h2 style={{ color: C.dark, marginTop: 0 }}>📋 Nuevo Parte de Incidencia</h2>
            {parteGenerado && (
              <Card style={{ background: "#E8F5F3", border: `2px solid ${C.teal}`, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ color: C.teal }}>✅ Parte generado · {fmt(parteGenerado.ts)}</strong>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setShowParte(completar(parteGenerado))} style={{ background: C.blue, color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>👁 Ver</button>
                  </div>
                </div>
                <ComoAvisar parte={completar(parteGenerado)} />
              </Card>
            )}
            <Card>
              <label style={labelStyle}>🔍 Buscar alumno</label>
              <input value={fBusqueda} onChange={e => { setFBusqueda(e.target.value); setFAlumno(""); }} placeholder="Nombre o curso…" style={inpStyle} />
              {fBusqueda && !fAlumno && (
                <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, marginTop: 4, background: C.white, maxHeight: 180, overflowY: "auto", marginBottom: 8 }}>
                  {alumnos.filter(a => a.nombre.toLowerCase().includes(fBusqueda.toLowerCase()) || a.curso.toLowerCase().includes(fBusqueda.toLowerCase())).map(a => (
                    <div key={a.id} onClick={() => { setFAlumno(a.id); setFBusqueda(a.nombre); }}
                      style={{ padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #f3f4f6", fontSize: 13 }}
                      onMouseOver={e => e.currentTarget.style.background = C.cream}
                      onMouseOut={e => e.currentTarget.style.background = C.white}>
                      <strong>{a.nombre}</strong> — {a.curso}
                    </div>
                  ))}
                </div>
              )}
              {alumnoSel && (
                <div style={{ background: C.cream, borderRadius: 8, padding: 12, margin: "8px 0 16px", fontSize: 13, border: `1px solid #ddd` }}>
                  <div><strong>Curso:</strong> {alumnoSel.curso} | <strong>Tutor:</strong> {alumnoSel.tutor}</div>
                  <div style={{ marginTop: 4 }}>✉️ {alumnoSel.email} · 📱 {alumnoSel.telefono}</div>
                  {partesLeves(alumnoSel.id) >= 3 && <div style={{ marginTop: 6, color: C.salmon, fontWeight: 600 }}>⚠️ Acumulación: {partesLeves(alumnoSel.id)} partes leves</div>}
                  <div style={{ marginTop: 2, color: C.gray }}>Total partes: {partesDeAlumno(alumnoSel.id).length}</div>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16, marginTop: 8 }}>
                <div><label style={labelStyle}>⏰ Hora de clase</label><select value={fHora} onChange={e => setFHora(e.target.value)} style={selStyle}>{HORAS.map(h => <option key={h} value={h}>{conTramo(h)}</option>)}</select></div>
                <div><label style={labelStyle}>📂 Tipo de parte</label><select value={fTipo} onChange={e => setFTipo(e.target.value)} style={selStyle}>{TIPOS.map(t => <option key={t}>{t}</option>)}</select></div>
                <div><label style={labelStyle}>🎯 Gravedad</label><select value={fGravedad} onChange={e => { setFGravedad(e.target.value); setFTipificacion(""); }} style={selStyle}>{GRAVEDAD.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}</select></div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>⚖️ Tipificación normativa <span style={{ fontWeight: 400, color: C.gray, fontSize: 11 }}>({fGravedad === "leve" ? "Plan de Convivencia del Centro" : "Decreto 32/2019 CAM"})</span></label>
                <select value={fTipificacion} onChange={e => setFTipificacion(e.target.value)} style={{ ...selStyle, borderColor: fTipificacion ? C.teal : "#d1d5db" }}>
                  <option value="">— Seleccionar tipificación (opcional) —</option>
                  {(TIPIFICACION[fGravedad] || []).map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
                {fTipificacion && (
                  <div style={{ marginTop: 6, background: "#E8F5F3", borderRadius: 6, padding: "6px 12px", fontSize: 12, color: C.teal, fontWeight: 600 }}>
                    ✓ {TIPIFICACION[fGravedad]?.find(t => t.id === fTipificacion)?.label}
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>📝 Descripción del incidente</label>
                <textarea value={fDesc} onChange={e => setFDesc(e.target.value)} rows={4} placeholder="Describe detalladamente lo ocurrido…" style={{ ...inpStyle, resize: "vertical" }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>👤 Profesor responsable</label>
                <select value={fProfesor} onChange={e => setFProfesor(e.target.value)} style={selStyle} disabled={identidadFija}>{profesores.map(p => <option key={p}>{p}</option>)}</select>
              </div>
              <Btn onClick={crearParte} disabled={!fAlumno || !fDesc.trim()} color={C.teal} style={{ width: "100%", fontSize: 15, padding: "14px" }}>
                📋 Generar Parte
              </Btn>
            </Card>
          </div>
        )}

        {/* ── Parte de grupo ── */}
        {tab === "parte_grupo" && (
          <div>
            <h2 style={{ color: C.dark, marginTop: 0 }}>👥 Parte de Grupo</h2>
            {grupoGenerado && <Card style={{ background: "#E8F5F3", border: `2px solid ${C.teal}`, marginBottom: 20 }}><strong style={{ color: C.teal }}>✅ {grupoGenerado.total} partes generados para {grupoGenerado.curso} · {fmt(grupoGenerado.ts)}</strong></Card>}
            <Card>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>🏫 Seleccionar curso / grupo</label>
                <select value={gCurso} onChange={e => { setGCurso(e.target.value); setGExcluidos([]); }} style={selStyle}>
                  <option value="">— Selecciona un curso —</option>
                  {cursos.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              {gCurso && (() => {
                const grupo = alumnos.filter(a => a.curso === gCurso);
                const activos = grupo.filter(a => !gExcluidos.includes(a.id));
                return (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <label style={{ ...labelStyle, marginBottom: 0 }}>👤 Alumnos <span style={{ color: C.gray, fontWeight: 400 }}>({activos.length} de {grupo.length})</span></label>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => setGExcluidos(grupo.map(a => a.id))} style={{ background: "#FDF0EF", color: C.salmon, border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Excluir todos</button>
                        <button onClick={() => setGExcluidos([])} style={{ background: "#E8F5F3", color: C.teal, border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Incluir todos</button>
                      </div>
                    </div>
                    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
                      {grupo.map(a => {
                        const excl = gExcluidos.includes(a.id);
                        return (
                          <div key={a.id}
                            onClick={() => setGExcluidos(prev => prev.includes(a.id) ? prev.filter(x => x !== a.id) : [...prev, a.id])}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid #f3f4f6", cursor: "pointer", background: excl ? "#FDF0EF" : C.white }}
                            onMouseOver={e => e.currentTarget.style.background = excl ? "#FDE8E8" : C.cream}
                            onMouseOut={e => e.currentTarget.style.background = excl ? "#FDF0EF" : C.white}>
                            <span style={{ fontSize: 13, textDecoration: excl ? "line-through" : "none", color: excl ? "#9ca3af" : C.dark }}><strong>{a.nombre}</strong></span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: excl ? C.salmon : C.teal, background: excl ? "#FDF0EF" : "#E8F5F3", borderRadius: 6, padding: "2px 10px" }}>{excl ? "Excluido" : "✔ Incluido"}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div><label style={labelStyle}>⏰ Hora</label><select value={gHora} onChange={e => setGHora(e.target.value)} style={selStyle}>{HORAS.map(h => <option key={h} value={h}>{conTramo(h)}</option>)}</select></div>
                <div><label style={labelStyle}>📂 Tipo</label><select value={gTipo} onChange={e => setGTipo(e.target.value)} style={selStyle}>{TIPOS.map(t => <option key={t}>{t}</option>)}</select></div>
                <div><label style={labelStyle}>🎯 Gravedad</label><select value={gGravedad} onChange={e => { setGGravedad(e.target.value); setGTipificacion(""); }} style={selStyle}>{GRAVEDAD.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}</select></div>
                {gGravedad && TIPIFICACION[gGravedad]?.length > 0 && (
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={labelStyle}>⚖️ Tipificación de la falta</label>
                    <select value={gTipificacion} onChange={e => setGTipificacion(e.target.value)} style={selStyle}>
                      <option value="">— Seleccionar tipificación —</option>
                      {TIPIFICACION[gGravedad].map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                    {gGravedad !== "leve" && <div style={{ fontSize: 11, color: C.gray, marginTop: 4 }}>Decreto 32/2019 de la CAM</div>}
                    {gGravedad === "leve" && <div style={{ fontSize: 11, color: C.gray, marginTop: 4 }}>Plan de Convivencia del Centro</div>}
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>📝 Descripción</label>
                <textarea value={gDesc} onChange={e => setGDesc(e.target.value)} rows={4} placeholder="Describe el comportamiento del grupo…" style={{ ...inpStyle, resize: "vertical" }} />
              </div>
              <Btn onClick={crearParteGrupo} disabled={!gCurso || !gDesc.trim()} color={C.teal} style={{ width: "100%", fontSize: 15, padding: "14px" }}>
                👥 Generar Parte para {gCurso ? `${alumnos.filter(a => a.curso === gCurso && !gExcluidos.includes(a.id)).length} alumnos de ${gCurso}` : "el grupo"}
              </Btn>
            </Card>
          </div>
        )}

        {/* ── Baños (profesor) ── */}
        {tab === "bano" && (
          <div>
            <h2 style={{ color: C.dark, marginTop: 0 }}>🚻 Control de Salidas al Baño</h2>
            <Card>
              <label style={labelStyle}>🔍 Buscar alumno</label>
              <input value={bBusqueda} onChange={e => { setBBusqueda(e.target.value); setBAlumno(""); }} placeholder="Nombre o curso…" style={{ ...inpStyle, marginBottom: 8 }} />
              {bBusqueda && !bAlumno && (
                <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, background: C.white, maxHeight: 160, overflowY: "auto", marginBottom: 12 }}>
                  {alumnos.filter(a => a.nombre.toLowerCase().includes(bBusqueda.toLowerCase()) || a.curso.toLowerCase().includes(bBusqueda.toLowerCase())).map(a => (
                    <div key={a.id} onClick={() => { setBAlumno(a.id); setBBusqueda(a.nombre); }}
                      style={{ padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #f3f4f6", fontSize: 13 }}
                      onMouseOver={e => e.currentTarget.style.background = C.cream}
                      onMouseOut={e => e.currentTarget.style.background = C.white}>
                      <strong>{a.nombre}</strong> — {a.curso}
                    </div>
                  ))}
                </div>
              )}
              <Btn onClick={registrarSalida} disabled={!bAlumno} color={C.blue}>🚻 Registrar Salida</Btn>
            </Card>
            {banoActivos.length > 0 && (
              <Card style={{ background: "#FFF8E8", border: `1px solid ${C.salmon}` }}>
                <h3 style={{ margin: "0 0 12px", color: C.dark }}>⏳ Fuera ahora ({banoActivos.length})</h3>
                {banoActivos.map(b => (
                  <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.cream}` }}>
                    <div style={{ fontSize: 13 }}><strong>{b.alumno}</strong> — {b.curso} — {fmt(b.salida)}</div>
                    <button onClick={() => setBanos(prev => prev.map(x => x.id === b.id ? { ...x, regreso: new Date().toISOString() } : x))}
                      style={{ background: C.teal, color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>✅ Regresó</button>
                  </div>
                ))}
              </Card>
            )}
            <Card>
              <h3 style={{ marginTop: 0, color: C.dark }}>📅 Historial de hoy</h3>
              {banos.filter(b => b.fecha === todayStr()).length === 0
                ? <p style={{ color: C.gray }}>Sin registros hoy</p>
                : banos.filter(b => b.fecha === todayStr()).map(b => {
                  const mins = b.regreso ? Math.round((new Date(b.regreso) - new Date(b.salida)) / 60000) : null;
                  return (
                    <div key={b.id} style={{ padding: "8px 0", borderBottom: `1px solid ${C.cream}`, fontSize: 13, display: "flex", justifyContent: "space-between" }}>
                      <span><strong>{b.alumno}</strong> — {b.curso}</span>
                      <span style={{ color: C.gray }}>{fmt(b.salida)} {b.regreso ? `· ${mins} min` : "· 🔴 Fuera"}</span>
                    </div>
                  );
                })}
            </Card>
          </div>
        )}

        {/* ── Planificador de Guardias ── */}
        {tab === "planificador" && (
          <PlanificadorGuardias
            profesores={profesores}
            cursos={cursos}
            inpStyle={inpStyle}
            selStyle={selStyle}
            labelStyle={labelStyle}
          />
        )}

        {/* ── Registrar Guardia ── */}
        {tab === "guardias_prof" && (
          <div>
            <h2 style={{ color: C.dark, marginTop: 0 }}>🔄 Registrar Guardia</h2>
            {guardiaGenerada && (
              <Card style={{ background: "#E8F5F3", border: `2px solid ${C.teal}`, marginBottom: 20 }}>
                <strong style={{ color: C.teal }}>✅ Guardia registrada · {fmt(guardiaGenerada.ts)}</strong>
                <div style={{ fontSize: 13, marginTop: 4, color: C.dark }}>{guardiaGenerada.hora} · {guardiaGenerada.curso} · Guardia: {guardiaGenerada.profesorGuardia}</div>
              </Card>
            )}
            <Card>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div><label style={labelStyle}>👤 Profesor ausente</label><select value={guProfesorAusente} onChange={e => setGuProfesorAusente(e.target.value)} style={selStyle}><option value="">— Seleccionar —</option>{profesores.map(p => <option key={p}>{p}</option>)}</select></div>
                <div><label style={labelStyle}>⏰ Hora de la guardia</label><select value={guHora} onChange={e => setGuHora(e.target.value)} style={selStyle}>{HORAS.map(h => <option key={h} value={h}>{conTramo(h)}</option>)}</select></div>
                <div><label style={labelStyle}>🏢 Módulo</label><select value={guModulo} onChange={e => setGuModulo(e.target.value)} style={selStyle}>{MODULOS.map(m => <option key={m}>{m}</option>)}</select></div>
                <div><label style={labelStyle}>🏫 Curso</label><select value={guCurso} onChange={e => setGuCurso(e.target.value)} style={selStyle}><option value="">— Seleccionar —</option>{cursos.map(c => <option key={c}>{c}</option>)}</select></div>
                <div><label style={labelStyle}>📚 Materia</label><input value={guMateria} onChange={e => setGuMateria(e.target.value)} placeholder="Ej: Matemáticas" style={inpStyle} /></div>
                <div><label style={labelStyle}>🔄 Profesor de guardia</label><select value={guProfesorGuardia} onChange={e => setGuProfesorGuardia(e.target.value)} style={selStyle}><option value="">— Seleccionar —</option>{profesores.filter(p => p !== guProfesorAusente).map(p => <option key={p}>{p}</option>)}</select></div>
                <div><label style={labelStyle}>❓ Motivo de ausencia</label><select value={guMotivo} onChange={e => setGuMotivo(e.target.value)} style={selStyle}>{MOTIVOS.map(m => <option key={m}>{m}</option>)}</select></div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>📝 Material dejado para trabajar</label>
                <textarea value={guMaterial} onChange={e => setGuMaterial(e.target.value)} rows={3} placeholder="Describe el material o tarea…" style={{ ...inpStyle, resize: "vertical" }} />
              </div>
              <Btn onClick={crearGuardia} disabled={!guProfesorAusente || !guCurso || !guProfesorGuardia} color={C.blue} style={{ width: "100%", fontSize: 15, padding: "14px" }}>
                🔄 Registrar Guardia
              </Btn>
            </Card>
          </div>
        )}

        {/* ── Ver Guardias (profesor) ── */}
        {tab === "guardias_ver" && (
          <ParteDia profesores={profesores} cuadrante={cuadrante} apoyosGuardia={apoyosGuardia} sustitutosGuardia={sustitutosGuardia} ausencias={ausencias} C={C} />
        )}

        {/* ── Mis Partes ── */}
        {tab === "historial" && (
          <div>
            <h2 style={{ color: C.dark, marginTop: 0 }}>🗂 Mis Partes Enviados</h2>
            {partes.filter(p => p.profesor === fProfesor).length === 0
              ? <Card style={{ textAlign: "center", color: C.gray, padding: 40 }}>No has generado ningún parte aún</Card>
              : partes.filter(p => p.profesor === fProfesor).map(p => <ParteCard key={p.id} parte={p} onVer={() => setShowParte(completar(p))} onPrint={() => pdfParte(completar(p))} />)}
          </div>
        )}

        {/* ── Dashboard ── */}
        {tab === "dashboard" && (
          <div>
            {/* BIENVENIDA PERSONALIZADA CON SALUDO POR HORA */}
            {(() => {
              const hora = new Date().getHours();
              let saludo = "";
              if (hora < 12) saludo = "¡Buenos días";
              else if (hora < 18) saludo = "¡Buenas tardes";
              else saludo = "¡Buenas noches";
              
              const hoyISO = isoLocal();
              const guardiaHoy = Object.keys(cuadrante).filter(k => k.startsWith(`${hoyISO}|`)).length;
              const partesHoy = partes.filter(p => p.ts.split("T")[0] === todayStr()).length;
              const ausenciasHoy = ausencias.filter(a => isoLocal(a.fecha) === hoyISO).length;
              
              return (
                <div style={{ background: `linear-gradient(135deg, ${C.blue} 0%, ${C.teal} 100%)`, color: "#fff", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                    <div>
                      <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{saludo}, {usuario}! 👋</h1>
                      <p style={{ margin: 0, fontSize: 15, opacity: 0.9, lineHeight: 1.5 }}>
                        Hoy hay <strong>{guardiaHoy} zona{guardiaHoy !== 1 ? 's' : ''} de guardia</strong> programada{guardiaHoy !== 1 ? 's' : ''} 
                        {partesHoy > 0 && <> y <strong>{partesHoy} parte{partesHoy !== 1 ? 's' : ''}</strong> registrado{partesHoy !== 1 ? 's' : ''}</>}
                        {ausenciasHoy > 0 && <> con <strong>{ausenciasHoy} ausencia{ausenciasHoy !== 1 ? 's' : ''}</strong></>}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 48 }}>📚</div>
                      <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <h2 style={{ color: C.dark, marginTop: 0, marginBottom: 20 }}>📊 Estado General</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Total Partes", value: partes.length,                                              color: C.dark,   emoji: "📋" },
                { label: "Leves",        value: partes.filter(p => p.gravedad === "leve").length,           color: C.teal,   emoji: "🟡" },
                { label: "Graves",       value: partes.filter(p => p.gravedad === "grave").length,          color: C.amber,  emoji: "⚠️" },
                { label: "Muy Graves",   value: partes.filter(p => p.gravedad === "muy_grave").length,      color: C.salmon, emoji: "🔴" },
                { label: "Fuera Ahora",  value: banoActivos.length,                                         color: C.blue,   emoji: "🚻" },
                { label: "Profes ausentes hoy", value: new Set(ausencias.filter(a => isoLocal(a.fecha) === isoLocal()).map(a => a.profesor)).size, color: "#7c3aed",emoji: "🔄" },
                { label: "Alertas",      value: alertasNoLeidas,                                             color: C.salmon, emoji: "🔔" },
              ].map(s => (
                <div key={s.label} style={{ background: C.white, borderRadius: 12, padding: 16, textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", borderTop: `4px solid ${s.color}` }}>
                  <div style={{ fontSize: 32 }}>{s.emoji}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginTop: 8 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: C.gray, marginTop: 8, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <h3 style={{ color: C.dark }}>Resumen por curso</h3>
            <Card style={{ padding: 0, overflow: "hidden" }}>
              {cursos.map(c => {
                const pC = partes.filter(p => p.curso === c);
                if (!pC.length) return null;
                return (
                  <div key={c} style={{ padding: "12px 20px", borderBottom: `1px solid ${C.cream}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 700, color: C.dark }}>🏫 {c} <span style={{ color: C.gray, fontWeight: 400, fontSize: 13 }}>— {pC.length} parte(s)</span></div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["leve", "grave", "muy_grave"].map(g => { const n = pC.filter(p => p.gravedad === g).length; if (!n) return null; const gv = gObj(g); return <span key={g} style={{ background: gv.bg, color: gv.color, borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{gv.label.split(" ")[0]} ×{n}</span>; })}
                    </div>
                  </div>
                );
              })}
              {partes.length === 0 && <div style={{ padding: 20, color: C.gray, textAlign: "center" }}>Sin incidencias registradas</div>}
            </Card>
            <h3 style={{ color: C.dark }}>Alumnos con más incidencias</h3>
            <Card style={{ padding: 0, overflow: "hidden" }}>
              {alumnos.filter(a => partesDeAlumno(a.id).length > 0).sort((a, b) => partesDeAlumno(b.id).length - partesDeAlumno(a.id).length).map(a => (
                <div key={a.id} style={{ padding: "12px 20px", borderBottom: `1px solid ${C.cream}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ color: C.dark }}>{a.nombre}</strong> <span style={{ color: C.gray, fontSize: 13 }}>— {a.curso}</span>
                    {partesLeves(a.id) >= 3 && <span style={{ marginLeft: 8, background: "#FFF0CC", color: "#b45309", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>⚠️ Acumulación</span>}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["leve", "grave", "muy_grave"].map(g => { const n = partesDeAlumno(a.id).filter(p => p.gravedad === g).length; if (!n) return null; const gv = gObj(g); return <span key={g} style={{ background: gv.bg, color: gv.color, borderRadius: 8, padding: "3px 8px", fontSize: 12, fontWeight: 700 }}>{gv.label.split(" ")[0]} ×{n}</span>; })}
                    <span style={{ background: "#EEF5F8", color: C.blue, borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>Total: {partesDeAlumno(a.id).length}</span>
                  </div>
                </div>
              ))}
              {partes.length === 0 && <div style={{ padding: 20, color: C.gray, textAlign: "center" }}>Sin incidencias registradas</div>}
            </Card>
          </div>
        )}

        {/* ── Por Curso ── */}
        {tab === "por_curso" && (
          <div>
            <h2 style={{ color: C.dark, marginTop: 0 }}>🏫 Partes por Curso / Grupo</h2>
            {cursos.map(curso => {
              const pC = partes.filter(p => p.curso === curso);
              const alC = alumnos.filter(a => a.curso === curso);
              return (
                <div key={curso} style={{ background: C.white, borderRadius: 14, marginBottom: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                  <div style={{ background: `linear-gradient(90deg,${C.dark},${C.blue})`, color: "#fff", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{curso}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {["leve", "grave", "muy_grave"].map(g => { const n = pC.filter(p => p.gravedad === g).length; if (!n) return null; const gv = gObj(g); return <span key={g} style={{ background: gv.bg, color: gv.color, borderRadius: 8, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{gv.label.split(" ")[0]} ×{n}</span>; })}
                      <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 8, padding: "2px 10px", fontSize: 13 }}>Total: {pC.length}</span>
                    </div>
                  </div>
                  {pC.length === 0
                    ? <div style={{ padding: "16px 20px", color: C.gray, fontSize: 13 }}>Sin partes en este curso</div>
                    : alC.map(a => {
                      const pA = partesDeAlumno(a.id);
                      if (!pA.length) return null;
                      return (
                        <div key={a.id} style={{ borderBottom: `1px solid ${C.cream}` }}>
                          <div style={{ padding: "10px 20px", background: C.cream, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontWeight: 600, fontSize: 14, color: C.dark }}>{a.nombre}</span>
                            <div style={{ display: "flex", gap: 6 }}>
                              {["leve", "grave", "muy_grave"].map(g => { const n = pA.filter(p => p.gravedad === g).length; if (!n) return null; const gv = gObj(g); return <span key={g} style={{ background: gv.bg, color: gv.color, borderRadius: 8, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{gv.label.split(" ")[0]} ×{n}</span>; })}
                            </div>
                          </div>
                          {pA.map(p => (
                            <div key={p.id} style={{ padding: "8px 20px 8px 36px", fontSize: 13, borderBottom: `1px solid ${C.cream}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ color: "#374151" }}>📅 {fmt(p.ts)} · {p.hora} · {p.tipo}{p.esGrupal ? " · grupal" : ""}</span>
                              <div style={{ display: "flex", gap: 6 }}>
                                <Badge g={p.gravedad} />
                                <button onClick={() => setShowParte(completar(p))} style={{ background: "#EEF5F8", color: C.blue, border: "none", borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Ver</button>
                                <button onClick={() => pdfParte(completar(p))} style={{ background: "#FDF0EF", color: C.salmon, border: "none", borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>🖨</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Por Alumno ── */}
        {tab === "por_alumno" && (
          <div>
            <h2 style={{ color: C.dark, marginTop: 0 }}>👤 Partes por Alumno</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <select value={filtCurso} onChange={e => { setFiltCurso(e.target.value); setFiltAlumno(""); }} style={selStyle}><option value="">Todos los cursos</option>{cursos.map(c => <option key={c}>{c}</option>)}</select>
              <select value={filtAlumno} onChange={e => setFiltAlumno(e.target.value)} style={selStyle}><option value="">Seleccionar alumno</option>{alumnos.filter(a => !filtCurso || a.curso === filtCurso).map(a => <option key={a.id} value={a.id}>{a.nombre} — {a.curso}</option>)}</select>
            </div>
            {filtAlumno ? (() => {
              const al = alumnos.find(a => a.id === parseInt(filtAlumno));
              const pAl = partesDeAlumno(al.id);
              return (
                <div>
                  <Card>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: C.dark }}>{al.nombre}</div>
                        <div style={{ color: C.gray, fontSize: 14, marginTop: 4 }}>{al.curso} · Tutor: {al.tutor}</div>
                        <div style={{ fontSize: 13, marginTop: 4 }}>✉️ {al.email} · 📱 {al.telefono}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 32, fontWeight: 800, color: C.dark }}>{pAl.length}</div>
                        <div style={{ fontSize: 12, color: C.gray }}>partes totales</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                      {["leve", "grave", "muy_grave"].map(g => { const n = pAl.filter(p => p.gravedad === g).length; const gv = gObj(g); return <div key={g} style={{ flex: 1, background: gv.bg, borderRadius: 10, padding: 12, textAlign: "center", border: `2px solid ${gv.color}` }}><div style={{ fontSize: 24, fontWeight: 800, color: gv.color }}>{n}</div><div style={{ fontSize: 12, color: gv.color, fontWeight: 600 }}>{gv.label}</div></div>; })}
                    </div>
                    {partesLeves(al.id) >= 3 && <div style={{ marginTop: 12, background: "#FFF0CC", border: "1px solid #fbbf24", borderRadius: 8, padding: "10px 14px", fontSize: 13, fontWeight: 600, color: "#92400e" }}>⚠️ Acumulación de {partesLeves(al.id)} partes leves — Considerar sanción</div>}
                  </Card>
                  {pAl.length === 0
                    ? <Card style={{ textAlign: "center", color: C.gray }}>Sin partes registrados</Card>
                    : pAl.map(p => <ParteCard key={p.id} parte={p} onVer={() => setShowParte(completar(p))} onPrint={() => pdfParte(completar(p))} />)}
                </div>
              );
            })() : (
              <Card style={{ padding: 0, overflow: "hidden" }}>
                {alumnos.filter(a => (!filtCurso || a.curso === filtCurso) && partesDeAlumno(a.id).length > 0)
                  .sort((a, b) => partesDeAlumno(b.id).length - partesDeAlumno(a.id).length)
                  .map(a => (
                    <div key={a.id} onClick={() => setFiltAlumno(a.id)}
                      style={{ padding: "12px 20px", borderBottom: `1px solid ${C.cream}`, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                      onMouseOver={e => e.currentTarget.style.background = C.cream}
                      onMouseOut={e => e.currentTarget.style.background = C.white}>
                      <div>
                        <strong style={{ color: C.dark }}>{a.nombre}</strong> <span style={{ color: C.gray, fontSize: 13 }}>— {a.curso}</span>
                        {partesLeves(a.id) >= 3 && <span style={{ marginLeft: 8, background: "#FFF0CC", color: "#b45309", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>⚠️</span>}
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        {["leve", "grave", "muy_grave"].map(g => { const n = partesDeAlumno(a.id).filter(p => p.gravedad === g).length; if (!n) return null; const gv = gObj(g); return <span key={g} style={{ background: gv.bg, color: gv.color, borderRadius: 8, padding: "3px 8px", fontSize: 12, fontWeight: 700 }}>{gv.label.split(" ")[0]} ×{n}</span>; })}
                        <span style={{ background: "#EEF5F8", color: C.blue, borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{partesDeAlumno(a.id).length}</span>
                        <span style={{ color: C.gray, fontSize: 16 }}>›</span>
                      </div>
                    </div>
                  ))}
                {alumnos.filter(a => (!filtCurso || a.curso === filtCurso) && partesDeAlumno(a.id).length > 0).length === 0 && <div style={{ padding: 30, textAlign: "center", color: C.gray }}>Sin alumnos con partes</div>}
              </Card>
            )}
          </div>
        )}

        {/* ── Todos los Partes ── */}
        {tab === "partes_todos" && (
          <div>
            <h2 style={{ color: C.dark, marginTop: 0 }}>📋 Todos los Partes</h2>
            <Card>
              <div style={{ fontWeight: 600, color: C.dark, marginBottom: 10 }}>🔍 Filtros</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
                <select value={filtCurso} onChange={e => { setFiltCurso(e.target.value); setFiltAlumno(""); }} style={{ ...selStyle, padding: "8px 12px", fontSize: 13 }}><option value="">Todos los cursos</option>{cursos.map(c => <option key={c}>{c}</option>)}</select>
                <select value={filtAlumno} onChange={e => setFiltAlumno(e.target.value)} style={{ ...selStyle, padding: "8px 12px", fontSize: 13 }}><option value="">Todos los alumnos</option>{alumnos.filter(a => !filtCurso || a.curso === filtCurso).map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}</select>
                <select value={filtGravedad} onChange={e => setFiltGravedad(e.target.value)} style={{ ...selStyle, padding: "8px 12px", fontSize: 13 }}><option value="">Toda gravedad</option>{GRAVEDAD.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}</select>
                <input type="date" value={filtFechaDesde} onChange={e => setFiltFechaDesde(e.target.value)} style={{ ...inpStyle, padding: "8px 12px", fontSize: 13 }} />
                <input type="date" value={filtFechaHasta} onChange={e => setFiltFechaHasta(e.target.value)} style={{ ...inpStyle, padding: "8px 12px", fontSize: 13 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <span style={{ fontSize: 13, color: C.gray }}>{partesFiltrados.length} parte(s)</span>
                <button onClick={() => { setFiltCurso(""); setFiltAlumno(""); setFiltGravedad(""); setFiltFechaDesde(""); setFiltFechaHasta(""); }} style={{ background: "none", border: `1px solid #d1d5db`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, color: C.gray }}>Limpiar</button>
              </div>
            </Card>
            {partesFiltrados.length === 0
              ? <Card style={{ textAlign: "center", color: C.gray }}>Sin partes con los filtros actuales</Card>
              : partesFiltrados.map(p => <ParteCard key={p.id} parte={p} onVer={() => setShowParte(completar(p))} onPrint={() => pdfParte(completar(p))} />)}
          </div>
        )}

        {/* ── Guardias (Jefatura) ── */}
        {tab === "guardias_jef" && (
          <div>
            <h2 style={{ color: C.dark, marginTop: 0 }}>🔄 Registro de Guardias</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 14, marginBottom: 20 }}>
              {[{ label: "Guardias Hoy", value: guardias.filter(g => g.fecha === todayStr()).length, color: C.blue }, { label: "Esta Semana", value: guardias.filter(g => weekKey(g.fecha) === weekKey(new Date())).length, color: C.teal }, { label: "Total", value: guardias.length, color: C.dark }].map(s => (
                <div key={s.label} style={{ background: C.white, borderRadius: 12, padding: 16, textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", borderTop: `4px solid ${s.color}` }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {guardias.length === 0
              ? <Card style={{ textAlign: "center", color: C.gray, padding: 40 }}>Sin guardias registradas</Card>
              : guardias.map(g => (
                <Card key={g.id} style={{ borderLeft: `4px solid ${C.blue}` }}>
                  <div style={{ fontWeight: 700, color: C.dark, fontSize: 15 }}>🔄 {g.hora} · {g.modulo} · {g.curso}{g.materia && ` · ${g.materia}`}</div>
                  <div style={{ fontSize: 13, color: C.gray, marginTop: 4 }}>📅 {fmt(g.ts)}</div>
                  <div style={{ fontSize: 13, marginTop: 6 }}><span style={{ color: C.salmon, fontWeight: 600 }}>Ausente:</span> {g.profesorAusente} <span style={{ color: C.gray, marginLeft: 8 }}>({g.motivo})</span></div>
                  <div style={{ fontSize: 13, marginTop: 2 }}><span style={{ color: C.teal, fontWeight: 600 }}>Guardia:</span> {g.profesorGuardia}</div>
                  {g.material && <div style={{ fontSize: 13, marginTop: 4, background: C.cream, borderRadius: 6, padding: "6px 10px" }}>📝 Material: {g.material}</div>}
                </Card>
              ))}
          </div>
        )}

        {/* ── Baños live (Jefatura) ── */}
        {/* ── Mi Guardia Hoy (Profesor) ── */}
        {tab === "mi_guardia" && (
          <MiGuardiaHoy firmas={firmas} setFirmas={setFirmas} listas={listas} setListas={setListas} alumnos={alumnos} profesores={profesores} cuadrante={cuadrante} apoyosGuardia={apoyosGuardia} sustitutosGuardia={sustitutosGuardia} ausencias={ausencias} fProfesor={fProfesor} setFProfesor={setFProfesor} C={C} selStyle={selStyle} labelStyle={labelStyle} usuario={usuario} setShowCuadrante={setShowCuadrante} diaSeleccionadoGuardias={diaSeleccionadoGuardias} setDiaSeleccionadoGuardias={setDiaSeleccionadoGuardias} />
        )}

        {/* ── Notificar Ausencia (Profesor) ── */}
        {tab === "notif_ausencia" && (
          <NotificarAusencia
            usuario={usuario}
            profesores={profesores} ausencias={ausencias} setAusencias={setAusencias}
            ausProfesor={ausProfesor} setAusProfesor={setAusProfesor}
            ausMotivo={ausMotivo} setAusMotivo={setAusMotivo}
            ausFecha={ausFecha} setAusFecha={setAusFecha}
            ausHoras={ausHoras} setAusHoras={setAusHoras}
            ausTarea={ausTarea} setAusTarea={setAusTarea}
            ausEnlace={ausEnlace} setAusEnlace={setAusEnlace}
            ausUbicacion={ausUbicacion} setAusUbicacion={setAusUbicacion}
            ausAula={ausAula} setAusAula={setAusAula}
            ausAsignatura={ausAsignatura} setAusAsignatura={setAusAsignatura}
            fProfesor={fProfesor} C={C} inpStyle={inpStyle} selStyle={selStyle} labelStyle={labelStyle} fmt={fmt}
          />
        )}

        {/* ── Cuadrante de Guardias (Jefatura) ── */}
        {tab === "cuadrante" && (
          <CuadranteGuardias
            profesores={profesores} cuadrante={cuadrante} setCuadrante={setCuadrante}
            apoyosGuardia={apoyosGuardia} setApoyosGuardia={setApoyosGuardia}
            sustitutosGuardia={sustitutosGuardia} setSustitutosGuardia={setSustitutosGuardia}
            profesoresGuardia={profesoresGuardia} setProfesoresGuardia={setProfesoresGuardia}
            ausencias={ausencias}
            quinceInicio={quinceInicio} setQInicio={setQInicio}
            quinceProfesor={quinceProfesor} setQProf={setQProf}
            C={C} inpStyle={inpStyle} selStyle={selStyle} labelStyle={labelStyle}
          />
        )}

        {/* ── Parte del Día (Jefatura) ── */}
        {tab === "parte_dia" && (
          <ParteDia profesores={profesores} cuadrante={cuadrante} apoyosGuardia={apoyosGuardia} sustitutosGuardia={sustitutosGuardia} ausencias={ausencias} C={C} />
        )}

        {/* ── Coordinación Diaria de Ausencias (Jefatura) ── */}
        {tab === "coordinacion" && (
          <CoordinacionAusencias
            profesores={profesores}
            ausencias={ausencias}
            cuadrante={cuadrante}
            apoyosGuardia={apoyosGuardia}
            sustitutosGuardia={sustitutosGuardia}
            profesoresGuardia={profesoresGuardia}
            HORAS_GUARDIA={HORAS_GUARDIA}
            ZONAS_CENTRO={ZONAS_CENTRO}
            DIAS_SEMANA={DIAS_SEMANA}
            C={C}
            inpStyle={inpStyle}
            selStyle={selStyle}
            labelStyle={labelStyle}
            fechaCoordinacion={fechaCoordinacion}
            setFechaCoordinacion={setFechaCoordinacion}
          />
        )}

        {/* ── Gestión Ausencias (Jefatura) ── */}
        {tab === "firmas_jef" && (
          <FirmasYListas profesores={profesores} cuadrante={cuadrante} apoyosGuardia={apoyosGuardia} sustitutosGuardia={sustitutosGuardia}
            ausencias={ausencias} firmas={firmas} listas={listas} C={C} inpStyle={inpStyle} />
        )}

        {tab === "ausencias_jef" && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <button onClick={() => { setRegistroTelefono(v => !v); setAusProfesor(""); }}
                style={{ background: registroTelefono ? "#f3f4f6" : C.salmon, color: registroTelefono ? C.dark : "#fff", border: "none", borderRadius: 10, padding: "11px 16px", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
                {registroTelefono ? "✕ Cerrar el registro" : "📞 Registrar una ausencia comunicada por teléfono"}
              </button>
            </div>
            {registroTelefono && (
              <NotificarAusencia modoJefatura usuario={usuario}
                profesores={profesores} ausencias={ausencias} setAusencias={setAusencias}
                ausProfesor={ausProfesor} setAusProfesor={setAusProfesor}
                ausMotivo={ausMotivo} setAusMotivo={setAusMotivo}
                ausFecha={ausFecha} setAusFecha={setAusFecha}
                ausHoras={ausHoras} setAusHoras={setAusHoras}
                ausTarea={ausTarea} setAusTarea={setAusTarea}
                ausEnlace={ausEnlace} setAusEnlace={setAusEnlace}
                ausUbicacion={ausUbicacion} setAusUbicacion={setAusUbicacion}
                ausAula={ausAula} setAusAula={setAusAula}
                ausAsignatura={ausAsignatura} setAusAsignatura={setAusAsignatura}
                fProfesor={fProfesor} C={C} inpStyle={inpStyle} selStyle={selStyle} labelStyle={labelStyle} fmt={fmt} />
            )}
            <GestionAusencias ausencias={ausencias} setAusencias={setAusencias} profesores={profesores} C={C} fmt={fmt} />
          </div>
        )}

        {/* ── Galvángram (Jefatura & Profesor) ── */}
        {tab === "mensajeria" && (
          <Galvangramm 
            mensajes={mensajes} 
            setMensajes={setMensajes}
            usuario={usuario}
            esJefatura={perfil.id === "jefatura"}
            profesores={profesores}
            C={C}
            inpStyle={inpStyle}
            selStyle={selStyle}
            labelStyle={labelStyle}
          />
        )}

        {tab === "bano_live" && (
          <div>
            <h2 style={{ color: C.dark, marginTop: 0 }}>🚻 Baños — Tiempo Real</h2>
            <Card style={{ background: banoActivos.length > 0 ? "#FFF8E8" : "#E8F5F3", border: `2px solid ${banoActivos.length > 0 ? C.salmon : C.teal}` }}>
              <h3 style={{ margin: "0 0 12px", color: C.dark }}>{banoActivos.length > 0 ? `⏳ ${banoActivos.length} alumno(s) fuera` : "✅ Ningún alumno fuera"}</h3>
              {banoActivos.map(b => <div key={b.id} style={{ padding: "8px 0", borderBottom: `1px solid rgba(0,0,0,0.08)`, fontSize: 14 }}><strong>{b.alumno}</strong> — {b.curso} — {fmt(b.salida)}</div>)}
            </Card>
            <Card>
              <h3 style={{ marginTop: 0, color: C.dark }}>📋 Historial completo</h3>
              {banos.length === 0
                ? <p style={{ color: C.gray }}>Sin registros</p>
                : banos.map(b => {
                  const mins = b.regreso ? Math.round((new Date(b.regreso) - new Date(b.salida)) / 60000) : null;
                  return (
                    <div key={b.id} style={{ padding: "8px 0", borderBottom: `1px solid ${C.cream}`, fontSize: 13, display: "flex", justifyContent: "space-between" }}>
                      <span><strong>{b.alumno}</strong> — {b.curso} — {b.fecha}</span>
                      <span style={{ color: C.gray }}>{b.regreso ? `${mins} min` : "🔴 Fuera"}</span>
                    </div>
                  );
                })}
            </Card>
          </div>
        )}

        {/* ── Alertas ── */}
        {tab === "alertas" && (
          <div>
            <h2 style={{ color: C.dark, marginTop: 0 }}>🔔 Alertas</h2>
            {alertas.length === 0
              ? <Card style={{ textAlign: "center", color: C.gray, padding: 40 }}>Sin alertas</Card>
              : alertas.map(a => {
                const config = {
                  acumulacion_leves: { icon: "⚠️", color: "#b45309", bg: "#FFF0CC", border: "#fbbf24", label: "Acumulación de leves" },
                  total_partes:      { icon: "📋", color: C.blue,     bg: "#EEF5F8", border: C.blue,    label: "Límite de partes" },
                  fuera_horario:     { icon: "🕐", color: C.teal,     bg: "#E8F5F3", border: C.teal,    label: "Fuera de horario" },
                  bano:              { icon: "🚻", color: C.salmon,   bg: "#FDF0EF", border: C.salmon,  label: "Abuso de baño" },
                }[a.tipo] || { icon: "🔔", color: C.gray, bg: C.cream, border: "#ccc", label: "Alerta" };
                return (
                  <div key={a.id}
                    onClick={() => setAlertas(prev => prev.map(x => x.id === a.id ? { ...x, leida: true } : x))}
                    style={{ background: a.leida ? C.white : config.bg, border: `1px solid ${a.leida ? "#e5e7eb" : config.border}`, borderLeft: `4px solid ${a.leida ? "#e5e7eb" : config.border}`, borderRadius: 12, padding: 16, marginBottom: 10, cursor: "pointer", opacity: a.leida ? .7 : 1, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 20 }}>{config.icon}</span>
                        <div>
                          <div style={{ fontWeight: 700, color: a.leida ? C.gray : config.color }}>{config.label} — {a.alumno}</div>
                          <div style={{ fontSize: 13, color: "#374151", marginTop: 2 }}>{a.curso} · {a.msg || a.msgs?.join(" · ")}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                        <div style={{ fontSize: 12, color: C.gray }}>{fmt(a.ts)}</div>
                        {!a.leida && <div style={{ fontSize: 11, color: config.color, marginTop: 4, fontWeight: 600 }}>● Sin leer</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* ── Estadísticas e informes del profesorado y tutores ── */}
        {tab === "mis_estadisticas" && (
          <EstadisticasDocumentos key={usuario} modo="profesor" usuario={usuario} avisos={avisosFamilia} setAvisos={setAvisosFamilia} partes={partes.map(completar)} banos={banos} ausencias={[]} firmas={[]} listas={[]}
            alumnos={alumnos} profesores={profesores} cuadrante={{}} apoyosGuardia={{}} sustitutosGuardia={{}}
            tutores={tutores} onVerParte={p => setShowParte(completar(p))} C={C} inpStyle={inpStyle} selStyle={selStyle} labelStyle={labelStyle} />
        )}

        {/* ── Estadísticas y documentos por fecha (Jefatura) ── */}
        {tab === "estadisticas" && (
          <EstadisticasDocumentos partes={partes.map(completar)} banos={banos} ausencias={ausencias} firmas={firmas} listas={listas}
            alumnos={alumnos} profesores={profesores} cuadrante={cuadrante} apoyosGuardia={apoyosGuardia} sustitutosGuardia={sustitutosGuardia}
            tutores={tutores} onVerParte={p => setShowParte(completar(p))} C={C} inpStyle={inpStyle} selStyle={selStyle} labelStyle={labelStyle} />
        )}

        {/* ── Informe ── */}
        {tab === "informe" && (
          <div>
            <h2 style={{ color: C.dark, marginTop: 0 }}>📤 Exportar Informe</h2>
            
            {/* SELECTOR DE TIPO DE INFORME */}
            <Card style={{ marginBottom: 20 }}>
              <label style={labelStyle}>📊 Selecciona el tipo de informe</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                <button 
                  onClick={() => setInformeType("partes")}
                  style={{ padding: 16, border: `2px solid ${informeType === "partes" ? C.teal : C.cream}`, borderRadius: 10, background: informeType === "partes" ? "#E8F5F3" : C.white, cursor: "pointer", fontWeight: 600, color: informeType === "partes" ? C.teal : C.gray, transition: "all .2s" }}>
                  📋 Informe de Partes
                </button>
                <button 
                  onClick={() => setInformeType("banos")}
                  style={{ padding: 16, border: `2px solid ${informeType === "banos" ? C.teal : C.cream}`, borderRadius: 10, background: informeType === "banos" ? "#E8F5F3" : C.white, cursor: "pointer", fontWeight: 600, color: informeType === "banos" ? C.teal : C.gray, transition: "all .2s" }}>
                  🚻 Informe de Salidas al Baño
                </button>
              </div>
            </Card>

            <Card>
              <div style={{ background: "#EEF5F8", borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 13, color: C.blue }}>
                💡 El informe se abrirá en pantalla completa. Pulsa <strong>⬇️ Descargar PDF</strong> para guardarlo o imprimirlo.
              </div>
              
              {informeType === "partes" ? (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10, marginBottom: 16 }}>
                    <select value={filtCurso} onChange={e => { setFiltCurso(e.target.value); setFiltAlumno(""); }} style={{ ...selStyle, fontSize: 13 }}><option value="">Todos los cursos</option>{cursos.map(c => <option key={c}>{c}</option>)}</select>
                    <select value={filtAlumno} onChange={e => setFiltAlumno(e.target.value)} style={{ ...selStyle, fontSize: 13 }}><option value="">Todos los alumnos</option>{alumnos.filter(a => !filtCurso || a.curso === filtCurso).map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}</select>
                    <select value={filtGravedad} onChange={e => setFiltGravedad(e.target.value)} style={{ ...selStyle, fontSize: 13 }}><option value="">Toda gravedad</option>{GRAVEDAD.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}</select>
                    <input type="date" value={filtFechaDesde} onChange={e => setFiltFechaDesde(e.target.value)} style={{ ...inpStyle, fontSize: 13 }} />
                    <input type="date" value={filtFechaHasta} onChange={e => setFiltFechaHasta(e.target.value)} style={{ ...inpStyle, fontSize: 13 }} />
                  </div>
                  {filtCurso
                    ? <TutoriasGrupos soloCurso={filtCurso} cursos={cursos} tutores={tutores} setTutores={setTutores} setAlumnos={setAlumnos} profesores={profesores} C={C} inpStyle={inpStyle} />
                    : <div style={{ fontSize: 12, color: C.gray, marginBottom: 12 }}>👩‍🏫 El informe incluye el tutor/a de cada grupo. Elige un curso para ver o cambiar su tutor/a.</div>}
                  <div style={{ background: C.cream, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: C.dark }}>
                    El informe incluirá <strong>{partesFiltrados.length} parte(s)</strong>
                    {filtCurso && ` · ${filtCurso}`}{filtGravedad && ` · ${GRAVEDAD.find(g => g.id === filtGravedad)?.label}`}
                    {filtFechaDesde && ` · Desde: ${fmtD(filtFechaDesde)}`}{filtFechaHasta && ` · Hasta: ${fmtD(filtFechaHasta)}`}
                  </div>
                  <Btn onClick={() => setPrintInforme(true)} disabled={partesFiltrados.length === 0} color={C.teal} style={{ width: "100%", fontSize: 15, padding: "14px" }}>
                    📄 Ver informe de partes y descargar PDF
                  </Btn>
                </>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10, marginBottom: 16 }}>
                    <select value={filtCurso} onChange={e => setFiltCurso(e.target.value)} style={{ ...selStyle, fontSize: 13 }}><option value="">Todos los cursos</option>{cursos.map(c => <option key={c}>{c}</option>)}</select>
                    <input type="date" value={filtFechaDesde} onChange={e => setFiltFechaDesde(e.target.value)} style={{ ...inpStyle, fontSize: 13 }} />
                    <input type="date" value={filtFechaHasta} onChange={e => setFiltFechaHasta(e.target.value)} style={{ ...inpStyle, fontSize: 13 }} />
                  </div>
                  <div style={{ background: C.cream, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: C.dark }}>
                    El informe incluirá <strong>{banosFiltrados.length} salida(s)</strong> al baño
                    {filtCurso && ` · ${filtCurso}`}
                    {filtFechaDesde && ` · Desde: ${fmtD(filtFechaDesde)}`}{filtFechaHasta && ` · Hasta: ${fmtD(filtFechaHasta)}`}
                  </div>
                  <Btn onClick={() => setPrintInforme(true)} disabled={banosFiltrados.length === 0} color={C.teal} style={{ width: "100%", fontSize: 15, padding: "14px" }}>
                    📄 Ver informe de baños y descargar PDF
                  </Btn>
                </>
              )}
            </Card>
            <InformesGuardados informes={informes} setInformes={setInformes} partes={partes} banos={banos} tutores={tutores} C={C} />
          </div>
        )}

        {/* ── Admin Alumnos ── */}
        {tab === "admin_panel" && (
          <TutoriasGrupos cursos={cursos} tutores={tutores} setTutores={setTutores} setAlumnos={setAlumnos} profesores={profesores} C={C} inpStyle={inpStyle} />
        )}
        {tab === "admin_panel" && (
          <AdminAlumnos alumnos={alumnos} setAlumnos={setAlumnos} inpStyle={inpStyle} C={C} />
        )}

        {/* ── Admin Profesores ── */}
        {tab === "admin_profesores" && (
          <div>
            <h2 style={{ color: C.dark, marginTop: 0 }}>👨‍🏫 Gestión de Profesores</h2>
            <Card>
              <h3 style={{ marginTop: 0, color: C.dark }}>Añadir profesor</h3>
              <div style={{ display: "flex", gap: 10 }}>
                <input value={nuevoProfesor} onChange={e => setNuevoProfesor(e.target.value)} placeholder="Nombre completo del profesor" style={{ ...inpStyle, flex: 1 }}
                  onKeyDown={e => { if (e.key === "Enter" && nuevoProfesor.trim()) { setProfesores(prev => [...prev, nuevoProfesor.trim()]); setNuevoProfesor(""); } }} />
                <Btn onClick={() => { 
                  if (!nuevoProfesor.trim()) return; 
                  setProfesores(prev => [...prev, nuevoProfesor.trim()]); 
                  setNuevoProfesor(""); 
                  // Feedback visual
                  setFeedbackAñadirProfesor(true);
                  setTimeout(() => setFeedbackAñadirProfesor(false), 1500);
                }} color={feedbackAñadirProfesor ? "#10b981" : C.teal} style={{ transition: "all .3s ease" }}>
                  {feedbackAñadirProfesor ? "✅ ¡Agregado!" : "➕ Añadir"}
                </Btn>
              </div>
            </Card>
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "12px 20px", background: C.cream, borderBottom: `1px solid #e5e7eb`, fontWeight: 600, fontSize: 13, color: C.dark }}>👨‍🏫 {profesores.length} profesor(es)</div>
              <div style={{ padding: "10px 20px", fontSize: 12, color: C.gray, borderBottom: `1px solid ${C.cream}` }}>
                El cargo decide a qué perfiles puede entrar cada persona: Profesor/a solo al de profesor; Jefatura de Estudios también a Jefatura; Dirección a los tres; Secretaría y Coordinación TIC también a Administración.
              </div>
              {profesores.map((p, i) => {
                const cuenta = cuentas[p] || {};
                return (
                  <div key={p} style={{ padding: "10px 20px", borderBottom: `1px solid ${C.cream}`, fontSize: 14, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ minWidth: 160 }}>
                      <div style={{ fontWeight: 600, color: C.dark }}>👤 {p}{p === usuario ? " (tú)" : ""}</div>
                      <div style={{ fontSize: 11, color: cuenta.clave ? C.teal : C.gray }}>{cuenta.clave ? "Clave creada" : "Sin clave: la creará al entrar por primera vez"}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <select aria-label={`Cargo de ${p}`} value={cuenta.cargo || "profesor"}
                        onChange={e => {
                          const nuevo = e.target.value;
                          if (p === usuario && !CARGOS.find(c => c.id === nuevo).perfiles.includes("admin") &&
                              !window.confirm("Vas a quitarte el acceso a Administración. ¿Continuar?")) return;
                          setCuentas(prev => ({ ...prev, [p]: { ...(prev[p] || {}), cargo: nuevo } }));
                        }}
                        style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 13 }}>
                        {CARGOS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                      {cuenta.clave && (
                        <button onClick={() => { if (window.confirm(`¿Restablecer la clave de ${p}? La próxima vez que entre tendrá que crear una nueva.`)) setCuentas(prev => ({ ...prev, [p]: { ...(prev[p] || {}), clave: null } })); }}
                          style={{ background: "#EEF5F8", color: C.blue, border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>🔑 Restablecer clave</button>
                      )}
                      <button aria-label={`Eliminar a ${p}`} onClick={() => { if (window.confirm(`¿Eliminar a ${p} de la lista del profesorado?`)) setProfesores(prev => prev.filter((_, j) => j !== i)); }} style={{ background: "#FDF0EF", color: C.salmon, border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>🗑</button>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        )}

      </div>

      {/* ── Modal Ver Cuadrante Completo ── */}
      {showCuadrante && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: C.white, borderRadius: 16, maxWidth: "95vw", width: "100%", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ background: `linear-gradient(90deg,${C.dark},${C.blue})`, color: "#fff", padding: "16px 24px", borderRadius: "16px 16px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>📅 Cuadrante de Guardias</div>
                <button onClick={() => setSemanaCuadrante(w => w - 1)} aria-label="Semana anterior" style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>←</button>
                <span style={{ fontSize: 13 }}>Semana del {sumarDias(lunesDe(), 7 * semanaCuadrante).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</span>
                <button onClick={() => setSemanaCuadrante(w => w + 1)} aria-label="Semana siguiente" style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>→</button>
              </div>
              <button onClick={() => { setShowCuadrante(false); setSemanaCuadrante(0); }} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
            <div style={{ padding: 20, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 900 }}>
                <thead>
                  <tr style={{ background: C.dark }}>
                    <th style={{ padding: "10px 8px", color: "#fff", textAlign: "left", fontWeight: 600 }}>Hora</th>
                    {[0,1,2,3,4].map(i => { const f = sumarDias(lunesDe(), 7 * semanaCuadrante + i); return <th key={i} style={{ padding: "10px 8px", color: "#fff", textAlign: "center", fontWeight: 600 }}>{DIAS_ES[f.getDay()].substring(0,3)} {f.getDate()}/{f.getMonth()+1}</th>; })}
                  </tr>
                </thead>
                <tbody>
                  {HORAS_GUARDIA.map((hora, idx) => (
                    <tr key={hora} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "10px 8px", fontWeight: 700, color: C.dark, width: 90 }}>{hora}<div style={{ fontSize: 10, fontWeight: 500, color: C.gray }}>{HORARIO[hora]}</div></td>
                      {[0,1,2,3,4].map(i => {
                        const dia = isoLocal(sumarDias(lunesDe(), 7 * semanaCuadrante + i));
                        const asignaciones = [];
                        profesores.forEach(prof => {
                          const key = `${dia}|${hora}|${prof}`;
                          if (cuadrante[key]) {
                            const zona = ZONAS_CENTRO.find(z => z.id === cuadrante[key]);
                            const apoyo = apoyosGuardia[`${dia}|${hora}|${cuadrante[key]}`];
                            const sustituto = sustitutosGuardia[`${dia}|${hora}|${cuadrante[key]}`];
                            asignaciones.push({
                              profesor: prof,
                              zona: zona ? zona.label : "Zona desconocida",
                              apoyo: apoyo || null,
                              sustituto: sustituto || null
                            });
                          }
                        });
                        
                        return (
                          <td key={dia} style={{ padding: "8px", textAlign: "left", fontSize: 10, background: asignaciones.length > 0 ? "#E8F5F3" : "transparent", borderRight: "1px solid #e5e7eb" }}>
                            {asignaciones.length > 0 ? (
                              <div style={{ color: C.teal }}>
                                {asignaciones.map((a, idx) => (
                                  <div key={idx} style={{ marginBottom: 6, paddingBottom: 6, borderBottom: idx < asignaciones.length - 1 ? "1px solid #d0e8e6" : "none" }}>
                                    <strong style={{ color: C.dark }}>👤 {a.profesor}</strong><br/>
                                    <span style={{ color: C.teal, fontSize: 9 }}>📍 {a.zona}</span><br/>
                                    {a.apoyo && <><span style={{ color: C.blue, fontSize: 9 }}>👥 Apoyo: {a.apoyo}</span><br/></>}
                                    {a.sustituto && <span style={{ color: "#7c3aed", fontSize: 9 }}>🔁 Sustituto: {a.sustituto}</span>}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span style={{ color: C.gray }}>—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: 16, fontSize: 11, color: C.gray, padding: "12px", background: "#f9fafb", borderRadius: 8 }}>
                <strong>👤</strong> = Profesor | <strong>📍</strong> = Lugar/Zona | <strong>👥</strong> = Profesor de Apoyo
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Ver Parte ── */}
      {showParte && (
        <div onClick={() => setShowParte(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: parteGrande ? 0 : 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: parteGrande ? 0 : 16, maxWidth: parteGrande ? "none" : 760, width: "100%", height: parteGrande ? "100%" : "auto", maxHeight: parteGrande ? "100%" : "92vh", overflowY: "auto", fontSize: parteGrande ? 18 : 15, zoom: parteGrande ? 1.25 : 1 }}>
            <div style={{ position: "sticky", top: 0, zIndex: 2, background: `linear-gradient(90deg,${C.dark},${C.blue})`, color: "#fff", padding: "16px 24px", borderRadius: parteGrande ? 0 : "16px 16px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700 }}>GalvánDesk · Parte de Incidencia</div>
                <div style={{ fontSize: 12, opacity: .8 }}>Ref: PARTE-{showParte.id}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => pdfParte(showParte)} title="Descargar PDF" style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>🖨 PDF</button>
                <button onClick={() => setParteGrande(v => !v)} title={parteGrande ? "Volver al tamaño normal" : "Ver a pantalla completa"} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>{parteGrande ? "🗗 Reducir" : "⛶ Pantalla completa"}</button>
                <button onClick={() => setShowParte(null)} aria-label="Cerrar" style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 16 }}>✕</button>
              </div>
            </div>
            <div style={{ padding: 24, maxWidth: parteGrande ? 900 : "none", margin: "0 auto" }}>
              {(() => { const g = gObj(showParte.gravedad); return <div style={{ background: g.bg, border: `2px solid ${g.color}`, borderRadius: 10, padding: 12, marginBottom: 20, textAlign: "center" }}><strong style={{ color: g.color, fontSize: 16 }}>{g.label} — {g.desc}</strong></div>; })()}
              {showParte.esGrupal && <div style={{ background: "#E8F5F3", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: C.teal, fontWeight: 600, marginBottom: 12 }}>👥 Parte generado como parte de grupo</div>}
              {[["Alumno", showParte.alumno], ["Curso", showParte.curso], ["Tutor/a del grupo", showParte.tutor || "—"], ["Correo del tutor/a", showParte.tutorEmail || "—"], ["Tipo", showParte.tipo], ["Hora", showParte.hora || "No especificada"], ["Fecha y hora", fmt(showParte.ts)], ["Profesor", showParte.profesor]].map(([k, v]) => (
                <InfoRow key={k} label={k} value={v} />
              ))}
              {showParte.tipificacion && (() => {
                const tipObj = TIPIFICACION[showParte.gravedad]?.find(t => t.id === showParte.tipificacion);
                const fuente = showParte.gravedad === "leve" ? "Plan de Convivencia" : "Decreto 32/2019";
                return (
                  <div style={{ margin: "8px 0", padding: "8px 12px", background: "#EEF5F8", borderRadius: 8, border: `1px solid ${C.blue}`, fontSize: 12 }}>
                    <span style={{ fontWeight: 700, color: C.blue }}>⚖️ Tipificación </span>
                    <span style={{ color: C.gray }}>({fuente})</span>
                    <div style={{ marginTop: 3, color: C.dark }}>{tipObj?.label}</div>
                  </div>
                );
              })()}
              <div style={{ marginTop: 16, background: C.cream, borderRadius: 8, padding: 14, fontSize: 14, lineHeight: 1.6, color: C.dark }}>{showParte.descripcion}</div>
              <div style={{ marginTop: 12, background: "#EEF5F8", borderRadius: 8, padding: 12, fontSize: 13 }}>
                <strong style={{ color: C.blue }}>📬 Familia:</strong> ✉️ {showParte.email} · 📱 {showParte.telefono}
              </div>
              <ComoAvisar parte={showParte} />
            </div>
          </div>
        </div>
      )}

      {/* ── Coordinación Diaria de Ausencias ── */}
      {showCoordinacion && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20, overflowY: "auto" }}>
          <div style={{ background: C.white, borderRadius: 16, maxWidth: "95vw", width: "100%", maxHeight: "90vh", overflowY: "auto", marginY: 20 }}>
            <div style={{ background: `linear-gradient(90deg,${C.dark},${C.blue})`, color: "#fff", padding: "16px 24px", borderRadius: "16px 16px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>🔄 Coordinación Diaria de Ausencias</div>
              <button onClick={() => setShowCoordinacion(false)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
            <div style={{ padding: 24 }}>
              <CoordinacionAusencias 
                profesores={profesores}
                ausencias={ausencias} 
                cuadrante={cuadrante} 
                apoyosGuardia={apoyosGuardia} 
                sustitutosGuardia={sustitutosGuardia}
                profesoresGuardia={profesoresGuardia}
                HORAS_GUARDIA={HORAS_GUARDIA}
                ZONAS_CENTRO={ZONAS_CENTRO}
                DIAS_SEMANA={DIAS_SEMANA}
                C={C} 
                inpStyle={inpStyle} 
                selStyle={selStyle} 
                labelStyle={labelStyle}
                fechaCoordinacion={fechaCoordinacion}
                setFechaCoordinacion={setFechaCoordinacion}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
