import { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";
import { registerUser } from "../../features/auth/authService";
import {
  usernameValidation,
  emailValidation,
} from "../../features/auth/authService";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function RegisterDialog() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    repassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorName, setErrorName] = useState<string | null>(null);
  const [errorEmail, setErrorEmail] = useState<string | null>(null);
  const [successName, setSuccessName] = useState<string | null>(null);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);

  const passwordsMatch = form.password === form.repassword;
  const isFormValid =
    form.username && form.email && form.password && passwordsMatch;

  const handleRegister = async () => {
    if (!passwordsMatch) return;
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const data = await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      if (data.success) {
        setSuccessMessage(
          "¡Cuenta creada exitosamente! Revisa tu correo para activarla."
        );
        setForm({ username: "", email: "", password: "", repassword: "" });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error en el registro";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const debounceDelay = 700;

  //llamada de usernameValidationHandler
  useEffect(() => {
    if (form.username.length === 0) {
      if (successName !== null) setSuccessName(null);
      if (errorName !== null) setErrorName(null);
      return;
    }

    const handlerUsername = setTimeout(() => {
      usernameValidationHandler();
    }, debounceDelay);

    return () => clearTimeout(handlerUsername);
  }, [form.username]);

  //llamada de emailValidationHandler
  useEffect(() => {
    if (form.email.length === 0) {
      if (successEmail !== null) setSuccessEmail(null);
      if (errorEmail !== null) setErrorEmail(null);
      return;
    }

    const handler = setTimeout(() => {
      emailValidationHandler();
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [form.email]);

  const emailValidationHandler = async () => {
    setErrorEmail(null);
    setSuccessEmail(null);
    if (!form.email) {
      return;
    }

    if (form.email.length > 0) {
      try {
        const response = await emailValidation({
          email: form.email,
        });
        if (response.success) {
          setSuccessEmail(response.success);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "No disponible";
        setSuccessEmail(null);
        setErrorEmail(message);
      }
    }
  };

  const usernameValidationHandler = async () => {
    setErrorName(null);
    setSuccessName(null);
    if (!form.username) {
      return;
    }

    if (form.username.length > 0) {
      try {
        const response = await usernameValidation({
          username: form.username,
        });
        if (response.success) {
          setSuccessName(response.success);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "No disponible";
        setSuccessName(null);
        setErrorName(message);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-transparent hover:bg-white hover:text-black py-1 px-3 rounded-sm cursor-pointer">
          Registrarse
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Crear cuenta</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Nombre de usuario
            </label>
            <div className="flex items-center gap-1">
              <Input
                id="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="ej: sherjan.dev"
              />
              <div className="w-5 h-5 relative">
                <AnimatePresence mode="wait">
                  {successName && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-0 left-0"
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CheckCircle className="text-green-500 w-5 h-5 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Nombre de usuario disponible</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </motion.div>
                  )}

                  {errorName && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-0 left-0"
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertCircle className="text-red-500 w-5 h-5 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-[150px] break-words">
                              {errorName}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Correo
            </label>
            <div className="flex items-center gap-1">
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="ejemplo@correo.com"
              />
              <div className="w-5 h-5 relative">
                <AnimatePresence mode="wait">
                  {successEmail && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-0 left-0"
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CheckCircle className="text-green-500 w-5 h-5 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Nombre de usuario disponible</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </motion.div>
                  )}

                  {errorEmail && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-0 left-0"
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertCircle className="text-red-500 w-5 h-5 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-[150px] break-words">
                              {errorEmail}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="********"
            />
          </div>

          <div>
            <label htmlFor="repassword" className="block text-sm font-medium">
              Confirmar contraseña
            </label>
            <Input
              id="repassword"
              type="password"
              value={form.repassword}
              onChange={(e) => setForm({ ...form, repassword: e.target.value })}
              placeholder="********"
            />
          </div>

          {!passwordsMatch && form.repassword && (
            <p className="text-sm text-red-500 font-medium">
              Las contraseñas no coinciden
            </p>
          )}
          {successMessage && (
            <p className="text-sm text-green-600 font-medium">
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            disabled={!isFormValid || isLoading}
            onClick={handleRegister}
            className="w-full flex items-center justify-center gap-2 bg-gradient-mascoti rounded-full cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Registrando...
              </>
            ) : (
              "Crear cuenta"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
