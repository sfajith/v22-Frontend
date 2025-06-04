import { Link } from "../links/linkTypes";
import instance from "../../lib/axiosInstance";
import axios from "axios";
export type LoginPayload = {
  email: string;
  password: string;
  gToken: string;
};

export type registerPayload = {
  username: string;
  email: string;
  password: string;
  gToken: string;
};

export type LoginResponse = {
  accessToken: string;
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
  accessToken: string;
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
export async function registerUser(payload: registerPayload) {
  return axios.post("http://localhost:3000/auth/register", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// Función que maneja el login de un usuario
export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  return axios
    .post<LoginResponse>("http://localhost:3000/auth/login", payload, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((response) => response.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.error || "Login fallido";
      throw new Error(errorMessage);
    });
}

export async function checkToken(): Promise<TestLogin> {
  const response = await axios.post<TestLogin>(
    "http://localhost:3000/auth/renew",
    {},
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  return response.data;
}

//funcion para cargar enlaces del usuario
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

export async function getUserCollection(
  payload: CollectionPayload
): Promise<CollectionResponse> {
  const cursor = payload.nextCursor ?? "";
  let url = `http://localhost:3000/api/user/${payload.username}/collection`;
  if (cursor) url += `?cursor=${cursor}`;

  return axios
    .get<CollectionResponse>(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${payload.token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error:", error.response?.data);
      throw new Error(error.response?.data?.error || "Expiró la sesión");
    });
}

//funcion para eliminar enlace
export type deletePayload = {
  linkId: string;
  token: string | null;
  username?: string;
};

/* export async function deleteLink(payload: deletePayload) {
  return axios.delete(
    `http://localhost:3000/api/user/${payload.username}/${payload.linkId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${payload.token}`,
      },
    }
  );
} */

export async function deleteLink(payload: deletePayload) {
  return instance.delete(
    `/api/user/${payload.username}/${payload.linkId}`, // Solo la ruta relativa, baseURL ya está en la instancia
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

//cambio de contraseña
type changeType = {
  username: string;
  token: string | null;
  body: { password: string; newPassword: string };
};

export async function changePassword(payload: changeType) {
  return axios.put(
    `http://localhost:3000/auth/${payload.username}/reset`,
    payload.body,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${payload.token}`,
      },
    }
  );
}

//funcion para borrar cuenta
type deleteType = {
  username: string;
  token: string | null;
  body: { password: string };
};
export async function deleteAccount(payload: deleteType) {
  return axios.post(
    `http://localhost:3000/auth/${payload.username}/delete`,
    payload.body,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${payload.token}`,
      },
    }
  );
}

//verificacion de la cuenta
type VerifyPayload = {
  token: string | null;
};
export async function verifyAccount(payload: VerifyPayload) {
  return axios.get(
    `http://localhost:3000/auth/verify-email?token=${payload.token}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

//reenvio de verificacion email
type ResendPayload = {
  email: string;
};
export async function resendVerification(payload: ResendPayload) {
  return axios.post(`http://localhost:3000/auth/resend-verification`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

//Envio de enlace de recuperacion de contraseña
type ForgotPayload = {
  email: string;
  gToken: string;
};
export async function forgotPassword(payload: ForgotPayload) {
  return axios.post(`http://localhost:3000/auth/forgot-password`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

//establecer nueva contraseña
type RestorePayload = {
  token: string | null;
  password: string;
};
export async function restorePassword(payload: RestorePayload) {
  return axios.post(
    `http://localhost:3000/auth/recover-password?token=${payload.token}`,
    payload.password,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

//llama al backend para validar campo username
type PayloadUsernameValidation = {
  username: string;
};
export async function usernameValidation(payload: PayloadUsernameValidation) {
  return axios.post(
    `http://localhost:3000/api/user/username-validation`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

//llama al backend para validar campo username
type PayloadEmailValidation = {
  email: string;
};
export async function emailValidation(payload: PayloadEmailValidation) {
  return axios.post(
    `http://localhost:3000/api/user/email-validation`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

//llama el backend para validar la contraseña via pwned
type PayloadPasswordlValidation = {
  password: string;
};
export async function passwordValidation(payload: PayloadPasswordlValidation) {
  return axios.post(
    `http://localhost:3000/api/user/password-validation`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

//llamada al logout
export async function logOut(token: string | null) {
  return axios.post(
    "http://localhost:3000/auth/logout",
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
}
