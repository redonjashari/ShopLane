"use client"

import { Elements, PaymentElement, useElements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useStripe } from "@stripe/react-stripe-js"
import Image from "next/image"
import { formatCurrency } from "@/lib/formatters"
import { Card, CardHeader, CardDescription, CardTitle, CardFooter, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormEvent } from "react"
import { useState } from "react"
import { LinkAuthenticationElement } from "@stripe/react-stripe-js"
import { userOrderExists } from "@/app/actions/orders"


type CheckoutFormProps = {
    product: {
        imagePath: string,
        name: string,
        priceInCents: number,
        description: string,
        id: string,
    },
    clientSecret: string
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as 
string)

export function CheckoutForm({ product, clientSecret}
: CheckoutFormProps) {
    return (
        <div className="max-w-6xl w-full mx-auto space-y-12">
            {/* Product Info Section */}
            <div className="bg-gradient-to-r from-card to-card/50 rounded-2xl p-8 shadow-lg border">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="aspect-video flex-shrink-0 w-full lg:w-1/3 relative rounded-xl overflow-hidden shadow-lg">
                        <Image 
                            src={product.imagePath} 
                            fill 
                            alt={product.name} 
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold text-primary"> 
                                {formatCurrency(product.priceInCents / 100)}
                            </div>
                            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                                Premium Digital Product
                            </div>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold leading-tight">{product.name}</h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Instant Access</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>24/7 Download</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
            {/* Checkout Form */}
            <div className="bg-card rounded-2xl shadow-lg border overflow-hidden">
                <Elements options={{ clientSecret }} stripe={stripePromise}>
                    <Form priceInCents={product.priceInCents} productId={product.id}/>
                </Elements>
            </div>
        </div>
    )
} 

function Form({ priceInCents, productId} : {
    priceInCents: number, 
    productId: string
}) {
    const stripe = useStripe()
    const elements = useElements()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>()
    const [email, setEmail] = useState<string>()

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        if (stripe == null || elements == null || email == null) return

        setIsLoading(true)

        const orderExists =  await userOrderExists(email, productId)

        if (orderExists) {
            setErrorMessage("You have already purchased this product. Try downloading it from the orders page.")
            setIsLoading(false)
            return
        }

        stripe.confirmPayment({ 
            elements, 
            confirmParams: {
                return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/
                purchase-success`
            },
        }).then(({ error }) => {
            if (error.type === "card_error" || error.type === "validation_error") {
                setErrorMessage(error.message)
            } else {
                setErrorMessage("An Unknown has Occurred")
            }
        }).finally(() => setIsLoading(false))
    }
    

    return (
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Complete Your Purchase</h2>
                <p className="text-muted-foreground">Secure payment powered by Stripe</p>
            </div>
            
            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Payment Information</h3>
                    <div className="bg-muted/30 p-4 rounded-lg">
                        <PaymentElement />
                    </div>
                </div>
                
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Email Address</h3>
                    <div className="bg-muted/30 p-4 rounded-lg">
                        <LinkAuthenticationElement onChange={e => 
                            setEmail(e.value.email)}/>
                    </div>
                </div>
            </div>

            {errorMessage && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="text-destructive text-sm font-medium">{errorMessage}</p>
                </div>
            )}

            <div className="pt-4">
                <Button 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200 text-lg py-6" 
                    size="lg" 
                    disabled={stripe == null || elements == null || isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            <span>Processing...</span>
                        </div>
                    ) : (
                        `Purchase Now - ${formatCurrency(priceInCents / 100)}`
                    )}
                </Button>
            </div>
        </form>
    )
}