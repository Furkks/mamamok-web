import { useState, useEffect, useRef } from "react";
import { MapPin, Clock, Phone, ArrowRight, Menu, X, Camera, Share2, CalendarHeart, ChevronDown, Check } from "lucide-react";

// ── TOKENS ────────────────────────────────────────────────────────────────────
const G      = "#2D4030";
const B      = "#4A1224";
const CR     = "#FDFBF7";
const ST     = "#2B2623";
const MU     = "#7A7268";
const BORDER = "#E2DDD5";

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

// ── MENU DATA ─────────────────────────────────────────────────────────────────
const CATS = [
  { id: "signatures", label: "Sandwichs & Spécialités" },
  { id: "sides",      label: "Accompagnements" },
  { id: "desserts",   label: "Desserts" },
  { id: "drinks",     label: "Boissons" },
];
const MENU = {
  signatures: [
    { name: "Le Mok Classic",        desc: "Pain grillé maison · Poulet zaatar · Labneh · Tomates confites · Pickles citron", price: "10,50 €", tag: "Incontournable", img: IMG.food },
    { name: "Le Végé Doré",          desc: "Falafel croustillants · Houmous · Roquette · Concombre · Tahini citron vert",     price: "9,50 €",  tag: "Végétarien",    img: IMG.food },
    { name: "L'Agneau Confit",        desc: "Épaule confite 8h aux épices · Oignons caramélisés · Coriandre · Harissa maison", price: "12,00 €", tag: "Incontournable", img: IMG.food },
    { name: "Le Mama Bowl",           desc: "Riz pilaf · Légumes rôtis · Œuf mollet · Sauce chermoula · Sésame",               price: "11,00 €", tag: "Végétarien",    img: IMG.food },
    { name: "Le Mok Épicé",           desc: "Merguez maison · Poivrons confits · Chèvre frais · Sauce piquante rouge",          price: "11,50 €", tag: "Fait maison",   img: IMG.food },
    { name: "La Spécialité Saumon",   desc: "Gravlax aux herbes · Crème citronnée · Câpres · Oignons rouges · Seigle grillé",  price: "13,00 €", tag: "Incontournable", img: IMG.food },
  ],
  sides: [
    { name: "Frites Maison",          desc: "Pommes de terre fraîches · Huile de tournesol · Sel de mer",                       price: "3,50 €",  tag: "Fait maison" },
    { name: "Salade Fraîcheur",       desc: "Roquette · Menthe · Grenade · Sumac · Vinaigrette olive-citron",                   price: "4,00 €",  tag: "Végétarien"  },
    { name: "Houmous & Pita",         desc: "Houmous onctueux maison · Huile d'olive · Paprika fumé · Deux pitas chauds",       price: "4,50 €",  tag: "Fait maison" },
    { name: "Soupe du Jour",          desc: "Préparation quotidienne selon arrivage · Servie avec pain grillé",                  price: "5,00 €",  tag: "Fait maison" },
  ],
  desserts: [
    { name: "Baklava Maison",         desc: "Pâte filo · Noix et pistaches · Fleur d'oranger · Miel d'acacia",                 price: "3,50 €",  tag: "Incontournable" },
    { name: "Mousse Chocolat Tahini", desc: "Chocolat noir 70 % · Tahini pur · Fleur de sel · Noisettes torréfiées",           price: "4,50 €",  tag: "Fait maison"   },
    { name: "Fruits de Saison",       desc: "Sélection du marché · Miel de lavande · Menthe fraîche",                           price: "3,00 €",  tag: "Végétarien"    },
  ],
  drinks: [
    { name: "Limonade Maison",        desc: "Citrons frais · Menthe · Eau gazeuse · Sirop d'agave",                             price: "3,50 €",  tag: "Fait maison"    },
    { name: "Ayran Frais",            desc: "Yaourt brassé · Eau glacée · Sel — rafraîchissant et authentique",                 price: "2,80 €",  tag: null             },
    { name: "Thé à la Menthe",        desc: "Thé vert Gunpowder · Menthe fraîche · Servi chaud en verre traditionnel",          price: "2,50 €",  tag: "Incontournable" },
    { name: "Café Cardamome",         desc: "Café fort · Cardamome verte · Servi court et intense",                              price: "2,50 €",  tag: null             },
    { name: "Eau & Soft",             desc: "Eau plate ou gazeuse · Coca-Cola · Orangina · Perrier Citron",                     price: "2,00 €",  tag: null             },
  ],
};
const HOURS = [
  { days: "Lun – Ven", time: "11h30 – 14h30  ·  18h30 – 22h00" },
  { days: "Samedi",    time: "12h00 – 22h30" },
  { days: "Dimanche",  time: "12h00 – 21h00" },
];
const TEAM = [
  { name: "Manon", role: "Co-fondatrice & Accueil",  img: IMG.manon, quote: "L'ambiance, c'est ma signature." },
  { name: "Matt",  role: "Co-fondateur & Cuisine",   img: IMG.matt,  quote: "Je cuisine ce que j'ai envie de manger." },
  { name: "Moké",  role: "Co-fondateur & Créations", img: IMG.moke,  quote: "Chaque recette est une histoire de famille." },
];
const FAQ = [
  { q: "Peut-on réserver une table à l'avance ?",                     a: "Oui, via notre formulaire en ligne, par téléphone (02 99 00 00 00) ou par email. Pour les groupes de 6 personnes et plus, la réservation est vivement recommandée." },
  { q: "Proposez-vous des options végétariennes ?",                    a: "Absolument. Plusieurs plats sont végétariens — le Végé Doré, le Mama Bowl ou le Houmous & Pita. Ils sont identifiés sur la carte avec le badge 'Végétarien'." },
  { q: "Y a-t-il des plats sans gluten ?",                             a: "Certains plats peuvent être adaptés. Signalez-le à la commande ou appelez-nous avant votre visite." },
  { q: "Peut-on commander à emporter ?",                               a: "Oui, tous nos plats sont disponibles à emporter. Passez au comptoir ou appelez-nous pour préparer votre commande à l'avance." },
  { q: "Acceptez-vous les paiements par carte bancaire ?",             a: "Oui — Visa, Mastercard, American Express, espèces et virement mobile." },
  { q: "Le restaurant est-il accessible aux personnes à mobilité réduite ?", a: "Notre salle est de plain-pied et accessible. Contactez-nous à l'avance pour tout besoin spécifique." },
];

