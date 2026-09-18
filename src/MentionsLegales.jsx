import { useEffect } from "react";

const G  = "#181e14";
const B  = "#811332";
const CR2 = "#f5f0e4";
const MU = "#6b6a5e";
const BORDER = "#d4cfc0";

export default function MentionsLegales() {
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = `
      @font-face { font-family:'Kumbh Sans'; src:url('/fonts/kumbh-sans-Regular.ttf') format('truetype'); font-weight:400; font-display:swap; }
      @font-face { font-family:'Kumbh Sans'; src:url('/fonts/kumbh-sans-Bold.ttf') format('truetype'); font-weight:700; font-display:swap; }
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    `;
    document.head.appendChild(s);
    document.title = "Mentions Légales — Mama Mok";
    window.scrollTo(0, 0);
  }, []);

  const section = { marginBottom: 40 };
  const h2 = { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: G, margin: "0 0 14px", paddingBottom: 8, borderBottom: `1px solid ${BORDER}` };
  const p = { color: MU, fontSize: 15, lineHeight: 1.85, margin: "0 0 10px" };
  const strong = { color: G, fontWeight: 700 };

  return (
    <div style={{ fontFamily: "'Kumbh Sans', sans-serif", background: CR2, minHeight: "100vh" }}>

      {/* Header */}
      <header style={{ background: G, padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <img src="/logo-mamamok.png" alt="Mama Mok" style={{ height: 32, filter: "brightness(0) invert(1)" }} />
        </a>
        <a href="/" style={{ color: "rgba(240,234,216,0.6)", fontSize: 12, textDecoration: "none", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          ← Retour au site
        </a>
      </header>

      {/* Contenu */}
      <main style={{ maxWidth: 780, margin: "0 auto", padding: "60px 28px 80px" }}>

        <div style={{ marginBottom: 48 }}>
          <p style={{ color: B, fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 10px" }}>Informations légales</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: G, margin: "0 0 8px" }}>Mentions Légales</h1>
          <p style={{ color: MU, fontSize: 13 }}>Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance en l'économie numérique.</p>
        </div>

        <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

        {/* Éditeur */}
        <div style={section}>
          <h2 style={h2}>1. Éditeur du site</h2>
          <p style={p}><span style={strong}>Raison sociale :</span> SAS MAMAMOK</p>
          <p style={p}><span style={strong}>Forme juridique :</span> Société par Actions Simplifiée (SAS)</p>
          <p style={p}><span style={strong}>Capital social :</span> 7 500 €</p>
          <p style={p}><span style={strong}>Siège social :</span> 36 Rue Saint-Georges, 35000 Rennes, France</p>
          <p style={p}><span style={strong}>SIRET :</span> 107 781 379 00014</p>
          <p style={p}><span style={strong}>SIREN :</span> 107 781 379</p>
          <p style={p}><span style={strong}>Directeur de la publication :</span> Mattheo Samson, Président</p>
          <p style={p}><span style={strong}>E-mail :</span> <a href="mailto:mamamokrestaurant@gmail.com" style={{ color: B }}>mamamokrestaurant@gmail.com</a></p>
          <p style={p}><span style={strong}>Téléphone :</span> <a href="tel:+33223203564" style={{ color: B }}>02 23 20 35 64</a></p>
        </div>

        {/* Hébergement */}
        <div style={section}>
          <h2 style={h2}>2. Hébergement</h2>
          <p style={p}><span style={strong}>Hébergeur :</span> Vercel Inc.</p>
          <p style={p}><span style={strong}>Adresse :</span> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
          <p style={p}><span style={strong}>Site web :</span> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: B }}>vercel.com</a></p>
        </div>

        {/* Propriété intellectuelle */}
        <div style={section}>
          <h2 style={h2}>3. Propriété intellectuelle</h2>
          <p style={p}>L'ensemble du contenu de ce site (textes, images, logos, graphismes, éléments visuels) est la propriété exclusive de SAS MAMAMOK ou de ses partenaires, et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.</p>
          <p style={p}>Toute reproduction, représentation, modification ou exploitation, totale ou partielle, du contenu de ce site, sans autorisation préalable écrite de SAS MAMAMOK, est strictement interdite.</p>
        </div>

        {/* Données personnelles */}
        <div style={section}>
          <h2 style={h2}>4. Données personnelles</h2>
          <p style={p}>Ce site ne collecte pas de données personnelles directement. Les réservations en ligne sont gérées via la plateforme <strong style={strong}>Zenchef</strong>, soumise à sa propre politique de confidentialité. Nous vous invitons à consulter les conditions d'utilisation de Zenchef pour toute information relative au traitement de vos données dans le cadre d'une réservation.</p>
          <p style={p}>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification et de suppression de vos données en nous contactant à l'adresse : <a href="mailto:mamamokrestaurant@gmail.com" style={{ color: B }}>mamamokrestaurant@gmail.com</a>.</p>
        </div>

        {/* Cookies */}
        <div style={section}>
          <h2 style={h2}>5. Cookies</h2>
          <p style={p}>Ce site n'utilise pas de cookies de traçage ou publicitaires. Des cookies techniques strictement nécessaires au fonctionnement du site peuvent être déposés par l'hébergeur Vercel.</p>
        </div>

        {/* Responsabilité */}
        <div style={section}>
          <h2 style={h2}>6. Limitation de responsabilité</h2>
          <p style={p}>Les informations contenues sur ce site sont fournies à titre indicatif. SAS MAMAMOK s'efforce de maintenir le site à jour mais ne peut garantir l'exactitude, la complétude ou l'actualité des informations diffusées. SAS MAMAMOK décline toute responsabilité en cas d'interruption du site ou de survenance de bugs.</p>
        </div>

        {/* Droit applicable */}
        <div style={section}>
          <h2 style={h2}>7. Droit applicable</h2>
          <p style={p}>Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
        </div>

        <p style={{ color: MU, fontSize: 12, marginTop: 48 }}>Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}</p>
      </main>

      {/* Footer simple */}
      <footer style={{ background: G, padding: "20px 28px", textAlign: "center" }}>
        <p style={{ color: "rgba(240,234,216,0.3)", fontSize: 11 }}>© {new Date().getFullYear()} SAS MAMAMOK · 36 Rue Saint-Georges, 35000 Rennes</p>
      </footer>
    </div>
  );
}