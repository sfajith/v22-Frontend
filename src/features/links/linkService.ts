import { Link } from "../links/linkTypes";
export type LinkType = Link;

export type LinkPayload = {
  token?: string | null;
  link: {
    originalUrl: string;
    userCode?: string;
  };
};

export async function newLink(payload: LinkPayload): Promise<LinkType> {
  const response = await fetch("http://localhost:3000/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(payload.token && { Authorization: `Bearer ${payload.token}` }),
    },
    body: JSON.stringify(payload.link),
  });
  if (!response.ok) {
    throw new Error("Error al acortar enlace");
  }
  const data = await response.json();
  return data;
}
