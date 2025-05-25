import { useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { restorePassword } from "../features/auth/authService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [form, setForm] = useState<{ password: string; rePassword: string }>({
    password: "",
    rePassword: "",
  });
  const [error, setError] = useState<boolean>(false);
  const [evento, setEvento] = useState<string | null>(null);

  const resendHandlder = async () => {
    toast.dismiss();
    setEvento(null);
    const payload = {
      token,
      password: form.password,
    };
    try {
      setEvento("loading");
      const response = await restorePassword(payload);
      if (response.success) {
        toast.dismiss();
        setEvento(null);
        toast.success("Contraseña reestablecida con exito!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      toast.dismiss();
      setEvento(null);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "No se pudo reestablecer la contraseña";
      toast.error(errorMessage);
      if (errorMessage === "") {
        setError(true);
      }
    }
  };
  return (
    <>
      {!error ? (
        <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-94px)] px-4">
          <h3 className="text-3xl md:text-4xl font-extrabold text-[#751B80] text-center tracking-tight leading-tight mb-6">
            Restablecer contraseña
          </h3>
          <form
            className="w-full max-w-md p-6 space-y-4 bg-white shadow-lg rounded-2xl"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              resendHandlder();
            }}
          >
            <div className="flex flex-col space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 text-base font-medium text-zinc-600"
                >
                  Nueva contraseña
                </label>
                <input
                  required
                  className="px-4 py-2 border border-zinc-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#751B80] w-full"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="mínimo 5 caracteres"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setForm({ ...form, password: e.target.value });
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="rePassword"
                  className="mb-1 text-base font-medium text-zinc-600"
                >
                  Confirmar contraseña
                </label>
                <input
                  required
                  className="px-4 py-2 border border-zinc-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#751B80] w-full"
                  type="password"
                  name="rePassword"
                  id="rePassword"
                  placeholder="deben coincidir"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setForm({ ...form, rePassword: e.target.value });
                  }}
                />
              </div>

              {form.rePassword.length >= 1 &&
                (form.password !== form.rePassword ? (
                  <p className="text-xs text-center text-red-500">
                    Las contraseñas deben coincidir
                  </p>
                ) : (
                  <p className="text-xs text-center text-green-600">
                    Contraseña confirmada
                  </p>
                ))}

              <div className="pt-2">
                <Button
                  type="submit"
                  className="cursor-pointer w-full py-2 px-4 text-white text-lg font-semibold tracking-tight rounded-full bg-gradient-to-r from-[#751B80] to-[#A84ACF] transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={evento === "loading"}
                >
                  {evento === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Recuperar contraseña
                    </>
                  ) : (
                    "Cambiar contraseña"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="fixed inset-0 z-[50] flex justify-center items-center bg-black/40 pointer-events-auto">
          <div className="pointer-events-auto">
            <Button
              className="cursor-pointer bg-gradient-to-r from-[#751B80] to-[#A84ACF] text-white font-semibold px-4 py-2 rounded-full"
              onClick={() => {
                navigate("/");
              }}
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default ResetPassword;
