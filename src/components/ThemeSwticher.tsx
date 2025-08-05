"use client"
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button
                variant="outline"
                size="icon"
                disabled
            >
                <Sun />
            </Button>
        );
    }

    const isDark = resolvedTheme === "dark";

    return (
        <Button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            variant="outline"
            size="icon"
        >
            {isDark ? <Moon /> : <Sun />}
        </Button>
    );
}
