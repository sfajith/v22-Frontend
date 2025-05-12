import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "../ui/input";

export function SidebarAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Cambiar Contraseña</AccordionTrigger>
        <AccordionContent>
          <div className="px-6 bg-gray-100 rounded-lg pt-2 pb-4">
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {}}
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
                type="newPassword"
                name="newPassword"
                id="newPassword"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {}}
              />
            </div>
            <div className="formDiv">
              <label
                className="text-xs text-muted-foreground"
                htmlFor="RePassword"
              >
                Confirma tu nueva Contraseña
              </label>
              <input
                className="bg-white"
                type="RePassword"
                name="RePassword"
                id="RePassword"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {}}
              />
            </div>
            <div className="formDiv">
              <button
                className="bg-gradient-mascoti buttom-mascoti"
                onClick={() => {}}
              >
                Confirmar
              </button>
            </div>
          </div>
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
