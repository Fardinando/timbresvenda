export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
              <span className="text-lg font-bold">
                Timbres<span className="text-primary">Venda</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              SoundFonts e timbres profissionais para AudioEvolution. Qualidade
              studio em suas produções.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Links
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="/produtos"
                  className="text-sm text-muted transition-colors hover:text-primary"
                >
                  Produtos
                </a>
              </li>
              <li>
                <a
                  href="/ativar"
                  className="text-sm text-muted transition-colors hover:text-primary"
                >
                  Ativar Código
                </a>
              </li>
              <li>
                <a
                  href="/meus-produtos"
                  className="text-sm text-muted transition-colors hover:text-primary"
                >
                  Meus Produtos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Suporte
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="text-sm text-muted">
                  Suporte via Mercado Livre
                </span>
              </li>
              <li>
                <span className="text-sm text-muted">
                  Pagamentos via Mercado Pago
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} TimbresVenda. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
