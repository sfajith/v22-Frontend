export interface Link {
  idLink: string;
  originalUrl: string;
  shorter: string;
<<<<<<< HEAD
=======
  clickHistory: { ip: string; date: Date }[];
>>>>>>> aa0308a (estadisticas de enlaces funcionando)
  clicks: number;
  visitors: number;
  date: string;
}

export interface LinkState {
  link: Link[];
  loading: boolean;
  generated: boolean;
  error: string | null;
}
