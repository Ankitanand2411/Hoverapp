import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface EcoMetric {
  name: string;
  value: number;
  target: number;
}

interface ConsumptionData {
  date: string;
  energy: number;
  emissions: number;
}

const mockConsumptionData: ConsumptionData[] = [
  { date: 'Mon', energy: 4.2, emissions: 0.8 },
  { date: 'Tue', energy: 3.8, emissions: 0.7 },
  { date: 'Wed', energy: 4.5, emissions: 0.9 },
  { date: 'Thu', energy: 3.9, emissions: 0.7 },
  { date: 'Fri', energy: 4.1, emissions: 0.8 },
  { date: 'Sat', energy: 3.6, emissions: 0.6 },
  { date: 'Sun', energy: 3.4, emissions: 0.5 },
];

const mockEcoMetrics: EcoMetric[] = [
  { name: 'Energy Efficiency', value: 4.2, target: 4.5 },
  { name: 'Carbon Footprint', value: 32.5, target: 30 },
  { name: 'Regeneration Rate', value: 0.8, target: 0.9 },
];

export const EcoMetricsCharts = () => {
  const handleDownloadPDF = async () => {
    const element = document.getElementById('eco-metrics-charts');
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('eco-metrics-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div id="eco-metrics-charts" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Environmental Performance Analytics</h2>
        <Button
          onClick={handleDownloadPDF}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Energy Consumption Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Energy Consumption Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockConsumptionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="energy"
                    name="Energy (kWh)"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Environmental Metrics Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Environmental Metrics vs Targets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockEcoMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#10b981" name="Current" />
                  <Bar dataKey="target" fill="#059669" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Emissions Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Cumulative Emissions Reduction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockConsumptionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="emissions"
                    name="CO₂ Emissions (kg)"
                    stroke="#059669"
                    fill="#059669"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};