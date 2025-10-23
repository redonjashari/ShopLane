import { Nav, NavLink} from "@/components/nav"

export const dynamic = 'force-dynamic'

export default function Layout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <Nav>
                <NavLink href="/">Home</NavLink>
                <NavLink href="/products">Products</NavLink>
                <NavLink href="/orders">My Orders</NavLink>
            </Nav>
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {children}
            </div>
        </div>
    )
}