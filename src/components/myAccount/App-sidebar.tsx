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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UserCog } from "lucide-react";
import md5 from "md5";
import { ChangePasswordComponent } from "./ChangePasswordComponent";
import { DeleteAccountComponent } from "./DeleteAccountComponent";
import { Button } from "../ui/button";

type PropAppSidebar = {
  email?: string;
  username?: string;
};

export function AppSidebar({ email, username }: PropAppSidebar) {
  const hash = md5(email || "");
  const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=identicon`;

  const logOutHandler = () => {
    localStorage.removeItem("token"); // Eliminar token
    window.location.href = "/";
  };

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
            <span className="text-lg text-center text-muted-foreground">
              @{username}
            </span>
            <div className="px-4 py-2 mt-3 text-white rounded-full bg-gradient-mascoti">
              <span>{email}</span>
            </div>
          </div>
          <div className="px-4">
            <ChangePasswordComponent />
            <DeleteAccountComponent />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <AlertDialog>
              <AlertDialogTrigger className="text-left cursor-pointer text-muted-foreground">
                Cerrar sesion
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Seguro que quieres cerrar sesion?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Cancelar
                  </AlertDialogCancel>
                  <Button
                    className="bg-red-400 cursor-pointer hover:bg-red-300"
                    onClick={() => {
                      logOutHandler();
                    }}
                  >
                    Salir
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
