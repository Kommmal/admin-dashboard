"use client";

import { useState, useEffect } from "react";
import { Pie, PieChart, Tooltip, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { client } from "@/sanity/lib/client";

interface Order {
  _id: string;
  status: string;
}


const COLORS: Record<string, string> = {
  Shipped: "#8d9696", // gray
  Pending: "#5c6363", // dark grey
  Delivered: "#2b3030", // black
};

export function OrderStatusPieChart() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    client
      .fetch(`*[_type == "order"]{ _id, status }`)
      .then((data) => setOrders(data));
  }, []);

  const getStatusData = () => {
    const statusCounts: Record<string, number> = {
      Shipped: 0,
      Pending: 0,
      Delivered: 0,
    };

    orders.forEach((order) => {
      if (statusCounts.hasOwnProperty(order.status)) {
        statusCounts[order.status] += 1;
      }
    });

    return Object.entries(statusCounts)
  .filter((entry) => entry[1] > 0) // Only checking count
  .map(([status, count]) => ({
    name: status,
    value: count,
    fill: COLORS[status],
  }));
  }
  
  const chartData = getStatusData();

  return (
    <Card className="lg:w-[700px] md:w-[300px] w-[300px] bg-gray-100">
      <CardHeader>
        <CardTitle>Order Status Distribution</CardTitle>
        <CardDescription>Showing percentage of order statuses</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        {chartData.length > 0 ? (
          <PieChart width={400} height={400}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150} // Adjusted for better visibility
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : (
          <p className="text-center text-gray-500">No data available</p>
        )}
      </CardContent>
    </Card>
  );
}
