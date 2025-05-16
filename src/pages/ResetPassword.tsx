import { useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { restorePassword } from "../features/auth/authService";
import {
  globalError,
  disableError,
  globalSuccess,
  globalLoading,
  disableLoading,
} from "../features/auth/authSlice";
import { useAppDispatch } from "../app/hooks";
import { Button } from "@/components/ui/button";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [form, setForm] = useState<{ password: string; rePassword: string }>({
    password: "",
    rePassword: "",
  });
  const [error, setError] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const resendHandlder = async () => {
    const payload = {
      token,
      password: form.password,
    };
    try {
      dispatch(globalLoading());
      const response = await restorePassword(payload);
      if (response.success) {
        console.log(response.success);
        dispatch(disableLoading());
        dispatch(globalSuccess(response.success));
        navigate("/login");
      }
    } catch (error) {
      dispatch(disableLoading());

      const errorMessage =
        error instanceof Error
          ? error.message
          : "No se pudo reestablecer la contraseña";
      dispatch(globalError(errorMessage));
      if (
        errorMessage ===
        "Este enlace ya expiró o es invalido, solicita un nuevo enlace"
      ) {
      }

      setError(true);
    }
  };
  return (
    <>
      {!error ? (
        <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-94px)]">
          <h3 className="text-2xl font-bold text-[#751B80] text-center">
            Establece tu nueva contraseña
          </h3>
          <div>
            <form
              className="rounded-lg pt-2 pb-4"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                resendHandlder();
              }}
            >
              <div className="formDiv">
                <label
                  className="text-lg text-muted-foreground"
                  htmlFor="newPassword"
                >
                  Nueva contraseña
                </label>
                <input
                  required
                  className="bg-white border"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="minimo 5 caracteres"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setForm({ ...form, password: e.target.value });
                  }}
                />

                <label
                  className="text-lg text-muted-foreground"
                  htmlFor="newPassword"
                >
                  Confirma tu contraseña
                </label>
                <input
                  required
                  className="bg-white border"
                  type="password"
                  name="rePassword"
                  id="rePassword"
                  placeholder="deben coincidir"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setForm({ ...form, rePassword: e.target.value });
                  }}
                />
              </div>
              {form.rePassword.length >= 1 &&
                (form.password !== form.rePassword ? (
                  <p className="text-xs text-red-400 text-center pt-2">
                    Las contraseñas deben coincidir
                  </p>
                ) : (
                  <p className="text-xs text-green-600 text-center pt-2">
                    Contraseña confirmada
                  </p>
                ))}

              <div className="formDiv">
                <button className="bg-gradient-mascoti buttom-mascoti px-4">
                  Reestablecer contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 z-[50] flex justify-center items-center bg-black/40 pointer-events-auto">
          <div className="pointer-events-auto">
            <Button
              className="cursor-pointer bg-gradient-mascoti font-semibold"
              onClick={() => {
                navigate("/");
              }}
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default ResetPassword;
