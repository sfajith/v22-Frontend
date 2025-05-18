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

type Props = {
  form: {
    originalUrl: string;
    userCode?: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      originalUrl: string;
      userCode?: string;
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
    setSuccess(null);
    setError(null);
    const codeRegex = /^[a-zA-Z0-9_-]+$/;
    if (form.userCode) {
      const trimmedCode = form.userCode.trim();
      if (!codeRegex.test(trimmedCode)) {
        setError("Solo se permiten letras, números, guiones y guiones bajos.");
        return;
      }
      if (trimmedCode.length > 12) {
        setError("Tu código es muy largo. Máximo 12 caracteres.");
        return;
      }
      try {
        if (form.userCode.length > 0) {
          const response = await liveCheckCode({ usercode: form.userCode });
          if (response.success) {
            setSuccess(response.success);
          }
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "No disponible";
        setError(message);
      }
    }
  };

  return (
    <motion.div
      className="flex mt-4 mx-auto items-center justify-center gap-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-2xl text-gray-500">http://localhost:3000/</h3>
      <Input
        type="text"
        value={form.userCode}
        className="w-1/4 rounded-full mb-1"
        placeholder="Tu codigo..."
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setForm({ ...form, userCode: e.target.value });
        }}
      />

      <div className="w-5 h-5 relative">
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
                    <CheckCircle className="text-green-500 w-5 h-5 cursor-help" />
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
                    <AlertCircle className="text-red-500 w-5 h-5 cursor-help" />
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
