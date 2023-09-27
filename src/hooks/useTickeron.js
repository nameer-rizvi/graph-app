import { useState, useEffect } from "react";

export function useTickeron(symbol) {
  const [state, setState] = useState();

  useEffect(() => {
    if (symbol?.length && state?.symbol !== symbol) {
      fetch(`/api/tickeron?symbol=${symbol}`)
        .then((res) => res.json())
        .then((json) => setState({ symbol, ...json }))
        .catch(console.error);
    }
  }, [symbol]);

  return state;
}
