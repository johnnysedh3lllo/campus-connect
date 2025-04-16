import { AnimatePresence, motion, Transition, Variants } from "framer-motion";

type AnimatedWrapperProps = {
  count?: number;
  children: React.ReactNode;
  variants: Variants;
  transition: Transition;
  classes?: string;
};

export function AnimationWrapper({
  count,
  children,
  variants,
  transition,
  classes,
}: AnimatedWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={count ?? ""}
        className={classes}
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
