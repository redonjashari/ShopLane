import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import db from "@/db/db"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string

export async function POST(req: NextRequest) {
    const body = await req.text()
    const signature = headers().get("stripe-signature")

    if (!signature) {
        return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error) {
        console.error("Webhook signature verification failed:", error)
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent
            const { productId } = paymentIntent.metadata

            if (!productId) {
                return NextResponse.json({ error: "Missing productId in metadata" }, { status: 400 })
            }

            const product = await db.product.findUnique({ where: { id: productId } })
            if (!product) {
                return NextResponse.json({ error: "Product not found" }, { status: 404 })
            }

            // Create or find user
            const user = await db.user.upsert({
                where: { email: paymentIntent.receipt_email || "" },
                create: { email: paymentIntent.receipt_email || "" },
                update: {}
            })

            // Create order
            await db.order.create({
                data: {
                    userId: user.id,
                    productId: product.id,
                    pricePaidInCents: product.priceInCents
                }
            })

            // Create download verification (expires in 24 hours)
            await db.downloadVerification.create({
                data: {
                    productId: product.id,
                    ExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
                }
            })

            break
        }
        default:
            console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
}
