import { Link } from "../links/linkTypes";
export interface User {
  id: string;
  username: string;
  email: string;
  statistics: { totalClicks: number; totalVisitors: number };
  LinkActivity: { link: string; date: Date }[];
  clickAnalitycs: { ip: string; date: Date }[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  accessToken: string | null;
  collection: {
    totalCount: number;
    nextCursor: string | null;
    isLoading: boolean;
    error: string | null;
    userLinks: Link[];
  };
  error: string | null;
  success: string | null;
}
