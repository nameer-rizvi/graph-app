import simpul from "simpul";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function useDataStore(key, defaultValue, option = {}) {
  let params, paramsValue, localStoreValue;

  if (simpul.isEnvWindowProperty("location")) {
    params = new URLSearchParams(window.location.search);

    paramsValue = params.get(key);
  }

  if (simpul.isEnvWindowProperty("localStorage")) {
    localStoreValue = JSON.parse(localStorage.getItem(key));
  }

  const initialValue = paramsValue || localStoreValue || defaultValue;

  const router = useRouter();

  const [value, setValue] = useState(initialValue);

  function update(newValue) {
    if (option.isParam === true) {
      params.set(key, newValue);

      const href = [window.location.pathname, params].join("?");

      router.push(href, undefined, { shallow: true });
    }

    try {
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (e) {
      console.error(e);
      localStorage.removeItem(key); // Reset state so stale data doesn't resurface.
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
