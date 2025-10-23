import db from "@/db/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/formatters"
import { cache } from "@/lib/cache"

const getOrders = cache(
    () => {
        return db.order.findMany({
            select: {
                id: true,
                pricePaidInCents: true,
                createdAt: true,
                user: { select: { email: true } },
                product: { select: { name: true } }
            },
            orderBy: { createdAt: "desc" }
        })
    },
    ["/admin/orders"],
    { revalidate: 60 }
)

export default async function OrdersPage() {
    const orders = await getOrders()

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Sales</CardTitle>
                    <CardDescription>
                        View all orders and sales data
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">
                                        {order.id.slice(0, 8)}...
                                    </TableCell>
                                    <TableCell>{order.product.name}</TableCell>
                                    <TableCell>{order.user.email}</TableCell>
                                    <TableCell>{formatCurrency(order.pricePaidInCents / 100)}</TableCell>
                                    <TableCell>
                                        {order.createdAt.toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
