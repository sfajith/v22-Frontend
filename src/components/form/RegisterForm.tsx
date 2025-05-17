import { useState } from "react";
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
import { useAppDispatch } from "../../app/hooks";
import { registerUser } from "../../features/auth/authService";
import { globalError } from "../../features/auth/authSlice";

export default function RegisterDialog() {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    repassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
            <Input
              id="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="ej: sherjan.dev"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Correo
            </label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="ejemplo@correo.com"
            />
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
