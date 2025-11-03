'use client';

import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';

interface UserProfile {
    email: string;
    phone: string;
    address: string;
    joinDate: string;
}

interface PersonalInfoCardProps {
    profile: UserProfile;
}

export default function PersonalInfoCard({ profile }: PersonalInfoCardProps) {
    const infoItems = [
        { icon: Mail, label: 'Email', value: profile.email },
        { icon: Phone, label: 'Phone', value: profile.phone },
        { icon: MapPin, label: 'Location', value: profile.address },
        { icon: Calendar, label: 'Joined', value: profile.joinDate },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <Card className="bg-secondary/20 hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full">
                <CardHeader className="px-4 sm:px-6 pb-3">
                    <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        Personal Information
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Your basic account details</CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 space-y-3 sm:space-y-4">
                    {infoItems.map((item, index) => (
                        <motion.div
                            key={item.label}
                            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors w-full"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                                <item.icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">{item.label}</p>
                                <p className="text-sm font-medium truncate">{item.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </CardContent>
            </Card>
        </motion.div>
    );
}
