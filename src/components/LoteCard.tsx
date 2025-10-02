import type { Lote } from "@/data/lotes";


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
};

export function LoteCard({ lote }: { lote: Lote }) {
  const waMsg = encodeURIComponent(`Olá! Tenho interesse no ${lote.titulo} (${lote.cabecas} cabeças).`);
  const waLink = `https://wa.me/${lote.whatsapp}?text=${waMsg}`;

  return (
    <div className="border rounded-2xl overflow-hidden flex flex-col">
      <img src={lote.fotos[0]} alt={lote.titulo} className="w-full h-44 object-cover" />
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold">{lote.titulo}</h3>
        <p className="text-sm text-gray-600">{lote.categoria} • {lote.raca}</p>
        <p className="text-sm text-gray-600">{lote.cabecas} cabeças • {lote.pesoMedioKg} kg médios</p>
        <p className="text-sm text-gray-600">{lote.municipio}/{lote.uf}</p>
        <div className="mt-auto flex gap-2 pt-3">
          <Link href={`/lotes/${lote.id}`} className="flex-1 text-center rounded-lg border px-3 py-2 hover:bg-gray-50 text-sm">
            Detalhes
          </Link>
          <a href={waLink} target="_blank" className="flex-1 text-center rounded-lg px-3 py-2 bg-black text-white text-sm hover:opacity-90">
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
