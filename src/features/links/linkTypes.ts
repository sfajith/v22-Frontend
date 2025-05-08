export interface Link {
  idLink: string;
  originalUrl: string;
  shorter: string;
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
