import { useState } from "react";
import { resendVerification } from "../features/auth/authService";
import {
  globalError,
  disableError,
  globalSuccess,
  globalLoading,
  disableLoading,
} from "../features/auth/authSlice";
import { useAppDispatch } from "../app/hooks";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function ReSendConfirmation() {
  const [email, setEmail] = useState<string>("");
  const [good, setGood] = useState<boolean>(false);
  const [evento, setEvento] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const resendHandlder = async () => {
    toast.dismiss();
    setEvento("loading");
    const payload = {
      email,
    };
    setTimeout(async () => {
      try {
        dispatch(globalLoading());
        const response = await resendVerification(payload);
        if (response.success) {
          setEvento(null);
          toast.dismiss();
          toast.success(
            `La verificación de tu cuenta se envió al correo ${email}`
          );
          setGood(true);
        }
      } catch (error) {
        setEvento(null);
        toast.dismiss();
        toast.error(
          error instanceof Error
            ? error.message
            : "No se pudo eliminar la cuenta"
        );
      }
    }, 1000);
  };
  return (
    <>
      {!good ? (
        <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-94px)] px-4">
          <h3 className="text-3xl md:text-4xl font-extrabold text-[#751B80] text-center tracking-tight leading-tight mb-6">
            Reenviar verificación
          </h3>
          <form
            className="w-full max-w-md p-6 space-y-4 bg-white shadow-lg rounded-2xl"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              resendHandlder();
            }}
          >
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="mb-1 text-base font-medium text-zinc-600"
              >
                Reenviaremos un enlace de confirmación a tu correo electrónico
              </label>
              <input
                required
                type="email"
                id="email"
                name="email"
                placeholder="tucorreo@ejemplo.com"
                className="px-4 py-2 border border-zinc-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#751B80]"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="cursor-pointer w-full py-2 px-4 text-white text-lg font-semibold tracking-tight rounded-full bg-gradient-to-r from-[#751B80] to-[#A84ACF] transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={evento === "loading"}
              >
                {evento === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Reenviar verificación
                  </>
                ) : (
                  "Cambiar contraseña"
                )}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center justify-center w-full h-[calc(100vh-94px)] px-4"
        >
          <h3 className="text-center text-3xl sm:text-4xl font-semibold tracking-tight text-[#751B80] leading-snug max-w-xl">
            Revisa tu bandeja de entrada{" "}
            <span className="inline-block">✉️</span>
            <br />
            <span className="text-[#A84ACF] font-bold">{email}</span>
            <br />
            <span className="block mt-2 text-lg font-normal text-zinc-600">
              Ya puedes cerrar esta ventana.
            </span>
          </h3>
        </motion.div>
      )}
    </>
  );
}

export default ReSendConfirmation;
