'use client';

import { motion } from 'framer-motion';
import { Activity, Edit2, FileText, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';

interface ActivityItem {
    action: string;
    time: string;
    icon: any;
}

export default function RecentActivitiesCard() {
    const recentActivities: ActivityItem[] = [
        { action: 'Updated profile information', time: '2 hours ago', icon: Edit2 },
        { action: 'Posted new content', time: '5 hours ago', icon: FileText },
        { action: 'Added comment', time: '1 day ago', icon: Activity },
        { action: 'Earned achievement', time: '2 days ago', icon: Award },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className="bg-secondary/20 hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full">
                <CardHeader className="px-4 sm:px-6 pb-3">
                    <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2">
                        <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        Recent Activities
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Your latest actions and updates</CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 space-y-3 sm:space-y-4">
                    {recentActivities.map((activity, index) => (
                        <motion.div
                            key={index}
                            className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 flex-shrink-0">
                                <activity.icon className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium truncate">{activity.action}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1">{activity.time}</p>
                            </div>
                        </motion.div>
                    ))}
                </CardContent>
                <CardFooter className="px-4 sm:px-6 pt-2 pb-4 sm:pb-6">
                    <Button variant="ghost" className="w-full text-xs sm:text-sm h-9 sm:h-10">
                        View All Activities
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
