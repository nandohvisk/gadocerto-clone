"use client";

import clsx from "clsx";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

/**
 * Botão para abrir o modal de login via CustomEvent("open-login-otp").
 * Estilizado no verde do site por padrão; pode receber className extra.
 */
export default function OpenLoginButton({ className, children }: Props) {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new CustomEvent("open-login-otp"));
      }}
      className={clsx(
        // padrão do botão verde do site
        "inline-flex h-11 items-center justify-center rounded-xl px-4 font-semibold text-white",
        "bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 transition",
        className
      )}
    >
      {children ?? "Fazer login"}
    </button>
  );
}
