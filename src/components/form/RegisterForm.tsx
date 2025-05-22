import { registerUser } from "../../features/auth/authService";
import {
  usernameValidation,
  emailValidation,
} from "../../features/auth/authService";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import {
  Loader2,
  MailCheck,
  MailX,
  UserRoundCheck,
  UserRoundX,
  AlertCircle,
  CheckIcon,
  XIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface FormInputs {
  username: string;
  email: string;
  password: string;
  rePassword: string;
}

//unificacion de clases condicionales
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

//validacion de la fortaleza de la contraseña
function validatePasswordStrength(password: string): {
  strength: "Débil" | "Media" | "Buena" | "Fuerte";
  color: string;
  clase: { width: string; bg: string };
  bgColor: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1)
    return {
      strength: "Débil",
      color: "text-red-500",
      clase: { width: "25%", bg: "bg-red-500" },
      bgColor: "#ef4444", // rojo
    };
  if (score === 2)
    return {
      strength: "Media",
      color: "text-yellow-500",
      clase: { width: "50%", bg: "bg-orange-400" },
      bgColor: "#facc15", // amarillo
    };
  if (score === 3)
    return {
      strength: "Buena",
      color: "text-yellow-500",
      clase: { width: "75%", bg: "bg-yellow-400" },
      bgColor: "#facc15",
    };
  return {
    strength: "Fuerte",
    color: "text-green-500",
    clase: { width: "100%", bg: "bg-green-500" },
    bgColor: "#22c55e", // verde
  };
}

