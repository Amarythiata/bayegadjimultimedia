import { ImageResponse } from "next/og";

// iOS n'accepte pas le SVG pour l'icône d'écran d'accueil : on génère un PNG.
// 180×180 est la taille attendue par les appareils Apple récents.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Fond plein : iOS applique lui-même son masque arrondi, inutile
          // d'arrondir les angles ici — ils seraient rognés deux fois.
          background: "#d99a2b",
          color: "#0a2318",
          fontSize: 78,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        AL
      </div>
    ),
    size,
  );
}
