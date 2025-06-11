import { Transition, Variants } from "framer-motion";

export const formVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};
export const animationConfig: Transition = { duration: 0.3 };
