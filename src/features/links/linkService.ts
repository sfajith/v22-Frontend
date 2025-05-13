import { Link } from "../links/linkTypes";
type LinkType = Link;
type LinkErrorType = { error: string };
type LinkPayload = {
  token?: string | null;
  link: {
    originalUrl: string;
    userCode?: string;
  };
};

export async function newLink(payload: LinkPayload) {
  const response = await fetch("http://localhost:3000/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(payload.token && { Authorization: `Bearer ${payload.token}` }),
    },
    body: JSON.stringify(payload.link),
  });
  const data: LinkType | LinkErrorType = await response.json();
  if (!response.ok) {
    const err = data as LinkErrorType;
    throw new Error(err.error || "Error al acortar enlace");
  }
  return data as LinkType;
}
