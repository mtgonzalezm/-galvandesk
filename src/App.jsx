import { useState, useEffect, useRef } from "react";
import html2pdf from 'html2pdf.js';
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
const HORAS   = ["1ª hora", "2ª hora", "3ª hora", "4ª hora", "5ª hora", "6ª hora", "7ª hora", "Recreo"];
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
async function sGet(k) { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } }
async function sSet(k, v) { try { await window.storage.set(k, JSON.stringify(v)); } catch (e) { console.error(e); } }

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

// ─── Vista impresión parte ────────────────────────────────────────────────────
function PrintParte({ parte, onClose }) {
  const g = gObj(parte.gravedad);
  const texto = `GALVÁNDESK — PARTE DE INCIDENCIA\nIES Enrique Tierno Galván · Madrid\n${"─".repeat(50)}\nGravedad: ${g.label} — ${g.desc}\n\nAlumno/a: ${parte.alumno}\nCurso / Aula: ${parte.curso}\nTutor de grupo: ${parte.tutor}\nTipo de parte: ${parte.tipo}\nHora: ${parte.hora || "No especificada"}\nFecha y hora: ${fmt(parte.ts)}\nProfesor responsable: ${parte.profesor}\n\nDescripción:\n${parte.descripcion}\n\nContacto familia:\nEmail: ${parte.email}\nTeléfono: ${parte.telefono}\n${"─".repeat(50)}\nRef: PARTE-${parte.id}`;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 1000, overflowY: "auto", fontFamily: "Georgia, serif" }}>
      <div className="no-print" style={{ background: C.dark, color: "#fff", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <span style={{ fontWeight: 700, fontSize: 14, fontFamily: "system-ui" }}>GalvánDesk · Vista previa — Ctrl+P para PDF</span>
        <div style={{ display: "flex", gap: 8 }}>
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
        {[["Alumno/a", parte.alumno], ["Curso / Aula", parte.curso], ["Tutor de grupo", parte.tutor], ["Tipo de parte", parte.tipo], ["Hora de clase", parte.hora || "No especificada"], ["Fecha y hora", fmt(parte.ts)], ["Profesor responsable", parte.profesor]].map(([k, v]) => (
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
function PrintInforme({ type = "partes", partes, banos, filtros, onClose }) {
  const fecha = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
  
  if (type === "partes") {
    const res = {
      leve:      partes.filter(p => p.gravedad === "leve").length,
      grave:     partes.filter(p => p.gravedad === "grave").length,
      muy_grave: partes.filter(p => p.gravedad === "muy_grave").length,
    };
    const filtrosTexto = [
      filtros.filtCurso && `Curso: ${filtros.filtCurso}`,
      filtros.filtGravedad && GRAVEDAD.find(g => g.id === filtros.filtGravedad)?.label,
      filtros.filtFechaDesde && `Desde: ${fmtD(filtros.filtFechaDesde)}`,
      filtros.filtFechaHasta && `Hasta: ${fmtD(filtros.filtFechaHasta)}`,
    ].filter(Boolean).join(" · ");
    const textoPlano = `GALVÁNDESK — INFORME DE PARTES\nIES Enrique Tierno Galván · Madrid\nGenerado el ${fecha}\n${filtrosTexto ? `Filtros: ${filtrosTexto}\n` : ""}\nRESUMEN: Total: ${partes.length} | Leves: ${res.leve} | Graves: ${res.grave} | Muy Graves: ${res.muy_grave}\n\n${"─".repeat(90)}\n${partes.map((p, i) => `${i + 1}. ${fmt(p.ts)} | ${p.hora || "-"} | ${p.alumno} | ${p.curso} | ${p.tipo} | ${p.gravedad.toUpperCase()} | ${p.profesor}\n   ${p.descripcion}`).join("\n")}\n${"─".repeat(90)}`;
    
    const descargarPDF = () => {
      const elemento = document.querySelector('[data-print-informe]');
      const nombreArchivo = "informe-partes.pdf";
      const opt = {
        margin: 10,
        filename: nombreArchivo,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      };
      html2pdf().set(opt).from(elemento).save();
    };
    
    return (
      <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 1000, overflowY: "auto", fontFamily: "system-ui, sans-serif" }}>
        <div className="no-print" style={{ background: C.dark, color: "#fff", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>GalvánDesk — Informe de Partes · Ctrl+P para PDF</span>
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
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: C.dark, color: "#fff" }}>
                {["Fecha", "Hora", "Alumno", "Curso", "Tipo", "Gravedad", "Profesor", "Descripción"].map(h => (
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
                    <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee" }}>{p.tipo}</td>
                    <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee" }}><span style={{ background: g.bg, color: g.color, padding: "2px 8px", borderRadius: 6, fontWeight: 700, fontSize: 11 }}>{g.label}</span></td>
                    <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee" }}>{p.profesor}</td>
                    <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee" }}>{p.descripcion.slice(0, 60)}{p.descripcion.length > 60 ? "…" : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
    const textoPlano = `GALVÁNDESK — INFORME DE SALIDAS AL BAÑO\nIES Enrique Tierno Galván · Madrid\nGenerado el ${fecha}\n${filtrosTexto ? `Filtros: ${filtrosTexto}\n` : ""}\nRESUMEN: Total de salidas: ${banos.length}\n\n${"─".repeat(90)}\n${banos.map((b, i) => `${i + 1}. ${fmt(b.ts)} | ${b.alumno} | ${b.curso} | Autorizado por: ${b.profesor}\n   Motivo: ${b.motivo || "-"}`).join("\n")}\n${"─".repeat(90)}`;
    
    const descargarPDF = () => {
      const elemento = document.querySelector('[data-print-informe]');
      const nombreArchivo = "informe-banos.pdf";
      const opt = {
        margin: 10,
        filename: nombreArchivo,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      };
      html2pdf().set(opt).from(elemento).save();
    };
    
    return (
      <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 1000, overflowY: "auto", fontFamily: "system-ui, sans-serif" }}>
        <div className="no-print" style={{ background: C.dark, color: "#fff", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>GalvánDesk — Informe de Baños · Ctrl+P para PDF</span>
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
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>{fmt(b.ts)}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee", fontWeight: 600 }}>{b.alumno}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee" }}>{b.curso}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #eee" }}>{b.profesor}</td>
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

// ─── Tarjeta de parte ────────────────────────────────────────────────────────
function ParteCard({ parte, onVer, onPrint }) {
  const g = gObj(parte.gravedad);
  return (
    <div style={{ background: C.white, borderRadius: 12, padding: 16, marginBottom: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", borderLeft: `4px solid ${g.color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.dark }}>
            {parte.alumno}
            {parte.esGrupal && <span style={{ fontSize: 11, background: "#e8f5f3", color: C.teal, borderRadius: 6, padding: "2px 8px", marginLeft: 6 }}>👥 grupal</span>}
          </div>
          <div style={{ fontSize: 12, color: C.gray, marginTop: 3 }}>
            📚 {parte.curso} · {parte.tipo} · ⏰ {parte.hora || "—"} · 📅 {fmt(parte.ts)} · 👤 {parte.profesor}
          </div>
          <div style={{ fontSize: 13, marginTop: 6, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {parte.descripcion}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
          <Badge g={parte.gravedad} />
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={onVer} style={{ background: "#EEF5F8", color: C.blue, border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>👁 Ver</button>
            <button onClick={onPrint} style={{ background: "#FDF0EF", color: C.salmon, border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>🖨 PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Gestión de alumnos ───────────────────────────────────────────────────────
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

  useEffect(() => {
    async function load() {
      const pg = await sGet("planes_guardia");
      if (pg) setPlanesGuardia(pg);
    }
    load();
  }, []);

  useEffect(() => {
    sSet("planes_guardia", planesGuardia);
  }, [planesGuardia]);

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
                  <div style={{ fontWeight:700, color:C.blue, fontSize:15, marginBottom:12 }}>⏰ {h}</div>
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
                    <div style={{ fontWeight:700, color:C.teal, fontSize:15 }}>⏰ {h}</div>
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
const HORAS_GUARDIA = ["1ª hora","2ª hora","3ª hora","4ª hora","Recreo","5ª hora","6ª hora","7ª hora"];
const DIAS_SEMANA   = ["Lunes","Martes","Miércoles","Jueves","Viernes"];

// ═══════════════════════════════════════════════════════════════════════════
// MI GUARDIA HOY (Profesor)
// ═══════════════════════════════════════════════════════════════════════════
function MiGuardiaHoy({ profesores, cuadrante, apoyosGuardia, ausencias, fProfesor, setFProfesor, C, selStyle, labelStyle, usuario, setShowCuadrante, diaSeleccionadoGuardias, setDiaSeleccionadoGuardias }) {
  const hoy     = new Date();
  const diasES  = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const diaHoy  = diasES[hoy.getDay()];
  const esFinde = hoy.getDay() === 0 || hoy.getDay() === 6;

  const guardiasDia = HORAS_GUARDIA.map(hora => {
    const key  = `${diaHoy}|${hora}|${fProfesor}`;
    const zona = cuadrante[key];
    
    if (!zona) return null;
    
    const z = ZONAS_CENTRO.find(z => z.id === zona);
    
    // Determinar si es Profesor de Guardia o Profesor de Apoyo
    let rol = "PROFESOR DE GUARDIA"; // Por defecto
    let profesorDeGuardia = fProfesor;
    let profesorApoyo = null;
    
    // Buscar si es el profesor de apoyo de esta zona
    const keyApoyo = `${diaHoy}|${hora}|${zona}`;
    if (apoyosGuardia[keyApoyo] === fProfesor) {
      rol = "APOYO A LA GUARDIA";
      // Encontrar quién es el profesor de guardia
      for (let prof of profesores) {
        if (cuadrante[`${diaHoy}|${hora}|${prof}`] === zona) {
          profesorDeGuardia = prof;
          break;
        }
      }
    } else {
      // Es profesor de guardia, buscar su apoyo
      profesorApoyo = apoyosGuardia[keyApoyo] || null;
    }
    
    // Buscar si hay ausencias para esa hora (profesores que no vinieron)
    const ausenciasHora = ausencias.filter(a => {
      const fechaAusencia = a.fecha;
      const hoysStr = hoy.toISOString().split("T")[0];
      return fechaAusencia === hoysStr && a.horas.includes(hora);
    });
    
    return { 
      hora, 
      zona: z ? z.label : null, 
      zonaId: zona,
      rol,
      profesorDeGuardia,
      profesorApoyo,
      ausencias: ausenciasHora
    };
  }).filter(g => g !== null);

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
        <select value={fProfesor} onChange={e => setFProfesor(e.target.value)} style={selStyle}>
          {profesores.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* CALENDARIO PRÓXIMOS 7 DÍAS */}
      {(() => {
        const proximosDias = [];
        for (let i = 0; i < 7; i++) {
          const fecha = new Date(hoy);
          fecha.setDate(fecha.getDate() + i);
          const dia = diasES[fecha.getDay()];
          
          // Verificar si tiene guardias ese día
          const tieneGuardia = HORAS_GUARDIA.some(hora => {
            const key = `${dia}|${hora}|${fProfesor}`;
            return cuadrante[key];
          });
          
          proximosDias.push({ dia, fecha, tieneGuardia });
        }
        
        return (
          <div style={{ background:C.white, borderRadius:12, padding:16, marginBottom:16, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize:13, fontWeight:600, color:C.gray, marginBottom:12 }}>📅 Próximos 7 días</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:8 }}>
              {proximosDias.map((p, idx) => (
                <div key={idx} 
                  onClick={() => p.tieneGuardia && setDiaSeleccionadoGuardias(p.dia)}
                  style={{ 
                    textAlign:"center", 
                    padding:12, 
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
                  <div style={{ fontSize:10, color: p.tieneGuardia ? C.teal : C.gray, fontWeight:600, marginTop:4 }}>
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
            const esRecreo = g.hora === "Recreo";
            const esApoyo = g.rol === "APOYO A LA GUARDIA";
            const color = esApoyo ? C.blue : C.teal;
            
            return (
              <div key={i} style={{ background:C.white, borderRadius:12, padding:18, marginBottom:12, boxShadow:"0 2px 10px rgba(0,0,0,0.06)", borderLeft:`5px solid ${color}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight:800, fontSize:18, color:C.dark }}>{g.hora}</div>
                    <div style={{ fontSize:15, color, fontWeight:600, marginTop:4 }}>📍 {g.zona}</div>
                    
                    {/* Mostrar rol */}
                    <div style={{ marginTop: 12, padding: "8px 12px", background: esApoyo ? "#EEF5F8" : "#E8F5F3", borderRadius: 8, fontSize: 12, fontWeight: 700, color, display: "inline-block" }}>
                      {esApoyo ? "🔄 APOYO A LA GUARDIA" : "🛡️ PROFESOR DE GUARDIA"}
                    </div>
                    
                    {/* Mostrar profesor de guardia si es apoyo */}
                    {esApoyo && (
                      <div style={{ marginTop: 10, padding: "8px 12px", background: "#FDF0EF", borderRadius: 8, fontSize: 12, color: C.salmon, fontWeight: 600 }}>
                        👤 Profesor: {g.profesorDeGuardia}
                      </div>
                    )}
                    
                    {/* Mostrar profesor de apoyo si es titular */}
                    {!esApoyo && g.profesorApoyo && (
                      <div style={{ marginTop: 10, padding: "8px 12px", background: "#EEF5F8", borderRadius: 8, fontSize: 12, color: C.blue, fontWeight: 600 }}>
                        👥 Apoyo: {g.profesorApoyo}
                      </div>
                    )}
                    
                    {/* Mostrar ausencias (docentes que no fueron) */}
                    {g.ausencias.length > 0 && (
                      <div style={{ marginTop: 10, padding: "8px 12px", background: "#FFF8E8", borderRadius: 8, fontSize: 12, color: C.dark, fontWeight: 600, border: "1px solid #fbbf24" }}>
                        📚 Sustituyes a: {g.ausencias.map(a => a.profesor).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ background:"#FFF8E8", borderRadius:10, padding:14, marginTop:8, fontSize:13, color:C.dark, border:"1px solid #fbbf24" }}>
            ⚠️ Si no puedes asistir, notifícalo en <strong>Notificar Ausencia</strong>.
          </div>
        </div>
      )}
      
      {/* PANEL LATERAL: Guardias del día seleccionado */}
      {diaSeleccionadoGuardias && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 50 }} onClick={() => setDiaSeleccionadoGuardias(null)}>
          <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: 400, background: C.white, boxShadow: "-4px 0 20px rgba(0,0,0,0.15)", overflowY: "auto", animation: "slideIn 0.3s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`, color: "#fff", padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>📅 {diaSeleccionadoGuardias}</div>
                <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>Guardias asignadas</div>
              </div>
              <button onClick={() => setDiaSeleccionadoGuardias(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 18, fontWeight: 700 }}>✕</button>
            </div>
            
            <div style={{ padding: 20 }}>
              {(() => {
                const guardiasDelDia = [];
                
                HORAS_GUARDIA.forEach(hora => {
                  const key = `${diaSeleccionadoGuardias}|${hora}|${fProfesor}`;
                  const zona = cuadrante[key];
                  
                  if (zona) {
                    const z = ZONAS_CENTRO.find(z => z.id === zona);
                    const keyApoyo = `${diaSeleccionadoGuardias}|${hora}|${zona}`;
                    const profesorApoyo = apoyosGuardia[keyApoyo];
                    
                    // Buscar ausencias de ese día
                    const ausenciasDelDia = ausencias.filter(a => {
                      return a.fecha.split("T")[0] === `2026-02-${String(new Date(diaSeleccionadoGuardias).getDate()).padStart(2, '0')}` && a.horas.includes(hora);
                    });
                    
                    guardiasDelDia.push({ hora, zona: z ? z.label : "Desconocida", zonaId: zona, profesorApoyo, ausencias: ausenciasDelDia });
                  }
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
                        <div style={{ fontWeight: 700, fontSize: 14, color: C.dark, marginBottom: 8 }}>🕐 {g.hora}</div>
                        <div style={{ fontSize: 13, color: C.teal, fontWeight: 600, marginBottom: 10 }}>📍 {g.zona}</div>
                        
                        {g.profesorApoyo && (
                          <div style={{ background: "#EEF5F8", borderRadius: 6, padding: "6px 10px", fontSize: 12, color: C.blue, fontWeight: 600, marginBottom: 8 }}>
                            👥 Apoyo: {g.profesorApoyo}
                          </div>
                        )}
                        
                        {g.ausencias.length > 0 && g.ausencias.map((a, i) => (
                          <div key={i} style={{ background: "#FFF8E8", borderRadius: 6, padding: 10, marginTop: 8, borderLeft: `3px solid #fbbf24` }}>
                            <div style={{ fontWeight: 600, color: C.dark, fontSize: 12, marginBottom: 6 }}>📚 Sustituyes a: {a.profesor}</div>
                            {a.tarea && <div style={{ fontSize: 11, color: "#555", marginBottom: 4 }}><strong>Tarea:</strong> {a.tarea}</div>}
                            {a.enlace && <div style={{ fontSize: 11, marginBottom: 4 }}><a href={a.enlace} target="_blank" rel="noopener noreferrer" style={{ color: C.blue, textDecoration: "underline" }}>🔗 Ver recursos</a></div>}
                            {a.ubicacion && <div style={{ fontSize: 11, color: "#555" }}><strong>📍 Ubicación:</strong> {a.ubicacion}</div>}
                          </div>
                        ))}
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
function NotificarAusencia({ profesores, ausencias, setAusencias, ausProfesor, setAusProfesor, ausMotivo, setAusMotivo, ausFecha, setAusFecha, ausHoras, setAusHoras, ausTarea, setAusTarea, ausEnlace, setAusEnlace, ausUbicacion, setAusUbicacion, fProfesor, C, inpStyle, selStyle, labelStyle, fmt }) {
  const [enviado, setEnviado] = useState(false);

  function toggleHora(h) {
    setAusHoras(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]);
  }

  function enviar() {
    if (!ausProfesor || !ausFecha || ausHoras.length === 0) return;
    const nueva = { id:Date.now(), profesor:ausProfesor, motivo:ausMotivo, fecha:ausFecha, horas:ausHoras, tarea:ausTarea, enlace:ausEnlace, ubicacion:ausUbicacion, ts:new Date().toISOString(), leida:false };
    setAusencias(prev => [nueva, ...prev]);
    setEnviado(true);
    setAusFecha(""); setAusHoras([]); setAusTarea(""); setAusEnlace(""); setAusUbicacion("");
    setTimeout(() => setEnviado(false), 4000);
  }

  const misAusencias = ausencias.filter(a => a.profesor === fProfesor);

  return (
    <div>
      <h2 style={{ color:C.dark, marginTop:0 }}>📢 Notificar Ausencia</h2>
      {enviado && (
        <div style={{ background:"#E8F5F3", border:`2px solid ${C.teal}`, borderRadius:12, padding:16, marginBottom:16, fontWeight:700, color:C.teal, fontSize:15 }}>
          ✅ Ausencia notificada. Jefatura ha sido informada.
        </div>
      )}
      <div style={{ background:C.white, borderRadius:12, padding:20, boxShadow:"0 2px 10px rgba(0,0,0,0.06)", marginBottom:16 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
          <div>
            <label style={labelStyle}>Soy el/la profesor/a *</label>
            <select value={ausProfesor} onChange={e => setAusProfesor(e.target.value)} style={selStyle}>
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
                  style={{ padding:"8px 14px", borderRadius:8, border:`2px solid ${sel?C.teal:"#d1d5db"}`, background:sel?C.teal:C.white, color:sel?"#fff":C.dark, cursor:"pointer", fontWeight:600, fontSize:13, transition:"all .15s" }}>
                  {h}
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
          📢 Notificar Ausencia a Jefatura
        </button>
      </div>
      {misAusencias.length > 0 && (
        <div>
          <h3 style={{ color:C.dark }}>Mis ausencias notificadas</h3>
          {misAusencias.map(a => (
            <div key={a.id} style={{ background:C.white, borderRadius:10, padding:14, marginBottom:10, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", borderLeft:`4px solid ${C.salmon}` }}>
              <div style={{ fontWeight:700, color:C.dark }}>📅 {new Date(a.fecha).toLocaleDateString("es-ES")} · {a.motivo}</div>
              <div style={{ fontSize:13, color:C.gray, marginTop:4 }}>Horas: {a.horas.join(", ")}</div>
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
function CuadranteGuardias({ profesores, cuadrante, setCuadrante, apoyosGuardia, setApoyosGuardia, quinceInicio, setQInicio, quinceProfesor, setQProf, C, inpStyle, selStyle, labelStyle }) {
  function setAsignacion(dia, hora, profesor, zonaId) {
    const key = `${dia}|${hora}|${profesor}`;
    setCuadrante(prev => { const next={...prev}; if(zonaId==="") delete next[key]; else next[key]=zonaId; return next; });
  }
  
  function setApoyo(dia, hora, zona, profesorApoyo) {
    const key = `${dia}|${hora}|${zona}`;
    setApoyosGuardia(prev => { const next={...prev}; if(profesorApoyo==="") delete next[key]; else next[key]=profesorApoyo; return next; });
  }
  
  const profesorSel = quinceProfesor || (profesores[0] || "");
  return (
    <div>
      <h2 style={{ color:C.dark, marginTop:0 }}>📅 Cuadrante de Guardias</h2>
      <div style={{ background:C.white, borderRadius:12, padding:16, marginBottom:16, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <div>
            <label style={labelStyle}>Inicio de quincena</label>
            <input type="date" value={quinceInicio} onChange={e => setQInicio(e.target.value)} style={inpStyle} />
          </div>
          <div>
            <label style={labelStyle}>Profesor a configurar</label>
            <select value={profesorSel} onChange={e => setQProf(e.target.value)} style={selStyle}>
              {profesores.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div style={{ background:C.white, borderRadius:12, padding:16, boxShadow:"0 2px 10px rgba(0,0,0,0.06)", overflowX:"auto" }}>
        <div style={{ fontWeight:700, color:C.dark, marginBottom:14, fontSize:14 }}>Asignación de {profesorSel}</div>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:700 }}>
          <thead>
            <tr style={{ background:C.dark }}>
              <th style={{ padding:"8px 12px", color:"#fff", textAlign:"left", width:100 }}>Hora</th>
              {DIAS_SEMANA.map(d => <th key={d} style={{ padding:"8px 12px", color:"#fff", textAlign:"left" }}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {HORAS_GUARDIA.map((hora, i) => (
              <tr key={hora} style={{ background:i%2===0?"#fff":C.light }}>
                <td style={{ padding:"6px 12px", fontWeight:700, color:C.dark, fontSize:13, whiteSpace:"nowrap" }}>{hora}</td>
                {DIAS_SEMANA.map(dia => {
                  const val = cuadrante[`${dia}|${hora}|${profesorSel}`] || "";
                  const zonaObj = ZONAS_CENTRO.find(z => z.id === val);
                  const apoyo = val ? apoyosGuardia[`${dia}|${hora}|${val}`] : "";
                  return (
                    <td key={dia} style={{ padding:"4px 8px" }}>
                      <div style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
                        <select value={val} onChange={e => setAsignacion(dia, hora, profesorSel, e.target.value)}
                          style={{ width:"100%", padding:"5px 6px", borderRadius:6, border:`1px solid ${val?"#00B7B5":"#d1d5db"}`, fontSize:11, background:val?"#E8F5F3":"#fff", color:C.dark, cursor:"pointer", fontWeight: val ? 600 : 400 }}>
                          <option value="">— Libre —</option>
                          <optgroup label="── Edificio A">{ZONAS_CENTRO.filter(z=>z.edificio==="A").map(z=><option key={z.id} value={z.id}>{z.label}</option>)}</optgroup>
                          <optgroup label="── Edificio B">{ZONAS_CENTRO.filter(z=>z.edificio==="B").map(z=><option key={z.id} value={z.id}>{z.label}</option>)}</optgroup>
                          <optgroup label="── Edificio C">{ZONAS_CENTRO.filter(z=>z.edificio==="C").map(z=><option key={z.id} value={z.id}>{z.label}</option>)}</optgroup>
                          <optgroup label="── Aula / Recreo">{ZONAS_CENTRO.filter(z=>z.edificio==="-").map(z=><option key={z.id} value={z.id}>{z.label}</option>)}</optgroup>
                        </select>
                        {val && (
                          <div style={{ marginTop: "2px" }}>
                            <select value={apoyo} onChange={e => setApoyo(dia, hora, val, e.target.value)}
                              style={{ width:"100%", padding:"5px 6px", borderRadius:6, border:`2px solid #00B7B5`, fontSize:11, background:"#e0f7f6", color:C.dark, cursor:"pointer", fontWeight: apoyo ? 600 : 400 }}>
                              <option value="">👥 Apoyo</option>
                              {profesores.filter(p => p !== profesorSel).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop:14, fontSize:12, color:C.gray }}>💾 Los cambios se guardan automáticamente. El apoyo es opcional y se asigna por zona.</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PARTE DEL DÍA (Jefatura)
// ═══════════════════════════════════════════════════════════════════════════
function ParteDia({ profesores, cuadrante, ausencias, C }) {
  const hoy      = new Date();
  const diasES   = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const diaHoy   = diasES[hoy.getDay()];
  const fechaHoy = hoy.toISOString().split("T")[0];
  const ausHoy   = ausencias.filter(a => a.fecha === fechaHoy);
  const profesoresAusentes = new Set(ausHoy.flatMap(a => a.horas.map(h => `${a.profesor}|${h}`)));

  const asignaciones = [];
  HORAS_GUARDIA.forEach(hora => {
    profesores.forEach(prof => {
      const zona = cuadrante[`${diaHoy}|${hora}|${prof}`];
      if (!zona) return;
      const z = ZONAS_CENTRO.find(z => z.id === zona);
      asignaciones.push({ hora, profesor:prof, zona:z?.label||zona, ausente:profesoresAusentes.has(`${prof}|${hora}`) });
    });
  });

  const porHora = HORAS_GUARDIA.map(hora => ({ hora, items:asignaciones.filter(a=>a.hora===hora) })).filter(h=>h.items.length>0);

  return (
    <div>
      <h2 style={{ color:C.dark, marginTop:0 }}>🔄 Parte del Día — {diaHoy}</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:16 }}>
        {[
          { label:"Total asignadas", value:asignaciones.length,                color:C.dark   },
          { label:"Cubiertas",       value:asignaciones.filter(a=>!a.ausente).length, color:C.teal   },
          { label:"Descubiertas",    value:asignaciones.filter(a=>a.ausente).length,  color:C.salmon },
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
            {hora==="Recreo"?"🏃 "+hora:"⏰ "+hora}
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ background:C.light }}>
              <th style={{ padding:"7px 16px", textAlign:"left", fontSize:12, color:C.gray, fontWeight:600 }}>Zona</th>
              <th style={{ padding:"7px 16px", textAlign:"left", fontSize:12, color:C.gray, fontWeight:600 }}>Profesor asignado</th>
              <th style={{ padding:"7px 16px", textAlign:"center", fontSize:12, color:C.gray, fontWeight:600 }}>Estado</th>
            </tr></thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} style={{ borderBottom:`1px solid ${C.cream}` }}>
                  <td style={{ padding:"10px 16px", fontSize:13, color:C.dark }}>{item.zona}</td>
                  <td style={{ padding:"10px 16px", fontSize:13, color:C.dark }}>{item.profesor}</td>
                  <td style={{ padding:"10px 16px", textAlign:"center" }}>
                    {item.ausente
                      ? <span style={{ color:C.salmon, fontWeight:700, fontSize:13 }}>🔴 Descubierta</span>
                      : <span style={{ color:C.teal,   fontWeight:700, fontSize:13 }}>🟢 Cubierto</span>}
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
              <div style={{ fontSize:11, color:C.gray, whiteSpace:"nowrap" }}>Notificado: {fmt(a.ts)}</div>
            </div>
          </div>
        ))
      }
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
  const [guardias, setGuardias]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showParte, setShowParte] = useState(null);
  const [showAlerta, setShowAlerta] = useState(null);
  const [printParte, setPrintParte] = useState(null);
  const [printInforme, setPrintInforme] = useState(false);
  const [showCuadrante, setShowCuadrante] = useState(false); // Nuevo: modal cuadrante

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
  const [apoyosGuardia, setApoyosGuardia] = useState({}); // Nuevo: {dia|hora|zona: profesor}
  const [ausencias, setAusencias]     = useState([]);
  const [quinceInicio, setQInicio]    = useState("");
  const [quinceProfesor, setQProf]    = useState("");
  const [ausMotivo, setAusMotivo]     = useState("Enfermedad");
  const [ausFecha, setAusFecha]       = useState("");
  const [ausHoras, setAusHoras]       = useState([]);
  const [ausTarea, setAusTarea]       = useState("");
  const [ausEnlace, setAusEnlace]     = useState("");
  const [ausUbicacion, setAusUbicacion] = useState("");
  const [ausProfesor, setAusProfesor] = useState("");
  const [diaSeleccionadoGuardias, setDiaSeleccionadoGuardias] = useState(null);

  // Carga
  useEffect(() => {
    async function load() {
      setLoading(true);
      const p  = await sGet("partes");    if (p)  setPartes(p);
      const b  = await sGet("banos");     if (b)  setBanos(b);
      const a  = await sGet("alertas");   if (a)  setAlertas(a);
      const al = await sGet("alumnos");   if (al) setAlumnos(al);
      const pr = await sGet("profesores");if (pr) setProfesores(pr);
      const g  = await sGet("guardias");    if (g)  setGuardias(g);
      const cq = await sGet("cuadrante");   if (cq) setCuadrante(cq);
      const au = await sGet("ausencias");   if (au) setAusencias(au);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => { if (!loading) sSet("partes", partes); },     [partes, loading]);
  useEffect(() => { if (!loading) sSet("banos", banos); },       [banos, loading]);
  useEffect(() => { if (!loading) sSet("alertas", alertas); },   [alertas, loading]);
  useEffect(() => { if (!loading) sSet("alumnos", alumnos); },   [alumnos, loading]);
  useEffect(() => { if (!loading) sSet("profesores", profesores); }, [profesores, loading]);
  useEffect(() => { if (!loading) sSet("guardias",   guardias);   }, [guardias,   loading]);
  useEffect(() => { if (!loading) sSet("cuadrante", cuadrante); }, [cuadrante, loading]);
  useEffect(() => { if (!loading) sSet("ausencias", ausencias); }, [ausencias, loading]);

  // Derivados
  const cursos        = [...new Set(alumnos.map(a => a.curso))].sort();
  const alumnoSel     = alumnos.find(a => a.id === parseInt(fAlumno));
  const banoActivos   = banos.filter(b => !b.regreso);
  const alertasNoLeidas = alertas.filter(a => !a.leida).length;
  const partesDeAlumno = id => partes.filter(p => p.alumnoId === id);
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
    if (filtFechaDesde && b.ts.split("T")[0] < filtFechaDesde) return false;
    if (filtFechaHasta && b.ts.split("T")[0] > filtFechaHasta) return false;
    return true;
  });

  function salir() {
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
    const p = { id: Date.now(), alumnoId: al.id, alumno: al.nombre, curso: al.curso, tutor: al.tutor, email: al.email, telefono: al.telefono, tipo: fTipo, gravedad: fGravedad, tipificacion: fTipificacion, descripcion: fDesc, profesor: fProfesor, hora: fHora, ts: new Date().toISOString() };
    generarAlertasParte(p, partes);
    setPartes(prev => [p, ...prev]);
    setParteGenerado(p);
    setFAlumno(""); setFBusqueda(""); setFDesc(""); setFTipo("Comportamiento"); setFGravedad("leve"); setFTipificacion("");
  }

  function crearParteGrupo() {
    if (!gCurso || !gDesc.trim()) return;
    const grupo = alumnos.filter(a => a.curso === gCurso && !gExcluidos.includes(a.id));
    const ts = new Date().toISOString();
    const nuevos = grupo.map(al => ({ id: Date.now() + al.id, alumnoId: al.id, alumno: al.nombre, curso: al.curso, tutor: al.tutor, email: al.email, telefono: al.telefono, tipo: gTipo, gravedad: gGravedad, tipificacion: gTipificacion, descripcion: gDesc, profesor: fProfesor, hora: gHora, ts, esGrupal: true }));
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
    setBanos(prev => [{ id: Date.now(), alumnoId: id, alumno: al.nombre, curso: al.curso, fecha: todayStr(), salida: new Date().toISOString(), regreso: null }, ...prev]);
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
  if (printInforme) return <PrintInforme type={informeType} partes={partesFiltrados} banos={banosFiltrados} filtros={{ filtCurso, filtAlumno, filtGravedad, filtFechaDesde, filtFechaHasta }} onClose={() => setPrintInforme(false)} />;

  // ── Pantalla de selección de perfil ──
  if (!perfil) return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg,${C.dark},${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,sans-serif", padding: 20 }}>
      <style>{`* { box-sizing: border-box; } body { margin: 0; }`}</style>
      <div style={{ background: C.white, borderRadius: 20, padding: "40px 36px", maxWidth: 420, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ fontSize: 52, marginBottom: 4 }}>🏫</div>
        <div style={{ fontSize: 11, color: C.gray, letterSpacing: 2, marginBottom: 4 }}>IES ENRIQUE TIERNO GALVÁN · MADRID</div>
        <h1 style={{ color: C.dark, margin: "0 0 4px", fontSize: 28 }}>GalvánDesk</h1>
        <p style={{ color: C.gray, marginBottom: 32, fontSize: 13 }}>Sistema de Gestión de Incidencias</p>
        
        <div style={{ marginBottom: 24, textAlign: "left" }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 8 }}>¿Quién eres?</label>
          <input 
            type="text" 
            placeholder="Tu nombre" 
            onChange={e => setUsuario(e.target.value)}
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `2px solid ${C.cream}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", marginBottom: 12 }}
          />
          <small style={{ color: C.gray, display: "block" }}>Por ejemplo: Teresa García o Juan López</small>
        </div>

        {[
          { id: "profesor",  label: "👨‍🏫 Profesor" },
          { id: "jefatura",  label: "📊 Jefatura" },
          { id: "admin",     label: "⚙️ Administración" },
        ].map(p => (
          <button key={p.id}
            onClick={() => { if (!usuario?.trim()) { alert("Por favor, ingresa tu nombre"); return; } setPerfil(p); setTab(p.id === "jefatura" ? "dashboard" : p.id === "admin" ? "admin_panel" : "partes"); }}
            style={{ display: "block", width: "100%", padding: "14px 20px", marginBottom: 12, background: C.cream, border: `2px solid ${C.teal}`, borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: 700, color: C.dark, transition: "all .2s" }}
            onMouseOver={e => { e.currentTarget.style.background = C.teal; e.currentTarget.style.color = "#fff"; }}
            onMouseOut={e => { e.currentTarget.style.background = C.cream; e.currentTarget.style.color = C.dark; }}>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );

  const tabs = perfil.id === "profesor"
    ? moduloProfesor === "alumnos"
      ? [
          { id: "partes",      label: "📋 Nuevo Parte", color: "#06b6d4" },
          { id: "parte_grupo", label: "👥 Parte de Grupo", color: "#ec4899" },
          { id: "bano",        label: "🚻 Baños", color: "#10b981" },
          { id: "historial",   label: "🗂 Mis Partes", color: "#8b5cf6" },
        ]
      : [
          { id: "mi_guardia",     label: "🔄 Mi Guardia Hoy", color: "#06b6d4" },
          { id: "notif_ausencia", label: "📢 Notificar Ausencia", color: "#ec4899" },
          { id: "guardias_ver",   label: "📄 Ver Guardias", color: "#10b981" },
        ]
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
        ]
      : [
          { id: "cuadrante",     label: "📅 Cuadrante", color: "#06b6d4" },
          { id: "parte_dia",     label: "🔄 Parte del Día", color: "#ec4899" },
          { id: "ausencias_jef", label: "📢 Ausencias de Profesores", color: "#10b981" },
        ]
    : [
        // Admin no necesita tabs adicionales, solo usa los módulos
      ];

  return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: "system-ui,sans-serif", width: "100%" }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        @media print { .no-print { display: none !important; } }
      `}</style>
      {/* Header — ancho completo CON BOTÓN HOME */}
      <div style={{ background: `linear-gradient(90deg,${C.dark},${C.blue})`, color: "#fff", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
            <span style={{ fontSize: 26 }}>🏫</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: .5 }}>GalvánDesk</div>
              <div style={{ fontSize: 11, opacity: .8 }}>IES Enrique Tierno Galván · {perfil.label}</div>
            </div>
          </div>
        </div>
        <button onClick={salir} 
          onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; }}
          onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
          style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "background .2s" }}>
          Salir
        </button>
      </div>

      {/* Selector módulo Profesor */}
      {perfil.id === "profesor" && (
        <div style={{ background: "#f0f4f7", display: "flex", justifyContent: "center", gap: 12, padding: "12px 24px", borderBottom: `1px solid #e2e8f0` }}>
          {[
            { id: "alumnos",  label: "👨‍🎓 Partes",  icon: "📋" },
            { id: "guardias", label: "🔄 Guardias",  icon: "⏰" },
          ].map(m => (
            <button key={m.id}
              onClick={() => { setModuloProfesor(m.id); setTab(m.id === "alumnos" ? "partes" : "mi_guardia"); }}
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
        <div style={{ background: "#f0f4f7", display: "flex", justifyContent: "center", gap: 12, padding: "12px 24px", borderBottom: `1px solid #e2e8f0` }}>
          {[
            { id: "alumnos",  label: "📋 Partes & Alumnos" },
            { id: "guardias", label: "🔄 Guardias & Ausencias" },
          ].map(m => (
            <button key={m.id}
              onClick={() => { setModuloJefatura(m.id); setTab(m.id === "alumnos" ? "dashboard" : "cuadrante"); }}
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
        <div style={{ background: "#f0f4f7", display: "flex", justifyContent: "center", gap: 12, padding: "12px 24px", borderBottom: `1px solid #e2e8f0` }}>
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
              const banoHoy = banos.filter(b => b.ts.split("T")[0] === todayStr() && b.profesor === usuario).length;
              
              // Calcular guardias pendientes del profesor
              const diasES  = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
              const diaHoy  = diasES[new Date().getDay()];
              const guardiasHoy = HORAS_GUARDIA.map(hora => {
                const key  = `${diaHoy}|${hora}|${usuario}`;
                const zona = cuadrante[key];
                return zona ? { hora, zona } : null;
              }).filter(Boolean).length;
              
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
                    <button onClick={() => setShowParte(parteGenerado)} style={{ background: C.blue, color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>👁 Ver</button>
                    <button onClick={() => setPrintParte(parteGenerado)} style={{ background: C.salmon, color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>🖨 PDF</button>
                  </div>
                </div>
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
                <div><label style={labelStyle}>⏰ Hora de clase</label><select value={fHora} onChange={e => setFHora(e.target.value)} style={selStyle}>{HORAS.map(h => <option key={h}>{h}</option>)}</select></div>
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
                <select value={fProfesor} onChange={e => setFProfesor(e.target.value)} style={selStyle}>{profesores.map(p => <option key={p}>{p}</option>)}</select>
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
                <div><label style={labelStyle}>⏰ Hora</label><select value={gHora} onChange={e => setGHora(e.target.value)} style={selStyle}>{HORAS.map(h => <option key={h}>{h}</option>)}</select></div>
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
                <div><label style={labelStyle}>⏰ Hora de la guardia</label><select value={guHora} onChange={e => setGuHora(e.target.value)} style={selStyle}>{HORAS.map(h => <option key={h}>{h}</option>)}</select></div>
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
          <div>
            <h2 style={{ color: C.dark, marginTop: 0 }}>📄 Guardias del día</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 14, marginBottom: 20 }}>
              {[{ label: "Guardias Hoy", value: guardias.filter(g => g.fecha === todayStr()).length, color: C.blue }, { label: "Esta Semana", value: guardias.filter(g => weekKey(g.fecha) === weekKey(new Date())).length, color: C.teal }, { label: "Total", value: guardias.length, color: C.dark }].map(s => (
                <div key={s.label} style={{ background: C.white, borderRadius: 12, padding: 16, textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", borderTop: `4px solid ${s.color}` }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {guardias.length === 0
              ? <Card style={{ textAlign: "center", color: C.gray, padding: 40 }}>No hay guardias registradas</Card>
              : guardias.map(g => (
                <Card key={g.id} style={{ borderLeft: `4px solid ${C.blue}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: C.dark, fontSize: 15 }}>🔄 {g.hora} · {g.modulo} · {g.curso}{g.materia && ` · ${g.materia}`}</div>
                      <div style={{ fontSize: 13, color: C.gray, marginTop: 4 }}>📅 {fmt(g.ts)}</div>
                      <div style={{ fontSize: 13, marginTop: 6 }}><span style={{ color: C.salmon, fontWeight: 600 }}>Ausente:</span> {g.profesorAusente} <span style={{ color: C.gray, marginLeft: 8 }}>({g.motivo})</span></div>
                      <div style={{ fontSize: 13, marginTop: 2 }}><span style={{ color: C.teal, fontWeight: 600 }}>Guardia:</span> {g.profesorGuardia}</div>
                      {g.material && <div style={{ fontSize: 13, marginTop: 6, background: C.cream, borderRadius: 6, padding: "6px 10px" }}>📝 Material: {g.material}</div>}
                    </div>
                    <span style={{ background: g.profesorGuardia === fProfesor ? "#E8F5F3" : "#EEF5F8", color: g.profesorGuardia === fProfesor ? C.teal : C.blue, borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>
                      {g.profesorGuardia === fProfesor ? "✅ Tú la cubres" : "👤 " + g.profesorGuardia}
                    </span>
                  </div>
                </Card>
              ))}
          </div>
        )}

        {/* ── Mis Partes ── */}
        {tab === "historial" && (
          <div>
            <h2 style={{ color: C.dark, marginTop: 0 }}>🗂 Mis Partes Enviados</h2>
            {partes.filter(p => p.profesor === fProfesor).length === 0
              ? <Card style={{ textAlign: "center", color: C.gray, padding: 40 }}>No has generado ningún parte aún</Card>
              : partes.filter(p => p.profesor === fProfesor).map(p => <ParteCard key={p.id} parte={p} onVer={() => setShowParte(p)} onPrint={() => setPrintParte(p)} />)}
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
              
              const guardiaHoy = guardias.filter(g => g.fecha === todayStr()).length;
              const partesHoy = partes.filter(p => p.ts.split("T")[0] === todayStr()).length;
              const ausenciasHoy = guardias.filter(g => g.fecha === todayStr()).length;
              
              return (
                <div style={{ background: `linear-gradient(135deg, ${C.blue} 0%, ${C.teal} 100%)`, color: "#fff", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                    <div>
                      <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{saludo}, {usuario}! 👋</h1>
                      <p style={{ margin: 0, fontSize: 15, opacity: 0.9, lineHeight: 1.5 }}>
                        Hoy tienes <strong>{guardiaHoy} guardia{guardiaHoy !== 1 ? 's' : ''}</strong> programada{guardiaHoy !== 1 ? 's' : ''} 
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
                { label: "Guardias Hoy", value: guardias.filter(g => g.fecha === todayStr()).length,        color: "#7c3aed",emoji: "🔄" },
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
                                <button onClick={() => setShowParte(p)} style={{ background: "#EEF5F8", color: C.blue, border: "none", borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Ver</button>
                                <button onClick={() => setPrintParte(p)} style={{ background: "#FDF0EF", color: C.salmon, border: "none", borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>🖨</button>
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
                    : pAl.map(p => <ParteCard key={p.id} parte={p} onVer={() => setShowParte(p)} onPrint={() => setPrintParte(p)} />)}
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
              : partesFiltrados.map(p => <ParteCard key={p.id} parte={p} onVer={() => setShowParte(p)} onPrint={() => setPrintParte(p)} />)}
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
          <MiGuardiaHoy profesores={profesores} cuadrante={cuadrante} apoyosGuardia={apoyosGuardia} ausencias={ausencias} fProfesor={fProfesor} setFProfesor={setFProfesor} C={C} selStyle={selStyle} labelStyle={labelStyle} usuario={usuario} setShowCuadrante={setShowCuadrante} diaSeleccionadoGuardias={diaSeleccionadoGuardias} setDiaSeleccionadoGuardias={setDiaSeleccionadoGuardias} />
        )}

        {/* ── Notificar Ausencia (Profesor) ── */}
        {tab === "notif_ausencia" && (
          <NotificarAusencia
            profesores={profesores} ausencias={ausencias} setAusencias={setAusencias}
            ausProfesor={ausProfesor} setAusProfesor={setAusProfesor}
            ausMotivo={ausMotivo} setAusMotivo={setAusMotivo}
            ausFecha={ausFecha} setAusFecha={setAusFecha}
            ausHoras={ausHoras} setAusHoras={setAusHoras}
            ausTarea={ausTarea} setAusTarea={setAusTarea}
            ausEnlace={ausEnlace} setAusEnlace={setAusEnlace}
            ausUbicacion={ausUbicacion} setAusUbicacion={setAusUbicacion}
            fProfesor={fProfesor} C={C} inpStyle={inpStyle} selStyle={selStyle} labelStyle={labelStyle} fmt={fmt}
          />
        )}

        {/* ── Cuadrante de Guardias (Jefatura) ── */}
        {tab === "cuadrante" && (
          <CuadranteGuardias
            profesores={profesores} cuadrante={cuadrante} setCuadrante={setCuadrante}
            apoyosGuardia={apoyosGuardia} setApoyosGuardia={setApoyosGuardia}
            quinceInicio={quinceInicio} setQInicio={setQInicio}
            quinceProfesor={quinceProfesor} setQProf={setQProf}
            C={C} inpStyle={inpStyle} selStyle={selStyle} labelStyle={labelStyle}
          />
        )}

        {/* ── Parte del Día (Jefatura) ── */}
        {tab === "parte_dia" && (
          <ParteDia profesores={profesores} cuadrante={cuadrante} ausencias={ausencias} C={C} />
        )}

        {/* ── Gestión Ausencias (Jefatura) ── */}
        {tab === "ausencias_jef" && (
          <GestionAusencias ausencias={ausencias} setAusencias={setAusencias} profesores={profesores} C={C} fmt={fmt} />
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
                💡 El informe se abrirá en pantalla completa. Usa <strong>Ctrl+P</strong> → <strong>"Guardar como PDF"</strong>.
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
                  <div style={{ background: C.cream, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: C.dark }}>
                    El informe incluirá <strong>{partesFiltrados.length} parte(s)</strong>
                    {filtCurso && ` · ${filtCurso}`}{filtGravedad && ` · ${GRAVEDAD.find(g => g.id === filtGravedad)?.label}`}
                    {filtFechaDesde && ` · Desde: ${fmtD(filtFechaDesde)}`}{filtFechaHasta && ` · Hasta: ${fmtD(filtFechaHasta)}`}
                  </div>
                  <Btn onClick={() => setPrintInforme(true)} disabled={partesFiltrados.length === 0} color={C.teal} style={{ width: "100%", fontSize: 15, padding: "14px" }}>
                    🖨 Ver Informe de Partes y Guardar como PDF (Ctrl+P)
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
                    🖨 Ver Informe de Baños y Guardar como PDF (Ctrl+P)
                  </Btn>
                </>
              )}
            </Card>
          </div>
        )}

        {/* ── Admin Alumnos ── */}
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
              {profesores.map((p, i) => (
                <div key={i} style={{ padding: "12px 20px", borderBottom: `1px solid ${C.cream}`, fontSize: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 500, color: C.dark }}>👤 {p}</span>
                  <button onClick={() => setProfesores(prev => prev.filter((_, j) => j !== i))} style={{ background: "#FDF0EF", color: C.salmon, border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>🗑</button>
                </div>
              ))}
            </Card>
          </div>
        )}

      </div>

      {/* ── Modal Ver Cuadrante Completo ── */}
      {showCuadrante && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: C.white, borderRadius: 16, maxWidth: "95vw", width: "100%", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ background: `linear-gradient(90deg,${C.dark},${C.blue})`, color: "#fff", padding: "16px 24px", borderRadius: "16px 16px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>📅 Cuadrante de Guardias Completo</div>
              <button onClick={() => setShowCuadrante(false)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
            <div style={{ padding: 20, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 900 }}>
                <thead>
                  <tr style={{ background: C.dark }}>
                    <th style={{ padding: "10px 8px", color: "#fff", textAlign: "left", fontWeight: 600 }}>Hora</th>
                    {DIAS_SEMANA.map(d => <th key={d} style={{ padding: "10px 8px", color: "#fff", textAlign: "center", fontWeight: 600 }}>{d.substring(0,3)}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {HORAS_GUARDIA.map((hora, idx) => (
                    <tr key={hora} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "10px 8px", fontWeight: 700, color: C.dark, width: 80 }}>{hora}</td>
                      {DIAS_SEMANA.map(dia => {
                        const asignaciones = [];
                        profesores.forEach(prof => {
                          const key = `${dia}|${hora}|${prof}`;
                          if (cuadrante[key]) {
                            const zona = ZONAS_CENTRO.find(z => z.id === cuadrante[key]);
                            const apoyo = apoyosGuardia[`${dia}|${hora}|${cuadrante[key]}`];
                            asignaciones.push({
                              profesor: prof,
                              zona: zona ? zona.label : "Zona desconocida",
                              apoyo: apoyo || null
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
                                    {a.apoyo && <span style={{ color: C.blue, fontSize: 9 }}>👥 Apoyo: {a.apoyo}</span>}
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
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: C.white, borderRadius: 16, maxWidth: 560, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ background: `linear-gradient(90deg,${C.dark},${C.blue})`, color: "#fff", padding: "16px 24px", borderRadius: "16px 16px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700 }}>GalvánDesk · Parte de Incidencia</div>
                <div style={{ fontSize: 12, opacity: .8 }}>Ref: PARTE-{showParte.id}</div>
              </div>
              <button onClick={() => setShowParte(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
            <div style={{ padding: 24 }}>
              {(() => { const g = gObj(showParte.gravedad); return <div style={{ background: g.bg, border: `2px solid ${g.color}`, borderRadius: 10, padding: 12, marginBottom: 20, textAlign: "center" }}><strong style={{ color: g.color, fontSize: 16 }}>{g.label} — {g.desc}</strong></div>; })()}
              {showParte.esGrupal && <div style={{ background: "#E8F5F3", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: C.teal, fontWeight: 600, marginBottom: 12 }}>👥 Parte generado como parte de grupo</div>}
              {[["Alumno", showParte.alumno], ["Curso", showParte.curso], ["Tutor", showParte.tutor], ["Tipo", showParte.tipo], ["Hora", showParte.hora || "No especificada"], ["Fecha y hora", fmt(showParte.ts)], ["Profesor", showParte.profesor]].map(([k, v]) => (
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
              <button onClick={() => { setShowParte(null); setPrintParte(showParte); }}
                style={{ marginTop: 16, width: "100%", background: C.salmon, color: "#fff", border: "none", borderRadius: 10, padding: "12px", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
                🖨 Imprimir / Guardar como PDF (Ctrl+P)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
