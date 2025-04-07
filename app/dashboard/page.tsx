"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  TrendingUp,
  Award,
  BarChart3,
  GraduationCap,
  ArrowUpRight,
  GripHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

// Mock data - Replace with real data from your API
const mockData = {
  enrollments: 1234,
  activeUsers: 892,
  completionRate: 76,
  totalEvents: 48,
  revenueGrowth: 23,
  chartData: [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 600 },
    { name: "Mar", value: 550 },
    { name: "Apr", value: 800 },
    { name: "May", value: 950 },
    { name: "Jun", value: 1100 },
  ],
};

interface DashboardWidgetProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  chart?: boolean;
  className?: string;
  isDragging?: boolean;
}

const DashboardWidget = ({
  title,
  value,
  icon,
  description,
  chart,
  className,
  isDragging,
}: DashboardWidgetProps) => {
  return (
    <Card
      className={cn(
        "relative group transition-all duration-200 hover:shadow-lg",
        isDragging ? "shadow-2xl rotate-3" : "",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {chart && (
          <div className="h-32 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData.chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--chart-1))"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripHorizontal className="w-4 h-4 text-muted-foreground cursor-move" />
      </div>
    </Card>
  );
};

interface Widget {
  id: string;
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  chart?: boolean;
  size: "small" | "large";
}

export default function OrganizationPage() {
  useEffect(() => {
    if (localStorage.getItem("onboardingComplete") === "true") {
      localStorage.removeItem("onboardingComplete");
      console.log("🧹 onboardingComplete localStorage flag removed");
    }
  }, []);

  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: "enrollments",
      title: "Total Enrollments",
      value: mockData.enrollments,
      icon: <Users className="w-4 h-4" />,
      description: "+12% from last month",
      size: "small",
    },
    {
      id: "active-users",
      title: "Active Users",
      value: mockData.activeUsers,
      icon: <GraduationCap className="w-4 h-4" />,
      description: "Currently active learners",
      size: "small",
    },
    {
      id: "completion",
      title: "Completion Rate",
      value: `${mockData.completionRate}%`,
      icon: <Award className="w-4 h-4" />,
      description: "Average course completion",
      size: "small",
    },
    {
      id: "events",
      title: "Total Events",
      value: mockData.totalEvents,
      icon: <Calendar className="w-4 h-4" />,
      description: "Across all courses",
      size: "small",
    },
    {
      id: "growth",
      title: "Revenue Growth",
      value: `${mockData.revenueGrowth}%`,
      icon: <TrendingUp className="w-4 h-4" />,
      description: "Year over year",
      size: "small",
    },
    {
      id: "enrollment-trend",
      title: "Enrollment Trend",
      value: "Monthly Overview",
      icon: <BarChart3 className="w-4 h-4" />,
      chart: true,
      size: "large",
    },
  ]);

  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggingId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain");

    if (sourceId === targetId) return;

    const newWidgets = [...widgets];
    const sourceIndex = newWidgets.findIndex((w) => w.id === sourceId);
    const targetIndex = newWidgets.findIndex((w) => w.id === targetId);

    const [movedWidget] = newWidgets.splice(sourceIndex, 1);
    newWidgets.splice(targetIndex, 0, movedWidget);

    setWidgets(newWidgets);
    setDraggingId(null);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 p-8"
      id="dashboard"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor your organization's performance and growth
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </div>
            <div className="h-8 w-px bg-border" />
            <button className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              View Reports
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {widgets.map((widget) => (
            <motion.div
              key={widget.id}
              layoutId={widget.id}
              draggable
              // onDragStart={(e) => handleDragStart(e, widget.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, widget.id)}
              className={cn(
                widget.size === "large" ? "lg:col-span-2" : "",
                "cursor-move"
              )}
            >
              <DashboardWidget
                title={widget.title}
                value={widget.value}
                icon={widget.icon}
                description={widget.description}
                chart={widget.chart}
                isDragging={draggingId === widget.id}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
