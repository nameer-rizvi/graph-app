import { useState, useEffect } from "react";
import { support } from "simpul";

export function useCSR() {
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (support.window()) setRender(true);
  }, []);

  return { render };
}
