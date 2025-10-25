'use client';

import { useState } from 'react';
import { FileText, Heart, Star, TrendingUp } from 'lucide-react';
import TopNavigation from './TopNavigation';
import Sidebar from './Sidebar';
import ProfileHero from './ProfileHero';
import PersonalInfoCard from './PersonalInfoCard';
import RecentActivitiesCard from './RecentActivitiesCard';

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    address: string;
    bio: string;
    joinDate: string;
    avatar: string;
}

export default function ProfilePage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
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

    const accounts = [
        { name: 'John Doe', email: 'john.doe@example.com', avatar: 'JD', active: true },
        { name: 'Jane Smith', email: 'jane.smith@example.com', avatar: 'JS', active: false },
        { name: 'Bob Wilson', email: 'bob.wilson@example.com', avatar: 'BW', active: false },
    ];

    return (
        <div className="min-h-screen bg-background">
            <TopNavigation
                profile={profile}
                accounts={accounts}
                onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            <div className="flex w-full">
                <Sidebar
                    stats={stats}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main Content */}
                <main className="flex-1 w-full min-w-0 overflow-y-auto">
                    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-10">
                        <div className="space-y-6 sm:space-y-8">
                            <ProfileHero profile={profile} stats={stats} />

                            {/* Info Cards Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                                <PersonalInfoCard profile={profile} />
                                <RecentActivitiesCard />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
