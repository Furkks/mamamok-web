import { useState, useEffect, useRef } from "react";
import { MapPin, Clock, Phone, ArrowRight, Menu, X, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xscdqxfvrmjlxeilrxnb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzY2RxeGZ2cm1qbHhlaWxyeG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMDQ5NDksImV4cCI6MjEwMzU4MDk0OX0.YHwFtZAJEK7MjOxYJTPrItQmV9IQfWQNS443V-uQ1F4"
);

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

// ── TOKENS CHARTE OFFICIELLE V2 ───────────────────────────────────────────────
const G      = "#181e14";  // Vert de Rangoon
const G2     = "#2e3d22";  // Vert Tropical
const B      = "#811332";  // Lie de Vin
const B2     = "#9b163a";  // Bordeaux
const CR     = "#f0ead8";  // Crème
const CR2    = "#f5f0e4";  // Crème légère
const MU     = "#6b6a5e";  // Muted
const BORDER = "#d4cfc0";  // Bordure

// ── THÈME DYNAMIQUE — seul endroit où midi/soir divergent ─────────────────────
const buildTheme = (isNight) => ({
  // Page & Navbar
  bg:           isNight ? G      : CR2,
  bgNav:        isNight ? `rgba(24,30,20,0.97)` : `rgba(245,240,228,0.97)`,
  bgNavBase:    isNight ? G      : CR2,
  borderNav:    isNight ? `rgba(240,234,216,0.1)` : BORDER,
  // Textes
  text:         isNight ? CR     : G,
  textMuted:    isNight ? `rgba(240,234,216,0.6)` : MU,
  textMutedHov: isNight ? CR     : G,
  // Prix & accents
  price:        isNight ? "#c8a882" : B,
  accent:       isNight ? "#c8a882" : B,
  // Boutons primaires
  btnBg:        isNight ? B      : G,
  btnText:      CR,
  // Bordures & séparateurs
  border:       isNight ? `rgba(240,234,216,0.12)` : BORDER,
  divider:      isNight ? `rgba(240,234,216,0.12)` : `rgba(24,30,20,0.1)`,
  // Badges
  noteBg:       isNight ? `rgba(200,168,130,0.12)` : `rgba(24,30,20,0.07)`,
  noteBd:       isNight ? `rgba(200,168,130,0.25)` : `rgba(24,30,20,0.18)`,
  noteText:     isNight ? "#c8a882" : G,
  // Callout
  calloutBg:    isNight ? `rgba(240,234,216,0.05)` : `rgba(24,30,20,0.04)`,
  calloutBd:    isNight ? `rgba(240,234,216,0.1)` : `rgba(24,30,20,0.12)`,
  // Toggle
  toggleAct:    isNight ? "#0d1109" : G,
  // Logo
  logoFilter:   isNight ? "brightness(0) invert(1)" : "none",
});

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
  { img: "/plat-elexir.png", label: "L'Élixir en action" },
  { img: "/salle.png",       label: "L'ambiance" },
  { img: "/cok.png",         label: "L'ambiance" },
  { img: IMG.drinks,         label: "Carte des vins" },
  { img: "/cuisineM.png",    label: "L'Élixir en action" },
];

const MENU_IMG_URL_DEFAULT = { midi: null, soir: null };

