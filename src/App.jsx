import { useState, useEffect, useRef } from "react";
import { MapPin, Clock, Phone, ArrowRight, Menu, X, Mail, CalendarHeart, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xscdqxfvrmjlxeilrxnb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzY2RxeGZ2cm1qbHhlaWxyeG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMDQ5NDksImV4cCI6MjEwMzU4MDk0OX0.YHwFtZAJEK7MjOxYJTPrItQmV9IQfWQNS443V-uQ1F4"
);

// ── ICÔNE INSTAGRAM (retirée de lucide-react v0.400+) ─────────────────────────
function Instagram({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none" />
    </svg>
  );
}

// ── DESIGN TOKENS — Charte Direction Artistique Mama Mok ──────────────────────
const G      = "#3A3F2E";   // Dark Olive — base identitaire (60%)
const G2     = "#6F6F44";   // Olive clair — nuance
const B      = "#6A1F2B";   // Ancient Burgundy — accent signature (10%)
const B2     = "#8B2535";   // Bordeaux secondaire
const CR     = "#D8D2C4";   // Skipping Stone — minéral chaud (30%)
const CR2    = "#EDE8DB";   // Crème légère (fonds de section)
const ST     = "#1C2016";   // Texte sombre profond
const MU     = "#7A7565";   // Muted — textes secondaires
const BORDER = "#C8C2B0";   // Bordure fine minérale

// ── THÈMES MIDI / SOIR ────────────────────────────────────────────────────────
const THEMES = {
  midi: {
    pageBg:     CR2,
    navBg:      "rgba(237,232,219,0.97)",
    navBorder:  BORDER,
    navLink:    MU,
    navLinkHov: G,
    menuBg:     CR2,
    menuTitle:  G,
    menuText:   ST,
    menuMuted:  MU,
    menuBorder: BORDER,
    menuPrice:  B,
    menuNote:   G,
    menuNoteBg: "rgba(58,63,46,0.08)",
    menuNoteBd: "rgba(58,63,46,0.2)",
    btnBg:      G,
    toggleAct:  G,
    divider:    "rgba(58,63,46,0.12)",
    calloutBg:  "rgba(58,63,46,0.05)",
    calloutBd:  "rgba(58,63,46,0.13)",
  },
  soir: {
    pageBg:     "#0f1409",
    navBg:      "rgba(12,17,6,0.97)",
    navBorder:  "rgba(216,210,196,0.08)",
    navLink:    "rgba(216,210,196,0.45)",
    navLinkHov: CR,
    menuBg:     "#0f1409",
    menuTitle:  CR,
    menuText:   "#ddd7c8",
    menuMuted:  "rgba(216,210,196,0.5)",
    menuBorder: "rgba(216,210,196,0.1)",
    menuPrice:  "#b5606e",
    menuNote:   "#b5606e",
    menuNoteBg: "rgba(106,31,43,0.15)",
    menuNoteBd: "rgba(106,31,43,0.3)",
    btnBg:      B,
    toggleAct:  "#0f1409",
    divider:    "rgba(216,210,196,0.1)",
    calloutBg:  "rgba(216,210,196,0.04)",
    calloutBd:  "rgba(216,210,196,0.08)",
  },
};

// ── IMAGES ────────────────────────────────────────────────────────────────────
const IMG = {
  hero:         "https://primary.jwwb.nl/public/l/n/c/temp-fqqsrlzrteuhifpkxoiw/8a5fb570-952f-4a56-b8a0-e776d79d1698-high.jpg?enable-io=true&crop=1.3333%3A1&width=1920",
  food:         "https://primary.jwwb.nl/pexels/28/28446155.jpeg?enable-io=true&crop=1.0538%3A1%2Coffset-y0&width=1920",
  drinks:       "https://primary.jwwb.nl/pexels/89/8942305.jpeg?enable-io=true&width=1920",
  manon:        "https://primary.jwwb.nl/public/l/n/c/temp-fqqsrlzrteuhifpkxoiw/c615bc5a-99e9-48f6-b85f-2104e21b25d5-high.jpg?enable-io=true&crop=0.9487%3A1%2Coffset-y0&width=1920",
  matt:         "https://primary.jwwb.nl/public/l/n/c/temp-fqqsrlzrteuhifpkxoiw/c54f5e3d-bc47-4718-8d7e-4d722d85d9e3-high.jpg?enable-io=true&crop=0.9569%3A1%2Coffset-y26&width=1920",
  moke:         "https://primary.jwwb.nl/public/l/n/c/temp-fqqsrlzrteuhifpkxoiw/24497393-3dc7-4bd4-9905-11fd339daede-high.jpg?enable-io=true&crop=0.9552%3A1%2Coffset-y17&width=1920",
  devanture:    "https://primary.jwwb.nl/public/l/n/c/temp-fqqsrlzrteuhifpkxoiw/10devanture-mamamok.svg",
  logoOfficial: "/logo-mamamok.png",
};

const CAROUSEL_SLIDES = [
  { img: IMG.food,   label: "Cuisine de saison" },
  { img: IMG.drinks, label: "Élixirs & cocktails" },
  { img: IMG.food,   label: "Geste signature" },
  { img: IMG.drinks, label: "Carte des vins" },
];

