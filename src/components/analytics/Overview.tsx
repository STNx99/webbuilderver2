"use client"

import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
    {
        views: 160,
        date: "Jan 22",
        fill: "hsl(var(--primary))",
    },
    {
        views: 240,
        date: "Jan 23",
        fill: "hsl(var(--primary))",
    },
    {
        views: 320,
        date: "Jan 24",
        fill: "hsl(var(--primary))",
    },
    {
        views: 280,
        date: "Jan 25",
        fill: "hsl(var(--primary))",
    },
    {
        views: 260,
        date: "Jan 26",
        fill: "hsl(var(--primary))",
    },
    {
        views: 440,
        date: "Jan 27",
        fill: "hsl(var(--primary))",
    },
    {
        views: 384,
        date: "Jan 28",
        fill: "hsl(var(--primary))",
    },
]

export function Overview() {
    return (
        <div className="w-full h-full flex justify-center items-stretch px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="transition-all duration-300 w-full h-full"
            >
                <Card className="relative overflow-hidden bg-secondary/20 hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                    {/* Background gradient effect */}
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <div className="bg-primary/5 absolute -top-[50%] left-[50%] h-[80%] w-[80%] -translate-x-1/2 rounded-full blur-3xl" />
                    </div>

                    <CardHeader className="px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">Traffic Overview</CardTitle>
                            <CardDescription className="text-xs sm:text-sm md:text-base">January 22-28, 2024</CardDescription>
                        </motion.div>
                    </CardHeader>
                    <CardContent className="px-2 sm:px-4 lg:px-8 flex-1 flex items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px] md:h-[350px] lg:h-[400px]">
                                <LineChart data={data}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="rounded-lg border bg-background p-2 sm:p-3 md:p-4 shadow-lg backdrop-blur-sm"
                                                    >
                                                        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-[0.65rem] sm:text-[0.70rem] md:text-xs uppercase text-muted-foreground">
                                                                    Views
                                                                </span>
                                                                <span className="font-bold text-primary text-base sm:text-lg md:text-xl">
                                                                    {payload[0].value}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[0.65rem] sm:text-[0.70rem] md:text-xs uppercase text-muted-foreground">
                                                                    Date
                                                                </span>
                                                                <span className="font-bold text-muted-foreground text-sm sm:text-base md:text-lg">
                                                                    {payload[0].payload.date}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )
                                            }
                                            return null
                                        }}
                                    />
                                    <Line
                                        type="natural"
                                        dataKey="views"
                                        strokeWidth={2}
                                        className="sm:stroke-[2.5] md:stroke-[3]"
                                        dot={{
                                            r: 4,
                                            fill: "hsl(var(--primary))",
                                            stroke: "hsl(var(--background))",
                                            strokeWidth: 2,
                                            className: "sm:r-5 md:r-6"
                                        }}
                                        activeDot={{
                                            r: 6,
                                            fill: "hsl(var(--primary))",
                                            stroke: "hsl(var(--background))",
                                            strokeWidth: 2,
                                            className: "sm:r-7 md:r-8"
                                        }}
                                        style={{
                                            stroke: "hsl(var(--primary))",
                                            filter: "drop-shadow(0 2px 4px hsl(var(--primary) / 0.3))",
                                        }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </motion.div>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-xs sm:text-sm md:text-base border-t bg-secondary/10 pt-3 sm:pt-4 md:pt-5 px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                            className="flex gap-2 leading-none font-medium text-primary items-center"
                        >
                            Trending up by 20.1% this month <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                            className="text-muted-foreground leading-none"
                        >
                            Showing total page views for the last 7 days
                        </motion.div>
                    </CardFooter>

                    {/* Subtle gradient overlay */}
                    <div className="from-primary/[0.05] pointer-events-none absolute right-0 bottom-0 left-0 h-1/3 rounded-b-lg bg-gradient-to-t to-transparent" />
                </Card>
            </motion.div>
        </div>
    )
}