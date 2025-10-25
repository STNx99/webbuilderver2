'use client';

import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Overview } from "@/components/analytics/Overview"
import { RecentVisits } from "@/components/analytics/RecentVisits"
import { CalendarDateRangePicker } from "@/components/analytics/DateRangePicker"
import * as XLSX from 'xlsx';
import { Download } from "lucide-react"

// Data for export
const statsData = [
    { metric: 'Total Page Views', value: 1234, change: '+20.1% from last month' },
    { metric: 'Unique Visitors', value: 456, change: '+10.5% from last month' },
    { metric: 'Avg. Time', value: '2m 13s', change: '+7% from last month' },
    { metric: 'Bounce Rate', value: '32.1%', change: '-4% from last month' },
];

const trafficData = [
    { date: 'Jan 22', views: 160 },
    { date: 'Jan 23', views: 240 },
    { date: 'Jan 24', views: 320 },
    { date: 'Jan 25', views: 280 },
    { date: 'Jan 26', views: 260 },
    { date: 'Jan 27', views: 440 },
    { date: 'Jan 28', views: 384 },
];

const recentVisitsData = [
    { page: '/home', visits: 12, time: '2 minutes ago', visitor: 'JD' },
    { page: '/about', visits: 8, time: '5 minutes ago', visitor: 'ML' },
    { page: '/contact', visits: 24, time: '12 minutes ago', visitor: 'AK' },
    { page: '/products', visits: 32, time: '15 minutes ago', visitor: 'RW' },
];

const monthlyData = [
    { month: 'January', desktop: 186 },
    { month: 'February', desktop: 305 },
    { month: 'March', desktop: 237 },
    { month: 'April', desktop: 73 },
    { month: 'May', desktop: 209 },
    { month: 'June', desktop: 214 },
];

export default function AnalyticsPage() {
    const handleDownload = () => {
        // Create workbook
        const workbook = XLSX.utils.book_new();

        // Sheet 1: Overview Statistics
        const statsSheet = XLSX.utils.json_to_sheet(statsData);
        statsSheet['!cols'] = [
            { wch: 25 },
            { wch: 15 },
            { wch: 30 }
        ];
        XLSX.utils.book_append_sheet(workbook, statsSheet, 'Overview Stats');

        // Sheet 2: Traffic Overview
        const trafficSheet = XLSX.utils.json_to_sheet(trafficData);
        trafficSheet['!cols'] = [
            { wch: 15 },
            { wch: 15 }
        ];
        XLSX.utils.book_append_sheet(workbook, trafficSheet, 'Traffic Overview');

        // Sheet 3: Recent Visits
        const visitsSheet = XLSX.utils.json_to_sheet(recentVisitsData);
        visitsSheet['!cols'] = [
            { wch: 20 },
            { wch: 10 },
            { wch: 20 },
            { wch: 15 }
        ];
        XLSX.utils.book_append_sheet(workbook, visitsSheet, 'Recent Visits');

        // Sheet 4: Monthly Analytics
        const monthlySheet = XLSX.utils.json_to_sheet(monthlyData);
        monthlySheet['!cols'] = [
            { wch: 15 },
            { wch: 15 }
        ];
        XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Monthly Analytics');

        // Download file
        const fileName = `analytics_report_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    return (
        <div className="flex flex-col justify-center md:flex w-full">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                    <Button onClick={handleDownload} className="gap-2">
                        <Download className="h-4 w-4" />
                        Download
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Page Views
                            </CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,234</div>
                            <p className="text-xs text-muted-foreground">
                                +20.1% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Unique Visitors
                            </CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">456</div>
                            <p className="text-xs text-muted-foreground">
                                +10.5% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2m 13s</div>
                            <p className="text-xs text-muted-foreground">
                                +7% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Bounce Rate
                            </CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">32.1%</div>
                            <p className="text-xs text-muted-foreground">
                                -4% from last month
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-2 md:grid-cols-2 md:h-[600px]">
                    <div className="col-span-1 h-full">
                        <Overview />
                    </div>
                    <div className="col-span-1 h-full">
                        <CalendarDateRangePicker />
                    </div>
                </div>
                <div className="grid gap-4 w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Visits</CardTitle>
                            <CardDescription>
                                You had 265 visits in the last 7 days
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RecentVisits />
                        </CardContent>
                    </Card>
                </div>
                <div className="flex justify-end pt-4">
                    <Link href="/dashboard">
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}