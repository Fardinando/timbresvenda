"use client";

import Shell from "@/components/Shell";
import Link from "next/link";

export default function Home() {
  return (
    <Shell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 sm:pt-32">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
              Timbres profissionais para AudioEvolution
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Soundfonts de{" "}
              <span className="gradient-text">qualidade studio</span>
              <br />
              para suas produções
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
              Coleção premium de timbres e soundfonts otimizados para
              AudioEvolution. Compre, ative com um código e baixe
              instantaneamente.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/produtos"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-background transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Ver Produtos
              </Link>
              <Link
                href="/ativar"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-border px-8 text-sm font-semibold text-muted transition-all hover:border-primary/40 hover:text-primary"
              >
                Já tenho um código
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface/50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Como funciona
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-muted">
            Três passos simples para começar a usar seus timbres
          </p>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Compre",
                desc: "Adquira seu pacote de timbres pelo Mercado Livre. Pagamento seguro via Mercado Pago.",
                icon: (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Ative",
                desc: "Receba seu código de ativação. Crie sua conta no site e ative o produto.",
                icon: (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Baixe",
                desc: "Acesse seus produtos a qualquer momento. Faça login em qualquer dispositivo e baixe novamente.",
                icon: (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/20 hover:glow-primary"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  {item.icon}
                </div>
                <div className="mb-2 text-xs font-bold uppercase tracking-widest text-primary/60">
                  Passo {item.step}
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Por que escolher nossos timbres?
          </h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Qualidade Studio",
                desc: "Samples录制 em estúdio com equipamentos de alta fidelidade.",
              },
              {
                title: "Formato SF2",
                desc: "Compatível diretamente com AudioEvolution Mobile e outros DAWs.",
              },
              {
                title: "Download Instantâneo",
                desc: "Ative o código e baixe imediatamente. Sem espera.",
              },
              {
                title: "Re-download Gratuito",
                desc: "Sua conta mantém seus produtos. Baixe novamente quando quiser.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-card/50 p-6 transition-all hover:border-primary/20"
              >
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Pronto para começar?
          </h2>
          <p className="mt-3 text-muted">
            Escolha seu pacote de timbres e eleve suas produções a outro nível.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/produtos"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-background transition-all hover:bg-primary-hover"
            >
              Ver Produtos
            </Link>
            <Link
              href="/ativar"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-border px-8 text-sm font-semibold text-muted transition-all hover:border-primary/40 hover:text-primary"
            >
              Ativar Código
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
