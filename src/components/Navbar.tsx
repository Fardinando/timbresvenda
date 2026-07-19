"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  email: string;
  nome: string;
  isAdmin: boolean;
}

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then(setUser)
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  const navLinks = [
    { href: "/produtos", label: "Catálogo" },
    { href: "/ativar", label: "Ativar Código" },
  ];

  if (user) {
    navLinks.push({ href: "/meus-produtos", label: "Meus Produtos" });
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-2xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-background shadow-md shadow-primary/20">
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight">
              Timbres<span className="text-primary">Venda</span>
            </span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:text-foreground hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                  {user.email[0].toUpperCase()}
                </div>
                <span className="text-[13px] text-muted max-w-[120px] truncate">{user.email}</span>
                {user.isAdmin && (
                  <Link
                    href="/admin"
                    className="rounded-lg border border-border px-2.5 py-1 text-[11px] font-medium text-muted transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="rounded-lg px-2.5 py-1 text-[11px] font-medium text-muted transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted transition-colors hover:text-foreground"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="rounded-lg bg-primary px-4 py-1.5 text-[13px] font-bold text-background shadow-sm shadow-primary/20 transition-colors hover:bg-primary-hover"
                >
                  Criar Conta
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-1.5 text-muted hover:bg-white/5 md:hidden"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-border py-3 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:text-foreground hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-border pt-2">
              {user ? (
                <div className="space-y-2 px-3">
                  <p className="text-sm text-muted">{user.email}</p>
                  {user.isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="block text-sm text-primary"
                    >
                      Painel Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-sm text-muted hover:text-foreground"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 px-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/cadastro"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg bg-primary px-4 py-1.5 text-sm font-bold text-background"
                  >
                    Criar Conta
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
