import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { disableSuccess } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../app/hooks";

export function Success({
  title = "¡Éxito!",
  success = "Tu acción se completó correctamente.",
  actionText = "Aceptar",
  actionLink = "/",
}: {
  title?: string;
  success?: string;
  actionText?: string;
  actionLink?: string;
}) {
  const dispatch = useAppDispatch();
  const succesHandler = () => {
    dispatch(disableSuccess());
  };
  return (
    <motion.div
      className="max-w-md mx-auto mt-24 p-6 rounded-2xl shadow-lg bg-white text-center border border-gray-200"
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="flex justify-center text-green-500 mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120, delay: 0.3 }}
      >
        <CheckCircle className="w-12 h-12" />
      </motion.div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{success}</p>
    </motion.div>
  );
}