// ── DONNÉES MENU ──────────────────────────────────────────────────────────────
const MENU_PDF_URL_DEFAULT = { midi: null, soir: null };
const MENU_DATA = {
  midi: {
    entrees: [
      { name: "Velouté du jour",          price: "8 €",   note: "Selon arrivage" },
      { name: "Tartare de légumes",        price: "10 €",  note: "Végétarien" },
      { name: "Gravlax de saumon",         price: "12 €",  note: "Signature" },
    ],
    plats: [
      { name: "Le Mama Bowl",              price: "16 €",  note: "Végétarien" },
      { name: "Agneau confit 8h",          price: "20 €",  note: "Signature" },
      { name: "Poisson du marché",         price: "18 €",  note: "Selon arrivage" },
    ],
    desserts: [
      { name: "Baklava maison",            price: "7 €",   note: "Signature" },
      { name: "Fruits de saison",          price: "6 €",   note: null },
    ],
  },
  soir: {
    entrees: [
      { name: "Planche charcuterie & fromage", price: "14 €", note: "À partager" },
      { name: "Houmous & pita chaud",           price: "9 €",  note: "Végétarien" },
      { name: "Tartare de bœuf couteau",        price: "14 €", note: "Signature" },
    ],
    plats: [
      { name: "Agneau confit aux épices",    price: "24 €", note: "Signature" },
      { name: "Saint-Jacques snackées",      price: "26 €", note: "Signature" },
      { name: "Risotto champignons-truffe",  price: "20 €", note: "Végétarien" },
    ],
    desserts: [
      { name: "Mousse chocolat tahini",      price: "8 €",  note: null },
      { name: "Baklava fleur d'oranger",     price: "7 €",  note: null },
    ],
    elixirs: [
      { name: "L'Élixir Vert",               price: "12 €", note: "Signature" },
      { name: "Lie de Lune",                 price: "11 €", note: null },
      { name: "Jardin d'Orient",             price: "11 €", note: null },
      { name: "Le Nectar — sans alcool",     price: "8 €",  note: null },
    ],
  },
};

const HOURS = [
  { service: "Déjeuner", days: "Mar – Sam", time: "12h00 – 14h30" },
  { service: "Dîner",    days: "Mar – Sam", time: "19h30 – 22h30" },
  { service: "Fermé",    days: "Dim – Lun", time: "—" },
];
const TEAM = [
  { name: "Manon", role: "Co-fondatrice", img: IMG.manon, quote: "L'ambiance, c'est ma signature." },
  { name: "Matt",  role: "Co-fondateur & Cuisine", img: IMG.matt,  quote: "Chaque assiette est une décision." },
  { name: "Moké",  role: "Co-fondateur & Créations", img: IMG.moke, quote: "L'élixir, c'est le geste qui révèle." },
];
const FAQ = [
  { q: "Comment réserver ?",                          a: "Via le bouton Réserver (Zenchef), par téléphone ou par Instagram. Groupes de 6+ : contactez-nous directement." },
  { q: "Y a-t-il des options végétariennes ?",        a: "Oui, plusieurs plats à chaque service, identifiés sur la carte." },
  { q: "Proposez-vous des adaptations sans gluten ?", a: "Certains plats peuvent être ajustés — signalez-le à la réservation ou à l'arrivée." },
  { q: "Peut-on commander à emporter ?",              a: "Le soir uniquement, sur appel préalable." },
  { q: "Quels modes de paiement acceptez-vous ?",     a: "CB, Visa, Mastercard, American Express et espèces." },
  { q: "Le restaurant est-il accessible PMR ?",        a: "Oui, salle de plain-pied. Contactez-nous pour tout besoin spécifique." },
];

const SLOTS = { midi: ["12h00", "12h30", "13h00"], soir: ["19h30", "20h00", "20h30"] };
const MAX_PAX_PER_SLOT = 30;
const WA_NUMBER = "33600000000"; // ← remplacer par le vrai numéro

// ─────────────────────────────────────────────────────────────────────────────
// SOUS-COMPOSANTS
// ─────────────────────────────────────────────────────────────────────────────

// Goutte SVG animée — signature élixir
function DroppingElixir({ size = 80, color = "#D8D2C4" }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 60 78" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}>
      <style>{`
        @keyframes dropFall {
          0%   { transform: translateY(-8px); opacity: 0; }
          15%  { opacity: 1; }
          80%  { transform: translateY(0px); opacity: 1; }
          100% { transform: translateY(0px); opacity: 0; }
        }
        @keyframes dropletFall {
          0%   { transform: translateY(-4px) scaleY(1.2); opacity: 0; }
          10%  { opacity: 1; }
          60%  { transform: translateY(12px) scaleY(0.9); opacity: 1; }
          100% { transform: translateY(24px) scaleY(0.7); opacity: 0; }
        }
        @keyframes ripple {
          0%   { r: 2; opacity: 0.6; }
          100% { r: 10; opacity: 0; }
        }
        .drop-body { animation: dropFall 2.8s ease-in-out infinite; }
        .drop-let  { animation: dropletFall 2.8s ease-in-out infinite; animation-delay: 0.6s; }
        .ripple    { animation: ripple 2.8s ease-out infinite; animation-delay: 1.4s; }
      `}</style>
      {/* Fiole / goutte principale */}
      <g className="drop-body" style={{ transformOrigin: "30px 36px" }}>
        <path d="M30 6 C30 6 14 22 14 36 C14 45.4 21.2 53 30 53 C38.8 53 46 45.4 46 36 C46 22 30 6 30 6Z"
          fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.5" />
        <path d="M30 6 C30 6 14 22 14 36 C14 45.4 21.2 53 30 53"
          stroke={color} strokeWidth="1" strokeOpacity="0.4" fill="none" />
      </g>
      {/* Gouttelette qui tombe */}
      <ellipse className="drop-let" cx="30" cy="60" rx="2.5" ry="3.5"
        fill={color} fillOpacity="0.7" style={{ transformOrigin: "30px 60px" }} />
      {/* Ondulation à l'impact */}
      <ellipse className="ripple" cx="30" cy="73" rx="2" ry="1.2"
        stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.5" />
    </svg>
  );
}

