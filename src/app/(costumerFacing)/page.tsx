import db from "@/db/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Product } from "@prisma/client"
import { ProductCard } from "@/components/ProductCard"
import { ProductCardSkeleton } from "@/components/ProductCard"
import { Suspense } from "react"
import { cache } from "@/lib/cache"

const getMostPopularProducts = cache(
    () => {
        return db.product.findMany({
            where: {isAvailableForPurchase: true }, 
            orderBy: { orders: {_count: "desc"}},
            take: 6
        })
    }, 
    ["/", "getMostPopularProducts"],
    { revalidate: 60 * 60 * 24 } 

) 
    


const getNewestProducts = cache(
    () => {
        return db.product.findMany({
            where: {isAvailableForPurchase: true }, 
            orderBy: { createdAt: "desc"},
            take: 6
        })
    },
    ["/", "getNewestProducts"],
    { revalidate: 60 * 60 * 24}
) 



function wait(duration: number) {
    return new Promise(resolve => setTimeout(resolve, duration))
}

export default function HomePage() {
    return (
        <main className="space-y-16">
            {/* Hero Section */}
            <section className="text-center space-y-6 py-12">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Premium Digital Products
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Discover and purchase high-quality digital products including ebooks, courses, software, and more. 
                    Instant access after purchase.
                </p>
            </section>

            <ProductGridSection title="Most Popular"
            productsFetcher={getMostPopularProducts} />

            <ProductGridSection title="Newest" 
            productsFetcher={getNewestProducts} />
        </main>
    )
}

type ProductGridSectionProps = {
    title: string
    productsFetcher: () => Promise<Product[]>
}

function ProductGridSection({
    productsFetcher, 
    title,
}: ProductGridSectionProps) {
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {title}
                </h2>
                <Button variant="outline" asChild className="group hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                    <Link href="/products" className="flex items-center space-x-2">
                        <span className="font-semibold">View All</span>
                        <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Suspense 
                    fallback={
                        <>
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                        </>
                    }
                >
                    <ProductSuspense productsFetcher={productsFetcher} />
                </Suspense>
            </div>
        </div>
    )
}

async function ProductSuspense({ 
    productsFetcher,
}: {
    productsFetcher: () => Promise<Product[]>
}) {
    return (await productsFetcher()).map(product => (
        <ProductCard key={product.id} {...product} />
    ))    
}