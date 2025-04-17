import simpul from "simpul";
import { useState } from "react";
import { useRouter } from "next/router";

export function useLocalStorage(key, defaultValue, option = {}) {
  let query, param, store;

  if (simpul.support.inWindow("location")) {
    query = new URLSearchParams(window.location.search);

    param = option.isParam && query.get(key);

    store = JSON.parse(localStorage.getItem(key));
  }

  const initialValue = param || store || defaultValue;

  const [value, setValue] = useState(initialValue);

  const router = useRouter();

  function update(newValue) {
    if (simpul.support.inWindow("location")) {
      if (option.isParam) {
        query.set(key, newValue);
        router.push([window.location.pathname, query].join("?"), undefined, {
          shallow: true,
        });
      }
      localStorage.setItem(key, JSON.stringify(newValue));
    }
    setValue(newValue);
  }

  return {
    key,
    defaultValue,
    value,
    update,
    set: setValue,
  };
}
