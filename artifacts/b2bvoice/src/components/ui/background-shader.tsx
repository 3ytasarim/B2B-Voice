import { lazy, Suspense, useEffect, useState } from "react";

// The animated WebGL mesh gradient is purely decorative (35% opacity behind a
// card). It costs a GPU context, a shader compile and a render loop, so it is:
//  - only used on large screens (>= 1024px) with a GPU and no reduced-motion
//    preference; phones/tablets get the static gradient below, and
//  - code-split, so its ~25 KB never ships to the devices that don't use it.
const MeshGradient = lazy(() =>
  import("@paper-design/shaders-react").then((m) => ({ default: m.MeshGradient })),
);

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

function wantsShader() {
  if (typeof window === "undefined") return false;
  if (!window.matchMedia("(min-width: 1024px)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return supportsWebGL();
}

function StaticGradient() {
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

export default function BackgroundShader() {
  // Decided after mount so the server-rendered HTML (no WebGL) and the first
  // client render match; the shader replaces the gradient right afterwards.
  const [webgl, setWebgl] = useState(false);
  useEffect(() => setWebgl(wantsShader()), []);

  if (!webgl) return <StaticGradient />;

  return (
    <Suspense fallback={<StaticGradient />}>
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
    </Suspense>
  );
}
