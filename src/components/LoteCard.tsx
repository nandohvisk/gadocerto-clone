// ./src/components/LoteCard.tsx
import Link from "next/link";

export type Lote = {
  id: string;
  titulo: string;
  categoria: string;
  raca: string;
  idadeMeses: number;
  pesoMedioKg: number;
  cabecas: number;
  municipio: string;
  uf: string;
  fotos: string[];
  whatsapp: string;
  precoLabel?: string;
  videoUrl?: string | null;
  badgeIcon?: string | null; // emoji/ícone escolhido no painel (ex.: "🐄", "🐂", "$", "coin")
};

export type LoteCardProps = {
  lote: Lote;
  primary?: string;     // cor do “ping”
  isLoggedIn?: boolean; // se true, mostra o preço
};

function resolveBadgeGlyph(badgeIcon?: string | null): string {
  const v = (badgeIcon || "").trim();
  if (v && v.length <= 4 && /[\p{Emoji}\$]/u.test(v)) return v;

  const map: Record<string, string> = {
    coin: "$",
    dolar: "$",
    dollar: "$",
    "$": "$",
    cow: "🐄",
    boi: "🐂",
    touro: "🐂",
    ox: "🐃",
    buffalo: "🦬",
  };
  if (map[v.toLowerCase()]) return map[v.toLowerCase()];
  return "🐄";
}

export default function LoteCard({
  lote,
  primary = "#111827",
  isLoggedIn = false,
}: LoteCardProps) {
  const waMsg = encodeURIComponent(
    `Olá! Tenho interesse no ${lote.titulo} (${lote.cabecas} cabeças).`
  );
  const waLink = `https://wa.me/${lote.whatsapp}?text=${waMsg}`;

  const firstPhoto = Array.isArray(lote.fotos) ? lote.fotos[0] : undefined;
  const glyph = resolveBadgeGlyph(lote.badgeIcon);

  const ctaGradient = `linear-gradient(135deg, ${primary}, ${primary}CC)`;

  return (
    <div className="relative border rounded-2xl flex flex-col bg-white shadow-sm hover:shadow-lg transition-shadow">
      {/* MÍDIA */}
      <div className="relative w-full h-48 rounded-t-2xl overflow-hidden">
        {lote.videoUrl ? (
          <video
            src={lote.videoUrl}
            muted
            loop
            playsInline
            autoPlay
            poster={firstPhoto || undefined}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : firstPhoto ? (
          <img
            src={firstPhoto}
            alt={lote.titulo}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 text-sm">
            Sem mídia
          </div>
        )}

        {/* BADGE */}
        <div className="absolute bottom-2 left-2">
          {isLoggedIn ? (
            // Logado: chip leve com preço
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 border shadow text-sm font-semibold text-gray-900">
              <span className="text-[18px]">🐄</span>
              <span>{lote.precoLabel ?? "Preço sob consulta"}</span>
            </div>
          ) : (
            // Não logado: apenas o emoji com ondulação; tooltip LATERAL no hover (BOTÃO primeiro)
            <div className="group relative inline-flex items-center">
              {/* Onda (ping) atrás do emoji */}
              <span
                className="absolute -left-1 -top-1 h-8 w-8 rounded-full animate-ping opacity-35"
                style={{ background: primary, filter: "blur(0.4px)" }}
                aria-hidden
              />
              {/* EMOJI — sem círculo branco */}
              <a
                href="/login"
                className="relative z-[1] text-[22px] leading-none select-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]"
                aria-label="Faça login para ver o preço"
                title="Faça login para ver o preço"
              >
                {glyph}
              </a>

              {/* Tooltip lateral: ORDEM trocada → botão primeiro, texto depois */}
              <div className="hidden group-hover:flex items-center gap-3 ml-3">
                <a
                  href="/login"
                  className="pointer-events-auto rounded-full px-3 py-1 text-sm font-semibold text-white shadow hover:shadow-md transition-shadow"
                  style={{ background: ctaGradient }}
                >
                  Fazer login
                </a>
                <span className="text-white/95 text-[13px] font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.65)] whitespace-nowrap">
                  Faça login para ver o preço
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900">{lote.titulo}</h3>

        <p className="text-sm text-gray-600">
          {lote.categoria} • {lote.raca}
        </p>
        <p className="text-sm text-gray-600">
          {lote.cabecas} cabeças • {lote.pesoMedioKg} kg médios
        </p>
        <p className="text-sm text-gray-600">
          {lote.municipio}/{lote.uf}
        </p>

        <div className="mt-auto flex gap-2 pt-3">
          <Link
            href={`/lotes/${lote.id}`}
            className="flex-1 text-center rounded-xl border px-3 py-2 hover:bg-gray-50 text-sm transition-colors"
            style={{ borderColor: "#E5E7EB" }}
          >
            Detalhes
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center rounded-xl px-3 py-2 text-white text-sm shadow hover:shadow-md transition-shadow"
            style={{ background: ctaGradient }}
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
