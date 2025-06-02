import {
  passwordValidation,
  registerUser,
} from "../../features/auth/authService";
import ReCAPTCHA from "react-google-recaptcha";
import {
  usernameValidation,
  emailValidation,
} from "../../features/auth/authService";
import { validatePasswordStrength } from "../../../../shared/validatePasswordStrength";
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
import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  MailCheck,
  MailX,
  UserRoundCheck,
  UserRoundX,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  EyeClosed,
  Eye,
  CircleCheck,
  CircleX,
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

const siteKey: string = import.meta.env.VITE_RECAPTCHA_SITE_KEY!;

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

  const recaptchaRef = useRef<InstanceType<typeof ReCAPTCHA> | null>(null);

  //estados para el manejo de la validacion de username
  const [successName, setSuccessName] = useState<string | null>(null);
  const [errorName, setErrorName] = useState<string | null>(null);
  const [validatingName, setValidatingName] = useState<boolean>(false);

  //Estados para el manejo de mostrar oculat contraseñas
  const [eyePassword, setEyePassword] = useState<boolean>(false);
  const [eyeRePassword, setEyeRePassword] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

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
      usernameValidation({ username })
        .then((response) => {
          setSuccessName("success");
          toast.dismiss(loadingToast);
          toast.success(`El nombre de usuario ${username} está disponible`);
        })
        .catch((error) => {
          toast.dismiss(loadingToast);
          setSuccessName(null);
          setErrorName(error.message);
          toast.error(`El nombre de usuario ${username} no está disponible`);
        })
        .finally(() => {
          setValidatingName(false);
        });
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
      emailValidation({ email })
        .then((response) => {
          toast.dismiss(loadingToast);
          setSuccessEmail("success");
          toast.success(`El email ${email} esta correcto y disponible`);
        })
        .catch((error) => {
          toast.dismiss(loadingToast);
          toast.error(error.message);
          setSuccessEmail(null);
          setErrorEmail("error");
        })
        .finally(() => {
          setValidatingEmail(false);
        });
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

  //estados para menejo del registro
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //funcion para manejo de la llamada al backend para el registro
  const handleRegister = async () => {
    if (errors.password) return;
    setErrorMessage(null);
    setIsLoading(true);

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

    registerUser({
      username,
      email,
      password,
      gToken,
    })
      .then((response) => {
        toast.dismiss();
        toast.success(`Registro exitoso, confirma tu cuenta desde ${email}`);
        setSuccessMessage(
          "¡Registro exitoso! Ve a tu correo para activar tu cuenta."
        );
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onSubmit = () => {
    handleRegister();
    reset();
  };

  //vigilante de form
  useEffect(() => {
    if (password) trigger("password");
    if (rePassword) trigger("rePassword");
  }, [password, rePassword]);

  //verificacion de la contraseña via PWNET
  const [pwnet, setPwnet] = useState<boolean | null>(null);
  const [pwLoading, setPwLoading] = useState<boolean | null>(null);
  const passwordPwnetValidation = (newPassword: string) => {
    setPwnet(null);
    setTimeout(async () => {
      const payload = {
        password: newPassword,
      };
      passwordValidation(payload)
        .then((respond) => {
          setPwLoading(false);
          toast.dismiss();
          toast.success("contraseña revisada por PWNET");
          setPwnet(true);
        })
        .catch((error) => {
          toast.dismiss();
          toast.error(
            "Esta contraseña podría haber sido expuesta antes. Cambiarla ayuda a protegerte."
          );
          setPwLoading(false);
          setPwnet(false);
        });
    }, 400);
  };

  //useEffect para manejar la validacion de newPassword PWNET
  useEffect(() => {
    setPwLoading(null);
    if (!password) {
      return;
    }
    if (
      password.length < 6 ||
      password.length > 64 ||
      passwordStrength?.strength === "Débil" ||
      passwordStrength?.strength === "Media"
    ) {
      return;
    }
    toast.dismiss();
    setPwLoading(true);
    toast.loading("Verificando contraseña");
    const passwordHandler = setTimeout(() => {
      passwordPwnetValidation(password);
    }, 700);

    return () => clearTimeout(passwordHandler);
  }, [password, passwordStrength?.strength]);

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
    passwordStrength?.strength !== "Débil" &&
    passwordStrength?.strength !== "Media" &&
    pwnet === true;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
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
              <Label className="mb-1 text-base font-medium text-zinc-600">
                Nombre de Usuario
              </Label>
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
                      message:
                        "Solo minúsculas, números, puntos o guiones bajos",
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
                      <UserRoundCheck className="text-[#06d6a0]" />
                    </div>
                  )}
                  {!validatingName && errorName && (
                    <div title="Este nombre ya está en uso">
                      <UserRoundX className="text-[#f77f00]" />
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
                      className="absolute inset-0 flex items-center gap-1 text-xs text-[#f77f00]"
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
              <Label className="mb-1 text-base font-medium text-zinc-600">
                Correo
              </Label>
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
                      <MailCheck className="text-[#06d6a0]" />
                    </div>
                  )}
                  {!validatingEmail && errorEmail && (
                    <div title="Este correo ya está en uso">
                      <MailX className="text-[#f77f00]" />
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
                      className="absolute inset-0 flex items-center gap-1 text-xs text-[#f77f00]"
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
              <Label className="mb-1 text-base font-medium text-zinc-600">
                Contraseña
              </Label>

              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={eyePassword ? "text" : "password"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Input
                      className="pr-10 rounded-full"
                      type={eyePassword ? "text" : "password"}
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
                  </motion.div>
                </AnimatePresence>
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
                  <div className="absolute flex items-center -translate-y-1/2 right-2 top-2/5">
                    {passwordStrength &&
                      (passwordStrength.strength === "Buena" ||
                        passwordStrength.strength === "Fuerte") &&
                      pwLoading === false &&
                      pwnet === false && (
                        <motion.div
                          key={passwordStrength.strength + "-alert"}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-[9px] font-medium text-[#f77f00]"
                        >
                          <div className="flex items-center pt-1">
                            <p>No segura</p>
                            <ShieldAlert className="ml-1" />
                          </div>
                        </motion.div>
                      )}

                    {passwordStrength &&
                      pwnet === true &&
                      (passwordStrength.strength === "Buena" ||
                        passwordStrength.strength === "Fuerte") &&
                      pwLoading === false && (
                        <motion.div
                          key={passwordStrength.strength + "-pwnet"}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-[9px] font-medium text-[#06d6a0]"
                        >
                          <div className="flex items-center pt-1">
                            <p>
                              Verificado <br /> por PWNET
                            </p>
                            <ShieldCheck className="ml-1" />
                          </div>
                        </motion.div>
                      )}

                    {passwordStrength &&
                      pwLoading === true &&
                      (passwordStrength.strength === "Buena" ||
                        passwordStrength.strength === "Fuerte") && (
                        <motion.div
                          key={passwordStrength.strength + "-loading"}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-[9px] font-medium text-[#118ab2]"
                        >
                          <div className="flex items-center pt-1">
                            <Loader2 className="animate-spin" />
                          </div>
                        </motion.div>
                      )}
                    {/* Botón mostrar/ocultar */}
                    <button
                      type="button"
                      onClick={() => setEyePassword(!eyePassword)}
                      className="cursor-pointer text-zinc-500 hover:text-zinc-700"
                    >
                      <AnimatePresence mode="wait">
                        {eyePassword ? (
                          <motion.div
                            key="eye-closed"
                            initial={{ opacity: 0, rotate: -10 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <EyeClosed />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="eye"
                            initial={{ opacity: 0, rotate: 10 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Eye />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
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
                      className="absolute inset-0 flex items-center gap-1 text-xs text-[#f77f00]"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errors.password.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mt-5">
              <Label className="mb-1 text-base font-medium text-zinc-600">
                Confirmar nueva contraseña
              </Label>
              <div className="relative mt-1">
                {/* Campo Input con animación */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={eyeRePassword ? "text" : "password"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Input
                      className="pr-10 rounded-full"
                      type={eyeRePassword ? "text" : "password"}
                      {...register("rePassword", {
                        validate: (value) =>
                          value === password || "Las contraseñas no coinciden",
                      })}
                      aria-invalid={errors.rePassword ? "true" : "false"}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Íconos y botón para mostrar/ocultar */}
                <div className="absolute flex items-center gap-2 -translate-y-1/2 right-2 top-2/4">
                  {rePassword && !errors.rePassword && (
                    <div title="Contraseña confirmada">
                      <CircleCheck className="text-[#06d6a0]" />
                    </div>
                  )}
                  {rePassword && errors.rePassword && (
                    <div title="Las contraseñas no coinciden">
                      <CircleX className="text-[#f77f00]" />
                    </div>
                  )}

                  {/* Botón mostrar/ocultar */}
                  <button
                    type="button"
                    onClick={() => setEyeRePassword(!eyeRePassword)}
                    className="cursor-pointer text-zinc-500 hover:text-zinc-700"
                  >
                    <AnimatePresence mode="wait">
                      {eyeRePassword ? (
                        <motion.div
                          key="eye-closed"
                          initial={{ opacity: 0, rotate: -10 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <EyeClosed />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="eye"
                          initial={{ opacity: 0, rotate: 10 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Eye />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>

              {/* Mensaje de error */}
              <div className="relative h-5 mb-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {errors.rePassword && (
                    <motion.div
                      key={errors.rePassword.message}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 flex items-center gap-1 text-xs text-[#f77f00]"
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
