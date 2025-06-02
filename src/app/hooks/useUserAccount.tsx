import {
  changePassword,
  deleteAccount,
  logOut,
} from "@/features/auth/authService";
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

  const handleLogOut = async () => {
    const token = auth.accessToken;

    if (!auth.isAuthenticated) {
      toast.error("No estas autenticado");
      return;
    }
    logOut(token).then(() => {
      toast.dismiss();
      toast.warning("Cerraste la sesión");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    });
  };

  const handlerChangePassword = async (
    password: string,
    newPassword: string
  ) => {
    setEvento("loading");

    if (!auth.user) {
      toast.error("Usuario no autenticado");
      setEvento("error");
      return;
    }

    const payload = {
      token: auth.accessToken,
      username: auth.user.username,
      body: { password, newPassword },
    };

    changePassword(payload)
      .then((response) => {
        setEvento("success");
        toast.dismiss();
        toast.success("Contraseña cambiada con éxito");
        setTimeout(() => {
          handleLogOut();
        }, 1000);
      })
      .catch((error) => {
        setEvento(null);
        toast.error(error.message);
      });
  };

  const handlerDeleteUserAcount = async (password: string) => {
    toast.loading("Verificando información...");
    if (auth.user) {
      const payload = {
        token: auth.accessToken,
        username: auth.user.username,
        body: {
          password,
        },
      };

      deleteAccount(payload)
        .then((response) => {
          toast.dismiss();
          toast.warning("Cuenta eliminada con exito!");
          setForm({ password: "", newPassword: "", rePassword: "" });
          handleLogOut();
        })
        .catch((error) => {
          setEvento(null);
          toast.error(error.message);
        });
    }
  };
  return {
    handlerChangePassword,
    handlerDeleteUserAcount,
    form,
    evento,
    setEvento,
    setForm,
    handleLogOut,
  };
}
