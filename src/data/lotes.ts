// src/data/lotes.ts
export type Lote = {
    id: string;
    titulo: string;
    categoria: 'Bezerros' | 'Bezerras' | 'Novilhas' | 'Vacas' | 'Touros';
    raca: string;
    idadeMeses: number;
    pesoMedioKg: number;
    cabecas: number;
    municipio: string;
    uf: string;
    fotos: string[];
    whatsapp: string; // DDI+DDD+número, ex.: 5565999999999
  };
  
  export const LOTES: Lote[] = [
    {
      id: 'l1',
      titulo: 'Bezerros Nelore — lote 45',
      categoria: 'Bezerros',
      raca: 'Nelore',
      idadeMeses: 10,
      pesoMedioKg: 210,
      cabecas: 45,
      municipio: 'Cáceres',
      uf: 'MT',
      fotos: ['https://images.unsplash.com/photo-1516570161787-2fd917215a3d'],
      whatsapp: '5565999999999',
    },
    {
      id: 'l2',
      titulo: 'Novilhas Angus — lote 28',
      categoria: 'Novilhas',
      raca: 'Angus',
      idadeMeses: 18,
      pesoMedioKg: 320,
      cabecas: 28,
      municipio: 'Cuiabá',
      uf: 'MT',
      fotos: ['https://images.unsplash.com/photo-1545464333-9efce8821470'],
      whatsapp: '5565999999999',
    },
    {
      id: 'l3',
      titulo: 'Vacas prenhes — lote 30',
      categoria: 'Vacas',
      raca: 'Nelore',
      idadeMeses: 48,
      pesoMedioKg: 430,
      cabecas: 30,
      municipio: 'Rondonópolis',
      uf: 'MT',
      fotos: ['https://images.unsplash.com/photo-1558877386-243b1b9e5b66'],
      whatsapp: '5565999999999',
    },
  ];
  