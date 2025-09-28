// src/components/Navbar.tsx
import Link from "next/link"; // para criar links entre páginas

// export default = deixa este componente "usável" em outros lugares
export default function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <Link href="/">Home</Link> |{" "}
      <Link href="/lotes">Lotes</Link> |{" "}
      <Link href="/contato">Contato</Link>
    </nav>
  );
}
