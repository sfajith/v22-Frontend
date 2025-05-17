import { AnimatePresence, motion } from "framer-motion";
import { Input } from "./ui/input";

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
  return (
    <motion.div
      className="flex mt-4 mx-auto items-center justify-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-2xl text-gray-500">http://localhost:3000/</h3>
      <Input
        type="text"
        value={form.userCode}
        className="w-1/4 rounded-full"
        placeholder="Tu codigo..."
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setForm({ ...form, userCode: e.target.value });
        }}
      />
    </motion.div>
  );
}

export default UserCode;
