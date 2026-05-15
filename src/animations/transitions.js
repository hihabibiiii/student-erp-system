export const pageTransition = {
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } }
};

export const cardHover = {
  whileHover: { y: -3, scale: 1.006 },
  transition: { type: "spring", stiffness: 260, damping: 24 }
};
