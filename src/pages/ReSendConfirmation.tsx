import { useState } from "react";
import { resendVerification } from "../features/auth/authService";
import {
  globalError,
  disableError,
  globalSuccess,
} from "../features/auth/authSlice";
import { useAppDispatch } from "../app/hooks";

function ReSendConfirmation() {
  const [email, setEmail] = useState<string>("");
  const [good, setGood] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const resendHandlder = async () => {
    const payload = {
      email,
    };
    try {
      const response = await resendVerification(payload);
      if (response.success) {
        dispatch(globalSuccess(response.success));
        setGood(true);
      }
    } catch (error) {
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
  };
  return (
    <>
      {!good ? (
        <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-94px)]">
          <h3 className="text-2xl font-bold text-[#751B80] text-center">
            Escribe el correo que usaste para registrarte.
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
                  className="text-xs text-muted-foreground"
                  htmlFor="newPassword"
                >
                  Reenviaremos un enlace de confirmacion a tu correo
                  electronico.
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
                  Reenviar verificación
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

export default ReSendConfirmation;
