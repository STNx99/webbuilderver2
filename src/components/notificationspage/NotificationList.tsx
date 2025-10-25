'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, MessageSquare, UserPlus, Settings, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const notifications = [
    {
        id: 1,
        type: "message",
        title: "New message from John Doe",
        description: "Hey, I have a question about...",
        time: "2 minutes ago",
        icon: MessageSquare,
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-500",
        read: false,
    },
    {
        id: 2,
        type: "user",
        title: "New follower",
        description: "Sarah Wilson started following you",
        time: "5 minutes ago",
        icon: UserPlus,
        iconBg: "bg-green-500/10",
        iconColor: "text-green-500",
        read: false,
    },
    {
        id: 3,
        type: "alert",
        title: "Security alert",
        description: "New login from unknown device",
        time: "12 minutes ago",
        icon: AlertCircle,
        iconBg: "bg-red-500/10",
        iconColor: "text-red-500",
        read: true,
    },
    {
        id: 4,
        type: "settings",
        title: "Settings updated",
        description: "Your profile settings have been saved",
        time: "1 hour ago",
        icon: Settings,
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-500",
        read: true,
    },
]

export function NotificationList() {
    return (
        <div className="w-full min-h-1 flex justify-center items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <Card className="w-full bg-secondary/20 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                <CardHeader className="px-4 sm:px-6 lg:px-8 w-full">
                    <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold flex items-center gap-2">
                        <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                        Recent Notifications
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 lg:px-8">
                    <div className="w-full space-y-4 sm:space-y-6 lg:space-y-8">
                        {notifications.map((notification, index) => {
                            const Icon = notification.icon;
                            return (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                    className={cn(
                                        "flex items-start group cursor-pointer rounded-lg p-3 sm:p-4 -mx-2 hover:bg-secondary/30 transition-colors duration-200",
                                        !notification.read && "bg-secondary/20"
                                    )}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.2 }}
                                        className={cn(
                                            "flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-full ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-200",
                                            notification.iconBg
                                        )}
                                    >
                                        <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", notification.iconColor)} />
                                    </motion.div>
                                    <div className="ml-3 sm:ml-4 md:ml-5 space-y-1 flex-1 min-w-0">
                                        <p className={cn(
                                            "text-sm sm:text-base md:text-lg font-medium leading-none group-hover:text-primary transition-colors duration-200",
                                            !notification.read && "font-semibold"
                                        )}>
                                            {notification.title}
                                        </p>
                                        <p className="text-xs sm:text-sm md:text-base text-muted-foreground line-clamp-1">
                                            {notification.description}
                                        </p>
                                        <p className="text-xs sm:text-sm text-muted-foreground/80">{notification.time}</p>
                                    </div>
                                    {!notification.read && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="ml-2 flex-shrink-0"
                                        >
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
