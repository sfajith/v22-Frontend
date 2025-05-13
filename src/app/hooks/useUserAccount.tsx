import { changePassword } from "@/features/auth/authService";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import {
  globalSuccess,
  disableSuccess,
  globalError,
  disableError,
} from "../../features/auth/authSlice";

export function useUserAccount() {
  const [form, setForm] = useState<{
    password: string;
    newPassword: string;
    rePassword: string;
  }>({ password: "", newPassword: "", rePassword: "" });

  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handlerChangePassword = async () => {
    const token = localStorage.getItem("token");

    if (auth.user) {
      const payload = {
        token,
        username: auth.user.username,
        body: {
          password: form.password,
          newPassword: form.newPassword,
        },
      };
      try {
        const response = await changePassword(payload);
        if (response.success) {
          setForm({ password: "", newPassword: "", rePassword: "" });
          dispatch(globalSuccess(response.success));
          setTimeout(() => {
            localStorage.removeItem("token"); // Eliminar token
            window.location.href = "/";
          }, 1000);
        }
      } catch (error) {
        setForm({ password: "", newPassword: "", rePassword: "" });
        dispatch(
          globalError(
            error instanceof Error
              ? error.message
              : "Error al cambiar la contraseña"
          )
        );
        setTimeout(() => {
          dispatch(disableError());
        }, 5000);
      }
    }
  };
  return { handlerChangePassword, form, setForm };
}