function DishRow({ item, theme }) {
  const T = theme || { menuText: ST, menuBorder: BORDER, menuPrice: B, menuMuted: MU, menuNote: G, menuNoteBg: "rgba(58,63,46,0.08)", menuNoteBd: "rgba(58,63,46,0.2)" };
  return (
    <div style={{ display: "flex", alignItems: "baseline", padding: "10px 0", borderBottom: `1px solid ${T.menuBorder}`, transition: "border-color 0.45s ease" }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: T.menuText, flexShrink: 0, transition: "color 0.45s ease" }}>{item.name}</span>
      {item.note && (
        <span style={{ display: "inline-block", padding: "1px 6px", borderRadius: 2, fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: T.menuNoteBg, color: T.menuNote, border: `1px solid ${T.menuNoteBd}`, marginLeft: 8, flexShrink: 0, transition: "all 0.45s ease" }}>
          {item.note}
        </span>
      )}
      <span style={{ flex: 1, margin: "0 10px 4px", borderBottom: `1px dotted ${T.menuBorder}`, transition: "border-color 0.45s ease" }} />
      <span style={{ fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 700, color: T.menuPrice, flexShrink: 0, transition: "color 0.45s ease" }}>{item.price}</span>
    </div>
  );
}

function MenuCategory({ title, items, theme }) {
  if (!items || items.length === 0) return null;
  const T = theme || { menuMuted: MU };
  return (
    <div style={{ marginBottom: 28 }}>
      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: T.menuMuted, margin: "0 0 6px", transition: "color 0.45s ease" }}>{title}</p>
      {items.map(item => <DishRow key={item.name} item={item} theme={theme} />)}
    </div>
  );
}

function PhotoCarousel() {
  const [idx, setIdx] = useState(0);
  const next = () => setIdx(i => (i + 1) % CAROUSEL_SLIDES.length);
  const prev = () => setIdx(i => (i - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  useEffect(() => { const t = setInterval(next, 4200); return () => clearInterval(t); }, []);
  return (
    <div style={{ position: "relative", overflow: "hidden", background: ST, height: 400 }}>
      {CAROUSEL_SLIDES.map((s, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, opacity: i === idx ? 1 : 0, transition: "opacity 0.75s ease" }}>
          <img src={s.img} alt={s.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 50%, rgba(28,32,22,0.8))" }} />
        </div>
      ))}
      <div style={{ position: "absolute", bottom: 44, left: 32 }}>
        <p style={{ margin: 0, color: CR, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.8 }}>
          {CAROUSEL_SLIDES[idx].label}
        </p>
      </div>
      <button onClick={prev} aria-label="Précédent" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", background: "rgba(216,210,196,0.15)", border: "none", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <ChevronLeft size={17} color={CR} />
      </button>
      <button onClick={next} aria-label="Suivant" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "rgba(216,210,196,0.15)", border: "none", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <ChevronRight size={17} color={CR} />
      </button>
      <div style={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
        {CAROUSEL_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} aria-label={`Slide ${i + 1}`}
            style={{ width: i === idx ? 18 : 5, height: 5, borderRadius: 3, background: i === idx ? CR : "rgba(216,210,196,0.35)", border: "none", cursor: "pointer", transition: "width 0.3s, background 0.3s", padding: 0 }} />
        ))}
      </div>
    </div>
  );
}

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${BORDER}` }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, textAlign: "left" }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: G, lineHeight: 1.3 }}>{item.q}</span>
        <span style={{ flexShrink: 0, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${open ? B : BORDER}`, borderRadius: "50%", color: open ? B : MU, fontSize: 15, transition: "color 0.2s, border-color 0.2s" }}>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && <p style={{ margin: "0 0 16px", color: MU, fontSize: 14, lineHeight: 1.75, paddingRight: 32 }}>{item.a}</p>}
    </div>
  );
}

