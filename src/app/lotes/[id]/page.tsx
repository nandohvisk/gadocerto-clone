// F:\gadocerto-clone\gadocerto-clone\src\app\lotes\[id]\page.tsx
import { sanityClient } from "@/sanity/lib/client";
import { LOTE_BY_ID_QUERY } from "@/sanity/lib/queries";
import LoteGallery from "@/components/LoteGallery";
import OpenLoginButton from "@/components/OpenLoginButton";
import LoteCard from "@/components/LoteCard";
import Link from "next/link";

/* Ícones das “tags” */
const IconHeads = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path fill="currentColor" d="M16 11a4 4 0 1 0-3.446-6.03A4 4 0 1 0 8 11c-2.21 0-4 1.79-4 4v1h16v-1c0-2.21-1.79-4-4-4Z" />
  </svg>
);
const IconCategory = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path fill="currentColor" d="M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm10 0h8v8h-8v-8Z" />
  </svg>
);
const IconWeight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path fill="currentColor" d="M5 20h14l-2-12H7L5 20Zm8-10v2h-2v-2h2Zm-2 4h2v2h-2v-2Z" />
  </svg>
);
const IconLocal = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
  </svg>
);

type Lote = {
  _id: string;
  titulo: string;
  categoria?: string;
  raca?: string;
  idadeMeses?: number;
  pesoMedioKg?: number;
  cabecas?: number;
  municipio?: string;
  uf?: string;
  fotos?: string[];
  videoUrl?: string | null;
  whatsapp?: string;
  precoLabel?: string;
  emoji?: string;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LotePage({ params }: { params: { id: string } }) {
  const { id } = params;

  // 1) Lote atual
  const lote = (await sanityClient.fetch(LOTE_BY_ID_QUERY, { id })) as Lote | null;

  if (!lote) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-2xl font-bold">Lote não encontrado</h1>
        <p className="mt-2 text-sm text-gray-600">
          Verifique o código do lote ou volte para a página de listagem.
        </p>
      </main>
    );
  }

  // TODO: troque por sua checagem real de sessão/usuário
  const isLoggedIn = false;

  const chips = [
    { key: "cabecas", icon: <IconHeads />, label: `${lote.cabecas ?? 0} cabeças` },
    { key: "categoria", icon: <IconCategory />, label: lote.categoria ?? "-" },
    {
      key: "peso",
      icon: <IconWeight />,
      label:
        typeof lote.pesoMedioKg === "number" && lote.pesoMedioKg > 0
          ? `${lote.pesoMedioKg} kg médios`
          : "Peso não informado",
    },
    {
      key: "local",
      icon: <IconLocal />,
      label:
        lote.municipio || lote.uf
          ? `${(lote.municipio ?? "").toLowerCase()} / ${(lote.uf ?? "").toUpperCase()}`
          : "Local não informado",
    },
  ];

  const whatsHref = lote.whatsapp ? `https://wa.me/${lote.whatsapp.replace(/\D/g, "")}` : null;

  // 2) Lotes da mesma região (município ou UF), excluindo o próprio
  const RELATED_QUERY = /* groq */ `
*[_type == "lote" && _id != $id && (
  (defined($mun) && lower(municipio) match $mun) ||
  (defined($uf) && lower(uf) match $uf)
)]
| order(_createdAt desc)[0...6]{
  _id,
  titulo,
  raca,
  idadeMeses,
  pesoMedioKg,
  cabecas,
  municipio,
  uf,
  "fotos": fotos[].asset->url,
  // vídeo primeiro upload depois link, com fallbacks
  "videoUrl": coalesce(
    videosArquivo[0].asset->url,
    videosUrl[0],
    video.asset->url
  ),
  // categoria normalizada
  "categoria": coalesce(categoriaRef->label, categoriaRef->title, categoria),
  whatsapp,
  precoLabel,
  badgeIcon,
  emoji
}
  `;

  const related = (await sanityClient.fetch(RELATED_QUERY, {
    id,
    mun: lote.municipio ? `${String(lote.municipio).toLowerCase()}*` : null,
    uf: lote.uf ? `${String(lote.uf).toLowerCase()}*` : null,
  })) as any[];

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-2 text-sm text-emerald-700">
        <Link href="/lotes" className="hover:underline">Lotes</Link> /{" "}
        <span className="text-gray-800">{lote.titulo || "Lote"}</span>
      </div>

      <h1 className="h-section">{lote.titulo || "Lote"}</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Galeria + Tags */}
        <div className="lg:col-span-7">
          <LoteGallery
            titulo={lote.titulo}
            fotos={lote.fotos ?? []}
            videoUrl={lote.videoUrl ?? undefined}
          />

          {/* TAGS — uma única fileira com wrap (lado a lado) */}
          <div className="mt-4 flex flex-wrap gap-3">
            {chips.map((c) => (
              <div
                key={c.key}
                className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gray-100">
                  {c.icon}
                </span>
                <span className="font-medium text-gray-800">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Preço + dados + botões */}
        <aside className="lg:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            {/* PREÇO — só para logado */}
            <div className="mb-4">
              {isLoggedIn ? (
                <div className="rounded-xl bg-amber-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                    Preço
                  </div>
                  <div className="mt-1 text-2xl font-bold text-amber-800">
                    {lote.precoLabel ?? "—"}
                  </div>
                </div>
              ) : (
                // pill de texto igual aos cards: “Faça login para ver o preço.”
                <div className="rounded-xl border border-dashed p-4 text-sm text-gray-700">
                  Faça{" "}
                  <OpenLoginButton className="underline text-emerald-700 hover:opacity-80">
                    login
                  </OpenLoginButton>{" "}
                  para ver o preço.
                </div>
              )}
            </div>

            {/* Dados sempre visíveis */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-500">Categoria</div>
                <div className="font-semibold text-gray-900">{lote.categoria ?? "-"}</div>
              </div>
              <div>
                <div className="text-gray-500">Raça</div>
                <div className="font-semibold text-gray-900">{lote.raca ?? "-"}</div>
              </div>
              <div>
                <div className="text-gray-500">Idade (meses)</div>
                <div className="font-semibold text-gray-900">{lote.idadeMeses ?? "-"}</div>
              </div>
              <div>
                <div className="text-gray-500">Peso médio (kg)</div>
                <div className="font-semibold text-gray-900">{lote.pesoMedioKg ?? "-"}</div>
              </div>
              <div>
                <div className="text-gray-500">Cabeças</div>
                <div className="font-semibold text-gray-900">{lote.cabecas ?? "-"}</div>
              </div>
              <div>
                <div className="text-gray-500">Local</div>
                <div className="font-semibold text-gray-900">
                  {(lote.municipio || "-") + " / " + (lote.uf?.toUpperCase() || "-")}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-500">WhatsApp</div>
                <div className="font-semibold text-gray-900">{lote.whatsapp || "-"}</div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {whatsHref ? (
                <a
                  href={whatsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-700 px-4 font-semibold text-white transition hover:bg-emerald-800"
                >
                  Falar no WhatsApp
                </a>
              ) : (
                <span className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-200 px-4 font-semibold text-gray-600">
                  Sem WhatsApp
                </span>
              )}

              <Link
                href="/lotes"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-amber-500 px-4 font-semibold text-emerald-900 transition hover:bg-amber-600"
              >
                Ver outros lotes
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Mapa */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900">Localização</h2>
        <div className="mt-3 overflow-hidden rounded-2xl border">
          <iframe
            title="Mapa"
            className="h-[420px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              `${lote.municipio ?? ""} ${lote.uf ?? ""}`
            )}&output=embed`}
          />
        </div>

        <div className="mt-3 flex justify-end">
          <a
            className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-amber-600"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${lote.municipio ?? ""} ${lote.uf ?? ""}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir no Google Maps
          </a>
        </div>
      </section>

      {/* Lotes da mesma região */}
      {Array.isArray(related) && related.length > 0 && (
        <section className="mt-12">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Lotes na mesma região
            </h2>
            <Link
              href={`/lotes?uf=${encodeURIComponent(lote.uf ?? "")}`}
              className="text-sm font-medium text-emerald-700 hover:underline"
            >
              Ver todos na região
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r: any) => (
              <LoteCard
                key={r._id}
                isLoggedIn={false}
                primary="var(--agro-wheat)"
                lote={{
                  id: r._id,
                  titulo: r.titulo ?? "Lote",
                  categoria: r.categoria ?? "",
                  raca: r.raca ?? "",
                  idadeMeses: r.idadeMeses ?? 0,
                  pesoMedioKg: r.pesoMedioKg ?? 0,
                  cabecas: r.cabecas ?? 0,
                  municipio: r.municipio ?? "",
                  uf: r.uf ?? "",
                  fotos: Array.isArray(r.fotos) ? r.fotos.filter(Boolean) : [],
                  videoUrl: r.videoUrl ?? undefined,
                  whatsapp: r.whatsapp ?? "",
                  precoLabel: r.precoLabel ?? undefined,
                  emoji: r.emoji || r.badgeIcon || "🐮",
                }}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