export default function RegisterDialog() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<FormInputs>({ mode: "onChange" });

  const password = watch("password");
  const username = watch("username");
  const email = watch("email");
  const rePassword = watch("rePassword");

  //estados para el manejo de la validacion de username
  const [successName, setSuccessName] = useState<string | null>(null);
  const [errorName, setErrorName] = useState<string | null>(null);
  const [validatingName, setValidatingName] = useState<boolean>(false);

  //llamada al backend para verificar el username
  const usernameValidationHandler = async () => {
    toast.dismiss();
    setValidatingName(true);
    const loadingToast = toast.loading(
      `verificando disponibilidad de ${username}...`
    );
    setErrorName(null);
    setSuccessName(null);
    if (errors.username) {
      setValidatingName(false);
      return;
    }
    setTimeout(async () => {
      try {
        const response = await usernameValidation({
          username,
        });
        if (response.success) {
          setSuccessName(response.success);
          toast.dismiss(loadingToast);
          toast.success(`El nombre de usuario ${username} está disponible`);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "No disponible";
        toast.dismiss(loadingToast);
        setSuccessName(null);
        setErrorName(message);
        toast.error(`El nombre de usuario ${username} no está disponible`);
      } finally {
        setValidatingName(false);
      }
    }, 700);
  };

  //useEffect para manejar la validacion de username
  useEffect(() => {
    if (successName !== null) setSuccessName(null);
    if (errorName !== null) setErrorName(null);
    if (errors.username || !username) {
      setSuccessName(null);
      return;
    }

    const usernameHandler = setTimeout(() => {
      usernameValidationHandler();
    }, 700);

    return () => clearTimeout(usernameHandler);
  }, [username, errors.username]);

  //estados para el manejo de la validacion de email
  const [successEmail, setSuccessEmail] = useState<string | null>(null);
  const [errorEmail, setErrorEmail] = useState<string | null>(null);
  const [validatingEmail, setValidatingEmail] = useState<boolean>(false);

  //llamada al backend para verioficar el email
  const emailValidationHandler = async () => {
    toast.dismiss();
    setValidatingEmail(true);
    setErrorEmail(null);
    setSuccessEmail(null);
    const loadingToast = toast.loading(`Verificando ${email}`);
    if (errors.email) {
      setValidatingEmail(false);
      return;
    }
    setTimeout(async () => {
      try {
        const response = await emailValidation({
          email,
        });
        if (response.success) {
          toast.dismiss(loadingToast);
          setSuccessEmail(response.success);
          toast.success(`El email ${email} esta correcto y disponible`);
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        const message =
          error instanceof Error ? error.message : "No disponible";
        toast.error(message);
        setSuccessEmail(null);
        setErrorEmail(message);
      } finally {
        setValidatingEmail(false);
      }
    }, 700);
  };

  //useEffect para manejar la validacion de email
  useEffect(() => {
    if (successEmail !== null) setSuccessEmail(null);
    if (errorEmail !== null) setErrorEmail(null);
    if (errors.email || !email) {
      setSuccessEmail(null);
      return;
    }

    const emailHandler = setTimeout(() => {
      emailValidationHandler();
    }, 700);

    return () => clearTimeout(emailHandler);
  }, [email, errors.email]);

  //trigger de validacion fortaleza de contraseña

  useEffect(() => {
    if (password) {
      setPasswordStrength(validatePasswordStrength(password));
    } else {
      setPasswordStrength(null);
    }
  }, [password]);

  const [passwordStrength, setPasswordStrength] = useState<{
    strength: "Débil" | "Media" | "Buena" | "Fuerte";
    color: string;
    clase: { width: string; bg: string };
    bgColor: string;
  } | null>(null);

  //modelo de comprobacion para permitir el evento submit
  const isFormValid =
    !errors.username &&
    !errors.email &&
    !errors.password &&
    !errors.rePassword &&
    username?.length > 0 &&
    email?.length > 0 &&
    password?.length > 0 &&
    rePassword?.length > 0 &&
    passwordStrength?.strength !== "Débil";

  //estados para menejo del registro
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //funcion para manejo de la llamada al backend para el registro
  const handleRegister = async () => {
    if (errors.password) return;
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const data = await registerUser({
        username,
        email,
        password,
      });

      if (data.success) {
        toast.success(`Registro exitoso, confirma tu cuenta desde ${email}`);
        setSuccessMessage(
          "¡Registro exitoso! Ve a tu correo para activar tu cuenta."
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error en el registro";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = () => {
    handleRegister();
    reset();
  };

  //vigilante de form
  useEffect(() => {
    if (password) trigger("password");
  }, [password]);
  useEffect(() => {
    if (rePassword) trigger("password");
  }, [rePassword]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-3 py-1 bg-transparent rounded-sm cursor-pointer hover:bg-white hover:text-black">
          Registrarse
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Registro de usuario</DialogTitle>
          <DialogDescription>Crea tu cuenta en V22</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
          {/* Username */}
          <div className="grid items-center w-full max-w-sm gap-1">
            <Label>Nombre de Usuario</Label>
            <div className="relative">
              <Input
                className="pr-10 rounded-full"
                {...register("username", {
                  required: "El nombre de usuario es requerido",
                  minLength: {
                    value: 3,
                    message: "Mínimo 3 caracteres",
                  },
                  maxLength: {
                    value: 20,
                    message: "Máximo 20 caracteres",
                  },
                  pattern: {
                    value: /^[a-z0-9._]+$/,
                    message: "Solo minúsculas, números, puntos o guiones bajos",
                  },
                })}
                aria-invalid={errors.username ? "true" : "false"}
              />
              <div className="absolute -translate-y-1/2 right-2 top-1/2">
                {validatingName && (
                  <div title="Verificando disponibilidad...">
                    <Loader2 className="text-blue-500 animate-spin" />
                  </div>
                )}
                {!validatingName && successName && (
                  <div title="Nombre de usuario disponible">
                    <UserRoundCheck className="text-green-600" />
                  </div>
                )}
                {!validatingName && errorName && (
                  <div title="Este nombre ya está en uso">
                    <UserRoundX className="text-orange-500 " />
                  </div>
                )}
              </div>
            </div>

            {/* Mensaje de error con animación */}
            <div className="relative h-5 mb-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {errors.username && (
                  <motion.div
                    key={errors.username.message}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center gap-1 text-xs text-orange-500"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.username.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Email */}
          <div className="grid items-center w-full max-w-sm gap-1">
            <Label>Correo</Label>
            <div className="relative">
              <Input
                className="pr-10 rounded-full"
                type="email"
                {...register("email", {
                  required: "El correo es requerido",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Correo no válido",
                  },
                  minLength: {
                    value: 5,
                    message: "Mínimo 6 caracteres",
                  },
                  maxLength: {
                    value: 254,
                    message: "Máximo 254 caracteres",
                  },
                })}
                aria-invalid={errors.email ? "true" : "false"}
              />
              <div className="absolute -translate-y-1/2 right-2 top-1/2">
                {validatingEmail && (
                  <div title="Verificando disponibilidad...">
                    <Loader2 className="text-blue-500 animate-spin" />
                  </div>
                )}
                {!validatingEmail && successEmail && (
                  <div title="Correo disponible">
                    <MailCheck className="text-green-600" />
                  </div>
                )}
                {!validatingEmail && errorEmail && (
                  <div title="Este correo ya está en uso">
                    <MailX className="text-orange-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Mensaje de error con animación */}
            <div className="relative h-5 mb-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {errors.email && (
                  <motion.div
                    key={errors.email.message}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center gap-1 text-xs text-orange-500"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.email.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Password */}
          <div className="grid items-center w-full max-w-sm gap-1">
            <Label>Contraseña</Label>

            <div className="relative">
              <Input
                className="pr-10 rounded-full"
                type="password"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message: "Mínimo 6 caracteres",
                  },
                  maxLength: {
                    value: 64,
                    message: "Máximo 64 caracteres",
                  },
                })}
              />
              <div className="w-full px-4 mt-1">
                {passwordStrength ? (
                  <div className="w-full h-1 overflow-hidden rounded-full bg-zinc-200">
                    <motion.div
                      className="h-full"
                      initial={{ width: 0, backgroundColor: "#ef4444" }}
                      animate={{
                        width: passwordStrength.clase.width,
                        backgroundColor: passwordStrength.bgColor,
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-1 overflow-hidden rounded-full bg-zinc-200"></div>
                )}
                <div className="absolute -translate-y-1/2 right-2 top-1/3">
                  {passwordStrength && (
                    <motion.p
                      key={passwordStrength.strength}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className={`mt-1 text-xs font-medium ${passwordStrength.color}`}
                    >
                      {passwordStrength.strength}
                    </motion.p>
                  )}
                </div>
              </div>
            </div>
            <div className="relative h-5 mb-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {errors.password && (
                  <motion.div
                    key={errors.password.message}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center gap-1 text-xs text-orange-500"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.password.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="grid items-center w-full max-w-sm gap-1">
            <Label>Confirmar contraseña</Label>
            <div className="relative">
              <Input
                className="pr-10 rounded-full"
                type="password"
                {...register("rePassword", {
                  required: "Confirma la contraseña",
                  validate: (value) =>
                    value === password || "Las contraseñas no coinciden",
                })}
              />
              <div className="absolute -translate-y-1/2 right-2 top-1/2">
                {rePassword && !errors.rePassword && (
                  <div title="Contraseña confirmada">
                    <CheckIcon className="text-green-600" />
                  </div>
                )}
                {rePassword && errors.rePassword && (
                  <div title="Las contraseñas no coinciden">
                    <XIcon className="text-orange-500" />
                  </div>
                )}
              </div>
            </div>
            <div className="relative h-5 mb-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {errors.rePassword && (
                  <motion.div
                    key={errors.rePassword.message}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center gap-1 text-xs text-orange-500"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.rePassword.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex flex-col justify-center w-full">
            <Button
              disabled={!isFormValid}
              className="w-full text-xl tracking-tight text-white transition-opacity rounded-full opacity-50 cursor-not-allowed bg-gradient-mascoti enabled:opacity-100 enabled:cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Crear cuenta"
              )}
            </Button>

            {successMessage && (
              <div className="flex justify-center">
                <p className="absolute p-1 mt-2 text-xs font-medium tracking-tight text-green-500 duration-100 rounded-full bottom-2 animate-in">
                  {successMessage}
                </p>
              </div>
            )}
            {errorMessage && (
              <div className="flex justify-center">
                <p className="absolute p-1 mt-2 text-xs font-medium tracking-tight text-red-500 duration-100 rounded-full bottom-2 animate-in">
                  {errorMessage}
                </p>
              </div>
            )}
          </div>
        </form>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
