---
name: Shader preview fallback
description: Environment-specific behavior for WebGL-based visual components in the B2BVoice preview.
---

WebGL-based visual components can throw a runtime error in the Replit preview browser even when the package typechecks correctly. Detect WebGL support before mounting the shader and render a visually similar CSS gradient fallback when it is unavailable.

**Why:** The preview environment may not expose WebGL, and an uncaught shader mount error can replace the entire app with the Vite runtime error overlay.

**How to apply:** Keep the shader dependency and component available for capable browsers, but guard its render path with a browser-side WebGL capability check and ensure the fallback preserves the intended visual tone.