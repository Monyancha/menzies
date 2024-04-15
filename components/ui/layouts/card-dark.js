import { isThemeDark } from "../../../lib/shared/ui-helpers";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

export default function CardDark({ children = null, className = null } = {}) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(isThemeDark({ path: router?.pathname }));

  useEffect(() => {
    setIsDark(isThemeDark({ path: router?.pathname }));
  }, [router]);

  return (
    <section
      className={`w-full
        ${isDark ? "bg-base-300" : "bg-base-100"}
      shadow rounded p-5 ${className}`}
    >
      {children}
    </section>
  );
}
