import { motion } from "framer-motion"
import { NotificationStats } from "@/components/notificationspage/NotificationStats"
import { NotificationFilters } from "@/components/notificationspage/NotificationFilters"
import { NotificationList } from "@/components/notificationspage/NotificationList"
import { Bell, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NotificationsContent() {
    const handleDownload = () => {
        // TODO: Implement export functionality
        console.log('Exporting notifications...');
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        Notifications
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1">
                        Stay updated with your latest notifications and alerts
                    </p>
                </div>
                <Button onClick={handleDownload} className="gap-2 w-full sm:w-auto">
                    <Download className="h-4 w-4" />
                    Export Report
                </Button>
            </div>

            {/* Content */}
            <div className="space-y-6 sm:space-y-8">
                {/* Stats Section */}
                <NotificationStats />

                {/* Filters Section */}
                <NotificationFilters />

                {/* Notifications List */}
                <NotificationList />
            </div>
        </div>
    )
}
