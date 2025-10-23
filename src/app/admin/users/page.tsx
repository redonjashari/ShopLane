import db from "@/db/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatNumber } from "@/lib/formatters"
import { cache } from "@/lib/cache"

const getUsers = cache(
    () => {
        return db.user.findMany({
            select: {
                id: true,
                email: true,
                createdAt: true,
                _count: { select: { orders: true } }
            },
            orderBy: { createdAt: "desc" }
        })
    },
    ["/admin/users"],
    { revalidate: 60 }
)

export default async function UsersPage() {
    const users = await getUsers()

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Customers</CardTitle>
                    <CardDescription>
                        Manage your customer base and view customer information
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Orders</TableHead>
                                <TableHead>Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.email}</TableCell>
                                    <TableCell>{formatNumber(user._count.orders)}</TableCell>
                                    <TableCell>
                                        {user.createdAt.toLocaleDateString()}
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
