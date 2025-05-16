import { useState } from "react";
import { forgotPassword } from "../features/auth/authService";
import {
  globalError,
  disableError,
  globalSuccess,
  globalLoading,
  disableLoading,
} from "../features/auth/authSlice";
import { useAppDispatch } from "../app/hooks";

function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [good, setGood] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const resendHandlder = async () => {
    const payload = {
      email,
    };
    try {
      dispatch(globalLoading());
      const response = await forgotPassword(payload);
      if (response.success) {
        console.log(response.success);
        dispatch(disableLoading());
        setGood(true);
        dispatch(globalSuccess(response.success));
      }
    } catch (error) {
      dispatch(
        globalError(
          error instanceof Error
            ? error.message
            : "No se pudo recuperar la contraseña"
        )
      );
      setTimeout(() => {
        dispatch(disableError());
      }, 5000);
    }
  };
  return (
    <>
      {!good ? (
        <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-94px)]">
          <h3 className="text-2xl font-bold text-[#751B80] text-center">
            Recupera tu contraseña
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
                  Escribe el correo electronico de tu cuenta
                </label>
                <input
                  required
                  className="bg-white"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="tucorreo@ejemplo.com"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>

              <div className="formDiv">
                <button className="bg-gradient-mascoti buttom-mascoti">
                  Recuperar contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-94px)]">
          <h3 className="text-2xl font-bold text-[#751B80] text-center">
            Revisa tu bandeja de entrada de ✉️ {email} <br /> ya puedes cerrar
            esta ventana.
          </h3>
        </div>
      )}
    </>
  );
}

export default ForgotPassword;
