import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Download } from "lucide-react"

export default function ExpiredDownloadPage() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <Clock className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl">Download Expired</CardTitle>
                    <CardDescription>
                        Your download link has expired. Please contact support if you need assistance.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Download links are valid for 24 hours after purchase for security reasons.
                    </p>
                    <Button asChild className="w-full">
                        <Link href="/products">
                            Browse Products
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
