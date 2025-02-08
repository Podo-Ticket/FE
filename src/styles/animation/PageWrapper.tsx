import React from 'react';
import { motion } from 'framer-motion';

interface PageWrapperProps {
  children: React.ReactNode;
  slideDirection?: "left" | "right"; // 슬라이드 방향 설정
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, slideDirection = "left" }) => {
  const pageVariants = {
    initial: { x: slideDirection === "left" ? "100vw" : "-100vw", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: slideDirection === "left" ? "-100vw" : "100vw", opacity: 0 },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
