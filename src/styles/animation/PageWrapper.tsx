import React from 'react';
import { motion } from 'framer-motion';

interface PageWrapperProps {
  children: React.ReactNode;
  slideDirection?: "left" | "right"; // 슬라이드 방향 설정
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children = "left" }) => {
  const pageVariants = {
    initial: { x: "100vw", opacity: 0 }, // Start off-screen to the right
    animate: { x: 0, opacity: 1 }, // Move to the center of the screen
    exit: { x: "-100vw", opacity: 0 }, // Exit off-screen to the left
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
