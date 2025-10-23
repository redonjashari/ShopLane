import { Nav, NavLink} from "@/components/nav"

export const dynamic = 'force-dynamic'

export default function AdminLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
            <Nav>
                <NavLink href="/admin">Dashboard</NavLink>
                <NavLink href="/admin/products">Products</NavLink>
                <NavLink href="/admin/users">Customers</NavLink>
                <NavLink href="/admin/orders">Sales</NavLink>
            </Nav>
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {children}
            </div>
        </div>
    )
}