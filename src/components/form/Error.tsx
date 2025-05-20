import { toast } from "sonner";

export function Error(message: string) {
  toast.error("Error", {
    description: message,
  });
}
