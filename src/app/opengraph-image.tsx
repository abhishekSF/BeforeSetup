import { ImageResponse } from "next/og";

export const alt = "BeforeSetup — the five minutes before you touch Setup";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #1e2a5e 0%, #4a5fc1 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.15)",
              border: "3px solid rgba(255,255,255,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              fontWeight: 700,
            }}
          >
            B
          </div>
          <div style={{ fontSize: "44px", fontWeight: 700 }}>BeforeSetup</div>
        </div>
        <div
          style={{
            fontSize: "68px",
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-1px",
            maxWidth: "950px",
          }}
        >
          The five minutes before you touch Setup
        </div>
        <div
          style={{
            marginTop: "28px",
            fontSize: "30px",
            color: "rgba(255,255,255,0.85)",
            maxWidth: "900px",
            lineHeight: 1.4,
          }}
        >
          A field guide to the Salesforce platform — mental models, decisions,
          and pitfalls. Free, no sign-up.
        </div>
      </div>
    ),
    size
  );
}
