"use client";
import { createContext } from "react";
import { useData } from "../hooks";

export const DataContext = createContext({});

export function DataProvider(props) {
  const data = useData();
  return <DataContext.Provider {...props} value={data} />;
}
