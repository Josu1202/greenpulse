"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardHeader, CardTitle } from "@/components/ui";
import type { TrendDatum } from "@/features/dashboard/dashboardStats";

interface TrendChartProps {
  data: TrendDatum[];
  title?: string;
}

export function TrendChart({
  data,
  title = "Reportes a lo largo del tiempo",
}: TrendChartProps) {
  const hasData = data.some((datum) => datum.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      {!hasData ? (
        <p className="py-12 text-center text-sm text-slate-400">
          Aún no hay reportes en este periodo.
        </p>
      ) : (
        <div className="h-72 w-full" style={{ minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -16 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                interval="preserveStartEnd"
                minTickGap={16}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <Tooltip cursor={{ stroke: "rgba(0,0,0,0.1)" }} />
              <Area
                type="monotone"
                dataKey="value"
                name="Reportes"
                stroke="#16a34a"
                strokeWidth={2}
                fill="url(#trendFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
