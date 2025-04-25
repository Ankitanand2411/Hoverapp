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

interface SafetyMetric {
  name: string;
  value: number;
  target: number;
}

interface PerformanceData {
  date: string;
  score: number;
  incidents: number;
}

const mockPerformanceData: PerformanceData[] = [
  { date: 'Mon', score: 85, incidents: 2 },
  { date: 'Tue', score: 88, incidents: 1 },
  { date: 'Wed', score: 86, incidents: 3 },
  { date: 'Thu', score: 90, incidents: 0 },
  { date: 'Fri', score: 87, incidents: 2 },
  { date: 'Sat', score: 92, incidents: 1 },
  { date: 'Sun', score: 89, incidents: 1 },
];

const mockSafetyMetrics: SafetyMetric[] = [
  { name: 'Obstacle Avoidance', value: 92, target: 95 },
  { name: 'Emergency Braking', value: 78, target: 90 },
  { name: 'Path Following', value: 88, target: 92 },
];

export const SafetyMetricsCharts = () => {
  const handleDownloadPDF = async () => {
    const element = document.getElementById('safety-metrics-charts');
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('safety-metrics-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div id="safety-metrics-charts" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Safety Performance Analytics</h2>
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
        {/* Weekly Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Safety Metrics Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Safety Metrics vs Targets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockSafetyMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Current" />
                  <Bar dataKey="target" fill="#82ca9d" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Incident Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Incident Trend Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="incidents"
                    stroke="#ff7300"
                    fill="#ff7300"
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