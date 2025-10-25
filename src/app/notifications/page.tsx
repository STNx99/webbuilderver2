import { NotificationList } from "@/components/notificationspage/NotificationList"
import { NotificationStats } from "@/components/notificationspage/NotificationStats"
import { NotificationFilters } from "@/components/notificationspage/NotificationFilters"

export default function NotificationsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
            </div>
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
                <div className="col-span-1 lg:col-span-4">
                    <NotificationStats />
                </div>
                <div className="col-span-1 lg:col-span-3">
                    <NotificationList />
                </div>
            </div>
            <div className="grid gap-4 grid-cols-1">
                <NotificationFilters />
            </div>
        </div>
    )
}
