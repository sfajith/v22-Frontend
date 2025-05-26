import { useRef, useState } from "react";
import { forgotPassword } from "../features/auth/authService";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";

const siteKey: string = import.meta.env.VITE_RECAPTCHA_SITE_KEY!;

function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [good, setGood] = useState<boolean>(false);
  const [evento, setEvento] = useState<string | null>(null);
  const recaptchaRef = useRef<InstanceType<typeof ReCAPTCHA> | null>(null);

  const resendHandlder = async () => {
    toast.dismiss();
    setEvento("loading");

    setTimeout(async () => {
      try {
        if (!siteKey) {
          throw new Error(
            "La clave reCAPTCHA no está definida en las variables de entorno"
          );
        }
        const gToken = await recaptchaRef.current?.executeAsync();
        recaptchaRef.current?.reset();

        if (!gToken) {
          toast.error("No se pudo obtener el token de reCAPTCHA");
          setEvento(null);
          return;
        }
        const payload = {
          email,
          gToken,
        };
        const response = await forgotPassword(payload);
        if (response.success) {
          toast.dismiss();
          `El enlace para recuperar tu cuenta se envió a tu correo ${email}`;
          setEvento(null);
          setGood(true);
        }
      } catch (error) {
        setEvento(null);
        toast.dismiss();
        toast.error(
          error instanceof Error
            ? error.message
            : "No se pudo recuperar la contraseña"
        );
      }
    }, 500);
  };
  return (
    <>
      {!good ? (
        <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-94px)] px-4">
          <h3 className="text-3xl md:text-4xl font-extrabold text-[#751B80] text-center tracking-tight leading-tight mb-6">
            Recupera tu contraseña
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
                Escribe el correo electrónico de tu cuenta
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
                    Recuperar contraseña
                  </>
                ) : (
                  "Recuperar contraseña"
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
      <ReCAPTCHA
        sitekey={siteKey}
        size="invisible"
        ref={recaptchaRef}
        badge="bottomleft"
      />
    </>
  );
}

export default ForgotPassword;
