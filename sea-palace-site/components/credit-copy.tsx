"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function CreditCopy() {
  const [english, setEnglish] = useState(false);

  useEffect(() => {
    const language = new URLSearchParams(window.location.search).get("lang");
    if (language !== "en") return;
    setEnglish(true);
    document.documentElement.lang = "en";
    document.title = "Photo credits · Sea Palace";
    return () => {
      document.documentElement.lang = "pt-PT";
    };
  }, []);

  return (
    <>
      <Link className="text-link" href="/">{english ? "Back to Sea Palace" : "Voltar ao Sea Palace"}</Link>
      <h1 className="mt-6 mb-2 text-3xl font-semibold">{english ? "Photo credits" : "Créditos de fotografia"}</h1>
    </>
  );
}