// ── MODAL RÉSERVATION ─────────────────────────────────────────────────────────
function ReservationModal({ onClose, reservations, onConfirm }) {
  const EMPTY = { nom: "", tel: "", date: "", service: "", slot: "", pax: "2" };
  const [form, setForm]           = useState(EMPTY);
  const [confirmed, setConfirmed] = useState(null);
  const [errors, setErrors]       = useState({});

  const paxForSlot = (date, slot) => reservations[`${date}__${slot}`] || 0;
  const remaining  = form.date && form.slot ? MAX_PAX_PER_SLOT - paxForSlot(form.date, form.slot) : null;
  const isFull     = remaining !== null && remaining <= 0;

  const validate = () => {
    const e = {};
    if (!form.nom.trim()) e.nom  = "Nom requis";
    if (!form.tel.trim()) e.tel  = "Téléphone requis";
    if (!form.date)       e.date = "Date requise";
    if (!form.slot)       e.slot = "Créneau requis";
    if (isFull)           e.slot = "Créneau complet";
    const n = parseInt(form.pax);
    if (remaining !== null && n > remaining) e.pax = `Plus que ${remaining} place${remaining > 1 ? "s" : ""} disponible${remaining > 1 ? "s" : ""}`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onConfirm(form.date, form.slot, parseInt(form.pax));
    const msg = ["Bonjour Mama Mok ! 🍽️", "Je souhaite réserver une table :",
      `- Nom : ${form.nom}`, `- Personnes : ${form.pax}`,
      `- Date : ${form.date}`, `- Créneau : ${form.slot}`,
      `- Téléphone : ${form.tel}`].join("\n");
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    setConfirmed(form);
    setForm(EMPTY);
  };

  const inputS = (err) => ({
    width: "100%", boxSizing: "border-box",
    border: `1px solid ${err ? B : BORDER}`, borderRadius: 2,
    padding: "11px 14px", fontSize: 14, color: ST, background: CR2,
    fontFamily: "inherit", outline: "none",
  });
  const labelS = { display: "block", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: MU, marginBottom: 6 };
  const currentSlots = form.service === "midi" ? SLOTS.midi : form.service === "soir" ? SLOTS.soir : [];

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(28,32,22,0.65)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 16px" }}>
      <div style={{ background: CR2, width: "100%", maxWidth: 500, borderRadius: 2, boxShadow: "0 24px 60px rgba(0,0,0,0.35)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ padding: "24px 24px 18px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ margin: "0 0 3px", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: B }}>Mama Mok · Rennes</p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color: G, margin: 0 }}>Réserver une table</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MU, padding: 4 }} aria-label="Fermer"><X size={20} /></button>
        </div>

        {confirmed ? (
          <div style={{ padding: "36px 24px 32px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 18 }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: G, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={22} color={CR2} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: G, margin: "0 0 10px" }}>Réservation envoyée</h3>
              <p style={{ color: MU, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                {confirmed.pax} personne{confirmed.pax > 1 ? "s" : ""} · {confirmed.date} · {confirmed.slot}
              </p>
              <p style={{ color: MU, fontSize: 13, marginTop: 8 }}>Un message WhatsApp a été transmis au restaurant.</p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <button onClick={() => setConfirmed(null)} style={{ background: "transparent", color: G, border: `1px solid ${G}`, borderRadius: 2, padding: "10px 20px", fontWeight: 700, fontSize: 12, cursor: "pointer", letterSpacing: "0.07em", textTransform: "uppercase" }}>Nouvelle réservation</button>
              <button onClick={onClose} style={{ background: G, color: CR2, border: "none", borderRadius: 2, padding: "10px 20px", fontWeight: 700, fontSize: 12, cursor: "pointer", letterSpacing: "0.07em", textTransform: "uppercase" }}>Fermer</button>
            </div>
          </div>
        ) : (
          <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={labelS}>Nom complet</label>
              <input value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Marie Dupont" style={inputS(errors.nom)} />
              {errors.nom && <p style={{ color: B, fontSize: 12, margin: "4px 0 0" }}>{errors.nom}</p>}
            </div>
            <div>
              <label style={labelS}>Téléphone</label>
              <input value={form.tel} onChange={e => setForm({ ...form, tel: e.target.value })} placeholder="06 00 00 00 00" type="tel" style={inputS(errors.tel)} />
              {errors.tel && <p style={{ color: B, fontSize: 12, margin: "4px 0 0" }}>{errors.tel}</p>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelS}>Date</label>
                <input value={form.date} onChange={e => setForm({ ...form, date: e.target.value, slot: "" })} type="date" min={new Date().toISOString().split("T")[0]} style={inputS(errors.date)} />
                {errors.date && <p style={{ color: B, fontSize: 12, margin: "4px 0 0" }}>{errors.date}</p>}
              </div>
              <div>
                <label style={labelS}>Personnes</label>
                <select value={form.pax} onChange={e => setForm({ ...form, pax: e.target.value })} style={{ ...inputS(errors.pax), cursor: "pointer" }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n === 1 ? "personne" : "personnes"}</option>)}
                </select>
                {errors.pax && <p style={{ color: B, fontSize: 12, margin: "4px 0 0" }}>{errors.pax}</p>}
              </div>
            </div>
            <div>
              <label style={labelS}>Service</label>
              <div style={{ display: "flex", gap: 10 }}>
                {["midi", "soir"].map(s => (
                  <button key={s} onClick={() => setForm({ ...form, service: s, slot: "" })}
                    style={{ flex: 1, border: `1.5px solid ${form.service === s ? G : BORDER}`, borderRadius: 2, padding: "10px 0", background: form.service === s ? G : "transparent", color: form.service === s ? CR2 : MU, fontWeight: 700, fontSize: 13, letterSpacing: "0.07em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
                    {s === "midi" ? "Midi" : "Soir"}
                  </button>
                ))}
              </div>
            </div>
            {currentSlots.length > 0 && form.date && (
              <div>
                <label style={labelS}>Créneau</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {currentSlots.map(slot => {
                    const left = MAX_PAX_PER_SLOT - paxForSlot(form.date, slot);
                    const full = left <= 0;
                    const sel  = form.slot === slot;
                    return (
                      <button key={slot} disabled={full} onClick={() => setForm({ ...form, slot })}
                        style={{ flex: 1, border: `1.5px solid ${full ? BORDER : sel ? G : BORDER}`, borderRadius: 2, padding: "10px 4px", cursor: full ? "not-allowed" : "pointer", background: full ? "#ddd7c8" : sel ? G : "transparent", color: full ? MU : sel ? CR2 : ST, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, opacity: full ? 0.6 : 1, transition: "all 0.18s" }}>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{slot}</span>
                        <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: full ? MU : sel ? "rgba(237,232,219,0.7)" : left <= 6 ? B : MU }}>
                          {full ? "Complet" : left <= 6 ? `${left} pl.` : "Dispo"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.slot && <p style={{ color: B, fontSize: 12, margin: "8px 0 0" }}>{errors.slot}</p>}
              </div>
            )}
            {remaining !== null && !isFull && (
              <div style={{ background: remaining <= 6 ? "rgba(106,31,43,0.08)" : "rgba(58,63,46,0.07)", border: `1px solid ${remaining <= 6 ? "rgba(106,31,43,0.2)" : "rgba(58,63,46,0.15)"}`, borderRadius: 2, padding: "10px 14px", fontSize: 13, color: remaining <= 6 ? B : G, fontWeight: 600 }}>
                {remaining <= 6 ? `⚠️ Plus que ${remaining} place${remaining > 1 ? "s" : ""} disponible${remaining > 1 ? "s" : ""}.` : `✓ ${remaining} places disponibles.`}
              </div>
            )}
            <button onClick={handleSubmit} style={{ background: G, color: CR2, border: "none", borderRadius: 2, padding: "14px 28px", fontWeight: 700, fontSize: 12, cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase", width: "100%", fontFamily: "inherit" }}>
              Confirmer via WhatsApp
            </button>
            <p style={{ color: MU, fontSize: 12, textAlign: "center", margin: 0 }}>
              Intégration Zenchef à venir · <a href="tel:+33299000000" style={{ color: G, fontWeight: 700 }}>02 99 00 00 00</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [mob, setMob]         = useState(false);
  const [scrolled, setSc]     = useState(false);
  const [modalOpen, setModal] = useState(false);
  const [service, setService] = useState("midi");
  const [fabVisible, setFab]  = useState(false);
  const [reservations, setRes]= useState({});
  const [menuPdfUrl, setPdfUrl] = useState(MENU_PDF_URL_DEFAULT);

  const T = THEMES[service];

  const heroRef    = useRef(null);
  const menuRef    = useRef(null);
  const conceptRef = useRef(null);
  const infosRef   = useRef(null);
  const NAV_H = 66;

  useEffect(() => {
    const fn = () => {
      setSc(window.scrollY > 40);
      setFab((heroRef.current?.getBoundingClientRect().bottom ?? 0) < 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { document.body.style.overflow = modalOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [modalOpen]);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;600;700&display=swap";
    document.head.appendChild(link);
  }, []);

  // Charge les URLs des PDFs depuis Supabase
  useEffect(() => {
    supabase.from("carte_urls").select("*").then(({ data }) => {
      if (data) {
        const urls = { midi: null, soir: null };
        data.forEach(row => { urls[row.service] = row.pdf_url; });
        setPdfUrl(urls);
      }
    });
  }, []);

  const go = (ref) => { setMob(false); setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80); };
  const openModal = () => { setMob(false); setModal(true); };
  const handleConfirm = (date, slot, pax) => { const key = `${date}__${slot}`; setRes(prev => ({ ...prev, [key]: (prev[key] || 0) + pax })); };

  const NAV = [
    { label: "La Carte",   ref: menuRef },
    { label: "Le Concept", ref: conceptRef },
    { label: "Accès",      ref: infosRef },
  ];

  const btnPrimary = (extra = {}) => ({
    background: T.btnBg, color: CR2, border: "none", borderRadius: 2,
    padding: "11px 24px", fontWeight: 700, fontSize: 11, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 8,
    letterSpacing: "0.1em", textTransform: "uppercase",
    fontFamily: "inherit", transition: "background 0.3s", ...extra,
  });

  const currentMenu = MENU_DATA[service];

  return (
    <div style={{ fontFamily: "'Kumbh Sans', sans-serif", background: T.pageBg, color: T.menuText, minHeight: "100vh", transition: "background 0.45s ease, color 0.45s ease" }}>

      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none} }
        @keyframes fabIn  { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none} }
        .mm-fadein { animation: fadeUp .5s ease both; }
        .mm-fab-in { animation: fabIn .26s ease both; }
        img { display: block; }
        input:focus, select:focus { outline: none; border-color: ${G} !important; }

        @media (max-width: 800px) {
          #desk-nav   { display: none !important; }
          #mob-btn    { display: flex !important; }
          .hero-split { flex-direction: column !important; }
          .hero-photo { height: 56vw !important; min-height: 210px; }
          .hero-copy  { padding: 36px 20px 32px !important; }
          .elixir-kw  { gap: 24px !important; }
          .menu-cols  { grid-template-columns: 1fr !important; }
          .team-grid  { grid-template-columns: 1fr !important; gap: 32px !important; }
          .team-intro { grid-template-columns: 1fr !important; gap: 28px !important; }
          .blockquote { border-left: none !important; padding-left: 0 !important; padding-top: 24px; border-top: 1px solid rgba(216,210,196,0.2); }
          .info-cols  { grid-template-columns: 1fr !important; gap: 32px !important; }
          .portrait   { height: 260px !important; }
          .sp         { padding: 56px 20px !important; }
        }
        @media (min-width: 801px) {
          #mob-btn  { display: none !important; }
          #desk-nav { display: flex !important; }
        }
      `}</style>

      {modalOpen && <ReservationModal onClose={() => setModal(false)} reservations={reservations} onConfirm={handleConfirm} />}

      {/* ════════════ NAVBAR ════════════ */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: scrolled ? T.navBg : T.pageBg, backdropFilter: scrolled ? "blur(10px)" : "none", borderBottom: `1px solid ${T.navBorder}`, transition: "background 0.45s ease, border-color 0.45s ease" }}>
        <nav style={{ maxWidth: 1160, margin: "0 auto", padding: "0 20px", height: NAV_H, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => go(heroRef)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <img src={IMG.logoOfficial} alt="Logo Mama Mok — Restaurant Bistronomique Rennes" style={{ height: 34, objectFit: "contain", filter: service === "soir" ? "brightness(0) invert(1)" : "none", transition: "filter 0.45s ease" }} />
          </button>
          <div id="desk-nav" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {NAV.map(({ label, ref }) => (
              <button key={label} onClick={() => go(ref)}
                style={{ background: "none", border: "none", cursor: "pointer", color: T.navLink, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 0", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = T.navLinkHov}
                onMouseLeave={e => e.target.style.color = T.navLink}>
                {label}
              </button>
            ))}
            <button onClick={openModal} style={btnPrimary()}>
              <CalendarHeart size={13} /> Réserver
            </button>
          </div>
          <button id="mob-btn" onClick={() => setMob(!mob)} style={{ background: "none", border: "none", cursor: "pointer", color: T.navLinkHov, padding: 4, display: "none" }}>
            {mob ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
        {mob && (
          <div style={{ background: T.pageBg, borderTop: `1px solid ${T.navBorder}`, padding: "14px 20px 24px", display: "flex", flexDirection: "column", gap: 4, transition: "background 0.45s ease" }}>
            {NAV.map(({ label, ref }) => (
              <button key={label} onClick={() => go(ref)}
                style={{ background: "none", border: "none", cursor: "pointer", color: T.menuText, fontSize: 16, fontWeight: 700, textTransform: "uppercase", textAlign: "left", padding: "10px 0", borderBottom: `1px solid ${T.menuBorder}`, letterSpacing: "0.07em" }}>
                {label}
              </button>
            ))}
            <button onClick={openModal} style={{ ...btnPrimary(), marginTop: 14, justifyContent: "center" }}>
              <CalendarHeart size={13} /> Réserver une table
            </button>
          </div>
        )}
      </header>

      <main>

      {/* ════════════ HERO ════════════ */}
      <section ref={heroRef} style={{ paddingTop: NAV_H }}>
        <div className="hero-split" style={{ display: "flex", minHeight: `calc(100vh - ${NAV_H}px)` }}>
          <div className="hero-copy" style={{ flex: "0 0 50%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "64px 52px 64px 44px", borderRight: `1px solid ${BORDER}` }}>
            <div className="mm-fadein" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <span style={{ color: B, fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 700 }}>
                Restaurant Bistronomique · Rennes
              </span>
              <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(38px, 5vw, 62px)", fontWeight: 700, color: G, lineHeight: 1.07, margin: 0, letterSpacing: "-0.02em" }}>
                Le goût,<br />
                <em style={{ color: B, fontStyle: "italic", fontWeight: 400 }}>dans sa</em><br />
                globalité.
              </h1>
              <p style={{ color: MU, fontSize: 15, lineHeight: 1.75, maxWidth: 390, margin: 0 }}>
                Une cuisine bistronomique où chaque assiette est associée à un élixir. Précision, fluidité, singularité — un geste signature qui révèle le plat.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <button onClick={() => go(menuRef)} style={btnPrimary()}>
                  La Carte <ArrowRight size={13} />
                </button>
                <button onClick={openModal} style={{ background: "transparent", color: G, border: `1.5px solid ${G}`, borderRadius: 2, padding: "10px 22px", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", fontFamily: "inherit" }}>
                  Réserver
                </button>
              </div>
              <div style={{ display: "flex", gap: 20, paddingTop: 4 }}>
                <a href="https://instagram.com/mamamok_rennes" target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 6, color: MU, fontSize: 11, textDecoration: "none", fontWeight: 600, letterSpacing: "0.07em" }}>
                  <Instagram size={14} color={G} /> @mamamok_rennes
                </a>
                <a href="mailto:bonjour@mamamok.fr"
                  style={{ display: "flex", alignItems: "center", gap: 6, color: MU, fontSize: 11, textDecoration: "none", fontWeight: 600, letterSpacing: "0.07em" }}>
                  <Mail size={14} color={G} /> Contact
                </a>
              </div>
            </div>
          </div>
          <div className="hero-photo" style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            <img src={IMG.hero} alt="Salle du restaurant Mama Mok, 12 rue de la Psalette, Rennes" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />
          </div>
        </div>
      </section>

      {/* ════════════ SECTION ÉLIXIR ════════════ */}
      <section style={{ background: G, padding: "72px 28px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 32 }}>

          {/* Goutte animée */}
          <DroppingElixir size={72} color={CR} />

          {/* Titre */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
            <span style={{ color: "rgba(216,210,196,0.45)", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 700 }}>Le Geste Signature</span>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 700, color: CR, margin: 0, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
              L'Élixir.
            </h2>
          </div>

          {/* Citation courte */}
          <p style={{ color: "rgba(216,210,196,0.72)", fontSize: 16, lineHeight: 1.78, maxWidth: 540, margin: 0 }}>
            Ce n'est pas un condiment. Ce n'est pas un cocktail. C'est un concentré de saveurs préparé chaque matin par nos cuisiniers — versé sur l'assiette au moment de servir, il révèle, intensifie, transforme.
          </p>

          {/* Mots-clés directeurs */}
          <div className="elixir-kw" style={{ display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center", paddingTop: 8 }}>
            {["Concentré", "Fluidité", "Précision", "Rituel"].map((kw, i) => (
              <div key={kw} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "Georgia, serif", fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 700, color: CR, letterSpacing: "-0.01em" }}>{kw}</span>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: B2 }} />
              </div>
            ))}
          </div>

          {/* Séparateur ligne fine */}
          <div style={{ width: 48, height: 1, background: "rgba(216,210,196,0.2)" }} />

          {/* Appel à l'action */}
          <button onClick={() => go(menuRef)}
            onMouseEnter={e => { e.currentTarget.style.background = CR; e.currentTarget.style.color = G; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = CR; }}
            style={{ background: "transparent", color: CR, border: `1.5px solid rgba(216,210,196,0.4)`, borderRadius: 2, padding: "12px 28px", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s, color 0.2s" }}>
            Découvrir la carte
          </button>
        </div>
      </section>

      {/* ════════════ CAROUSEL ════════════ */}
      <section style={{ background: ST }}>
        <PhotoCarousel />
      </section>

      {/* ════════════ MENU ════════════ */}
      <section ref={menuRef} className="sp" style={{ padding: "80px 28px", background: T.menuBg, transition: "background 0.45s ease" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <p style={{ color: B, fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>Cuisine & Saison</p>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: T.menuTitle, margin: 0, transition: "color 0.45s ease" }}>Notre Carte</h2>
              <p style={{ color: T.menuMuted, fontSize: 13, margin: 0, maxWidth: 320, lineHeight: 1.65, transition: "color 0.45s ease" }}>
                Produits sourcés chaque matin. La carte suit les saisons et les arrivages du marché.
              </p>
            </div>
          </div>

          <div style={{ height: 1, background: T.divider, marginBottom: 32, transition: "background 0.45s ease" }} />

          {/* Toggle Midi / Soir */}
          <div style={{ display: "flex", gap: 0, marginBottom: 44, border: `1.5px solid ${T.menuBorder}`, borderRadius: 2, overflow: "hidden", width: "fit-content", transition: "border-color 0.45s ease" }}>
            {["midi", "soir"].map(s => (
              <button key={s} onClick={() => setService(s)}
                style={{ padding: "10px 32px", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", border: "none", background: service === s ? THEMES[s].toggleAct : "transparent", color: service === s ? CR2 : T.menuMuted, fontFamily: "inherit", transition: "all 0.3s" }}>
                {s === "midi" ? "☀️  Midi" : "🌙  Soir"}
              </button>
            ))}
          </div>

          {menuPdfUrl[service] ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: T.menuMuted, fontSize: 14, marginBottom: 20 }}>Consultez notre carte complète :</p>
              <a href={menuPdfUrl[service]} target="_blank" rel="noopener noreferrer"
                style={{ ...btnPrimary(), textDecoration: "none", display: "inline-flex" }}>
                Voir la carte {service} (PDF) <ArrowRight size={13} />
              </a>
            </div>
          ) : (
            <div className="menu-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 56px" }}>
              <div>
                <MenuCategory title="Entrées"  items={currentMenu.entrees}  theme={T} />
                <MenuCategory title="Plats"    items={currentMenu.plats}    theme={T} />
              </div>
              <div>
                <MenuCategory title="Desserts" items={currentMenu.desserts} theme={T} />
                {currentMenu.elixirs   && <MenuCategory title="Élixirs & Cocktails" items={currentMenu.elixirs}   theme={T} />}
              </div>
            </div>
          )}

          <div style={{ marginTop: 40, padding: "20px 24px", background: T.calloutBg, border: `1px solid ${T.calloutBd}`, borderRadius: 2, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between", transition: "background 0.45s ease, border-color 0.45s ease" }}>
            <div>
              <p style={{ margin: "0 0 2px", fontWeight: 700, color: T.menuTitle, fontSize: 13, transition: "color 0.45s ease" }}>Carte des vins & élixirs</p>
              <p style={{ margin: 0, color: T.menuMuted, fontSize: 12, transition: "color 0.45s ease" }}>Disponible à table ou sur demande.</p>
            </div>
            <button onClick={openModal} style={btnPrimary()}>Réserver une table</button>
          </div>
        </div>
      </section>

      {/* ════════════ CONCEPT / ÉQUIPE ════════════ */}
      <section ref={conceptRef} style={{ background: G }}>
        <div className="sp" style={{ padding: "80px 28px", maxWidth: 1160, margin: "0 auto" }}>
          <div className="team-intro" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center", marginBottom: 72 }}>
            <div>
              <p style={{ color: "rgba(216,210,196,0.45)", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 14px" }}>L'Esprit Mama Mok</p>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, color: CR, lineHeight: 1.12, margin: "0 0 20px" }}>
                Créatif, structuré,<br /><em style={{ fontWeight: 400, fontStyle: "italic" }}>jamais rigide.</em>
              </h2>
              <p style={{ color: "rgba(216,210,196,0.68)", fontSize: 15, lineHeight: 1.82, margin: 0 }}>
                Mama Mok n'est pas un gastro. Ce n'est pas un bistrot ordinaire. C'est un lieu d'expression culinaire avec un geste identitaire — l'élixir — qui prolonge chaque assiette et engage tous les sens. Né en 2018, porté par trois associés avec une ambition : l'excellence dans la précision.
              </p>
            </div>
            <div className="blockquote" style={{ borderLeft: `1px solid rgba(216,210,196,0.15)`, paddingLeft: 36 }}>
              <blockquote style={{ margin: 0 }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(17px, 2.5vw, 22px)", fontStyle: "italic", color: CR, lineHeight: 1.55, margin: "0 0 14px" }}>
                  "L'élixir n'est pas un plus. C'est un activateur sensoriel. Un rituel. Un élément de surprise maîtrisée."
                </p>
                <cite style={{ color: "rgba(216,210,196,0.4)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", fontStyle: "normal" }}>— Direction Artistique, Mama Mok</cite>
              </blockquote>
            </div>
          </div>

          <p style={{ color: "rgba(216,210,196,0.4)", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 24px" }}>Les Fondateurs</p>
          <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {TEAM.map(p => (
              <div key={p.name}>
                <div className="portrait" style={{ height: 360, borderRadius: 2, overflow: "hidden", marginBottom: 18 }}>
                  <img src={p.img} alt={`${p.name} — ${p.role} du restaurant bistronomique Mama Mok à Rennes`} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                </div>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: 19, fontWeight: 700, color: CR, margin: "0 0 3px" }}>{p.name}</h3>
                <p style={{ color: "rgba(216,210,196,0.4)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>{p.role}</p>
                <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: "rgba(216,210,196,0.6)", fontSize: 14, margin: 0 }}>"{p.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ DEVANTURE IMMERSIVE ════════════ */}
      <section style={{ width: "100%", minHeight: 520, position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden", backgroundImage: `url(${IMG.devanture})`, backgroundSize: "cover", backgroundPosition: "center 10%", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(22,28,14,0.62)" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px 52px", maxWidth: 600, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <span style={{ color: "rgba(216,210,196,0.55)", fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" }}>Le Lieu · Rennes Centre</span>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 700, color: CR, lineHeight: 1.12, margin: 0 }}>
            Poussez la porte du<br />12 Rue de la Psalette.
          </p>
          <p style={{ color: "rgba(216,210,196,0.65)", fontSize: 15, lineHeight: 1.72, margin: 0 }}>
            Sur place ou à emporter. Au cœur du quartier historique de Rennes.
          </p>
          <button onClick={openModal}
            onMouseEnter={e => { e.currentTarget.style.background = CR; e.currentTarget.style.color = G; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = CR; }}
            style={{ marginTop: 4, background: "transparent", color: CR, border: "1.5px solid rgba(216,210,196,0.45)", borderRadius: 2, padding: "12px 28px", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s, color 0.2s" }}>
            Réserver une table
          </button>
        </div>
      </section>

      {/* ════════════ INFOS & ACCÈS ════════════ */}
      <section ref={infosRef} className="sp" style={{ padding: "80px 28px", background: CR2 }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <p style={{ color: B, fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>Rennes Centre-Ville</p>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: G, margin: "0 0 40px" }}>Infos & Accès</h2>
          <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

          <div className="info-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40, marginBottom: 56 }}>
            <div>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: G, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin size={17} color={B} /> Adresse
              </h3>
              <p style={{ color: MU, fontSize: 14, lineHeight: 1.78, margin: "0 0 16px" }}>
                12 Rue de la Psalette<br />35000 Rennes<br />Quartier Centre-Ville
              </p>
              <a href="https://maps.google.com/?q=12+rue+de+la+Psalette+Rennes" target="_blank" rel="noopener noreferrer"
                style={{ color: G, fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none", borderBottom: `1px solid ${G}`, paddingBottom: 2, display: "inline-flex", alignItems: "center", gap: 4 }}>
                Google Maps <ArrowRight size={11} />
              </a>
            </div>
            <div>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: G, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <Clock size={17} color={B} /> Horaires
              </h3>
              {HOURS.map(h => (
                <div key={h.service} style={{ padding: "8px 0", borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: ST }}>{h.service} — {h.days}</div>
                  <div style={{ color: MU, fontSize: 13, marginTop: 2 }}>{h.time}</div>
                </div>
              ))}
            </div>
            <div>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: G, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <Phone size={17} color={B} /> Contact
              </h3>
              <p style={{ color: MU, fontSize: 14, lineHeight: 1.78, margin: "0 0 20px" }}>
                <a href="tel:+33299000000" style={{ color: MU, textDecoration: "none" }}>02 99 00 00 00</a><br />
                <a href="mailto:bonjour@mamamok.fr" style={{ color: MU, textDecoration: "none" }}>bonjour@mamamok.fr</a>
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <a href="https://instagram.com/mamamok_rennes" target="_blank" rel="noopener noreferrer"
                  style={{ ...btnPrimary({ padding: "9px 16px", fontSize: 10, background: G }), textDecoration: "none" }}>
                  <Instagram size={12} /> Instagram
                </a>
                <a href="mailto:bonjour@mamamok.fr"
                  style={{ background: "transparent", color: G, border: `1.5px solid ${G}`, borderRadius: 2, padding: "9px 16px", fontWeight: 700, fontSize: 10, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, letterSpacing: "0.09em", textTransform: "uppercase", fontFamily: "inherit" }}>
                  <Mail size={12} /> Email
                </a>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 48, marginBottom: 48 }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 700, color: G, margin: "0 0 6px" }}>Questions fréquentes</h2>
            <p style={{ color: MU, fontSize: 13, margin: "0 0 24px" }}>Tout ce qu'il faut savoir avant de venir.</p>
            <div style={{ maxWidth: 660 }}>
              {FAQ.map(item => <FaqItem key={item.q} item={item} />)}
            </div>
          </div>

          {/* Carte simulée */}
          <div style={{ borderRadius: 2, overflow: "hidden", border: `1px solid ${BORDER}`, background: CR, position: "relative", height: 230, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}>
              <defs><pattern id="mg" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke={G} strokeWidth="0.5" /></pattern></defs>
              <rect width="100%" height="100%" fill="url(#mg)" />
              <line x1="0" y1="44%" x2="100%" y2="44%" stroke={G} strokeWidth="2" opacity="0.3" />
              <line x1="31%" y1="0" x2="31%" y2="100%" stroke={G} strokeWidth="1.5" opacity="0.22" />
              <line x1="64%" y1="0" x2="64%" y2="100%" stroke={G} strokeWidth="1" opacity="0.16" />
            </svg>
            <div style={{ position: "relative", textAlign: "center", background: CR2, border: `1px solid ${BORDER}`, padding: "16px 22px", borderRadius: 2 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: G, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                <MapPin size={17} color={CR2} fill={CR2} />
              </div>
              <p style={{ fontFamily: "Georgia, serif", fontWeight: 700, color: G, fontSize: 14, margin: "0 0 2px" }}>Mama Mok</p>
              <p style={{ color: MU, fontSize: 11, margin: "0 0 12px" }}>12 Rue de la Psalette · Rennes</p>
              <a href="https://maps.google.com/?q=12+rue+de+la+Psalette+Rennes" target="_blank" rel="noopener noreferrer"
                style={{ ...btnPrimary({ fontSize: 10, padding: "8px 18px", background: G }), textDecoration: "none" }}>
                Itinéraire Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* ════════════ FOOTER ════════════ */}
      <footer style={{ background: G, color: CR, padding: "40px 28px 28px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <img src={IMG.logoOfficial} alt="Logo Mama Mok — Restaurant Bistronomique Rennes" style={{ height: 40, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
            <span style={{ color: "rgba(216,210,196,0.4)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>Restaurant Bistronomique · Rennes</span>
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <a href="https://instagram.com/mamamok_rennes" target="_blank" rel="noopener noreferrer"
              style={{ color: "rgba(216,210,196,0.4)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em" }}>
              <Instagram size={15} /> Instagram
            </a>
            <a href="mailto:bonjour@mamamok.fr"
              style={{ color: "rgba(216,210,196,0.4)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em" }}>
              <Mail size={15} /> Email
            </a>
          </div>
          <span style={{ color: "rgba(216,210,196,0.22)", fontSize: 11 }}>© {new Date().getFullYear()} Mama Mok · Tous droits réservés</span>
          <a href="/admin" style={{ color: "rgba(216,210,196,0.12)", fontSize: 10, textDecoration: "none", letterSpacing: "0.05em" }}>·</a>
        </div>
      </footer>

      {/* ════════════ FAB ════════════ */}
      {fabVisible && (
        <button className="mm-fab-in" onClick={openModal} aria-label="Réserver une table au restaurant Mama Mok"
          onMouseEnter={e => { e.currentTarget.style.background = B2; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = B; e.currentTarget.style.transform = "translateY(0)"; }}
          style={{ position: "fixed", bottom: 24, right: 24, zIndex: 150, background: B, color: CR2, border: "none", borderRadius: 40, padding: "13px 22px", display: "flex", alignItems: "center", gap: 9, fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 4px 20px rgba(106,31,43,0.4)", fontFamily: "inherit", transition: "background 0.2s, transform 0.2s" }}>
          <CalendarHeart size={14} strokeWidth={2} />
          Réserver
        </button>
      )}
    </div>
  );
}