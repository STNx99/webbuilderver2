'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, LogOut, Sparkles, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface UserProfile {
    name: string;
    email: string;
    avatar: string;
}

interface Account {
    name: string;
    email: string;
    avatar: string;
    active: boolean;
}

interface TopNavigationProps {
    profile: UserProfile;
    accounts: Account[];
    onMenuToggle?: () => void;
}

export default function TopNavigation({ profile, accounts, onMenuToggle }: TopNavigationProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    return (
        <motion.div
            className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border w-full"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-4">
                <div className="flex items-center justify-between gap-3 sm:gap-4 w-full max-w-[1600px] mx-auto">
                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={onMenuToggle}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Logo/Title */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                            <Sparkles className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text hidden sm:block">
                            WebBuilder
                        </h1>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="flex-1 max-w-md hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search settings, activities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full bg-secondary/20 border-border focus:border-primary/50 transition-all"
                            />
                        </div>
                    </div>

                    {/* Account Switcher & Actions */}
                    <div className="flex items-center gap-2">
                        {/* Search Icon - Mobile/Tablet */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setShowSearch(!showSearch)}
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-2 h-9 px-2 sm:px-3">
                                    <Avatar className="h-7 w-7">
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                            {profile.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">{profile.name}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64">
                                <DropdownMenuLabel>Switch Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {accounts.map((account) => (
                                    <DropdownMenuItem key={account.email} className="gap-2 cursor-pointer">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className={account.active ? 'bg-primary text-primary-foreground' : 'bg-secondary'}>
                                                {account.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{account.name}</p>
                                            <p className="text-xs text-muted-foreground">{account.email}</p>
                                        </div>
                                        {account.active && (
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        )}
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2 text-red-500 cursor-pointer">
                                    <LogOut className="h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Mobile Search - Expandable */}
                {showSearch && (
                    <motion.div
                        className="md:hidden mt-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full bg-secondary/20 text-sm"
                                autoFocus
                            />
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
