import { Link } from "../links/linkTypes";
export type LoginPayload = {
  email: string;
  password: string;
};

export type registerPayload = {
  username: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    statistics: { totalClicks: number; totalVisitors: number };
  };
};

export type TestLogin = {
  ok: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    statistics: { totalClicks: number; totalVisitors: number };
  };
};

// Función que maneja el registro de un usuario
export async function registerUser(
  payload: registerPayload
): Promise<{ success: string }> {
  const response = await fetch("http://localhost:3000/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Error registro fallido");
  }
  const data: { success: string } = await response.json();
  return data;
}

// Función que maneja el login de un usuario
export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch("http://localhost:3000/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Login fallido");
  }

  const data: LoginResponse = await response.json();
  return data;
}

// Función para verificar la validez del token
export async function checkToken(payload: string | null): Promise<TestLogin> {
  const response = await fetch("http://localhost:3000/api/user/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${payload}`,
    },
  });
  if (!response.ok) {
    throw new Error("Token invalido");
  }
  const data: TestLogin = await response.json();
  return data;
}

type CollectionPayload = {
  username: string;
  nextCursor: string | null;
  token: string | null;
};

type CollectionResponse = {
  userLinks: Link[];
  nextCursor: string;
  totalCount: number;
};

// Función para obtener la colección de enlaces de un usuario
export async function getUserCollection(
  payload: CollectionPayload
): Promise<CollectionResponse> {
  const cursor = payload.nextCursor ?? ""; // si no hay cursor, vacío
  const response = await fetch(
    `http://localhost:3000/api/user/${payload.username}/collection?cursor=${cursor}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${payload.token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Token invalido");
  }

  const data: CollectionResponse = await response.json();
  console.log(
    `http://localhost:3000/api/user/${payload.username}/collection?cursor=${cursor}`
  );
  return data;
}

export type deletePayload = {
  username?: string;
  linkId: string;
  token: string | null;
};

type deleteResponse = {
  success: string;
};

// Función para eliminar un enlace de la colección de un usuario
export async function deleteLink(payload: deletePayload) {
  const response = await fetch(
    `http://localhost:3000/api/user/${payload.username}/${payload.linkId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${payload.token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("No se pudo eliminar el enlace");
  }
  const data: deleteResponse = await response.json();
  return data;
}
