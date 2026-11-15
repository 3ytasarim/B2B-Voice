// Framer Motion's animation/gesture/layout features, split out of the entry
// bundle: components use the tiny `m` component and the features arrive right
// after hydration (see <LazyMotion> in App.tsx).
import { domMax } from "framer-motion";

export default domMax;
