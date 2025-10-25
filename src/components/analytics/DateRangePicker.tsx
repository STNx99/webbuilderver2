"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Calendar as CalendarIcon, TrendingUp } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
]

export function CalendarDateRangePicker({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(2024, 0, 20),
        to: new Date(2024, 0, 25),
    })

    return (
        <div className="w-full flex justify-center items-center min-h-[500px] px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -5 }}
                className="transition-all duration-300 w-full max-w-4xl h-full"
            >
                <Card className="relative overflow-hidden bg-secondary/20 hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                    {/* Background gradient effect */}
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <div className="bg-primary/5 absolute -bottom-[50%] right-[50%] h-[80%] w-[80%] translate-x-1/2 rounded-full blur-3xl" />
                    </div>

                    <CardHeader className="px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">Date Range Selection</CardTitle>
                            <CardDescription className="text-xs sm:text-sm md:text-base">Select date range for analytics</CardDescription>
                        </motion.div>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">
                        <motion.div
                            className={cn("grid gap-2", className)}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                        >
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className={cn(
                                            "w-full sm:w-[280px] md:w-[320px] justify-start text-left font-normal hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-300 text-xs sm:text-sm md:text-base",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                                        {date?.from ? (
                                            date.to ? (
                                                <>
                                                    {date.from.toLocaleDateString()} - {date.to.toLocaleDateString()}
                                                </>
                                            ) : (
                                                date.from.toLocaleDateString()
                                            )
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
                                </PopoverContent>
                            </Popover>
                        </motion.div>

                        <motion.div
                            className="mt-6 flex justify-center w-full"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <ResponsiveContainer width="100%" height={250} className="sm:h-[280px] md:h-[320px] lg:h-[350px]">
                                <BarChart
                                    data={chartData}
                                    layout="vertical"
                                    margin={{
                                        left: -20,
                                    }}
                                >
                                    <XAxis type="number" dataKey="desktop" hide />
                                    <YAxis
                                        dataKey="month"
                                        type="category"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                        style={{
                                            fontSize: '10px',
                                            fill: 'hsl(var(--muted-foreground))',
                                        }}
                                        className="sm:text-xs md:text-sm"
                                    />
                                    <Bar
                                        dataKey="desktop"
                                        fill="hsl(var(--primary))"
                                        radius={5}
                                        style={{
                                            filter: "drop-shadow(0 2px 4px hsl(var(--primary) / 0.3))",
                                        }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-xs sm:text-sm md:text-base border-t bg-secondary/10 pt-3 sm:pt-4 md:pt-5 px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.7 }}
                            className="flex gap-2 leading-none font-medium text-primary items-center"
                        >
                            Trending up by 5.2% this month <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.8 }}
                            className="text-muted-foreground leading-none"
                        >
                            Showing total visitors for the selected date range
                        </motion.div>
                    </CardFooter>

                    {/* Subtle gradient overlay */}
                    <div className="from-primary/[0.05] pointer-events-none absolute right-0 bottom-0 left-0 h-1/3 rounded-b-lg bg-gradient-to-t to-transparent" />
                </Card>
            </motion.div>
        </div>
    )
}