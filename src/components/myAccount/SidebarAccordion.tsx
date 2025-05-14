import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUserAccount } from "../../app/hooks/useUserAccount";
import { useState } from "react";

export function SidebarAccordion() {
  const [eliminar, setEliminar] = useState<string>("");
  const { form, setForm, handlerChangePassword, handlerDeleteUserAcount } =
    useUserAccount();

  const changePasswordHandler = async () => {
    await handlerChangePassword();
  };

  const deleteUserHandler = async () => {
    await handlerDeleteUserAcount();
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Cambiar Contraseña</AccordionTrigger>
        <AccordionContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              changePasswordHandler();
            }}
            className="px-6 border rounded-lg pt-2 pb-4"
          >
            <div className="formDiv">
              <label
                className="text-xs text-muted-foreground"
                htmlFor="password"
              >
                Ingresa tu Contraseña actual
              </label>
              <input
                className="bg-white"
                type="password"
                name="password"
                id="password"
                value={form.newPassword}
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setForm({ ...form, password: e.target.value });
                }}
              />
            </div>

            <div className="formDiv">
              <label
                className="text-xs text-muted-foreground"
                htmlFor="newPassword"
              >
                Ingresa tu nueva Contraseña
              </label>
              <input
                className="bg-white"
                type="password"
                name="newPassword"
                id="newPassword"
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setForm({ ...form, newPassword: e.target.value });
                }}
              />
            </div>

            <div className="formDiv">
              <label
                className="text-xs text-muted-foreground"
                htmlFor="rePassword"
              >
                Confirma tu nueva Contraseña
              </label>
              <input
                className={
                  form.newPassword !== form.rePassword
                    ? "focus:bg-red-100 bg-white"
                    : "focus:bg-green-100 bg-white"
                }
                type="password"
                name="rePassword"
                id="rePassword"
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setForm({ ...form, rePassword: e.target.value });
                }}
              />
              {form.rePassword && form.newPassword !== form.rePassword && (
                <p className="text-red-500 text-xs mt-1">
                  Las contraseñas no coinciden.
                </p>
              )}
            </div>

            <div className="formDiv">
              <button
                disabled={
                  form.newPassword !== form.rePassword ||
                  form.newPassword.length < 5 ||
                  form.password.length < 5
                }
                type="submit"
                className="bg-gradient-mascoti buttom-mascoti disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar
              </button>
            </div>
          </form>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="text-red-400">
          Eliminar Cuenta
        </AccordionTrigger>
        <AccordionContent>
          <form
            className="px-6 bg-red-100 rounded-lg pt-2 pb-4"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              deleteUserHandler();
            }}
          >
            <div className="formDiv">
              <label
                className="text-xs text-muted-foreground"
                htmlFor="password"
              >
                Ingresa tu Contraseña
              </label>
              <input
                required
                className="bg-white"
                type="password"
                name="password"
                id="password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setForm({ ...form, password: e.target.value });
                }}
              />
            </div>
            <div className="formDiv">
              <label
                className="text-xs text-muted-foreground"
                htmlFor="newPassword"
              >
                Confirma escribiendo "eliminar"
              </label>
              <input
                required
                className="bg-white"
                type="text"
                name="eliminar"
                id="eliminar"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEliminar(e.target.value);
                }}
              />
              {eliminar === "eliminar" && (
                <p className="text-red-500 text-xs mt-1">
                  Seguro? te vamos a extrañar 😞
                </p>
              )}
            </div>

            <div className="formDiv">
              <button
                className="bg-red-400 buttom-mascoti disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={form.password.length < 5 || eliminar !== "eliminar"}
              >
                Eliminar cuenta
              </button>
            </div>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
