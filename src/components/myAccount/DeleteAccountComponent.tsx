import { useUserAccount } from "../../app/hooks/useUserAccount";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

export function DeleteAccountComponent() {
  const [eliminar, setEliminar] = useState<string>("");
  const { form, setForm, handlerChangePassword, handlerDeleteUserAcount } =
    useUserAccount();

  const deleteUserHandler = async () => {
    await handlerDeleteUserAcount();
  };

  //trigger de validacion fortaleza de contraseña

  return (
    <Dialog>
      <DialogTrigger className="w-full text-left text-red-400">
        Eliminar Cuenta
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Cuenta</DialogTitle>
          <DialogDescription>
            Esta acción es permanente. Ingresa tu contraseña para confirmar.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            deleteUserHandler();
          }}
        >
          <div className="formDiv">
            <label className="text-xs text-muted-foreground" htmlFor="password">
              Ingresa tu Contraseña
            </label>
            <input
              required
              className="bg-white"
              type="password"
              id="password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="formDiv">
            <label className="text-xs text-muted-foreground" htmlFor="eliminar">
              Confirma escribiendo "eliminar"
            </label>
            <input
              required
              className="bg-white"
              type="text"
              id="eliminar"
              onChange={(e) => setEliminar(e.target.value)}
            />
            {eliminar === "eliminar" && (
              <p className="mt-1 text-xs text-red-500">
                ¿Seguro? Te vamos a extrañar 😞
              </p>
            )}
          </div>

          <DialogFooter>
            <button
              className="bg-red-400 buttom-mascoti disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={form.password.length < 5 || eliminar !== "eliminar"}
            >
              Eliminar cuenta
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
