'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Bell, Settings, Activity, Award, X } from 'lucide-react';
import { Button } from '../ui/button';

interface Stat {
    label: string;
    value: string;
    icon: any;
    color: string;
    bgColor: string;
}

interface SidebarProps {
    stats: Stat[];
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ stats, isOpen = false, onClose }: SidebarProps) {
    const menuItems = [
        { icon: User, label: 'Personal Info', active: true },
        { icon: Shield, label: 'Security', badge: null },
        { icon: Bell, label: 'Notifications', badge: 3 },
        { icon: Settings, label: 'Settings', badge: null },
        { icon: Activity, label: 'Activity Log', badge: null },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                className="hidden lg:block w-72 xl:w-80 bg-card border-r border-border h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto flex-shrink-0"
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="p-6 space-y-6">
                    {/* Navigation Menu */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            Menu
                        </h3>
                        {menuItems.map((item, index) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Button
                                    variant={item.active ? 'default' : 'ghost'}
                                    className="w-full justify-start gap-3 h-11"
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {item.badge && (
                                        <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </Button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Quick Stats
                        </h3>
                        {stats.slice(0, 3).map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className="bg-secondary/20 rounded-lg p-4 border border-border hover:border-primary/50 transition-all cursor-pointer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`${stat.color} opacity-50`}>
                                        <stat.icon className="h-7 w-7" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Upgrade Card */}
                    <motion.div
                        className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h4 className="text-base font-semibold mb-2 flex items-center gap-2">
                            <Award className="text-primary h-5 w-5" />
                            Upgrade to Pro
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                            Unlock premium features and benefits
                        </p>
                        <Button className="w-full" size="sm">
                            Upgrade Now
                        </Button>
                    </motion.div>
                </div>
            </motion.aside>

            {/* Mobile Sidebar Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="lg:hidden fixed inset-0 bg-black/50 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                        />

                        {/* Drawer */}
                        <motion.aside
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card border-r border-border z-50 overflow-y-auto"
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            <div className="p-6 space-y-6">
                                {/* Close Button */}
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold">Menu</h2>
                                    <Button variant="ghost" size="icon" onClick={onClose}>
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>

                                {/* Navigation Menu */}
                                <div className="space-y-2">
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                        Navigation
                                    </h3>
                                    {menuItems.map((item, index) => (
                                        <Button
                                            key={item.label}
                                            variant={item.active ? 'default' : 'ghost'}
                                            className="w-full justify-start gap-3 h-11"
                                            onClick={onClose}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            <span className="flex-1 text-left">{item.label}</span>
                                            {item.badge && (
                                                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Button>
                                    ))}
                                </div>

                                {/* Quick Stats */}
                                <div className="space-y-3">
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Quick Stats
                                    </h3>
                                    {stats.slice(0, 3).map((stat) => (
                                        <div
                                            key={stat.label}
                                            className="bg-secondary/20 rounded-lg p-4 border border-border"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                                </div>
                                                <div className={`${stat.color} opacity-50`}>
                                                    <stat.icon className="h-7 w-7" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Upgrade Card */}
                                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
                                    <h4 className="text-base font-semibold mb-2 flex items-center gap-2">
                                        <Award className="text-primary h-5 w-5" />
                                        Upgrade to Pro
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Unlock premium features and benefits
                                    </p>
                                    <Button className="w-full" size="sm">
                                        Upgrade Now
                                    </Button>
                                </div>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
