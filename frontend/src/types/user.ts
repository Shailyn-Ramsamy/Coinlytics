export type GoogleUser = {
  email: string;
  name?: string;
  picture?: string;
  sub: string;
};

export type AppUser = {
  id: number;
  email: string;
  name?: string;
  picture?: string;
  created_at: string;
};