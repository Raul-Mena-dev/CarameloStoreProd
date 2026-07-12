"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({ unauthorized = false }: { unauthorized?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState(
    unauthorized ? "Acceso no autorizado" : "",
  );
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    );
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });

    if (loginError) {
      setError("Correo o contraseña incorrectos");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card w-full max-w-md space-y-5 p-8">
      <p className="font-black uppercase tracking-widest text-cherry">
        Administración
      </p>
      <h1 className="text-4xl font-black">Iniciar sesión</h1>
      <label>
        <span className="label">Correo</span>
        <input
          required
          autoComplete="email"
          className="field"
          name="email"
          type="email"
        />
      </label>
      <label>
        <span className="label">Contraseña</span>
        <input
          required
          autoComplete="current-password"
          className="field"
          name="password"
          type="password"
        />
      </label>
      {error && (
        <p role="alert" className="text-sm font-bold text-cherry">
          {error}
        </p>
      )}
      <button disabled={loading} className="btn-primary w-full">
        {loading ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
