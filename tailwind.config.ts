import type { Config } from "tailwindcss";
export default { content: ["./src/**/*.{ts,tsx}"], theme: { extend: { colors: { ink: "#371b12", cream: "#fff9ed", coral: "#f05d46", cherry: "#c92f4b", mint: "#bfe5cf", gold: "#f6bd4b" }, boxShadow: { candy: "0 14px 35px rgba(87,39,21,.12)" }, borderRadius: { candy: "1.75rem" } } }, plugins: [] } satisfies Config;
