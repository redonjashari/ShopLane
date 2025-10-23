import { NextRequest, NextResponse } from "next/server"
import db from "@/db/db"
import fs from "fs/promises"

export async function GET(
    request: NextRequest,
    { params }: { params: { downloadVerificationId: string } }
) {
    const { downloadVerificationId } = params

    const downloadVerification = await db.downloadVerification.findUnique({
        where: { id: downloadVerificationId },
        include: { product: true }
    })

    if (!downloadVerification) {
        return NextResponse.json({ error: "Download verification not found" }, { status: 404 })
    }

    if (downloadVerification.ExpiresAt < new Date()) {
        return NextResponse.json({ error: "Download verification expired" }, { status: 410 })
    }

    const product = downloadVerification.product

    if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    try {
        const fileBuffer = await fs.readFile(product.filePath)
        
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${product.name}.pdf"`,
                'Content-Length': fileBuffer.length.toString()
            }
        })
    } catch (error) {
        console.error("Error reading file:", error)
        return NextResponse.json({ error: "File not found" }, { status: 404 })
    }
}
