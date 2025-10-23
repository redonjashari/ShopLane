import { formatCurrency } from "@/lib/formatters";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";


type ProductCardProps = {
    id: string,
    name: string,
    priceInCents: number,
    description: string,
    imagePath: string
}

export function ProductCard({ name, priceInCents, description, id, imagePath }:
ProductCardProps) {
    return (
        <Card className="group flex overflow-hidden flex-col hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50 border-0 shadow-md">
            <div className="relative w-full h-auto aspect-video overflow-hidden">
                <Image 
                    src={imagePath} 
                    fill 
                    alt={name}
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {formatCurrency(priceInCents / 100)}
                </div>
            </div>
            <CardHeader className="space-y-2">
                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-200">
                    {name}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Premium Digital Product
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </CardContent>
            <CardFooter className="pt-4">
                <Button 
                    asChild 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105"
                >
                    <Link href={`/products/${id}/purchase`}>
                        Purchase Now
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden flex flex-col animate-pulse bg-gradient-to-br from-card to-card/50 border-0 shadow-md">
            <div className="w-full aspect-video bg-gradient-to-br from-muted to-muted/50" />
            <CardHeader className="space-y-2">
                <CardTitle>
                    <div className="w-3/4 h-6 rounded-lg bg-gradient-to-r from-muted to-muted/50"/>
                </CardTitle>
                <CardDescription>
                    <div className="w-1/2 h-4 rounded-lg bg-gradient-to-r from-muted to-muted/50" />
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="w-full h-4 rounded-lg bg-gradient-to-r from-muted to-muted/50" />
                <div className="w-full h-4 rounded-lg bg-gradient-to-r from-muted to-muted/50" />
                <div className="w-3/4 h-4 rounded-lg bg-gradient-to-r from-muted to-muted/50" />
            </CardContent>
            <CardFooter className="pt-4">
                <div className="w-full h-12 rounded-lg bg-gradient-to-r from-muted to-muted/50" />
            </CardFooter>
        </Card>
    )
}