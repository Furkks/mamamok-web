import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Upload, LogOut, Check, X, FileText, RefreshCw } from "lucide-react";

// ── CONFIG SUPABASE ────────────────────────────────────────────────────────────
const SUPA_URL  = "https://xscdqxfvrmjlxeilrxnb.supabase.co";
const SUPA_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzY2RxeGZ2cm1qbHhlaWxyeG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMDQ5NDksImV4cCI6MjEwMzU4MDk0OX0.YHwFtZAJEK7MjOxYJTPrItQmV9IQfWQNS443V-uQ1F4";
const supabase  = createClient(SUPA_URL, SUPA_ANON);

// ── MOT DE PASSE ADMIN ─────────────────────────────────────────────────────────
// ⚠️ À changer avant la mise en production
const ADMIN_PASSWORD = "mamamok2024";

// ── TOKENS ────────────────────────────────────────────────────────────────────
const G  = "#3A3F2E";
const B  = "#6A1F2B";
const CR = "#D8D2C4";
const CR2= "#EDE8DB";
const MU = "#7A7565";
const BORDER = "#C8C2B0";

export default function AdminPanel() {
  const [authed, setAuthed]       = useState(() => sessionStorage.getItem("mm_admin") === "1");
  const [password, setPassword]   = useState("");
  const [loginErr, setLoginErr]   = useState("");

  const [carteUrls, setCarteUrls] = useState({ midi: null, soir: null });
  const [uploading, setUploading] = useState({ midi: false, soir: false });
  const [feedback, setFeedback]   = useState({ midi: null, soir: null }); // "ok" | "err"

  // Charge les URLs actuelles depuis Supabase
  const fetchUrls = async () => {
    const { data } = await supabase.from("carte_urls").select("*");
    if (data) {
      const urls = { midi: null, soir: null };
      data.forEach(row => { urls[row.service] = row.pdf_url; });
      setCarteUrls(urls);
    }
  };

  useEffect(() => { if (authed) fetchUrls(); }, [authed]);

  // Login
  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("mm_admin", "1");
      setAuthed(true);
      setLoginErr("");
    } else {
      setLoginErr("Mot de passe incorrect.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("mm_admin");
    setAuthed(false);
    setPassword("");
  };

  // Upload PDF
  const handleUpload = async (service, file) => {
    if (!file || file.type !== "application/pdf") {
      setFeedback(f => ({ ...f, [service]: "err" }));
      return;
    }
    setUploading(u => ({ ...u, [service]: true }));
    setFeedback(f => ({ ...f, [service]: null }));

    const fileName = `carte-${service}-${Date.now()}.pdf`;

    // Upload dans le bucket Supabase Storage
    const { error: uploadErr } = await supabase.storage
      .from("cartes")
      .upload(fileName, file, { upsert: true, contentType: "application/pdf" });

    if (uploadErr) {
      setFeedback(f => ({ ...f, [service]: "err" }));
      setUploading(u => ({ ...u, [service]: false }));
      return;
    }

    // Récupère l'URL publique
    const { data: urlData } = supabase.storage.from("cartes").getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;

    // Met à jour la table carte_urls (upsert sur le service)
    const { data: existing } = await supabase
      .from("carte_urls")
      .select("id")
      .eq("service", service)
      .single();

    if (existing) {
      await supabase.from("carte_urls").update({ pdf_url: publicUrl }).eq("service", service);
    } else {
      await supabase.from("carte_urls").insert({ service, pdf_url: publicUrl });
    }

    setCarteUrls(u => ({ ...u, [service]: publicUrl }));
    setFeedback(f => ({ ...f, [service]: "ok" }));
    setUploading(u => ({ ...u, [service]: false }));

    // Reset feedback après 3s
    setTimeout(() => setFeedback(f => ({ ...f, [service]: null })), 3000);
  };

  const cardStyle = {
    background: CR2, border: `1px solid ${BORDER}`, borderRadius: 4,
    padding: "28px 24px", display: "flex", flexDirection: "column", gap: 16,
  };

  // ── ÉCRAN LOGIN ─────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: G, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Kumbh Sans', sans-serif", padding: 20 }}>
        <div style={{ background: CR2, borderRadius: 4, padding: "40px 36px", width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: B, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px" }}>Mama Mok</p>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 700, color: G, margin: 0 }}>Espace Admin</h1>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: MU }}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              style={{ border: `1px solid ${loginErr ? B : BORDER}`, borderRadius: 2, padding: "12px 14px", fontSize: 15, color: G, background: "#fff", fontFamily: "inherit", outline: "none" }}
            />
            {loginErr && <p style={{ color: B, fontSize: 12, margin: 0 }}>{loginErr}</p>}
          </div>
          <button onClick={handleLogin}
            style={{ background: G, color: CR2, border: "none", borderRadius: 2, padding: "13px", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
            Se connecter
          </button>
          <a href="/" style={{ textAlign: "center", color: MU, fontSize: 12, textDecoration: "none" }}>← Retour au site</a>
        </div>
      </div>
    );
  }

  // ── PANEL ADMIN ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f5f2ec", fontFamily: "'Kumbh Sans', sans-serif" }}>

      {/* Header */}
      <header style={{ background: G, padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: CR }}>Mama Mok</span>
          <span style={{ color: "rgba(216,210,196,0.5)", fontSize: 11, marginLeft: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button onClick={fetchUrls} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(216,210,196,0.6)", display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
            <RefreshCw size={14} /> Actualiser
          </button>
          <button onClick={handleLogout}
            style={{ background: "transparent", color: CR, border: "1px solid rgba(216,210,196,0.3)", borderRadius: 2, padding: "7px 16px", fontWeight: 600, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
            <LogOut size={13} /> Déconnexion
          </button>
        </div>
      </header>

      {/* Contenu */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, color: G, margin: "0 0 8px" }}>Gestion des cartes</h2>
        <p style={{ color: MU, fontSize: 14, margin: "0 0 36px", lineHeight: 1.65 }}>
          Uploadez votre PDF Canva pour mettre à jour la carte du site. Le changement est instantané.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {["midi", "soir"].map(service => (
            <div key={service} style={cardStyle}>
              <div>
                <p style={{ color: B, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px" }}>
                  {service === "midi" ? "☀️  Service Midi" : "🌙  Service Soir"}
                </p>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: G, margin: 0 }}>
                  Carte {service === "midi" ? "du midi" : "du soir"}
                </h3>
              </div>

              {/* Carte actuelle */}
              <div style={{ background: carteUrls[service] ? "rgba(58,63,46,0.06)" : "rgba(0,0,0,0.03)", border: `1px solid ${BORDER}`, borderRadius: 2, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <FileText size={16} color={carteUrls[service] ? G : MU} />
                {carteUrls[service] ? (
                  <a href={carteUrls[service]} target="_blank" rel="noopener noreferrer"
                    style={{ color: G, fontSize: 13, fontWeight: 600, textDecoration: "none", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    Voir la carte actuelle ↗
                  </a>
                ) : (
                  <span style={{ color: MU, fontSize: 13 }}>Aucune carte uploadée</span>
                )}
              </div>

              {/* Zone upload */}
              <label style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "24px 16px", border: `2px dashed ${BORDER}`, borderRadius: 2, cursor: "pointer", transition: "border-color 0.2s", background: "#fff" }}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); handleUpload(service, e.dataTransfer.files[0]); }}>
                <input type="file" accept="application/pdf" style={{ display: "none" }}
                  onChange={e => handleUpload(service, e.target.files[0])} />
                {uploading[service] ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: G }}>
                    <RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Upload en cours…</span>
                  </div>
                ) : feedback[service] === "ok" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#2d6a4f" }}>
                    <Check size={18} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Carte mise à jour !</span>
                  </div>
                ) : feedback[service] === "err" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: B }}>
                    <X size={18} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Erreur — PDF uniquement</span>
                  </div>
                ) : (
                  <>
                    <Upload size={22} color={MU} />
                    <div style={{ textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: G }}>Glisser le PDF ici</p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: MU }}>ou cliquer pour choisir</p>
                    </div>
                  </>
                )}
              </label>

              <p style={{ margin: 0, fontSize: 11, color: MU, textAlign: "center" }}>
                Format PDF uniquement · Max 50 MB
              </p>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div style={{ marginTop: 32, padding: "20px 24px", background: CR2, border: `1px solid ${BORDER}`, borderRadius: 4 }}>
          <h4 style={{ fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 700, color: G, margin: "0 0 10px" }}>Comment ça marche ?</h4>
          <ol style={{ color: MU, fontSize: 13, lineHeight: 1.8, margin: 0, paddingLeft: 18 }}>
            <li>Exportez votre carte Canva en PDF (Partager → Télécharger → PDF standard)</li>
            <li>Glissez le fichier dans la zone correspondante (Midi ou Soir)</li>
            <li>Le site se met à jour instantanément — vos clients voient la nouvelle carte immédiatement</li>
          </ol>
        </div>

        <a href="/" style={{ display: "inline-block", marginTop: 24, color: MU, fontSize: 12, textDecoration: "none" }}>← Retour au site</a>
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;600;700&display=swap');
      `}</style>
    </div>
  );
}