'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
    {
        page: "/home",
        visits: 12,
        time: "2 minutes ago",
        visitor: "JD",
    },
    {
        page: "/about",
        visits: 8,
        time: "5 minutes ago",
        visitor: "ML",
    },
    {
        page: "/contact",
        visits: 24,
        time: "12 minutes ago",
        visitor: "AK",
    },
    {
        page: "/products",
        visits: 32,
        time: "15 minutes ago",
        visitor: "RW",
    },
]

export function RecentVisits() {
    return (
        <div className="w-full min-h-1 flex justify-center items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <Card className="w-full bg-secondary/20 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                <CardHeader className="px-4 sm:px-6 lg:px-8 w-full">
                    <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">Recent Visits</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 lg:px-8">
                    <div className="w-full space-y-4 sm:space-y-6 lg:space-y-8">
                        {data.map((item, index) => (
                            <motion.div
                                key={item.page}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                className="flex items-center group cursor-pointer rounded-lg p-3 sm:p-4 -mx-2 hover:bg-secondary/30 transition-colors duration-200"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Avatar className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-200">
                                        <AvatarFallback className="bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-200 text-sm sm:text-base">
                                            {item.visitor}
                                        </AvatarFallback>
                                    </Avatar>
                                </motion.div>
                                <div className="ml-3 sm:ml-4 md:ml-5 space-y-1 flex-1 min-w-0">
                                    <p className="text-sm sm:text-base md:text-lg font-medium leading-none group-hover:text-primary transition-colors duration-200 truncate">
                                        {item.page}
                                    </p>
                                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground">{item.time}</p>
                                </div>
                                <motion.div
                                    className="ml-auto font-medium flex-shrink-0"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <span className="text-primary text-base sm:text-lg md:text-xl">{item.visits}</span>
                                    <span className="text-muted-foreground text-xs sm:text-sm md:text-base ml-1">visits</span>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}