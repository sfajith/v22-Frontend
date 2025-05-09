import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { subDays, subMonths, subYears, isAfter, format } from "date-fns";

type ClickData = {
  date: string;
  clicks: number;
};

const mockData: ClickData[] = [
  { date: "2025-04-01", clicks: 12 },
  { date: "2025-04-12", clicks: 32 },
  { date: "2025-04-20", clicks: 20 },
  { date: "2025-05-01", clicks: 15 },
  { date: "2025-05-02", clicks: 30 },
  { date: "2025-05-03", clicks: 18 },
  { date: "2025-05-04", clicks: 25 },
  { date: "2025-05-05", clicks: 42 },
  { date: "2025-05-06", clicks: 25 },
];

export default function ClicksChart() {
  const [range, setRange] = useState<"7d" | "1m" | "1y">("7d");

  const today = new Date();

  const filteredData = mockData
    .filter((d) => {
      const date = new Date(d.date);
      if (range === "7d") return isAfter(date, subDays(today, 7));
      if (range === "1m") return isAfter(date, subMonths(today, 1));
      return isAfter(date, subYears(today, 1));
    })
    .map((d) => ({ ...d, date: format(new Date(d.date), "MMM d") }));

  return (
    <div className="w-full p-4 rounded-xl shadow bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Resumen de clics</h2>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as "7d" | "1m" | "1y")}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="7d">Últimos 7 días</option>
          <option value="1m">Último mes</option>
          <option value="1y">Último año</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="clicks"
            stroke="#751b80"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
