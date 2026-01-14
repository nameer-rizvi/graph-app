import { useState, useEffect } from "react";
import simpul from "simpul";

export function useCSR() {
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (simpul.support.window) setRender(true);
  }, []);

  return { render };
}
