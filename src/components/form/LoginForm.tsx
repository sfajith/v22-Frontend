import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "../../app/hooks";
import {
  loginSuccess,
  overWriteAccessToken,
} from "../../features/auth/authSlice";
import { loginUser } from "../../features/auth/authService";
import { AlertCircle, Loader2 } from "lucide-react"; // Ícono de carga de Lucide
import { useNavigate } from "react-router-dom";
import { useUserCollection } from "../../app/hooks/useUserCollection";
import { toast } from "sonner";

const siteKey: string = import.meta.env.VITE_RECAPTCHA_SITE_KEY!;

export default function LoginDialog() {
  const dispatch = useAppDispatch();

  const recaptchaRef = useRef<InstanceType<typeof ReCAPTCHA> | null>(null);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const isFormValid = form.email !== "" && form.password !== "";
  const navigate = useNavigate();

  const { handlerLoadCollection } = useUserCollection();

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      try {
        if (
          (isValidEmail(form.email) === false && form.email.length < 5) ||
          form.email.length > 254
        ) {
          throw new Error("Email y/o contraseña incorrectos");
        }
        if (form.password.length < 6 || form.password.length > 64) {
          throw new Error("Email y/o contraseña incorrectos");
        }
        if (!siteKey) {
          throw new Error(
            "La clave reCAPTCHA no está definida en las variables de entorno"
          );
        }
        const gToken = await recaptchaRef.current?.executeAsync();
        recaptchaRef.current?.reset();

        if (!gToken) {
          toast.error("No se pudo obtener el token de reCAPTCHA");
          setIsLoading(false);
          return;
        }

        const data = await loginUser({
          email: form.email,
          password: form.password,
          gToken,
        });
        dispatch(loginSuccess(data));
        dispatch(overWriteAccessToken(data.accessToken));
        handlerLoadCollection();
        console.log(data);

        setErrorMessage(null);
        setOpen(false);
        toast.success("Ingresaste con exito!");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error al iniciar sesión";
        setErrorMessage(message);
        toast.error(message);
        handlerLoadCollection();
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };
  const handleForgotPassword = () => {
    setOpen(false); // <-- Cierra el diálogo
    navigate("/forgot-password"); // <-- Redirige
  };

  const handleResendVerification = () => {
    setOpen(false); // <-- Cierra el diálogo
    navigate("/resend-email"); // <-- Redirige
  };

  useEffect(() => {
    setErrorMessage(null);
  }, [form]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="px-3 py-1 bg-transparent rounded-sm cursor-pointer hover:bg-white hover:text-black">
            Ingresar
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Iniciar sesión</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label
                htmlFor="email"
                className="mb-1 text-base font-medium text-zinc-600"
              >
                Correo
              </label>
              <Input
                disabled={isLoading}
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="ejemplo@correo.com"
                className="rounded-full"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 text-base font-medium text-zinc-600"
              >
                Contraseña
              </label>
              <Input
                disabled={isLoading}
                id="password"
                type="password"
                placeholder="tu contraseña"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="rounded-full"
              />
            </div>
            <AnimatePresence initial={false}>
              <div className="flex flex-col justify-start w-full gap-1">
                <button
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-left underline cursor-pointer text-muted-foreground"
                >
                  Olvidé mi contraseña
                </button>
                {errorMessage ===
                  "Tu cuenta aún no ha sido verificada. Por favor revisa tu correo o solicita un nuevo enlace." && (
                  <motion.div
                    key="verify"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <button
                      className="text-xs font-medium text-left underline cursor-pointer text-muted-foreground"
                      onClick={handleResendVerification}
                    >
                      Reenviar correo de verificación
                    </button>
                  </motion.div>
                )}
              </div>
              {errorMessage && (
                <motion.div
                  key="loginError"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden gap-1 text-xs text-[#f77f00] flex items-center"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <DialogFooter>
            <Button
              aria-disabled={!isFormValid || isLoading}
              disabled={!isFormValid || isLoading}
              onClick={handleLogin}
              className="w-full text-xl tracking-tight text-white transition-opacity rounded-full opacity-50 cursor-not-allowed bg-gradient-mascoti enabled:opacity-100 enabled:cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {open && (
        <ReCAPTCHA
          sitekey={siteKey}
          size="invisible"
          ref={recaptchaRef}
          badge="bottomleft"
        />
      )}
    </>
  );
}
