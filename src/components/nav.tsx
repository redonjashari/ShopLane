"use client"

import Link from "next/link"
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ComponentProps, ReactNode } from "react"
import { ShoppingBag, Package, User, BarChart3, Home } from "lucide-react"

const iconMap = {
    "/": Home,
    "/products": Package,
    "/orders": ShoppingBag,
    "/admin": BarChart3,
    "/admin/products": Package,
    "/admin/users": User,
    "/admin/orders": BarChart3,
}

export function Nav({ children }: { children: ReactNode}) {
    return (
        <nav className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg border-b">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-center items-center space-x-1">
                    {children}
                </div>
            </div>
        </nav>
    )
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
    const pathname = usePathname()
    const Icon = iconMap[props.href as keyof typeof iconMap]
    
    return (
        <Link 
            {...props} 
            className={cn(
                "flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                "hover:bg-primary-foreground/10 hover:scale-105",
                "focus-visible:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/20",
                "relative overflow-hidden group",
                pathname === props.href 
                    ? "bg-primary-foreground/15 text-primary-foreground shadow-sm" 
                    : "text-primary-foreground/80 hover:text-primary-foreground"
            )}
        >
            {Icon && <Icon className="h-4 w-4" />}
            <span className="relative z-10">{props.children}</span>
            {pathname === props.href && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/5 to-transparent animate-pulse-custom" />
            )}
        </Link>
    )
} 