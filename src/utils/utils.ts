//validacion de la fortaleza de la contraseña
export function validatePasswordStrength(password: string): {
  strength: "Débil" | "Media" | "Buena" | "Fuerte";
  color: string;
  clase: { width: string; bg: string };
  bgColor: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1)
    return {
      strength: "Débil",
      color: "text-red-500",
      clase: { width: "25%", bg: "bg-red-500" },
      bgColor: "#ef4444", // rojo
    };
  if (score === 2)
    return {
      strength: "Media",
      color: "text-yellow-500",
      clase: { width: "50%", bg: "bg-orange-400" },
      bgColor: "#facc15", // amarillo
    };
  if (score === 3)
    return {
      strength: "Buena",
      color: "text-yellow-500",
      clase: { width: "75%", bg: "bg-yellow-400" },
      bgColor: "#facc15",
    };
  return {
    strength: "Fuerte",
    color: "text-green-500",
    clase: { width: "100%", bg: "bg-green-500" },
    bgColor: "#22c55e", // verde
  };
}
