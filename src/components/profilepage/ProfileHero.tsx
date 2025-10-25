'use client';

import { motion } from 'framer-motion';
import { Camera, Edit2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface UserProfile {
    name: string;
    bio: string;
    avatar: string;
}

interface Stat {
    label: string;
    value: string;
}

interface ProfileHeroProps {
    profile: UserProfile;
    stats: Stat[];
}

export default function ProfileHero({ profile, stats }: ProfileHeroProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                <CardContent className="p-4 sm:p-6 lg:p-8 relative">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                        <motion.div
                            className="relative group"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32 border-4 border-background shadow-xl">
                                <AvatarFallback className="bg-primary/20 text-primary text-2xl sm:text-3xl lg:text-4xl font-bold">
                                    {profile.avatar}
                                </AvatarFallback>
                            </Avatar>
                            <motion.button
                                className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 sm:p-2 rounded-full shadow-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                            </motion.button>
                        </motion.div>
                        <div className="flex-1 text-center sm:text-left w-full">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">{profile.name}</h2>
                            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">{profile.bio}</p>
                            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start">
                                {stats.map((stat) => (
                                    <div key={stat.label} className="text-center min-w-[60px]">
                                        <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stat.value}</p>
                                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button className="gap-2 w-full sm:w-auto mt-2 sm:mt-0" size="sm">
                            <Edit2 className="h-4 w-4" />
                            <span className="sm:inline">Edit Profile</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
