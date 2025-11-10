"use client";

import React, { createContext, useContext, useState } from "react";

interface EditorStateContextType {
  isReadOnly: boolean;
  isLocked: boolean;
  setIsReadOnly: (value: boolean) => void;
  setIsLocked: (value: boolean) => void;
}

const EditorStateContext = createContext<EditorStateContextType | undefined>(
  undefined,
);

export function EditorStateProvider({
  children,
  initialReadOnly = false,
  initialLocked = false,
}: {
  children: React.ReactNode;
  initialReadOnly?: boolean;
  initialLocked?: boolean;
}) {
  const [isReadOnly, setIsReadOnly] = useState(initialReadOnly);
  const [isLocked, setIsLocked] = useState(initialLocked);

  return (
    <EditorStateContext.Provider
      value={{ isReadOnly, isLocked, setIsReadOnly, setIsLocked }}
    >
      {children}
    </EditorStateContext.Provider>
  );
}

export function useEditorState() {
  const context = useContext(EditorStateContext);
  if (!context) {
    throw new Error("useEditorState must be used within EditorStateProvider");
  }
  return context;
}
