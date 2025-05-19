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
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import {
  Loader2,
  MailCheck,
  MailX,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";

interface FormInputs {
  username: string;
  email: string;
  password: string;
  rePassword: string;
}

export default function RegisterDialog() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({ mode: "onChange" });

  const password = watch("password");
  const username = watch("username");
  const email = watch("email");

  //estados para el manejo de la validacion de username
  const [successName, setSuccessName] = useState<string | null>(null);
  const [errorName, setErrorName] = useState<string | null>(null);
  const [validatingName, setValidatingName] = useState<boolean>(false);

  //llamada al backend para verioficar el username
  const usernameValidationHandler = async () => {
    setValidatingName(true);
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
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "No disponible";
        setSuccessName(null);
        setErrorName(message);
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
    setValidatingEmail(true);
    setErrorEmail(null);
    setSuccessEmail(null);
    if (errors.username) {
      setValidatingName(false);
      return;
    }
    setTimeout(async () => {
      try {
        const response = await emailValidation({
          email,
        });
        if (response.success) {
          setSuccessEmail(response.success);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "No disponible";
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
        clase: { width: "50%", bg: "bg-yellow-400" },
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

  const [passwordStrength, setPasswordStrength] = useState<{
    strength: "Débil" | "Media" | "Buena" | "Fuerte";
    color: string;
    clase: { width: string; bg: string };
    bgColor: string;
  } | null>(null);

  const onSubmit = (data: FormInputs) => {
    console.log(data);
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
          {/* Username */}
          <div className="flex flex-col">
            <label className="mb-1">Nombre de Usuario</label>
            <div className="relative">
              <Input
                className="pr-10"
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
                    message:
                      "Solo letras minúsculas, números, puntos o guiones bajos",
                  },
                })}
                aria-invalid={errors.username ? "true" : "false"}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
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
                    <UserRoundX className="text-red-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Mensaje de error con animación */}
            <div className="h-4 mt-1 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {errors.username && (
                  <motion.p
                    key={errors.username.message}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs text-red-500 absolute"
                  >
                    {errors.username.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1">Correo</label>
            <div className="relative">
              <Input
                className="pr-10"
                type="email"
                {...register("email", {
                  required: "El correo es obligatorio",
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
                    message: "Mínimo 254 caracteres",
                  },
                })}
                aria-invalid={errors.email ? "true" : "false"}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                {validatingEmail && (
                  <div title="Verificando disponibilidad...">
                    <Loader2 className="text-blue-500 animate-spin" />
                  </div>
                )}
                {!validatingEmail && successEmail && (
                  <div title="Si te puedes registrar con este correo">
                    <MailCheck className="text-green-600" />
                  </div>
                )}
                {!validatingEmail && errorEmail && (
                  <div title="Ya existe una cuenta registrada con este correo">
                    <MailX className="text-red-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Mensaje de error con animación */}
            <div className="h-4 mt-1 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {errors.email && (
                  <motion.p
                    key={errors.email.message}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs text-red-500 absolute"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="mb-1">Contraseña</label>
            <div className="relative">
              <Input
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
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
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
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}

            {passwordStrength && (
              <div className="h-2 mt-2 w-full bg-zinc-200 rounded-full overflow-hidden">
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
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col">
            <label className="mb-1">Confirmar contraseña</label>
            <Input
              type="password"
              {...register("rePassword", {
                required: "Confirma la contraseña",
                validate: (value) =>
                  value === password || "Las contraseñas no coinciden",
              })}
            />
            {errors.rePassword && (
              <p className="text-xs text-red-500">
                {errors.rePassword.message}
              </p>
            )}
          </div>

          <Input
            type="submit"
            value="Registrarse"
            className="bg-green-200 cursor-pointer"
          />
        </form>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
