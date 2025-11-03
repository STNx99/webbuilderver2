"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Filter, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const filterOptions = [
    { id: "all", label: "All", count: 150, active: true },
    { id: "unread", label: "Unread", count: 23, active: false },
    { id: "messages", label: "Messages", count: 45, active: false },
    { id: "followers", label: "Followers", count: 32, active: false },
    { id: "alerts", label: "Alerts", count: 28, active: false },
    { id: "updates", label: "Updates", count: 19, active: false },
]

export function NotificationFilters({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    const [filters, setFilters] = React.useState(filterOptions)
    const [searchQuery, setSearchQuery] = React.useState("")

    const toggleFilter = (id: string) => {
        setFilters(prev => prev.map(filter => ({
            ...filter,
            active: filter.id === id
        })))
    }

    return (
        <div className="w-full flex justify-center items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="transition-all duration-300 w-full"
            >
                <Card className="relative overflow-hidden bg-secondary/20 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <div className="bg-primary/5 absolute -bottom-[50%] right-[50%] h-[80%] w-[80%] translate-x-1/2 rounded-full blur-3xl" />
                    </div>

                    <CardHeader className="px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold flex items-center gap-2">
                                <Filter className="h-5 w-5 sm:h-6 sm:w-6" />
                                Filter Notifications
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm md:text-base">Search and filter your notifications</CardDescription>
                        </motion.div>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6 lg:px-8 space-y-6">
                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            className="relative"
                        >
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search notifications..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-background/50 border-muted hover:border-primary/30 focus:border-primary transition-colors"
                            />
                        </motion.div>

                        {/* Filter Buttons */}
                        <motion.div
                            className={cn("flex flex-wrap gap-2", className)}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                        >
                            {filters.map((filter, index) => (
                                <motion.div
                                    key={filter.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        variant={filter.active ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => toggleFilter(filter.id)}
                                        className={cn(
                                            "text-xs sm:text-sm md:text-base transition-all duration-300 relative",
                                            filter.active
                                                ? "shadow-md"
                                                : "hover:bg-primary/5 hover:border-primary/30 hover:text-primary"
                                        )}
                                    >
                                        {filter.label}
                                        <span className={cn(
                                            "ml-2 px-2 py-0.5 rounded-full text-xs font-semibold",
                                            filter.active
                                                ? "bg-background/20 text-primary-foreground"
                                                : "bg-muted text-muted-foreground"
                                        )}>
                                            {filter.count}
                                        </span>
                                    </Button>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Active Filter Info */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.9 }}
                            className="text-xs sm:text-sm text-muted-foreground pt-2 border-t"
                        >
                            Showing <span className="font-semibold text-foreground">
                                {filters.find(f => f.active)?.count || 0}
                            </span> {filters.find(f => f.active)?.label.toLowerCase()} notifications
                        </motion.div>
                    </CardContent>

                    <div className="from-primary/[0.05] pointer-events-none absolute right-0 bottom-0 left-0 h-1/3 rounded-b-lg bg-gradient-to-t to-transparent" />
                </Card>
            </motion.div>
        </div>
    )
}
