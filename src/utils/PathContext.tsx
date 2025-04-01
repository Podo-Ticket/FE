import React, { createContext, useState, useContext } from "react";

interface PathContextType {
  prevPath: string;
  setPrevPath: (path: string) => void;
}

const PathContext = createContext<PathContextType | undefined>(undefined);

export const PathProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [prevPath, setPrevPath] = useState("/home"); // 초기 prevPath 값

  return (
    <PathContext.Provider value={{ prevPath, setPrevPath }}>
      {children}
    </PathContext.Provider>
  );
};

export const usePath = (): PathContextType => {
  const context = useContext(PathContext);
  if (!context) throw new Error("usePath must be used within a PathProvider");
  return context;
};
