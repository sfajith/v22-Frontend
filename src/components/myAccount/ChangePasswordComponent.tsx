import { useUserAccount } from "../../app/hooks/useUserAccount";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
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
import { Label } from "../ui/label";
import {
  AlertCircle,
  CheckIcon,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  XIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { validatePasswordStrength } from "../../../../shared/validatePasswordStrength";
import { toast } from "sonner";
import { passwordValidation } from "../../features/auth/authService";

//unificacion de clases condicionales
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type Inputs = {
  password: string;
  rePassword: string;
  newPassword: string;
};

export function ChangePasswordComponent() {
  const { evento, handlerChangePassword, setEvento } = useUserAccount();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<Inputs>();

  const password = watch("password");
  const newPassword = watch("newPassword");
  const rePassword = watch("rePassword");

  //trigger de validacion fortaleza de contraseña
  useEffect(() => {
    if (newPassword) {
      setNewPasswordStrength(validatePasswordStrength(newPassword));
    } else {
      setNewPasswordStrength(null);
    }
  }, [newPassword]);

  const [newPasswordStrength, setNewPasswordStrength] = useState<{
    strength: "Débil" | "Media" | "Buena" | "Fuerte";
    color: string;
    clase: { width: string; bg: string };
    bgColor: string;
  } | null>(null);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.newPassword !== data.rePassword) {
      return toast.error("Las contraseñas no coinciden");
    }
    await handlerChangePassword(data.password, data.newPassword);
  };

  //verificacion de la contraseña via PWNET
  const passwordPwnetValidation = async (newPassword: string) => {
    try {
      toast.dismiss();
      toast.loading("Verificando contraseña");
      const payload = {
        password: newPassword,
      };
      const response = await passwordValidation(payload);

      if (response.success) {
        toast.dismiss();
        toast.success("contraseña revisada por PWNET");
      }
    } catch (error) {
      toast.dismiss();
      toast.error(
        "Esta contraseña podría haber sido expuesta antes. Cambiarla ayuda a protegerte."
      );
    }
  };

  //useEffect para manejar la validacion de newPassword PWNET
  useEffect(() => {
    if (!newPassword) {
      return;
    }
    if (
      newPassword.length < 6 ||
      newPassword.length > 64 ||
      newPasswordStrength?.strength === "Débil" ||
      newPasswordStrength?.strength === "Media"
    ) {
      return;
    }

    const passwordHandler = setTimeout(() => {
      passwordPwnetValidation(newPassword);
    }, 700);

    return () => clearTimeout(passwordHandler);
  }, [newPassword, newPasswordStrength?.strength]);

  //vigilante de form
  useEffect(() => {
    if (password) {
      trigger("password");
      setEvento(null);
    }
    if (newPassword) {
      trigger("newPassword");
      setEvento(null);
    }
    if (rePassword) {
      trigger("rePassword");
      setEvento(null);
    }
  }, [password, newPassword, rePassword]);

  //modelo de comprobacion para permitir el evento submit
  const isFormValid =
    !errors.password &&
    !errors.newPassword &&
    !errors.rePassword &&
    password?.length > 0 &&
    newPassword.length > 0 &&
    rePassword?.length > 0 &&
    newPasswordStrength?.strength !== "Débil" &&
    newPasswordStrength?.strength !== "Media";

  return (
    <Dialog>
      <DialogTrigger className="w-full text-left">
        Cambiar Contraseña
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Cambiar Contraseña</DialogTitle>
          <DialogDescription>
            Actualiza tu contraseña de forma segura.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
          <Label>Contraseña</Label>
          <Input
            className="pr-10 mt-1 rounded-full"
            type="password"
            {...register("password", {
              required: "Ingresa tu contraseña actual",
              minLength: { value: 6, message: "Contraseña incompleta" },
              maxLength: {
                value: 64,
                message: "Esto es muy largo para ser tu contraseña",
              },
            })}
            aria-invalid={errors.password ? "true" : "false"}
          />
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

          <Label>Nueva contraseña</Label>
          <div className="relative mt-1">
            <Input
              className="pr-10 rounded-full"
              type="password"
              {...register("newPassword", {
                required: "Ingresa tu nueva contraseña",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener minimo 6 caracteres",
                },
                maxLength: {
                  value: 64,
                  message: "Maximo 64 caracteres",
                },
              })}
              aria-invalid={errors.newPassword ? "true" : "false"}
            />
            <div className="w-full px-4 mt-1">
              {newPasswordStrength ? (
                <div className="w-full h-1 overflow-hidden rounded-full bg-zinc-200">
                  <motion.div
                    className="h-full"
                    initial={{ width: 0, backgroundColor: "#ef4444" }}
                    animate={{
                      width: newPasswordStrength.clase.width,
                      backgroundColor: newPasswordStrength.bgColor,
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                </div>
              ) : (
                <div className="w-full h-1 overflow-hidden rounded-full bg-zinc-200"></div>
              )}
              <div className="absolute -translate-y-1/2 right-2 top-1/3">
                {newPasswordStrength &&
                  (newPasswordStrength.strength === "Débil" ||
                    newPasswordStrength.strength === "Media") && (
                    <motion.p
                      key={newPasswordStrength.strength}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className={`mt-1 text-xs font-medium text-[#f77f00]`}
                    >
                      <div className="flex items-center text-[9px] pt-1">
                        <p>No segura</p>
                        <ShieldAlert />
                      </div>
                    </motion.p>
                  )}
                {newPasswordStrength &&
                  (newPasswordStrength.strength === "Buena" ||
                    newPasswordStrength.strength === "Fuerte") && (
                    <motion.p
                      key={newPasswordStrength.strength}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className={`mt-1 text-xs font-medium text-[#06d6a0]`}
                    >
                      <div className="flex items-center text-[9px] pt-1">
                        <p>
                          Verificado <br /> por PWNET
                        </p>
                        <ShieldCheck />
                      </div>
                    </motion.p>
                  )}
              </div>
            </div>
          </div>
          <div className="mt-5">
            <Label>Confirmar nueva contraseña</Label>
            <div className="relative mt-1">
              <Input
                className="pr-10 rounded-full"
                type="password"
                {...register("rePassword", {
                  validate: (value) =>
                    value === newPassword || "Las contraseñas no coinciden",
                })}
                aria-invalid={errors.rePassword ? "true" : "false"}
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
          <div className="flex flex-col justify-center w-full mt-2">
            <Button
              type="submit"
              disabled={!isFormValid}
              className="w-full text-lg tracking-tight text-white transition-opacity rounded-full opacity-50 cursor-not-allowed bg-gradient-mascoti enabled:opacity-100 enabled:cursor-pointer"
            >
              {evento === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Cambiar contraseña"
              )}
            </Button>

            {evento === "success" && (
              <div className="flex justify-center mt-2">
                <p className="absolute p-1 text-xs font-medium tracking-tight text-green-500 duration-100 rounded-full bottom-2 animate-in">
                  Cambio de contraseña exitoso, vuelve a ingresar...
                </p>
              </div>
            )}
            {evento === "error" && (
              <div className="flex justify-center mt-2">
                <p className="absolute p-1 mt-4 text-xs font-medium tracking-tight text-red-500 duration-100 rounded-full bottom-2 animate-in">
                  No se pudo cambiar la contraseña.
                </p>
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
