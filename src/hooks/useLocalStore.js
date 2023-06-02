import { support } from "simpul";
import { useState } from "react";

export function useLocalStore(KEY, DEFAULT_VALUE) {
  const INITIAL_VALUE =
    (support.window() && JSON.parse(localStorage.getItem(KEY))) ||
    DEFAULT_VALUE;

  const [value, setValue] = useState(INITIAL_VALUE);

  function update(NEW_VALUE) {
    if (support.window()) {
      localStorage.setItem(KEY, JSON.stringify(NEW_VALUE));
      setValue(NEW_VALUE);
    }
  }

  return {
    key: KEY,
    defaultValue: DEFAULT_VALUE,
    value,
    update,
    set: setValue,
  };
}
