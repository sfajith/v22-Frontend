import { changePassword, deleteAccount } from "@/features/auth/authService";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import {
  globalSuccess,
  disableSuccess,
  globalError,
  disableError,
} from "../../features/auth/authSlice";
import { toast } from "sonner";

export function useUserAccount() {
  const [form, setForm] = useState<{
    password: string;
    newPassword: string;
    rePassword: string;
  }>({ password: "", newPassword: "", rePassword: "" });

  const [evento, setEvento] = useState<string | null>(null);

  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handlerChangePassword = async (
    password: string,
    newPassword: string
  ) => {
    setEvento("loading");
    const token = localStorage.getItem("token");

    if (!auth.user) {
      toast.error("Usuario no autenticado");
      setEvento("error");
      return;
    }

    const payload = {
      token,
      username: auth.user.username,
      body: { password, newPassword },
    };

    try {
      const response = await changePassword(payload);

      if (response.success) {
        setEvento("success");
        dispatch(globalSuccess(response.success));
        toast.success("Contraseña cambiada con éxito");

        setTimeout(() => {
          localStorage.removeItem("token"); // Eliminar token
          window.location.href = "/";
        }, 2000);
      } else {
        throw new Error("No se pudo cambiar la contraseña");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al cambiar la contraseña";

      toast.error(errorMessage);
      setEvento("error");

      dispatch(globalError(errorMessage));
      setTimeout(() => {
        dispatch(disableError());
      }, 5000);
    }
  };

  const handlerDeleteUserAcount = async () => {
    const token = localStorage.getItem("token");
    if (auth.user) {
      const payload = {
        token,
        username: auth.user.username,
        body: {
          password: form.password,
        },
      };
      try {
        const response = await deleteAccount(payload);
        if (response.success) {
          setForm({ password: "", newPassword: "", rePassword: "" });
          dispatch(globalSuccess(response.success));
          setTimeout(() => {
            localStorage.removeItem("token"); // Eliminar token
            window.location.href = "/";
          }, 2000);
        }
      } catch (error) {
        setForm({ password: "", newPassword: "", rePassword: "" });
        dispatch(
          globalError(
            error instanceof Error
              ? error.message
              : "No se pudo eliminar la cuenta"
          )
        );
        setTimeout(() => {
          dispatch(disableError());
        }, 5000);
      }
    }
  };
  return {
    handlerChangePassword,
    handlerDeleteUserAcount,
    form,
    evento,
    setEvento,
    setForm,
  };
}
