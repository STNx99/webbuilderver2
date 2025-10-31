'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download, FileText, Heart, Star, TrendingUp } from 'lucide-react';
import ProfileHero from './ProfileHero';
import PersonalInfoCard from './PersonalInfoCard';
import RecentActivitiesCard from './RecentActivitiesCard';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    address: string;
    bio: string;
    joinDate: string;
    avatar: string;
}

export function ProfileContent() {
    const [profile, setProfile] = useState<UserProfile>({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 234 567 8900',
        address: 'San Francisco, CA',
        bio: 'Passionate developer and tech enthusiast',
        joinDate: 'January 2024',
        avatar: 'JD',
    });

    const stats = [
        { label: 'Posts', value: '245', icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
        { label: 'Followers', value: '1.2K', icon: Heart, color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
        { label: 'Following', value: '842', icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
        { label: 'Trust Score', value: '98%', icon: TrendingUp, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    ];

    const handleDownload = () => {
        // TODO: Implement export functionality
        console.log('Exporting profile data...');
    };

    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            My Profile
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground mt-1">
                            View and manage your personal information
                        </p>
                    </div>
                    <Button onClick={handleDownload} className="gap-2 w-full sm:w-auto">
                        <Download className="h-4 w-4" />
                        Export Data
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <Card key={stat.label} className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.label}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground font-medium">
                                    Your {stat.label.toLowerCase()} count
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Profile Hero */}
                <div className="w-full">
                    <ProfileHero profile={profile} stats={stats} />
                </div>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PersonalInfoCard profile={profile} />
                    <RecentActivitiesCard />
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
