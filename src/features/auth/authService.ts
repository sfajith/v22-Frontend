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
  let url = `/api/user/${payload.username}/collection`;
  if (cursor) url += `?cursor=${cursor}`;

  return instance
    .get<CollectionResponse>(url) // Usa la instancia que ya añade los headers
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error:", error.response?.data);
      throw new Error(error.response?.data?.error || "Expiró la sesión");
    });
}

//funcion para eliminar enlace
export type deletePayload = {
  linkId: string;
  username?: string;
};

export async function deleteLink(payload: deletePayload) {
  return instance.delete(`/api/user/${payload.username}/${payload.linkId}`);
}

//cambio de contraseña
type changeType = {
  username: string;
  body: { password: string; newPassword: string };
};

export async function changePassword(payload: changeType) {
  return instance.put(`/auth/${payload.username}/reset`, payload.body);
}

//funcion para borrar cuenta
type deleteType = {
  username: string;
  body: { password: string };
};
export async function deleteAccount(payload: deleteType) {
  return instance.post(`/auth/${payload.username}/delete`, payload.body);
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