// ── RÉSERVATION : config ───────────────────────────────────────────────────────
const SLOTS = {
  midi: ["12h00", "12h30", "13h00"],
  soir: ["19h30", "20h00", "20h30"],
};
const MAX_PAX_PER_SLOT = 30; // personnes max par créneau

// ── HELPERS ───────────────────────────────────────────────────────────────────
function Tag({ label }) {
  if (!label) return null;
  const isBordeaux = label === "Incontournable";
  return (
    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 2, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: isBordeaux ? "rgba(74,18,36,0.08)" : "rgba(45,64,48,0.08)", color: isBordeaux ? B : G, border: `1px solid ${isBordeaux ? "rgba(74,18,36,0.2)" : "rgba(45,64,48,0.2)"}` }}>
      {label}
    </span>
  );
}

function MenuCard({ item, landscape }) {
  if (landscape) {
    return (
      <div style={{ paddingBottom: 20, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <h3 style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: G, margin: 0 }}>{item.name}</h3>
          <div style={{ flex: 1, borderBottom: `1px dotted ${BORDER}`, margin: "0 10px 3px" }} />
          <span style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 17, color: B, whiteSpace: "nowrap" }}>{item.price}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
          <p style={{ color: MU, fontSize: 13, lineHeight: 1.5, margin: 0, flex: 1 }}>{item.desc}</p>
          {item.tag && <Tag label={item.tag} />}
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", borderBottom: `1px solid ${BORDER}`, paddingBottom: 24 }}>
      <div style={{ height: 220, borderRadius: 4, overflow: "hidden", marginBottom: 16 }}>
        <img src={item.img} alt={`Plat ${item.name} - Restaurant Bistronomique Mama Mok Rennes`} className="mm-photo" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flexGrow: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h3 style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: G, margin: 0 }}>{item.name}</h3>
          <span style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 18, color: B }}>{item.price}</span>
        </div>
        <p style={{ color: MU, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
        <div style={{ marginTop: "auto", paddingTop: 8 }}>{item.tag && <Tag label={item.tag} />}</div>
      </div>
    </div>
  );
}

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${BORDER}` }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "18px 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, textAlign: "left" }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: G, lineHeight: 1.3 }}>{item.q}</span>
        <span style={{ flexShrink: 0, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${open ? B : BORDER}`, borderRadius: "50%", color: open ? B : MU, fontSize: 16, fontWeight: 300, transition: "color 0.2s, border-color 0.2s" }}>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && <p className="mm-faq-answer" style={{ margin: "0 0 18px", color: MU, fontSize: 14, lineHeight: 1.75, paddingRight: 40 }}>{item.a}</p>}
    </div>
  );
}

