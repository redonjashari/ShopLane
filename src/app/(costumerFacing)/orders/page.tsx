import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Package } from "lucide-react"
import Link from "next/link"
import db from "@/db/db"
import { formatCurrency } from "@/lib/formatters"
import { cache } from "@/lib/cache"

const getUserOrders = cache(
    (email: string) => {
        return db.order.findMany({
            where: { user: { email } },
            select: {
                id: true,
                pricePaidInCents: true,
                createdAt: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        imagePath: true,
                        filePath: true
                    }
                },
                downloadVerification: {
                    select: {
                        id: true,
                        ExpiresAt: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        })
    },
    ["/orders"],
    { revalidate: 60 }
)

async function OrdersContent() {
    // In a real app, you'd get the user email from authentication
    // For now, we'll use a placeholder or make it configurable
    const email = "demo@example.com" // This should come from auth
    const orders = await getUserOrders(email)

    if (orders.length === 0) {
        return (
            <Card>
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Package className="h-6 w-6" />
                    </div>
                    <CardTitle>No orders yet</CardTitle>
                    <CardDescription>
                        You haven't made any purchases yet. Start shopping now!
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <Button asChild>
                        <Link href="/products">
                            Browse Products
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">My Orders</h1>
                <Button asChild>
                    <Link href="/products">
                        Continue Shopping
                    </Link>
                </Button>
            </div>
            
            <div className="grid gap-6">
                {orders.map(order => (
                    <Card key={order.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">{order.product.name}</CardTitle>
                                    <CardDescription>
                                        Purchased on {order.createdAt.toLocaleDateString()}
                                    </CardDescription>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-semibold">
                                        {formatCurrency(order.pricePaidInCents / 100)}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Order ID: {order.id.slice(0, 8)}...
                                </div>
                                {order.downloadVerification && 
                                 order.downloadVerification.ExpiresAt > new Date() ? (
                                    <Button asChild size="sm">
                                        <Link href={`/products/download/${order.downloadVerification.id}`}>
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button disabled size="sm" variant="outline">
                                        Download Expired
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default function OrdersPage() {
    return (
        <Suspense fallback={
            <div className="space-y-6">
                <div className="h-8 bg-muted animate-pulse rounded" />
                <Card>
                    <CardHeader>
                        <div className="h-6 bg-muted animate-pulse rounded" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-4 bg-muted animate-pulse rounded" />
                    </CardContent>
                </Card>
            </div>
        }>
            <OrdersContent />
        </Suspense>
    )
}
