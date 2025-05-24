import { useUserAccount } from "../../app/hooks/useUserAccount";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "recharts";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CircleAlert, Eye, EyeClosed } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Inputs = {
  password: string;
  elimimar: string;
};

export function DeleteAccountComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [eyePassword, setEyePassword] = useState<boolean>(false);
  const { handlerDeleteUserAcount } = useUserAccount();
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const password = watch("password");

  const deleteUserHandler = async () => {
    await handlerDeleteUserAcount(password);
    console.log("funciona");
  };

  //trigger de validacion fortaleza de contraseña

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger className="w-full mt-5 text-center text-red-400 cursor-pointer">
        Eliminar Cuenta
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Cuenta</DialogTitle>
          <DialogDescription>
            Esta acción es permanente. Ingresa tu contraseña para confirmar.
          </DialogDescription>
        </DialogHeader>
        <form>
          <Label>Contraseña</Label>
          <div className="relative mt-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={eyePassword ? "text" : "password"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Input
                  className="pr-10 mt-1 rounded-full"
                  type={eyePassword ? "text" : "password"}
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
              </motion.div>
            </AnimatePresence>
            {/* Mensajes y botón para mostrar/ocultar */}
            <div className="absolute flex items-center gap-2 -translate-y-1/2 right-2 top-2/4">
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="cursor-pointer">
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  <CircleAlert className="text-[#ef476f] cursor-pointer" />{" "}
                  ¿Estas completamente seguro?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Deseas eliminar tu cuenta? todos tus enlaces seran borrados y
                  dejaran de funcionar.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  className="cursor-pointer"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    className="bg-[#ef476f] cursor-pointer"
                    type="button"
                    onClick={() => {
                      deleteUserHandler();
                    }}
                  >
                    Eliminar cuenta
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </DialogContent>
    </Dialog>
  );
}
