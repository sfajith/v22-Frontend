import { Link } from "../links/linkTypes";
import instance from "../../lib/axiosInstance";
type LinkType = Link;
type LinkErrorType = { error: string };
type LinkPayload = {
  token?: string | null;
  link: {
    originalUrl: string;
    userCode?: string;
  };
};

/* export async function newLink(payload: LinkPayload) {
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
} */

export async function newLink(payload: LinkPayload): Promise<LinkType> {
  try {
    const response = await instance.post<LinkType>("/new", payload.link);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error || "Error al acortar enlace";
    throw new Error(message);
  }
}

//validacion en tiempo real del usercode

type livePayload = {
  usercode: string;
};

type livePayloadSuccess = {
  success: string;
};

type livePayloadError = {
  error: string;
};

export async function liveCheckCode(payload: livePayload) {
  const response = await fetch("http://localhost:3000/live-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userCode: payload.usercode }),
  });
  const data: livePayloadSuccess | livePayloadError = await response.json();
  if (!response.ok) {
    const err = data as livePayloadError;
    throw new Error(err.error || "Codigo no disponible");
  }
  return data as livePayloadSuccess;
}
