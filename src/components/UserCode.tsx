import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Input } from "./ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { liveCheckCode } from "../features/links/linkService";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  form: {
    originalUrl: string;
    userCode?: string;
    isValidCode: boolean;
    isValidUrl: string | null;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      originalUrl: string;
      userCode?: string;
      isValidCode: boolean;
      isValidUrl: string | null;
    }>
  >;
};

function UserCode({ form, setForm }: Props) {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const debounceDelay = 700;

  useEffect(() => {
    if (!form.userCode) {
      if (success !== null) setSuccess(null);
      if (error !== null) setError(null);
      return;
    }
    const handler = setTimeout(() => {
      liveCheckHandler();
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [form.userCode]);

  const liveCheckHandler = async () => {
    toast.dismiss();
    setSuccess(null);
    setError(null);
    toast.loading(`Verificando ${form.userCode}`);
    const codeRegex = /^[a-zA-Z0-9_-]+$/;
    if (form.userCode) {
      const trimmedCode = form.userCode.trim();
      if (!codeRegex.test(trimmedCode)) {
        toast.dismiss();
        setError("Solo se permiten letras, números, guiones y guiones bajos.");
        toast.error(
          "Solo se permiten letras, números, guiones y guiones bajos."
        );
        setForm({ ...form, isValidCode: false });
        return;
      }
      if (trimmedCode.length > 12) {
        toast.dismiss();
        setError("Tu código es muy largo. Máximo 12 caracteres.");
        toast.error("Tu código es muy largo. Máximo 12 caracteres.");
        setForm({ ...form, isValidCode: false });
        return;
      }
      try {
        if (form.userCode.length > 0) {
          const response = await liveCheckCode({ usercode: form.userCode });
          if (response.success) {
            toast.dismiss();
            setSuccess(response.success);
            toast.success(`"${form.userCode}" esta disponible`);
            setForm({ ...form, isValidCode: true });
          }
        }
      } catch (error) {
        toast.dismiss();
        const message =
          error instanceof Error ? error.message : "No disponible";
        setError(message);
        setForm({ ...form, isValidCode: false });
        toast.error(`${form.userCode} no esta disponible`);
      }
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center gap-2 mx-auto mt-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-2xl text-gray-500">http://localhost:3000/</h3>
      <Input
        type="text"
        value={form.userCode}
        className="mb-1 rounded-full w-1/9"
        placeholder="Tu codigo..."
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setForm({ ...form, userCode: e.target.value });
        }}
      />

      <div className="relative w-5 h-5">
        <AnimatePresence mode="wait">
          {success && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute top-0 left-0"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CheckCircle className="w-5 h-5 text-green-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Código disponible</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute top-0 left-0"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="w-5 h-5 text-red-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{error}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default UserCode;
