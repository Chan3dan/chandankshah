import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Chandan Kumar Shah — Digital Services & Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #0f172a 0%, #111827 42%, #1d4ed8 100%)",
          color: "white",
          padding: "56px 64px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              maxWidth: 760,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 28,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#93c5fd",
              }}
            >
              Digital Services • Nepal
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 86,
                lineHeight: 1,
                fontWeight: 700,
              }}
            >
              Chandan Kumar Shah
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 34,
                lineHeight: 1.35,
                color: "#dbeafe",
              }}
            >
              Documentation, Loksewa support, DEMAT setup, and polished web
              development.
            </div>
          </div>

          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: 9999,
              border: "8px solid rgba(255,255,255,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(15,23,42,0.45)",
              fontSize: 68,
              fontWeight: 800,
            }}
          >
            CKS
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "#bfdbfe",
          }}
        >
          <div style={{ display: "flex" }}>
            Clear process • Fast follow-up • Modern delivery
          </div>
          <div style={{ display: "flex", fontWeight: 700 }}>
            chandankshah.com.np
          </div>
        </div>
      </div>
    ),
    size,
  );
}