const HOURS = [
  { service: "Déjeuner", days: "Mar – Sam", time: "12h00 – 14h00" },
  { service: "Dîner",    days: "Mar – Sam", time: "19h30 – 22h30" },
  { service: "Fermé",    days: "Dim – Lun", time: "—" },
];
const TEAM = [
  { name: "Manon", role: "Co-fondatrice",         img: IMG.manon, quote: "L'ambiance, c'est ma signature." },
  { name: "Matt",  role: "Co-fondateur & Cuisine",img: IMG.matt,  quote: "Chaque assiette est une décision." },
  { name: "Moké",  role: "Co-fondateur & Créations", img: IMG.moke, quote: "L'élixir, c'est le geste qui révèle." },
];
const FAQ = [
  { q: "Comment réserver ?",                          a: "Via le bouton Réserver (Zenchef), par téléphone ou par Instagram. Groupes de 6+ : contactez-nous directement." },
  { q: "Y a-t-il des options végétariennes ?",        a: "Oui, plusieurs plats à chaque service, identifiés sur la carte." },
  { q: "Proposez-vous des adaptations sans gluten ?", a: "Certains plats peuvent être ajustés — signalez-le à la réservation ou à l'arrivée." },
  { q: "Peut-on commander à emporter ?",              a: "Le soir uniquement, sur appel préalable." },
  { q: "Quels modes de paiement acceptez-vous ?",     a: "CB, Visa, Mastercard, American Express et espèces." },
  { q: "Le restaurant est-il accessible PMR ?",       a: "Oui, salle de plain-pied. Contactez-nous pour tout besoin spécifique." },
];


// ── SOUS-COMPOSANTS ───────────────────────────────────────────────────────────

