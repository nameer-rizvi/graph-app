import simpul from "simpul";
import { useState } from "react";
import { useRouter } from "next/router";

export function useLocalStorage(key, defaultValue, option = {}) {
  if (simpul.support.window) {
    const query = new URLSearchParams(window.location.search);

    const param = option.isParam && query.get(key);

    const store = JSON.parse(localStorage.getItem(key));

    const initialValue = param || store || defaultValue;

    const [value, setValue] = useState(initialValue);

    const router = useRouter();

    function update(newValue) {
      if (option.isParam) {
        query.set(key, newValue);

        router.push([window.location.pathname, query].join("?"), undefined, {
          shallow: true,
        });
      }

      localStorage.setItem(key, JSON.stringify(newValue));

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

  return {};
}
