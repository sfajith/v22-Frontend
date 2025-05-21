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
import { useAppDispatch } from "../../app/hooks";
import { loginSuccess } from "../../features/auth/authSlice";
import { loginUser } from "../../features/auth/authService";
import { Loader2 } from "lucide-react"; // Ícono de carga de Lucide
import { useNavigate } from "react-router-dom";
import { useUserCollection } from "../../app/hooks/useUserCollection";
import { toast } from "sonner";

export default function LoginDialog() {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const isFormValid = form.email !== "" && form.password !== "";
  const navigate = useNavigate();

  const { handlerLoadCollection } = useUserCollection();

  const handleLogin = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const data = await loginUser({
          email: form.email,
          password: form.password,
        });
        dispatch(loginSuccess(data));
        handlerLoadCollection();
        console.log(data);
        localStorage.setItem("token", data.token);
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

  return (
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
              placeholder="tu contraseña"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            onClick={handleForgotPassword}
            className="text-xs font-medium underline cursor-pointer text-muted-foreground"
          >
            Olvidé mi contraseña
          </button>
          {errorMessage && (
            <p className="text-sm font-medium text-red-500">{errorMessage}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            disabled={!isFormValid || isLoading}
            onClick={handleLogin}
            className="flex items-center justify-center w-full gap-2 rounded-full cursor-pointer bg-gradient-mascoti"
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
  );
}
