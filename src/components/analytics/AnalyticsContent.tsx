'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Overview } from "@/components/analytics/Overview";
import { RecentVisits } from "@/components/analytics/RecentVisits";
import { CalendarDateRangePicker } from "@/components/analytics/DateRangePicker";
import * as XLSX from 'xlsx';
import { Download } from "lucide-react";

// Data for export
const statsData = [
    { metric: 'Total Template Views', value: 13240, change: '+20.1% from last week' },
    { metric: 'Total Downloads', value: 3860, change: '+15.3% from last week' },
    { metric: 'Total Likes', value: 2210, change: '+12.8% from last week' },
    { metric: 'Avg Conversion Rate', value: '29.2%', change: '+5.2% from last week' },
];

const trafficData = [
    { date: 'Jan 22', views: 1240, downloads: 320, likes: 180 },
    { date: 'Jan 23', views: 1580, downloads: 420, likes: 245 },
    { date: 'Jan 24', views: 1920, downloads: 580, likes: 310 },
    { date: 'Jan 25', views: 1680, downloads: 490, likes: 275 },
    { date: 'Jan 26', views: 2100, downloads: 650, likes: 380 },
    { date: 'Jan 27', views: 2440, downloads: 720, likes: 425 },
    { date: 'Jan 28', views: 2280, downloads: 680, likes: 395 },
];

const recentVisitsData = [
    { template: 'E-Commerce Dashboard', category: 'Dashboard', views: 1240, downloads: 320, likes: 180, time: '2 minutes ago' },
    { template: 'Landing Page Pro', category: 'Marketing', views: 980, downloads: 245, likes: 142, time: '15 minutes ago' },
    { template: 'SaaS Admin Panel', category: 'Dashboard', views: 756, downloads: 198, likes: 123, time: '32 minutes ago' },
    { template: 'Blog Template', category: 'Content', views: 645, downloads: 167, likes: 98, time: '1 hour ago' },
    { template: 'Portfolio Showcase', category: 'Portfolio', views: 532, downloads: 142, likes: 87, time: '2 hours ago' },
];

const topTemplatesData = [
    { template: 'E-Commerce Dashboard', views: 3860, downloads: 892 },
    { template: 'SaaS Admin Panel', views: 3540, downloads: 784 },
    { template: 'Landing Page Pro', views: 3120, downloads: 698 },
    { template: 'Portfolio Showcase', views: 2890, downloads: 612 },
    { template: 'Blog Template', views: 2560, downloads: 543 },
    { template: 'Analytics Dashboard', views: 2340, downloads: 489 },
];

export function AnalyticsContent() {
    const handleDownload = () => {
        // Create workbook
        const workbook = XLSX.utils.book_new();

        // Sheet 1: Overview Statistics
        const statsSheet = XLSX.utils.json_to_sheet(statsData);
        statsSheet['!cols'] = [
            { wch: 30 },
            { wch: 15 },
            { wch: 30 }
        ];
        XLSX.utils.book_append_sheet(workbook, statsSheet, 'Overview Stats');

        // Sheet 2: Daily Metrics
        const trafficSheet = XLSX.utils.json_to_sheet(trafficData);
        trafficSheet['!cols'] = [
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 }
        ];
        XLSX.utils.book_append_sheet(workbook, trafficSheet, 'Daily Metrics');

        // Sheet 3: Recent Template Views
        const visitsSheet = XLSX.utils.json_to_sheet(recentVisitsData);
        visitsSheet['!cols'] = [
            { wch: 25 },
            { wch: 15 },
            { wch: 12 },
            { wch: 12 },
            { wch: 12 },
            { wch: 20 }
        ];
        XLSX.utils.book_append_sheet(workbook, visitsSheet, 'Recent Template Views');

        // Sheet 4: Top Templates
        const topSheet = XLSX.utils.json_to_sheet(topTemplatesData);
        topSheet['!cols'] = [
            { wch: 25 },
            { wch: 15 },
            { wch: 15 }
        ];
        XLSX.utils.book_append_sheet(workbook, topSheet, 'Top Templates');

        // Download file
        const fileName = `marketplace_analytics_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Marketplace Analytics
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground mt-1">
                            Track template performance and engagement metrics
                        </p>
                    </div>
                    <Button onClick={handleDownload} className="gap-2 w-full sm:w-auto">
                        <Download className="h-4 w-4" />
                        Export Report
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Views
                            </CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-blue-500"
                            >
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">13.2K</div>
                            <p className="text-xs text-green-500 font-medium">
                                +20.1% from last week
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Downloads
                            </CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-green-500"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" x2="12" y1="15" y2="3" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3.86K</div>
                            <p className="text-xs text-green-500 font-medium">
                                +15.3% from last week
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-pink-500"
                            >
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2.21K</div>
                            <p className="text-xs text-green-500 font-medium">
                                +12.8% from last week
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Conversion Rate
                            </CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-purple-500"
                            >
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">29.2%</div>
                            <p className="text-xs text-green-500 font-medium">
                                +5.2% from last week
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="lg:col-span-1">
                        <Overview />
                    </div>
                    <div className="lg:col-span-1">
                        <CalendarDateRangePicker />
                    </div>
                </div>

                {/* Recent Visits */}
                <div className="w-full">
                    <RecentVisits />
                </div>

                {/* Back Button */}
                <div className="flex justify-end pt-4">
                    <Link href="/dashboard">
                        <Button variant="outline" className="gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4"
                            >
                                <path d="m12 19-7-7 7-7" />
                                <path d="M19 12H5" />
                            </svg>
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}
