import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Datos simulados para cada rango
const dataByRange = {
  week: [
    { date: "01 May", ctr: 12.3 },
    { date: "02 May", ctr: 10.8 },
    { date: "03 May", ctr: 14.2 },
    { date: "04 May", ctr: 9.5 },
    { date: "05 May", ctr: 11.1 },
    { date: "06 May", ctr: 13.6 },
    { date: "07 May", ctr: 12.9 },
  ],
  month: Array.from({ length: 30 }, (_, i) => ({
    date: `${i + 1} May`,
    ctr: +(8 + Math.random() * 7).toFixed(2),
  })),
  year: Array.from({ length: 12 }, (_, i) => ({
    date: new Date(2025, i).toLocaleString("default", { month: "short" }),
    ctr: +(7 + Math.random() * 8).toFixed(2),
  })),
};

export default function CTRChart() {
  const [range, setRange] = useState<"week" | "month" | "year">("week");

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Tasa de Clics (CTR)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Porcentaje promedio de clics por enlace (
            {range === "week"
              ? "últimos 7 días"
              : range === "month"
              ? "último mes"
              : "último año"}
            )
          </p>
        </div>
        <Select
          value={range}
          onValueChange={(value: "week" | "month" | "year") => setRange(value)}
        >
          <SelectTrigger className="w-[140px] text-sm">
            <SelectValue placeholder="Rango" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Últimos 7 días</SelectItem>
            <SelectItem value="month">Último mes</SelectItem>
            <SelectItem value="year">Último año</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataByRange[range]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, "dataMax + 5"]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="ctr"
              stroke="#4F46E5"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
