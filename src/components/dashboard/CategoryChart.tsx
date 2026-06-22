"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Card, CardHeader, CardTitle } from "@/components/ui";
import type { ChartDatum } from "@/features/dashboard/dashboardStats";

interface CategoryChartProps {
  data: ChartDatum[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reportes por categoría</CardTitle>
      </CardHeader>

      {data.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400">
          Aún no hay reportes para mostrar.
        </p>
      ) : (
        <div className="h-72 w-full" style={{ minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: 13 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
