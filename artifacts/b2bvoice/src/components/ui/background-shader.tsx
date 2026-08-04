import { MeshGradient } from "@paper-design/shaders-react";

function supportsWebGL() {
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

export default function BackgroundShader() {
  if (!supportsWebGL()) {
    return (
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-45"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(186, 230, 253, 0.85), transparent 42%), radial-gradient(circle at 80% 30%, rgba(191, 219, 254, 0.8), transparent 44%), linear-gradient(135deg, #f8fbff 0%, #e7f1fb 48%, #f5fbff 100%)",
        }}
      />
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-35">
      <MeshGradient
        style={{ width: "100%", height: "100%" }}
        distortion={0.55}
        swirl={0.08}
        offsetX={0}
        offsetY={0}
        scale={1}
        rotation={0}
        speed={0.35}
        colors={[
          "hsl(205, 80%, 94%)",
          "hsl(215, 75%, 90%)",
          "hsl(190, 72%, 94%)",
          "hsl(225, 65%, 96%)",
        ]}
      />
    </div>
  );
}