import { useRouter } from "next/router";
import { useEffect } from "react";

function Custom404() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  });

  return null;
}

export default Custom404;