// ── MODAL RÉSERVATION ─────────────────────────────────────────────────────────
function ReservationModal({ onClose, reservations, onConfirm }) {
  const EMPTY = { nom: "", tel: "", date: "", service: "", slot: "", pax: "2" };
  const [form, setForm]         = useState(EMPTY);
  const [confirmed, setConfirmed] = useState(null);
  const [errors, setErrors]     = useState({});

  // Calcule les pax déjà réservés pour un créneau donné
  const paxForSlot = (date, slot) => {
    const key = `${date}__${slot}`;
    return reservations[key] || 0;
  };

  const remaining = form.date && form.slot
    ? MAX_PAX_PER_SLOT - paxForSlot(form.date, form.slot)
    : null;
  const isFull = remaining !== null && remaining <= 0;

  const validate = () => {
    const e = {};
    if (!form.nom.trim())  e.nom  = "Nom requis";
    if (!form.tel.trim())  e.tel  = "Téléphone requis";
    if (!form.date)        e.date = "Date requise";
    if (!form.slot)        e.slot = "Créneau requis";
    if (isFull)            e.slot = "Créneau complet";
    const paxN = parseInt(form.pax);
    if (remaining !== null && paxN > remaining) e.pax = `Plus que ${remaining} place${remaining > 1 ? "s" : ""} disponible${remaining > 1 ? "s" : ""}`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const WA_NUMBER = "33600000000"; // ← remplace par le vrai numéro sans + ni espaces

  const handleSubmit = () => {
    if (!validate()) return;

    // 1. Enregistre dans le state de capacité
    onConfirm(form.date, form.slot, parseInt(form.pax));

    // 2. Construit le message WhatsApp
    const msg = [
      "Bonjour Mama Mok ! 🍽️",
      "Je souhaite réserver une table :",
      `- Nom : ${form.nom}`,
      `- Personnes : ${form.pax}`,
      `- Date : ${form.date}`,
      `- Créneau : ${form.slot}`,
      `- Téléphone : ${form.tel}`,
    ].join("\n");

    // 3. Ouvre WhatsApp dans un nouvel onglet
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");

    // 4. Passe à l'écran de confirmation
    setConfirmed(form);
    setForm(EMPTY);
  };

  // Ferme en cliquant l'overlay
  const handleOverlay = (e) => { if (e.target === e.currentTarget) onClose(); };

  const inputStyle = (hasErr) => ({
    width: "100%", boxSizing: "border-box",
    border: `1px solid ${hasErr ? B : BORDER}`, borderRadius: 2,
    padding: "11px 14px", fontSize: 14, color: ST, background: CR,
    fontFamily: "system-ui, sans-serif", outline: "none",
    transition: "border-color 0.2s",
  });

  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MU, marginBottom: 6 };

  const currentSlots = form.service === "midi" ? SLOTS.midi : form.service === "soir" ? SLOTS.soir : [];

  return (
    <div onClick={handleOverlay} style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(43,38,35,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 16px" }}>
      <div style={{ background: CR, width: "100%", maxWidth: 520, borderRadius: 4, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>

        {/* Header modal */}
        <div style={{ padding: "28px 28px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: B }}>Mama Mok · Rennes</p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 700, color: G, margin: 0 }}>Réserver une table</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MU, padding: 4, flexShrink: 0 }} aria-label="Fermer">
            <X size={22} />
          </button>
        </div>

        {/* Corps */}
        {confirmed ? (
          /* ── ÉCRAN DE CONFIRMATION ── */
          <div style={{ padding: "40px 28px 36px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: G, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={26} color={CR} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color: G, margin: "0 0 10px" }}>Réservation confirmée !</h3>
              <p style={{ color: MU, fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                Table pour <strong style={{ color: ST }}>{confirmed.pax} personne{confirmed.pax > 1 ? "s" : ""}</strong><br />
                le <strong style={{ color: ST }}>{confirmed.date}</strong> à <strong style={{ color: ST }}>{confirmed.slot}</strong>
              </p>
              <p style={{ color: MU, fontSize: 13, marginTop: 8 }}>Un SMS de confirmation sera envoyé au <strong>{confirmed.tel}</strong>.</p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
              <button onClick={() => setConfirmed(null)} style={{ background: "transparent", color: G, border: `1px solid ${G}`, borderRadius: 2, padding: "11px 22px", fontWeight: 600, fontSize: 13, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Nouvelle réservation
              </button>
              <button onClick={onClose} style={{ background: G, color: CR, border: "none", borderRadius: 2, padding: "11px 22px", fontWeight: 600, fontSize: 13, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Fermer
              </button>
            </div>
          </div>
        ) : (
          /* ── FORMULAIRE ── */
          <div style={{ padding: "24px 28px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Nom */}
            <div>
              <label style={labelStyle}>Nom complet</label>
              <input value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })}
                placeholder="Marie Dupont" style={inputStyle(errors.nom)} />
              {errors.nom && <p style={{ color: B, fontSize: 12, margin: "4px 0 0" }}>{errors.nom}</p>}
            </div>

            {/* Téléphone */}
            <div>
              <label style={labelStyle}>Téléphone</label>
              <input value={form.tel} onChange={e => setForm({ ...form, tel: e.target.value })}
                placeholder="06 00 00 00 00" style={inputStyle(errors.tel)} type="tel" />
              {errors.tel && <p style={{ color: B, fontSize: 12, margin: "4px 0 0" }}>{errors.tel}</p>}
            </div>

            {/* Date + Couverts sur la même ligne */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Date</label>
                <input value={form.date} onChange={e => setForm({ ...form, date: e.target.value, slot: "" })}
                  type="date" min={new Date().toISOString().split("T")[0]}
                  style={inputStyle(errors.date)} />
                {errors.date && <p style={{ color: B, fontSize: 12, margin: "4px 0 0" }}>{errors.date}</p>}
              </div>
              <div>
                <label style={labelStyle}>Personnes</label>
                <select value={form.pax} onChange={e => setForm({ ...form, pax: e.target.value })}
                  style={{ ...inputStyle(errors.pax), appearance: "none", cursor: "pointer" }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n === 1 ? "personne" : "personnes"}</option>)}
                </select>
                {errors.pax && <p style={{ color: B, fontSize: 12, margin: "4px 0 0" }}>{errors.pax}</p>}
              </div>
            </div>

            {/* Service */}
            <div>
              <label style={labelStyle}>Service</label>
              <div style={{ display: "flex", gap: 10 }}>
                {["midi", "soir"].map(s => (
                  <button key={s} onClick={() => setForm({ ...form, service: s, slot: "" })}
                    style={{ flex: 1, border: `1.5px solid ${form.service === s ? G : BORDER}`, borderRadius: 2, padding: "10px 0", background: form.service === s ? G : "transparent", color: form.service === s ? CR : MU, fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}>
                    {s === "midi" ? "Midi" : "Soir"}
                  </button>
                ))}
              </div>
            </div>

            {/* Créneaux */}
            {currentSlots.length > 0 && form.date && (
              <div>
                <label style={labelStyle}>Créneau horaire</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {currentSlots.map(slot => {
                    const used = paxForSlot(form.date, slot);
                    const left = MAX_PAX_PER_SLOT - used;
                    const full = left <= 0;
                    const selected = form.slot === slot;
                    const almostFull = left > 0 && left <= 6;
                    return (
                      <button key={slot} disabled={full}
                        onClick={() => setForm({ ...form, slot })}
                        style={{
                          flex: "1 0 30%", border: `1.5px solid ${full ? BORDER : selected ? G : BORDER}`,
                          borderRadius: 2, padding: "10px 8px", cursor: full ? "not-allowed" : "pointer",
                          background: full ? "#F0EBE3" : selected ? G : "transparent",
                          color: full ? MU : selected ? CR : ST,
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                          transition: "all 0.2s", opacity: full ? 0.6 : 1,
                        }}>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{slot}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: full ? MU : selected ? "rgba(253,251,247,0.7)" : almostFull ? B : MU }}>
                          {full ? "Complet" : almostFull ? `Plus que ${left} place${left > 1 ? "s" : ""}` : `${left} places`}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.slot && <p style={{ color: B, fontSize: 12, margin: "8px 0 0" }}>{errors.slot}</p>}
              </div>
            )}

            {/* Indicateur global si créneau sélectionné */}
            {remaining !== null && !isFull && (
              <div style={{ background: remaining <= 6 ? "rgba(74,18,36,0.06)" : "rgba(45,64,48,0.06)", border: `1px solid ${remaining <= 6 ? "rgba(74,18,36,0.15)" : "rgba(45,64,48,0.15)"}`, borderRadius: 2, padding: "10px 14px", fontSize: 13, color: remaining <= 6 ? B : G, fontWeight: 600 }}>
                {remaining <= 6
                  ? `⚠️ Plus que ${remaining} place${remaining > 1 ? "s" : ""} disponible${remaining > 1 ? "s" : ""} sur ce créneau.`
                  : `✓ ${remaining} places disponibles sur ce créneau.`}
              </div>
            )}

            {/* Submit */}
            <button onClick={handleSubmit}
              style={{ background: G, color: CR, border: "none", borderRadius: 2, padding: "14px 28px", fontWeight: 700, fontSize: 13, cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase", width: "100%", marginTop: 4 }}>
              Confirmer la réservation
            </button>

            <p style={{ color: MU, fontSize: 12, textAlign: "center", margin: 0 }}>
              En cas de besoin, contactez-nous au <a href="tel:+33299000000" style={{ color: G, fontWeight: 600 }}>02 99 00 00 00</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [cat, setCat]               = useState("signatures");
  const [mob, setMob]               = useState(false);
  const [scrolled, setSc]           = useState(false);
  const [bannerOpen, setBanner]     = useState(true);
  const [fabVisible, setFab]        = useState(false);
  const [modalOpen, setModalOpen]   = useState(false);
  // reservations : { "YYYY-MM-DD__HH:MM": totalPax }
  const [reservations, setReservations] = useState({});

  const heroRef    = useRef(null);
  const menuRef    = useRef(null);
  const conceptRef = useRef(null);
  const infosRef   = useRef(null);

  const BANNER_H = 44;
  const NAV_H    = 72;

  useEffect(() => {
    const fn = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 0;
      setSc(window.scrollY > 48);
      setFab(heroBottom < 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Bloque le scroll du body quand la modal est ouverte
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  const go = (ref) => {
    setMob(false);
    setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const openModal = () => { setMob(false); setModalOpen(true); };

  const handleConfirm = (date, slot, pax) => {
    const key = `${date}__${slot}`;
    setReservations(prev => ({ ...prev, [key]: (prev[key] || 0) + pax }));
  };

  const NAV = [
    { label: "Accueil",       ref: heroRef },
    { label: "Notre Carte",   ref: menuRef },
    { label: "L'Équipe",      ref: conceptRef },
    { label: "Infos & Accès", ref: infosRef },
  ];

  const primaryBtn = (extra = {}) => ({
    background: G, color: CR, border: "none", borderRadius: 2,
    padding: "12px 28px", fontWeight: 600, fontSize: 13, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 8,
    letterSpacing: "0.06em", textTransform: "uppercase",
    transition: "background 0.2s", ...extra,
  });

  const topOffset = bannerOpen ? BANNER_H + NAV_H : NAV_H;

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: CR, color: ST, minHeight: "100vh" }}>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none} }
        @keyframes fabIn  { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none} }
        .mm-fadein{animation:fadeUp .55s ease both}
        .mm-fab-in{animation:fabIn .3s ease both}
        img.mm-photo{object-fit:cover;display:block;width:100%;height:100%;transition:transform .4s ease}
        img.mm-photo:hover{transform:scale(1.03)}
        input:focus,select:focus{outline:none;border-color:${G} !important}
        @media(max-width:800px){
          .mm-banner-text{font-size:11px !important}
          .mm-banner-bold{display:block;margin-bottom:2px}
          #desk-nav{display:none !important}
          #mob-btn{display:flex !important}
          .mm-nav-tagline{display:none !important}
          .mm-navbar{height:58px !important}
          .mm-logo-img{height:28px !important}
          .hero-split{flex-direction:column !important}
          .hero-photo{height:56vw !important;min-height:220px;width:100% !important}
          .hero-copy{padding:36px 20px 32px !important}
          .mm-hero-badge{bottom:12px !important;right:12px !important;padding:8px 12px !important}
          .mm-menu-tabs{gap:16px !important;justify-content:flex-start !important;overflow-x:auto !important;flex-wrap:nowrap !important;padding-bottom:8px !important;-webkit-overflow-scrolling:touch;scrollbar-width:none}
          .mm-menu-tabs::-webkit-scrollbar{display:none}
          .mm-menu-tab{font-size:12px !important;white-space:nowrap;padding:0 8px 8px !important}
          .menu-grid{grid-template-columns:1fr !important;gap:28px !important}
          .mm-team-intro{grid-template-columns:1fr !important;gap:32px !important}
          .mm-blockquote{border-left:none !important;padding-left:0 !important;border-top:1px solid rgba(253,251,247,0.2);padding-top:28px !important}
          .team-grid{grid-template-columns:1fr !important;gap:36px !important}
          .mm-portrait{height:260px !important}
          .info-grid{grid-template-columns:1fr !important;gap:36px !important}
          .mm-faq-answer{padding-right:0 !important}
          .mm-devanture-section{min-height:380px !important}
          .mm-devanture-content{padding:0 20px 36px !important;gap:14px !important}
          .mm-devanture-content h2{font-size:24px !important}
          .mm-fab{bottom:16px !important;right:16px !important;padding:12px 18px !important;font-size:12px !important;gap:8px !important}
          .section-pad{padding:56px 20px !important}
          .mm-res-grid{grid-template-columns:1fr !important}
        }
        @media(min-width:801px){
          #mob-btn{display:none !important}
          #desk-nav{display:flex !important}
        }
      `}</style>

      {/* ── MODAL ── */}
      {modalOpen && (
        <ReservationModal
          onClose={() => setModalOpen(false)}
          reservations={reservations}
          onConfirm={handleConfirm}
        />
      )}

      {/* ── BANDEAU ── */}
      {bannerOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 300, height: BANNER_H, background: B, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 48px" }}>
          <p style={{ margin: 0, color: CR, fontSize: 13, fontWeight: 500, textAlign: "center", lineHeight: 1.5 }} className="mm-banner-text">
            <span style={{ fontWeight: 700, marginRight: 6 }} className="mm-banner-bold">🎉 Ouverture officielle le [Date] !</span>
            Pensez à réserver votre table dès maintenant.
          </p>
          <button onClick={() => setBanner(false)} aria-label="Fermer l'annonce"
            style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(253,251,247,0.6)", padding: 6, display: "flex", alignItems: "center" }}
            onMouseEnter={e => e.currentTarget.style.color = CR}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(253,251,247,0.6)"}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── NAVBAR ── */}
      <header style={{ position: "fixed", top: bannerOpen ? BANNER_H : 0, left: 0, right: 0, zIndex: 200, background: scrolled ? "rgba(253,251,247,0.96)" : CR, backdropFilter: scrolled ? "blur(8px)" : "none", borderBottom: `1px solid ${BORDER}`, transition: "top 0.25s ease, background 0.3s" }}>
        <nav className="mm-navbar" style={{ maxWidth: 1160, margin: "0 auto", padding: "0 16px", width: "100%", height: NAV_H, display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" }}>
          <button onClick={() => go(heroRef)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0 }}>
            <img src={IMG.logoOfficial} alt="Logo Mama Mok - Restaurant Bistronomique Rennes" className="mm-logo-img" style={{ height: 36, width: "auto", objectFit: "contain", display: "block" }} />
            <span className="mm-nav-tagline" style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: MU, marginTop: 6 }}>Restaurant Bistronomique · Rennes</span>
          </button>
          <div id="desk-nav" style={{ display: "flex", alignItems: "center", gap: 36 }}>
            {NAV.map(({ label, ref }) => (
              <button key={label} onClick={() => go(ref)} style={{ background: "none", border: "none", cursor: "pointer", color: ST, fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", padding: "4px 0" }}>
                {label}
              </button>
            ))}
            <button onClick={openModal} style={primaryBtn()}>Réserver</button>
          </div>
          <button id="mob-btn" onClick={() => setMob(!mob)} style={{ background: "none", border: "none", cursor: "pointer", color: G, display: "none", flexShrink: 0 }}>
            {mob ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>
        {mob && (
          <div style={{ background: CR, borderTop: `1px solid ${BORDER}`, padding: "16px 20px 28px", display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV.map(({ label, ref }) => (
              <button key={label} onClick={() => go(ref)} style={{ background: "none", border: "none", cursor: "pointer", color: ST, fontSize: 16, fontWeight: 600, textTransform: "uppercase", textAlign: "left", padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
                {label}
              </button>
            ))}
            <button onClick={openModal} style={{ ...primaryBtn(), marginTop: 14, justifyContent: "center" }}>Réserver une table</button>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <main>
      <section ref={heroRef} style={{ paddingTop: topOffset }}>
        <div className="hero-split" style={{ display: "flex", minHeight: `calc(100vh - ${topOffset}px)` }}>
          <div className="hero-copy" style={{ flex: "0 0 50%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "72px 56px 72px 48px", borderRight: `1px solid ${BORDER}` }}>
            <div className="mm-fadein" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <span style={{ color: B, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700 }}>Restaurant Bistronomique · Rennes</span>
              <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(42px, 5vw, 68px)", fontWeight: 700, color: G, lineHeight: 1.05, margin: 0, letterSpacing: "-0.02em" }}>
                Le goût,<br /><span style={{ color: B, fontStyle: "italic", fontWeight: 400 }}>dans sa</span><br />globalité.
              </h1>
              <p style={{ color: MU, fontSize: 16, lineHeight: 1.7, maxWidth: 420, margin: 0 }}>
                Saveurs méditerranéennes et du Moyen-Orient cuisinées avec passion. Des produits frais sourcés chaque matin, rien de préfabriqué — jamais.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, paddingTop: 8 }}>
                <button onClick={() => go(menuRef)} style={primaryBtn()}>Découvrir La Carte <ArrowRight size={15} /></button>
                <button onClick={openModal} style={{ background: "transparent", color: G, border: `1px solid ${G}`, borderRadius: 2, padding: "12px 24px", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer" }}>
                  Réserver une table
                </button>
              </div>
            </div>
          </div>
          <div className="hero-photo" style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <img src={IMG.hero} alt="Salle et table dressée du restaurant Mama Mok, 12 rue de la Psalette, Rennes" className="mm-photo" style={{ objectPosition: "center 30%" }} />
            <div className="mm-hero-badge" style={{ position: "absolute", bottom: 28, right: 28, background: CR, border: `1px solid ${BORDER}`, padding: "10px 18px", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>✨</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: G, letterSpacing: "0.06em", textTransform: "uppercase" }}>Ouverture Prochaine</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MENU ── */}
      <section ref={menuRef} className="section-pad" style={{ padding: "96px 28px", maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ color: B, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 12 }}>Cuisine & Saison</span>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 700, color: G, margin: 0 }}>Notre Carte</h2>
        </div>
        <div className="mm-menu-tabs" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 32, marginBottom: 48 }}>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)} className="mm-menu-tab"
              style={{ background: "none", border: "none", borderBottom: "none", padding: "0 0 8px", fontSize: 14, fontWeight: cat === c.id ? 700 : 400, letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer", color: cat === c.id ? G : "rgba(45,64,48,0.4)", transition: "color 0.2s" }}>
              {c.label}
            </button>
          ))}
        </div>
        {cat === "signatures" ? (
          <div className="menu-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36 }}>
            {MENU[cat].map(item => <MenuCard key={item.name} item={item} landscape={false} />)}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 800, margin: "0 auto" }}>
            {MENU[cat].map(item => <MenuCard key={item.name} item={item} landscape={true} />)}
          </div>
        )}
      </section>

      {/* ── ÉQUIPE ── */}
      <section ref={conceptRef} style={{ background: G, color: CR }}>
        <div className="section-pad" style={{ padding: "96px 28px", maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", marginBottom: 80 }} className="mm-team-intro info-grid">
            <div>
              <span style={{ color: "rgba(253,251,247,0.5)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 16 }}>L'Esprit Mama Mok</span>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: CR, lineHeight: 1.1, margin: "0 0 24px" }}>
                Une cuisine de cœur,<br /><em style={{ fontStyle: "italic", fontWeight: 400 }}>sans chichis.</em>
              </h2>
              <p style={{ color: "rgba(253,251,247,0.75)", fontSize: 16, lineHeight: 1.8, margin: 0 }}>
                Mama Mok est née en 2018 d'un désir simple : partager les recettes familiales méditerranéennes avec les Rennais. Manon, Matt et Moké cuisinent chaque jour avec le même engagement — la qualité absolue des produits frais.
              </p>
            </div>
            <div className="mm-blockquote" style={{ borderLeft: `1px solid rgba(253,251,247,0.2)`, paddingLeft: 40 }}>
              <blockquote style={{ margin: 0 }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 24, fontStyle: "italic", color: CR, lineHeight: 1.5, margin: "0 0 16px" }}>
                  "Je cuisine exactement ce que j'ai envie de partager avec mes proches."
                </p>
                <cite style={{ color: "rgba(253,251,247,0.5)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", fontStyle: "normal" }}>— L'Équipe Mama Mok</cite>
              </blockquote>
            </div>
          </div>
          <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36 }}>
            {TEAM.map((p) => (
              <div key={p.name} style={{ display: "flex", flexDirection: "column" }}>
                <div className="mm-portrait" style={{ height: 380, borderRadius: 2, overflow: "hidden", marginBottom: 20 }}>
                  <img src={p.img} alt={`${p.name} - ${p.role} du restaurant bistronomique Mama Mok à Rennes`} className="mm-photo" />
                </div>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color: CR, margin: "0 0 4px" }}>{p.name}</h3>
                <p style={{ color: "rgba(253,251,247,0.5)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 12px" }}>{p.role}</p>
                <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: "rgba(253,251,247,0.75)", fontSize: 14, margin: 0 }}>"{p.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INFOS & ACCÈS ── */}
      <section ref={infosRef} className="section-pad" style={{ padding: "96px 28px", maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span style={{ color: B, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 12 }}>Rennes Centre-Ville</span>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 700, color: G, margin: 0 }}>Infos & Accès</h2>
        </div>
        <div className="info-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 48, borderTop: `1px solid ${BORDER}`, paddingTop: 48, marginBottom: 48 }}>
          <div>
            <h3 style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: G, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 10 }}><MapPin size={20} color={B} /> Adresse</h3>
            <p style={{ color: MU, fontSize: 15, lineHeight: 1.75, margin: "0 0 20px" }}>12 Rue de la Psalette<br />35000 Rennes<br />Quartier Centre-Ville</p>
            <a href="https://maps.google.com/?q=Rennes+France" target="_blank" rel="noopener noreferrer" style={{ color: G, fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", textDecoration: "none", borderBottom: `1px solid ${G}`, paddingBottom: 2, display: "inline-flex", alignItems: "center", gap: 4 }}>
              Google Maps <ArrowRight size={12} />
            </a>
          </div>
          <div>
            <h3 style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: G, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 10 }}><Clock size={20} color={B} /> Horaires</h3>
            {HOURS.map((h) => (
              <div key={h.days} style={{ padding: "8px 0", borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ color: ST, fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h.days}</div>
                <div style={{ color: MU, fontSize: 13, marginTop: 2 }}>{h.time}</div>
              </div>
            ))}
          </div>
          <div>
            <h3 style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: G, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 10 }}><Phone size={20} color={B} /> Contact</h3>
            <p style={{ color: MU, fontSize: 15, lineHeight: 1.75, margin: "0 0 24px" }}>02 99 00 00 00<br />bonjour@mamamok.fr</p>
            <div style={{ display: "flex", gap: 12 }}>
              <a href="#" style={{ color: G, border: `1px solid ${BORDER}`, padding: "10px 16px", borderRadius: 2, textDecoration: "none", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Camera size={14} /> Instagram
              </a>
              <a href="#" style={{ color: G, border: `1px solid ${BORDER}`, padding: "10px 16px", borderRadius: 2, textDecoration: "none", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Share2 size={14} /> Facebook
              </a>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 56, marginBottom: 56 }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, color: G, margin: "0 0 6px" }}>Questions fréquentes</h2>
            <p style={{ color: MU, fontSize: 13, margin: 0 }}>Tout ce qu'il faut savoir avant de venir.</p>
          </div>
          <div style={{ maxWidth: 720 }}>
            {FAQ.map(item => <FaqItem key={item.q} item={item} />)}
          </div>
        </div>

        {/* Carte simulée */}
        <div style={{ borderRadius: 4, overflow: "hidden", border: `1px solid ${BORDER}`, background: "#EDE8E0", position: "relative", height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.22 }}>
            <defs><pattern id="mg" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke={G} strokeWidth="0.5" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#mg)" />
            <line x1="0" y1="44%" x2="100%" y2="44%" stroke={G} strokeWidth="2.5" opacity="0.3" />
            <line x1="0" y1="72%" x2="100%" y2="72%" stroke={G} strokeWidth="1.2" opacity="0.2" />
            <line x1="31%" y1="0" x2="31%" y2="100%" stroke={G} strokeWidth="2" opacity="0.25" />
            <line x1="64%" y1="0" x2="64%" y2="100%" stroke={G} strokeWidth="1.2" opacity="0.18" />
          </svg>
          <div style={{ position: "relative", textAlign: "center", background: CR, border: `1px solid ${BORDER}`, padding: "20px 28px", borderRadius: 4, boxShadow: "0 4px 20px rgba(45,64,48,0.08)" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: G, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
              <MapPin size={20} color={CR} fill={CR} />
            </div>
            <p style={{ fontFamily: "Georgia, serif", fontWeight: 700, color: G, fontSize: 16, margin: "0 0 2px" }}>Mama Mok</p>
            <p style={{ color: MU, fontSize: 12, margin: "0 0 12px" }}>12 Rue de la Psalette · Rennes Centre</p>
            <a href="https://maps.google.com/?q=Rennes+France" target="_blank" rel="noopener noreferrer" style={{ ...primaryBtn({ fontSize: 11, padding: "8px 18px" }), textDecoration: "none" }}>
              Itinéraire Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* ── DEVANTURE IMMERSIVE ── */}
      <section className="mm-devanture-section" style={{ width: "100%", minHeight: 560, position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden", backgroundImage: `url(${IMG.devanture})`, backgroundSize: "cover", backgroundPosition: "center 10%", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(30,48,34,0.62)" }} />
        <div className="mm-devanture-content" style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px 56px", maxWidth: 680, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <span style={{ color: "rgba(253,251,247,0.65)", fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" }}>Le Lieu · Rennes Centre</span>
          <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 700, color: CR, lineHeight: 1.12, margin: 0, letterSpacing: "-0.01em" }}>
            Poussez la porte du<br />12 Rue de la Psalette.
          </p>
          <p style={{ color: "rgba(253,251,247,0.72)", fontSize: 16, lineHeight: 1.7, margin: 0 }}>
            Sur place ou à emporter, nous vous accueillons au cœur du quartier historique.
          </p>
          <button onClick={openModal}
            onMouseEnter={e => { e.currentTarget.style.background = CR; e.currentTarget.style.color = G; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = CR; }}
            style={{ marginTop: 8, background: "transparent", color: CR, border: "1.5px solid rgba(253,251,247,0.6)", borderRadius: 2, padding: "13px 30px", fontWeight: 600, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s, color 0.2s" }}>
            Réserver une table
          </button>
        </div>
      </section>

      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background: G, color: CR, padding: "48px 28px 32px", borderTop: "1px solid rgba(253,251,247,0.1)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <img src={IMG.logoOfficial} alt="Logo Mama Mok - Restaurant Bistronomique Rennes" style={{ height: 48, width: "auto", objectFit: "contain", display: "block", filter: "brightness(0) invert(1)" }} />
            <span style={{ color: "rgba(253,251,247,0.5)", fontSize: 12 }}>Restaurant Bistronomique · Rennes</span>
          </div>
          <div style={{ color: "rgba(253,251,247,0.3)", fontSize: 12 }}>© {new Date().getFullYear()} Mama Mok · Tous droits réservés</div>
        </div>
      </footer>

      {/* ── FAB ── */}
      {fabVisible && (
        <button className="mm-fab mm-fab-in" onClick={openModal} aria-label="Réserver une table au restaurant Mama Mok"
          onMouseEnter={e => { e.currentTarget.style.background = "#3a1830"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = B; e.currentTarget.style.transform = "translateY(0)"; }}
          style={{ position: "fixed", bottom: 28, right: 28, zIndex: 150, background: B, color: CR, border: "none", borderRadius: 40, padding: "14px 24px", display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 4px 20px rgba(74,18,36,0.35)", transition: "background 0.2s, transform 0.2s" }}>
          <CalendarHeart size={16} strokeWidth={2} />
          Réserver une table
        </button>
      )}
    </div>
  );
}