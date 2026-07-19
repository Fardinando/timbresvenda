"use client";

import Shell from "@/components/Shell";
import Link from "next/link";

export default function Home() {
  return (
    <Shell>
      <section className="relative overflow-hidden mesh-gradient">
        <div className="hero-glow bg-primary" style={{ left: "20%", top: "-200px" }} />
        <div className="hero-glow bg-accent" style={{ right: "10%", top: "-100px" }} />

        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:pt-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-slide-up">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full trust-badge px-4 py-1.5 text-xs font-medium text-primary">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zm0 10a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 11zm9-5a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0119 6zM4 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 014 10zm12.07-6.07a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zM5.93 14.93a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0z" clipRule="evenodd" />
                </svg>
                +50 timbres profissionais disponíveis
              </div>

              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Soundfonts de{" "}
                <span className="gradient-text">qualidade studio</span>{" "}
                para suas produções
              </h1>

              <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
                Coleção premium de timbres e soundfonts otimizados para
                AudioEvolution Mobile. Compre, ative com um código e baixe
                instantaneamente.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/produtos"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-bold text-background shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Ver Catálogo
                </Link>
                <Link
                  href="/ativar"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 text-sm font-semibold text-muted transition-all hover:border-primary/30 hover:text-primary"
                >
                  Já tenho um código
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  Pagamento seguro
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  Download instantâneo
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  Re-download grátis
                </div>
              </div>
            </div>

            <div className="hidden lg:flex justify-center animate-slide-up stagger-2">
              <div className="relative w-80">
                <div className="rounded-3xl bg-card border border-border p-8 glow-primary-strong animate-float">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Piano Grand Collection</p>
                      <p className="text-xs text-muted">24 bit / 48kHz</p>
                    </div>
                  </div>
                  <div className="waveform mb-4">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="waveform-bar" />
                    ))}
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-primary/10 px-4 py-3">
                    <span className="text-2xl font-bold text-primary">R$ 49,90</span>
                    <span className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-background">
                      COMPRAR
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface/50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Como funciona
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              Do pagamento ao download em 3 passos simples
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Compre",
                desc: "Escolha seu pacote e pague com segurança via Mercado Pago ou Stripe.",
                color: "bg-primary/10 text-primary",
                icon: (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Ative",
                desc: "Receba seu código, crie uma conta e ative o produto em segundos.",
                color: "bg-accent/10 text-accent",
                icon: (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Baixe",
                desc: "Acesse seus timbres a qualquer momento. Faça login e baixe novamente.",
                color: "bg-success/10 text-success",
                icon: (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative rounded-2xl card-gradient p-7 transition-all duration-300 hover:glow-primary"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
                  {item.icon}
                </div>
                <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
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

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Por que nossos timbres?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              Qualidade profissional acessível para todos os produtores
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-2.625 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125m1.5 3.75c-.621 0-1.125-.504-1.125-1.125" />
                  </svg>
                ),
                title: "Qualidade Studio",
                desc: "Samples gravados em estúdio com equipamentos de alta fidelidade.",
              },
              {
                icon: (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                ),
                title: "Formato SF2",
                desc: "Compatível com AudioEvolution Mobile e outros DAWs populares.",
              },
              {
                icon: (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                ),
                title: "Download Instantâneo",
                desc: "Ative o código e baixe imediatamente. Sem espera.",
              },
              {
                icon: (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                  </svg>
                ),
                title: "Re-download Gratuito",
                desc: "Sua conta mantém seus produtos. Baixe novamente quando quiser.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl card-gradient p-5 transition-all duration-300 hover:glow-primary"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {item.icon}
                </div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Perguntas frequentes
              </h2>
              <div className="mt-8 space-y-4">
                {[
                  {
                    q: "Como recebo o código de ativação?",
                    a: "Após a confirmação do pagamento, o código é enviado automaticamente pela mensagem do Mercado Livre ou exibido na tela de confirmação do site.",
                  },
                  {
                    q: "Posso usar em mais de um dispositivo?",
                    a: "Sim! Basta fazer login na sua conta em qualquer dispositivo e acessar Meus Produtos para baixar novamente.",
                  },
                  {
                    q: "Qual a qualidade dos arquivos?",
                    a: "Todos os timbres são gravados em estúdio com qualidade de 24 bits / 48kHz, otimizados para uso profissional.",
                  },
                  {
                    q: "Funciona com outros apps além do AudioEvolution?",
                    a: "Sim! O formato SF2 é amplamente suportado por DAWs como GarageBand, FL Studio, Cubase e outros.",
                  },
                ].map((item) => (
                  <div key={item.q} className="rounded-xl card-gradient p-5">
                    <p className="font-semibold">{item.q}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center lg:items-start">
              <div className="rounded-2xl card-gradient p-8 text-center glow-primary max-w-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Precisa de ajuda?</h3>
                <p className="mt-2 text-sm text-muted">
                  Nossa equipe está disponível via Mercado Livre para tirar suas dúvidas.
                </p>
                <Link
                  href="/produtos"
                  className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-background transition-colors hover:bg-primary-hover"
                >
                  Ver Produtos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface/50 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Pronto para produzir?
          </h2>
          <p className="mt-3 text-muted">
            Escolha seu pacote de timbres e eleve suas produções a outro nível.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/produtos"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-bold text-background shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Ver Catálogo
            </Link>
            <Link
              href="/ativar"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-card px-8 text-sm font-semibold text-muted transition-all hover:border-primary/30 hover:text-primary"
            >
              Já tenho um código
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
