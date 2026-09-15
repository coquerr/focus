"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

interface SheetContextValue {
  isSheetOpen: boolean;
  registerOpen: (id: string) => void;
  registerClose: (id: string) => void;
}

const SheetContext = createContext<SheetContextValue | null>(null);

export function SheetProvider({ children }: { children: ReactNode }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const openIds = useRef<Set<string>>(new Set());

  const registerOpen = useCallback((id: string) => {
    openIds.current.add(id);
    setIsSheetOpen(true);
  }, []);

  const registerClose = useCallback((id: string) => {
    openIds.current.delete(id);
    setIsSheetOpen(openIds.current.size > 0);
  }, []);

  return (
    <SheetContext.Provider value={{ isSheetOpen, registerOpen, registerClose }}>
      {children}
    </SheetContext.Provider>
  );
}

export function useSheetContext() {
  const ctx = useContext(SheetContext);
  if (!ctx) {
    throw new Error("useSheetContext must be used within SheetProvider");
  }
  return ctx;
}