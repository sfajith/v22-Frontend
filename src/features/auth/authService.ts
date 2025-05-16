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
    LinkActivity: { link: string; date: Date }[];
    clickAnalitycs: { ip: string; date: Date }[];
  };
};

export type TestLogin = {
  ok: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    statistics: { totalClicks: number; totalVisitors: number };
    LinkActivity: { link: string; date: Date }[];
    clickAnalitycs: { ip: string; date: Date }[];
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
  const data: { success: string } | { error: string } = await response.json();
  if (!response.ok) {
    const err = data as { error: string };
    throw new Error(err.error || "Login fallido");
  }
  return data as { success: string };
}

// Función que maneja el login de un usuario
type ErrorResponse = { error: string };
export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch("http://localhost:3000/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data: LoginResponse | ErrorResponse = await response.json();
  if (!response.ok) {
    const err = data as ErrorResponse;
    throw new Error(err.error || "Login fallido");
  }

  return data as LoginResponse;
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

//cambio de contraseña

type changeType = {
  username: string;
  token: string | null;
  body: { password: string; newPassword: string };
};

type changeResponse = {
  success: string;
};
type changeError = {
  error: string;
};
export async function changePassword(payload: changeType) {
  const response = await fetch(
    `http://localhost:3000/api/user/${payload.username}/reset`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${payload.token}`,
      },
      body: JSON.stringify(payload.body),
    }
  );

  const data: changeResponse | changeError = await response.json();
  if (!response.ok) {
    const err = data as ErrorResponse;
    throw new Error(err.error || "Error al cambiar la contraseña");
  }

  return data as changeResponse;
}

type deleteType = {
  username: string;
  token: string | null;
  body: { password: string };
};
type deleteUserResponse = {
  success: string;
};
type deleteError = {
  error: string;
};
export async function deleteAccount(payload: deleteType) {
  const response = await fetch(
    `http://localhost:3000/api/user/${payload.username}/delete`,
    {
      method: "POST",
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${payload.token}`,
      },
      body: JSON.stringify(payload.body),
    }
  );
  const data: deleteUserResponse | deleteError = await response.json();
  if (!response.ok) {
    const err = data as deleteError;
    throw new Error(err.error || "No se pudo eliminar el usuario");
  }
  return data as deleteUserResponse;
}

//verificacion de la cuenta
type VerifyPayload = {
  token: string | null;
};

type VerifiySuccess = {
  success: string;
};

type VerifyError = {
  error: string;
};
export async function verifyAccount(payload: VerifyPayload) {
  const response = await fetch(
    `http://localhost:3000/api/user/verify-email?token=${payload.token}`,
    {
      method: "GET",
      headers: {
        "content-Type": "application/json",
      },
    }
  );
  const data: VerifiySuccess | VerifyError = await response.json();

  if (!response.ok) {
    const err = data as deleteError;
    throw new Error(err.error || "Falló la verificación");
  }
  return data as VerifiySuccess;
}

//reenvio de verificacion email
type ResendPayload = {
  email: string;
};

type resendSuccess = {
  success: string;
};

type resendError = {
  error: string;
};
export async function resendVerification(payload: ResendPayload) {
  const response = await fetch(
    `http://localhost:3000/api/user/resend-verification`,
    {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  const data: resendSuccess | resendError = await response.json();
  if (!response.ok) {
    const err = data as resendError;
    throw new Error(err.error || "No se pudo reenviar el enlace");
  }
  return data as resendSuccess;
}

//Envio de enlace de recuperacion de contraseña
type ForgotPayload = {
  email: string;
};

type ForgotSuccess = {
  success: string;
};

type ForgotError = {
  error: string;
};

export async function forgotPassword(payload: ForgotPayload) {
  const response = await fetch(
    `http://localhost:3000/api/user/forgot-password`,
    {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  const data: ForgotSuccess | ForgotError = await response.json();
  if (!response.ok) {
    const err = data as ForgotError;
    throw new Error(err.error || "No se pudo recuperar la contraseña");
  }
  return data as ForgotSuccess;
}
