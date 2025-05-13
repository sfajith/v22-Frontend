import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUserAccount } from "../../app/hooks/useUserAccount";

export function SidebarAccordion() {
  const { form, setForm, handlerChangePassword } = useUserAccount();

  const changePasswordHandler = async () => {
    await handlerChangePassword();
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Cambiar Contraseña</AccordionTrigger>
        <AccordionContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.password || !form.newPassword || !form.rePassword) {
                alert("Todos los campos son obligatorios.");
                return;
              }
              if (form.newPassword !== form.rePassword) {
                alert("Las nuevas contraseñas no coinciden.");
                return;
              }
              changePasswordHandler();
            }}
            className="px-6 bg-gray-100 rounded-lg pt-2 pb-4"
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
                className="bg-white"
                type="password"
                name="rePassword"
                id="rePassword"
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setForm({ ...form, rePassword: e.target.value });
                }}
              />
            </div>

            <div className="formDiv">
              <button
                type="submit"
                className="bg-gradient-mascoti buttom-mascoti"
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
          <div className="px-6 bg-red-100 rounded-lg pt-2 pb-4">
            <div className="formDiv">
              <label
                className="text-xs text-muted-foreground"
                htmlFor="password"
              >
                Ingresa tu Contraseña
              </label>
              <input
                className="bg-white"
                type="password"
                name="password"
                id="password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {}}
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
                className="bg-white"
                type="newPassword"
                name="newPassword"
                id="newPassword"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {}}
              />
            </div>

            <div className="formDiv">
              <button className="bg-red-400 buttom-mascoti" onClick={() => {}}>
                Eliminar cuenta
              </button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
