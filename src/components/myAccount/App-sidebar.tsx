import { Label } from "@/components/ui/label";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserCog } from "lucide-react";
import md5 from "md5";
import { useState } from "react";
import { SidebarAccordion } from "./SidebarAccordion";

type PropAppSidebar = {
  email?: string;
  username?: string;
};

export function AppSidebar({ email, username }: PropAppSidebar) {
  const hash = md5(email || "");
  const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=identicon`;

  const [open, setOpen] = useState<boolean>(false);

  return (
    <Sheet>
      <SheetTrigger asChild className="cursor-pointer">
        <UserCog />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Mi cuenta</SheetTitle>
          <SheetDescription>
            Modifica tu perfil aquí. Guarda los cambios cuando termines.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 ">
          <div className="text-center">
            <h3>Mi perfil</h3>
          </div>
          <div className="grid grid-cols-1 justify-items-center">
            <img
              src={gravatarUrl}
              alt="Avatar"
              className="w-20 h-20 rounded-full"
            />
            <span className="text-lg text-muted-foreground text-center">
              @{username}
            </span>
            <div className="mt-3 py-2 px-4 bg-gradient-mascoti  rounded-full text-white">
              <span>{email}</span>
            </div>
          </div>
          <div className="px-4">
            <SidebarAccordion />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Label className="text-lg text-muted-foreground text-center cursor-pointer">
              Cerrar Sesión
            </Label>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
