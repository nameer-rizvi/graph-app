import simpul from "simpul";

export function changeFavicon(newFavicon) {
  if (simpul.isEnvDocument) {
    let link = document.querySelector('link[rel="icon"]');

    if (!link) {
      link = document.createElement("link");

      link.rel = "icon";

      document.head.appendChild(link);
    }

    link.href = `/${newFavicon}.ico`;
  }
}
