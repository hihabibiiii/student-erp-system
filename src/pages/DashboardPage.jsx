import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, GraduationCap, IndianRupee, TrendingUp, WalletCards } from "lucide-react";
import { motion } from "framer-motion";
import { ChartLegend, ChartTooltip, chartColors } from "../components/charts/ChartSkin";
import StatCard from "../components/ui/StatCard";
import { currency, percent } from "../utils/formatters";

export default function DashboardPage({ totalStudents = 0, totalPaid = 0, totalDue = 0 }) {
  const totalFee = Number(totalPaid) + Number(totalDue);
  const collectionRate = totalFee ? (Number(totalPaid) / totalFee) * 100 : 0;
  const dueRate = totalFee ? (Number(totalDue) / totalFee) * 100 : 0;
  const bars = [
    { name: "Collected", amount: Number(totalPaid) },
    { name: "Due", amount: Number(totalDue) }
  ];
  const pie = [
    { name: "Collected", value: Number(totalPaid), fill: chartColors.cyan },
    { name: "Due", value: Number(totalDue), fill: chartColors.rose }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={GraduationCap} label="Total Students" value={totalStudents} tone="cyan" meta="Active records" />
        <StatCard icon={Activity} label="Attendance" value={percent(92)} tone="lime" meta="Estimated monthly average" />
        <StatCard icon={IndianRupee} label="Fees Collected" value={currency(totalPaid)} tone="violet" meta={`${percent(collectionRate)} of assigned fee`} />
        <StatCard icon={TrendingUp} label="Performance" value={percent(84)} tone="cyan" meta="Academic health index" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <motion.section className="panel interactive-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="section-title">Fee Analytics</h2>
              <p className="section-subtitle">Collected versus outstanding balance</p>
            </div>
            <WalletCards className="h-5 w-5 text-brand-200 light:text-brand-700" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bars} margin={{ top: 8, right: 10, left: 0, bottom: 4 }} barCategoryGap="34%">
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                <XAxis dataKey="name" stroke={chartColors.axis} axisLine={false} tickLine={false} tickMargin={12} />
                <YAxis stroke={chartColors.axis} axisLine={false} tickLine={false} tickMargin={8} tickFormatter={(value) => `Rs. ${value}`} width={72} />
                <Tooltip cursor={{ fill: "rgba(34, 211, 238, 0.06)" }} content={<ChartTooltip formatter={(value) => currency(value)} />} />
                <Bar dataKey="amount" name="Amount" radius={[12, 12, 4, 4]} maxBarSize={88}>
                  <Cell fill={chartColors.cyan} />
                  <Cell fill={chartColors.rose} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section className="panel interactive-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.34, delay: 0.04 }}>
          <h2 className="section-title">Collection Mix</h2>
          <p className="section-subtitle">Due rate: {percent(dueRate)}</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <Pie
                  data={pie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="58%"
                  outerRadius="80%"
                  paddingAngle={5}
                  stroke="rgba(2, 6, 23, 0.5)"
                  strokeWidth={3}
                  activeShape={false}
                />
                <Tooltip content={<ChartTooltip formatter={(value) => currency(value)} />} />
                <Legend content={<ChartLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
