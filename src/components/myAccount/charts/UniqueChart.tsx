import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ChartData = {
  date: string;
  enlaces: number;
};

type Range = "week" | "month" | "3months";

type Props = {
  data: ChartData[];
  title: string;
  description: string;
  tipo: string;
};

const rangeToDays = {
  week: 7,
  month: 30,
  "3months": 90,
};

const rangeLabel: Record<Range, string> = {
  week: "Última semana",
  month: "Último mes",
  "3months": "Últimos 3 meses",
};

function fillMissingDates(
  data: ChartData[],
  start: Date,
  end: Date
): ChartData[] {
  const filled: ChartData[] = [];
  const map = new Map(data.map((d) => [d.date, d.enlaces]));

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    filled.push({ date: dateStr, enlaces: map.get(dateStr) ?? 0 });
  }

  return filled;
}

function getFilteredData(data: ChartData[], days: number): ChartData[] {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days + 1);
  return fillMissingDates(data, start, end);
}

export function UniqueChart({ data, title, description, tipo }: Props) {
  const [range, setRange] = useState<Range>("month");
  const filteredData = getFilteredData(data, rangeToDays[range]);

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center w-full sm:flex-row">
        <div className="grid flex-1 text-center sm:text-left">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>

        <div className="w-44">
          <Select
            value={range}
            onValueChange={(value) => setRange(value as Range)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un rango" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">{rangeLabel.week}</SelectItem>
              <SelectItem value="month">{rangeLabel.month}</SelectItem>
              <SelectItem value="3months">{rangeLabel["3months"]}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(dateStr) => {
              const [year, month, day] = dateStr.split("-");
              const months = [
                "ene",
                "feb",
                "mar",
                "abr",
                "may",
                "jun",
                "jul",
                "ago",
                "sep",
                "oct",
                "nov",
                "dic",
              ];
              return `${day} ${months[parseInt(month) - 1]}`;
            }}
            interval={range === "3months" ? 6 : "preserveStartEnd"} // ← clave aquí
          />

          <YAxis allowDecimals={false} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const [year, month, day] = label.split("-");
                const months = [
                  "ene",
                  "feb",
                  "mar",
                  "abr",
                  "may",
                  "jun",
                  "jul",
                  "ago",
                  "sep",
                  "oct",
                  "nov",
                  "dic",
                ];
                const formattedDate = `${day} ${months[parseInt(month) - 1]}`;

                return (
                  <div className="bg-white p-2 rounded shadow text-sm">
                    <p className="font-semibold">{formattedDate}</p>
                    <p>
                      {payload[0].value} {tipo}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="enlaces"
            stroke="#751b80"
            dot={(props) =>
              props.payload.enlaces > 0 ? (
                <circle cx={props.cx} cy={props.cy} r={4} fill="#751b80" />
              ) : null
            }
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
