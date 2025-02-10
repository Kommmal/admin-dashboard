"use client";

import { useState, useMemo, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { client } from "@/sanity/lib/client";

interface Product {
  name: string;
  image?: string;
}

interface Order {
  _id: string;
  firstName: string;
  lastName: string;
  total: number;
  paymentMethod: string;
  email: string;
  status: string;
  _createdAt: string;
  products: Product[];
}

export function OrdersBarChart() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
          _id,
          firstName,
          lastName,
          email,
          paymentMethod,
          status,
          total,
          _createdAt,
          products[] { name, image }
        }`
      )
      .then((data) => setOrders(data));
  }, []);

  const filterOrders = (filter: string) => {
    const now = new Date();
    return orders.filter((order) => {
      const orderDate = new Date(order._createdAt);

      if (filter === "Today") {
        return orderDate.toDateString() === now.toDateString();
      }
      if (filter === "7 Days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return orderDate >= sevenDaysAgo;
      }
      if (filter === "Month") {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }
      if (filter === "Year") {
        return orderDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const chartData = [
    { label: "Today", sales: filterOrders("Today").reduce((sum, order) => sum + order.total, 0) },
    { label: "7 Days", sales: filterOrders("7 Days").reduce((sum, order) => sum + order.total, 0) },
    { label: "Month", sales: filterOrders("Month").reduce((sum, order) => sum + order.total, 0) },
    { label: "Year", sales: filterOrders("Year").reduce((sum, order) => sum + order.total, 0) },
  ];

  const chartConfig: ChartConfig = {
    sales: { label: "Sales", color: "hsl(var(--chart-1))" },
  };

  return (
    <Card className="md:w-[500px]  w-[300px] bg-gray-100 lg:h-[400px] xl:h-auto">
      <CardHeader>
        <CardTitle>Orders Sales Chart</CardTitle>
        <CardDescription>Sales Overview</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} width={300} height={250}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel color="white"  />} />
            <Bar dataKey="sales" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing sales for different timeframes
        </div>
      </CardFooter>
    </Card>
  );
}