function DroppingElixir({ size = 80, color = CR }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 60 78" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <style>{`
        @keyframes dropFall { 0%{transform:translateY(-8px);opacity:0} 15%{opacity:1} 80%{transform:translateY(0);opacity:1} 100%{transform:translateY(0);opacity:0} }
        @keyframes dropletFall { 0%{transform:translateY(-4px) scaleY(1.2);opacity:0} 10%{opacity:1} 60%{transform:translateY(12px) scaleY(0.9);opacity:1} 100%{transform:translateY(24px) scaleY(0.7);opacity:0} }
        @keyframes ripple { 0%{r:2;opacity:0.6} 100%{r:10;opacity:0} }
        .drop-body{animation:dropFall 2.8s ease-in-out infinite}
        .drop-let{animation:dropletFall 2.8s ease-in-out infinite;animation-delay:0.6s}
        .ripple{animation:ripple 2.8s ease-out infinite;animation-delay:1.4s}
      `}</style>
      <g className="drop-body" style={{ transformOrigin: "30px 36px" }}>
        <path d="M30 6 C30 6 14 22 14 36 C14 45.4 21.2 53 30 53 C38.8 53 46 45.4 46 36 C46 22 30 6 30 6Z" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.5" />
        <path d="M30 6 C30 6 14 22 14 36 C14 45.4 21.2 53 30 53" stroke={color} strokeWidth="1" strokeOpacity="0.4" fill="none" />
      </g>
      <ellipse className="drop-let" cx="30" cy="60" rx="2.5" ry="3.5" fill={color} fillOpacity="0.7" style={{ transformOrigin: "30px 60px" }} />
      <ellipse className="ripple" cx="30" cy="73" rx="2" ry="1.2" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.5" />
    </svg>
  );
}

function PhotoCarousel() {
  const [idx, setIdx] = useState(0);
  const next = () => setIdx(i => (i + 1) % CAROUSEL_SLIDES.length);
  const prev = () => setIdx(i => (i - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  useEffect(() => { const t = setInterval(next, 4200); return () => clearInterval(t); }, []);
  return (
    <div style={{ position: "relative", overflow: "hidden", background: G, height: 400 }}>
      {CAROUSEL_SLIDES.map((s, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, opacity: i === idx ? 1 : 0, transition: "opacity 0.75s ease" }}>
          <img src={s.img} alt={s.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 50%, rgba(24,30,20,0.8))" }} />
        </div>
      ))}
      <div style={{ position: "absolute", bottom: 44, left: 32 }}>
        <p style={{ margin: 0, color: CR, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.8 }}>{CAROUSEL_SLIDES[idx].label}</p>
      </div>
      <button onClick={prev} aria-label="Précédent" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", background: "rgba(240,234,216,0.15)", border: "none", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <ChevronLeft size={17} color={CR} />
      </button>
      <button onClick={next} aria-label="Suivant" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "rgba(240,234,216,0.15)", border: "none", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <ChevronRight size={17} color={CR} />
      </button>
      <div style={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
        {CAROUSEL_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} aria-label={`Slide ${i+1}`} style={{ width: i === idx ? 18 : 5, height: 5, borderRadius: 3, background: i === idx ? CR : "rgba(240,234,216,0.35)", border: "none", cursor: "pointer", transition: "width 0.3s", padding: 0 }} />
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

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [mob, setMob]           = useState(false);
  const [scrolled, setSc]       = useState(false);
  const [service, setService]   = useState("midi");
  const [fabVisible, setFab]    = useState(false);
  const [menuImgUrl, setImgUrl] = useState(MENU_IMG_URL_DEFAULT);

  const isNight = service === "soir";
  const T = buildTheme(isNight);

  const heroRef    = useRef(null);
  const menuRef    = useRef(null);
  const conceptRef = useRef(null);
  const infosRef   = useRef(null);
  const NAV_H = 66;

  // Zenchef SDK
  useEffect(() => {
    if (document.getElementById("zenchef-sdk")) return;
    const el = document.getElementsByTagName("script")[0];
    const js = document.createElement("script");
    js.id = "zenchef-sdk";
    js.src = "https://sdk.zenchef.com/v1/sdk.min.js";
    el.parentNode.insertBefore(js, el);
  }, []);

  useEffect(() => {
    const fn = () => { setSc(window.scrollY > 40); setFab((heroRef.current?.getBoundingClientRect().bottom ?? 0) < 0); };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = `
      @font-face { font-family:'Kumbh Sans'; src:url('/fonts/kumbh-sans-Regular.ttf') format('truetype'); font-weight:400; font-display:swap; }
      @font-face { font-family:'Kumbh Sans'; src:url('/fonts/kumbh-sans-Bold.ttf') format('truetype'); font-weight:700; font-display:swap; }
    `;
    document.head.appendChild(s);
  }, []);

  // Charge les cartes depuis Supabase Storage
  useEffect(() => {
    const SUPA_URL = "https://xscdqxfvrmjlxeilrxnb.supabase.co";
    const NAMES = { midi: "carte-midi-current", soir: "carte-soir-current" };
    const loadUrls = async () => {
      const imgs = { midi: null, soir: null };
      for (const svc of ["midi", "soir"]) {
        for (const ext of ["pdf", "jpg", "png"]) {
          const url = `${SUPA_URL}/storage/v1/object/public/cartes/${NAMES[svc]}.${ext}`;
          try {
            const res = await fetch(url, { method: "HEAD" });
            if (res.ok) { imgs[svc] = `${url}?t=${Date.now()}`; break; }
          } catch {}
        }
      }
      setImgUrl(imgs);
    };
    loadUrls();
  }, []);

  const go = (ref) => { setMob(false); setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80); };
  
  // Ouvre le widget Zenchef
  const openZenchef = () => {
    if (window.ZenchefSDK) window.ZenchefSDK.open();
  };

  const NAV = [
    { label: "La Carte",    ref: menuRef },
    { label: "Le Concept",  ref: conceptRef },
    { label: "Accès",       ref: infosRef },
  ];

  const btn = (extra = {}) => ({
    background: T.btnBg, color: T.btnText, border: "none", borderRadius: 2,
    padding: "11px 24px", fontWeight: 700, fontSize: 11, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 8,
    letterSpacing: "0.1em", textTransform: "uppercase",
    fontFamily: "inherit", transition: "background 0.3s", ...extra,
  });

  return (
    <div style={{ fontFamily: "'Kumbh Sans', sans-serif", background: T.bg, color: T.text, minHeight: "100vh", transition: "background 0.45s ease, color 0.45s ease" }}>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, #root { width: 100%; overflow-x: hidden; }
        body { width: 100%; margin: 0; padding: 0; overflow-x: hidden; }
        img { display: block; }
        input:focus, select:focus { outline: none; border-color: ${G} !important; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none} }
        @keyframes fabIn  { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none} }
        .mm-fadein { animation: fadeUp .5s ease both; }
        .mm-fab-in { animation: fabIn .26s ease both; }
        @media(max-width:800px){
          #desk-nav{display:none !important} #mob-btn{display:flex !important}
          .hero-split{flex-direction:column !important}
          .hero-photo{height:56vw !important;min-height:210px}
          .hero-copy{padding:36px 20px 32px !important}
          .elixir-kw{gap:24px !important}
          .menu-cols{grid-template-columns:1fr !important}
          .team-grid{grid-template-columns:1fr !important;gap:32px !important}
          .team-intro{grid-template-columns:1fr !important;gap:28px !important}
          .blockquote{border-left:none !important;padding-left:0 !important;padding-top:24px;border-top:1px solid rgba(240,234,216,0.2)}
          .info-cols{grid-template-columns:1fr !important;gap:32px !important}
          .portrait{height:260px !important}
          .sp{padding:56px 20px !important}
          .pdf-embed{display:none !important}
        }
        @media(min-width:801px){ #mob-btn{display:none !important} #desk-nav{display:flex !important} }
      `}</style>

      {/* Widget Zenchef */}
      <div className="zc-widget-config" data-restaurant="387411" data-open="0" />

      {/* ── NAVBAR ── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: scrolled ? T.bgNav : T.bgNavBase, backdropFilter: scrolled ? "blur(10px)" : "none", borderBottom: `1px solid ${T.borderNav}`, transition: "background 0.45s ease, border-color 0.45s ease" }}>
        <nav style={{ maxWidth: 1160, margin: "0 auto", padding: "0 20px", height: NAV_H, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => go(heroRef)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <img src={IMG.logoOfficial} alt="Logo Mama Mok" style={{ height: 34, objectFit: "contain", filter: T.logoFilter, transition: "filter 0.45s ease" }} />
          </button>
          <div id="desk-nav" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {NAV.map(({ label, ref }) => (
              <button key={label} onClick={() => go(ref)}
                style={{ background: "none", border: "none", cursor: "pointer", color: T.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 0", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = T.textMutedHov}
                onMouseLeave={e => e.target.style.color = T.textMuted}>
                {label}
              </button>
            ))}
            <button onClick={openZenchef} style={btn()}>Réserver</button>
          </div>
          <button id="mob-btn" onClick={() => setMob(!mob)} style={{ background: "none", border: "none", cursor: "pointer", color: T.text, padding: 4, display: "none" }}>
            {mob ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
        {mob && (
          <div style={{ background: T.bg, borderTop: `1px solid ${T.border}`, padding: "14px 20px 24px", display: "flex", flexDirection: "column", gap: 4, transition: "background 0.45s ease" }}>
            {NAV.map(({ label, ref }) => (
              <button key={label} onClick={() => go(ref)} style={{ background: "none", border: "none", cursor: "pointer", color: T.text, fontSize: 16, fontWeight: 700, textTransform: "uppercase", textAlign: "left", padding: "10px 0", borderBottom: `1px solid ${T.border}`, letterSpacing: "0.07em" }}>{label}</button>
            ))}
            <button onClick={openZenchef} style={{ ...btn(), marginTop: 14, justifyContent: "center" }}>Réserver une table</button>
          </div>
        )}
      </header>

      <main>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ paddingTop: NAV_H, borderBottom: isNight ? `1px solid rgba(240,234,216,0.15)` : `1px solid ${BORDER}`, transition: "border-color 0.45s ease" }}>
        <div className="hero-split" style={{ display: "flex", minHeight: `calc(100vh - ${NAV_H}px)` }}>
          <div className="hero-copy" style={{ flex: "0 0 50%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "64px 52px 64px 44px", borderRight: `1px solid ${T.border}`, background: T.bg, transition: "background 0.45s ease, border-color 0.45s ease" }}>
            <div className="mm-fadein" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <span style={{ color: isNight ? "#c8a882" : B, fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 700, transition: "color 0.45s ease" }}>Restaurant Bistronomique · Rennes</span>
              <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(38px, 5vw, 62px)", fontWeight: 700, color: T.text, lineHeight: 1.07, margin: 0, letterSpacing: "-0.02em", transition: "color 0.45s ease" }}>
                Le goût,<br />
                <em style={{ color: isNight ? "#c8a882" : B, fontStyle: "italic", fontWeight: 400, transition: "color 0.45s ease" }}>dans sa</em><br />
                globalité.
              </h1>
              <p style={{ color: T.textMuted, fontSize: 15, lineHeight: 1.75, maxWidth: 390, margin: 0, transition: "color 0.45s ease" }}>
                Une cuisine bistronomique où chaque assiette est associée à un élixir. Précision, fluidité, singularité — un geste signature qui révèle le plat.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <button onClick={() => go(menuRef)} style={btn()}>La Carte <ArrowRight size={13} /></button>
                <button onClick={openZenchef} style={{ background: "transparent", color: T.text, border: `1.5px solid ${T.text}`, borderRadius: 2, padding: "10px 22px", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", fontFamily: "inherit", transition: "color 0.45s ease, border-color 0.45s ease" }}>
                  Réserver
                </button>
              </div>
              <div style={{ display: "flex", gap: 20, paddingTop: 4 }}>
                <a href="https://www.instagram.com/mamamok.restaurant" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, color: T.textMuted, fontSize: 11, textDecoration: "none", fontWeight: 600, letterSpacing: "0.07em", transition: "color 0.45s" }}>
                  <Instagram size={14} color={T.text} /> @mamamok.restaurant
                </a>
                <a href="mailto:bonjour@mamamok.fr" style={{ display: "flex", alignItems: "center", gap: 6, color: T.textMuted, fontSize: 11, textDecoration: "none", fontWeight: 600, letterSpacing: "0.07em", transition: "color 0.45s" }}>
                  <Mail size={14} color={T.text} /> Contact
                </a>
              </div>
            </div>
          </div>
          <div className="hero-photo" style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            <img src={IMG.hero} alt="Salle du restaurant Mama Mok, 12 rue de la Psalette, Rennes" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center" }} />
          </div>
        </div>
      </section>

      {/* ── SECTION ÉLIXIR ── */}
      <section style={{ background: G2, padding: "48px 20px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 28 }}>
          <DroppingElixir size={64} color={CR} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <span style={{ color: "rgba(240,234,216,0.45)", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 700 }}>Le Geste Signature</span>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 700, color: CR, margin: 0, lineHeight: 1.1, letterSpacing: "-0.01em" }}>L'Élixir.</h2>
          </div>
          <p style={{ color: "rgba(240,234,216,0.72)", fontSize: 15, lineHeight: 1.78, maxWidth: 540, margin: 0 }}>
            Ce n'est pas un condiment. Ce n'est pas un cocktail. C'est un concentré de saveurs préparé chaque matin par nos cuisiniers — versé sur l'assiette au moment de servir, il révèle, intensifie, transforme.
          </p>
          <div className="elixir-kw" style={{ display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center", paddingTop: 4 }}>
            {["Concentré", "Fluidité", "Précision", "Rituel"].map(kw => (
              <div key={kw} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "Georgia, serif", fontSize: "clamp(18px, 3vw, 28px)", fontWeight: 700, color: CR }}>{kw}</span>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: B2 }} />
              </div>
            ))}
          </div>
          <button onClick={() => go(menuRef)}
            onMouseEnter={e => { e.currentTarget.style.background = CR; e.currentTarget.style.color = G; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = CR; }}
            style={{ background: "transparent", color: CR, border: "1.5px solid rgba(240,234,216,0.4)", borderRadius: 2, padding: "12px 28px", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s, color 0.2s" }}>
            Découvrir la carte
          </button>
        </div>
      </section>

      {/* ── CAROUSEL ── */}
      <section style={{ background: G }}><PhotoCarousel /></section>

      {/* ── MENU ── */}
      <section ref={menuRef} style={{ background: T.bg, transition: "background 0.45s ease" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "80px 28px 0" }}>
          <p style={{ color: B, fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>Cuisine & Saison</p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 40 }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: T.text, margin: 0, transition: "color 0.45s ease" }}>Notre Carte</h2>
            <p style={{ color: T.textMuted, fontSize: 13, margin: 0, maxWidth: 320, lineHeight: 1.65, transition: "color 0.45s ease" }}>Produits sourcés chaque matin. La carte suit les saisons.</p>
          </div>
          <div style={{ height: 1, background: T.divider, marginBottom: 32, transition: "background 0.45s ease" }} />
          {/* Toggle */}
          <div style={{ display: "flex", gap: 0, marginBottom: 44, border: `1.5px solid ${T.border}`, borderRadius: 2, overflow: "hidden", width: "fit-content", transition: "border-color 0.45s ease" }}>
            {["midi", "soir"].map(s => (
              <button key={s} onClick={() => setService(s)}
                style={{ padding: "10px 32px", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", border: "none", background: service === s ? (s === "soir" ? "#0d1109" : G) : "transparent", color: service === s ? CR : T.textMuted, fontFamily: "inherit", transition: "all 0.3s" }}>
                {s === "midi" ? "☀️  Midi" : "🌙  Soir"}
              </button>
            ))}
          </div>
        </div>

        {menuImgUrl[service] ? (
          <div style={{ background: T.bg, padding: "0 28px 48px", transition: "background 0.45s ease" }}>
            <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <embed
                src={`${menuImgUrl[service]}#toolbar=0&navpanes=0&scrollbar=0`}
                type="application/pdf"
                style={{
                  width: "100%",
                  height: "80vh",
                  borderRadius: 4,
                  border: isNight ? "1px solid rgba(240,234,216,0.2)" : `1px solid ${BORDER}`,
                  boxShadow: isNight ? "0 10px 40px rgba(0,0,0,0.4)" : "0 10px 30px rgba(0,0,0,0.08)",
                  display: "block",
                }}
              />
              <a href={menuImgUrl[service]} target="_blank" rel="noopener noreferrer"
                style={{ color: T.textMuted, fontSize: 11, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: `1px solid ${T.border}`, paddingBottom: 2, transition: "color 0.45s" }}>
                Ouvrir en plein écran <ArrowRight size={11} />
              </a>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 28px 80px", textAlign: "center" }}>
            <p style={{ color: T.textMuted, fontSize: 14, lineHeight: 1.7 }}>
              La carte sera disponible très prochainement.<br />
              Contactez-nous au <a href="tel:+33223203564" style={{ color: T.text, fontWeight: 700 }}>02 23 20 35 64</a> pour toute question.
            </p>
          </div>
        )}

        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 28px 80px" }}>
          <div style={{ padding: "20px 24px", background: T.calloutBg, border: `1px solid ${T.calloutBd}`, borderRadius: 2, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between", transition: "background 0.45s ease, border-color 0.45s ease" }}>
            <div>
              <p style={{ margin: "0 0 2px", fontWeight: 700, color: T.text, fontSize: 13, transition: "color 0.45s ease" }}>Carte des vins & élixirs</p>
              <p style={{ margin: 0, color: T.textMuted, fontSize: 12, transition: "color 0.45s ease" }}>Disponible à table ou sur demande.</p>
            </div>
            <button onClick={openZenchef} style={btn()}>Réserver une table</button>
          </div>
        </div>
      </section>

      {/* ── ÉQUIPE — fond vert fixe, toujours lisible ── */}
      <section ref={conceptRef} style={{ background: G }}>
        <div className="sp" style={{ padding: "80px 28px", maxWidth: 1160, margin: "0 auto" }}>
          <div className="team-intro" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center", marginBottom: 72 }}>
            <div>
              <p style={{ color: "rgba(240,234,216,0.45)", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 14px" }}>L'Esprit Mama Mok</p>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, color: CR, lineHeight: 1.12, margin: "0 0 20px" }}>
                Créatif, structuré,<br /><em style={{ fontWeight: 400, fontStyle: "italic" }}>jamais rigide.</em>
              </h2>
              <p style={{ color: "rgba(240,234,216,0.68)", fontSize: 15, lineHeight: 1.82, margin: 0 }}>
                Mama Mok n'est pas un gastro. Ce n'est pas un bistrot ordinaire. C'est un lieu d'expression culinaire avec un geste identitaire — l'élixir — qui prolonge chaque assiette et engage tous les sens.
              </p>
            </div>
            <div className="blockquote" style={{ borderLeft: "1px solid rgba(240,234,216,0.15)", paddingLeft: 36 }}>
              <blockquote style={{ margin: 0 }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(16px, 2.5vw, 22px)", fontStyle: "italic", color: CR, lineHeight: 1.55, margin: "0 0 14px" }}>
                  "L'élixir n'est pas un plus. C'est un activateur sensoriel. Un rituel. Un élément de surprise maîtrisée."
                </p>
                <cite style={{ color: "rgba(240,234,216,0.4)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", fontStyle: "normal" }}>— Direction Artistique, Mama Mok</cite>
              </blockquote>
            </div>
          </div>
          <p style={{ color: "rgba(240,234,216,0.4)", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 24px" }}>Les Fondateurs</p>
          <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28 }}>
            {TEAM.map(p => (
              <div key={p.name}>
                <div className="portrait" style={{ height: 360, borderRadius: 2, overflow: "hidden", marginBottom: 18 }}>
                  <img src={p.img} alt={`${p.name} — ${p.role} du restaurant Mama Mok à Rennes`} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                </div>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: 19, fontWeight: 700, color: CR, margin: "0 0 3px" }}>{p.name}</h3>
                <p style={{ color: "rgba(240,234,216,0.4)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>{p.role}</p>
                <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: "rgba(240,234,216,0.6)", fontSize: 14, margin: 0 }}>"{p.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEVANTURE ── */}
      <section style={{ width: "100%", minHeight: 520, position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden", backgroundImage: `url(${IMG.devanture})`, backgroundSize: "cover", backgroundPosition: "center 10%", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(24,30,20,0.62)" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px 52px", maxWidth: 600, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <span style={{ color: "rgba(240,234,216,0.55)", fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" }}>Le Lieu · Rennes Centre</span>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 700, color: CR, lineHeight: 1.12, margin: 0 }}>
            Poussez la porte du<br />36 Rue Saint-Georges.
          </p>
          <p style={{ color: "rgba(240,234,216,0.65)", fontSize: 15, lineHeight: 1.72, margin: 0 }}>Sur place ou à emporter. Au cœur du quartier historique de Rennes.</p>
          <button onClick={openZenchef}
            onMouseEnter={e => { e.currentTarget.style.background = CR; e.currentTarget.style.color = G; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = CR; }}
            style={{ marginTop: 4, background: "transparent", color: CR, border: "1.5px solid rgba(240,234,216,0.45)", borderRadius: 2, padding: "12px 28px", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s, color 0.2s" }}>
            Réserver une table
          </button>
        </div>
      </section>

      {/* ── INFOS — fond crème fixe, toujours lisible ── */}
      <section ref={infosRef} className="sp" style={{ padding: "80px 28px 48px", background: CR2 }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <p style={{ color: B, fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>Rennes Centre-Ville</p>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: G, margin: "0 0 40px" }}>Infos & Accès</h2>
          <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />
          <div className="info-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40, marginBottom: 56 }}>
            <div>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: G, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}><MapPin size={17} color={B} /> Adresse</h3>
              <p style={{ color: MU, fontSize: 14, lineHeight: 1.78, margin: "0 0 16px" }}>36 Rue Saint-Georges<br />35000 Rennes<br />Quartier Centre-Ville</p>
              <a href="https://maps.app.goo.gl/8GRtWUaZVgaEjuWAA" target="_blank" rel="noopener noreferrer" style={{ color: G, fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none", borderBottom: `1px solid ${G}`, paddingBottom: 2, display: "inline-flex", alignItems: "center", gap: 4 }}>
                Google Maps <ArrowRight size={11} />
              </a>
            </div>
            <div>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: G, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}><Clock size={17} color={B} /> Horaires</h3>
              {HOURS.map(h => (
                <div key={h.service} style={{ padding: "8px 0", borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: G }}>{h.service} — {h.days}</div>
                  <div style={{ color: MU, fontSize: 13, marginTop: 2 }}>{h.time}</div>
                </div>
              ))}
            </div>
            <div>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: G, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}><Phone size={17} color={B} /> Contact</h3>
              <p style={{ color: MU, fontSize: 14, lineHeight: 1.78, margin: "0 0 20px" }}>
                <a href="tel:+33223203564" style={{ color: MU, textDecoration: "none" }}>02 23 20 35 64</a><br />
                <a href="mailto:mamamokrestaurant@gmail.com" style={{ color: MU, textDecoration: "none" }}>mamamokrestaurant@gmail.com</a>
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <a href="https://www.instagram.com/mamamok.restaurant" target="_blank" rel="noopener noreferrer" style={{ background: G, color: CR, border: "none", borderRadius: 2, padding: "9px 16px", fontWeight: 700, fontSize: 10, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, letterSpacing: "0.09em", textTransform: "uppercase" }}>
                  <Instagram size={12} color={CR} /> Instagram
                </a>
                <a href="mailto:mamamokrestaurant@gmail.com" style={{ background: "transparent", color: G, border: `1.5px solid ${G}`, borderRadius: 2, padding: "9px 16px", fontWeight: 700, fontSize: 10, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, letterSpacing: "0.09em", textTransform: "uppercase" }}>
                  <Mail size={12} /> Email
                </a>
              </div>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 48, marginBottom: 48 }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 700, color: G, margin: "0 0 6px" }}>Questions fréquentes</h2>
            <p style={{ color: MU, fontSize: 13, margin: "0 0 24px" }}>Tout ce qu'il faut savoir avant de venir.</p>
            <div style={{ maxWidth: 660 }}>{FAQ.map(item => <FaqItem key={item.q} item={item} />)}</div>
          </div>
          <div style={{ borderRadius: 2, overflow: "hidden", border: `1px solid ${BORDER}`, height: 350 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2663.9193143973207!2d-1.6781965235783605!3d48.11179217124069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x480edf46702b9e63%3A0x36a2add86651def4!2sMamamok!5e0!3m2!1sfr!2sfr!4v1788726641212!5m2!1sfr!2sfr"
              width="100%" height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Localisation Mama Mok Rennes"
            />
          </div>
        </div>
      </section>

      </main>

      {/* ── FOOTER — fond vert fixe ── */}
      <footer style={{ background: G, color: CR, padding: "40px 28px 28px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <img src={IMG.logoOfficial} alt="Logo Mama Mok" style={{ height: 40, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
            <span style={{ color: "rgba(240,234,216,0.4)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>Restaurant Bistronomique · Rennes</span>
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <a href="https://www.instagram.com/mamamok.restaurant" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(240,234,216,0.4)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em" }}>
              <Instagram size={15} /> Instagram
            </a>
            <a href="mailto:mamamokrestaurant@gmail.com" style={{ color: "rgba(240,234,216,0.4)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em" }}>
              <Mail size={15} /> Email
            </a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <span style={{ color: "rgba(240,234,216,0.22)", fontSize: 11 }}>© {new Date().getFullYear()} Mama Mok · Tous droits réservés</span>
            <a href="/admin" style={{ color: "rgba(240,234,216,0.3)", fontSize: 10, textDecoration: "none", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, border: "1px solid rgba(240,234,216,0.15)", borderRadius: 2, padding: "5px 10px" }}>Admin</a>
          </div>
        </div>
      </footer>

      {/* ── FAB ── */}
      {fabVisible && (
        <button className="mm-fab-in" onClick={openZenchef} aria-label="Réserver une table au restaurant Mama Mok"
          onMouseEnter={e => { e.currentTarget.style.background = B2; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = B; e.currentTarget.style.transform = "translateY(0)"; }}
          style={{ position: "fixed", bottom: 24, right: 24, zIndex: 150, background: B, color: CR2, border: "none", borderRadius: 40, padding: "13px 22px", display: "flex", alignItems: "center", gap: 9, fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 4px 20px rgba(129,19,50,0.4)", fontFamily: "inherit", transition: "background 0.2s, transform 0.2s" }}>
          
          Réserver
        </button>
      )}
    </div>
  );
}