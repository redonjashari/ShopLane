"use server"

import db from "@/db/db"
import { z } from "zod"
import fs from "fs/promises"
import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

const fileSchema = z.instanceof(File, { message: "Required"})

const imageSchema = fileSchema.refine(
    file => file.size === 0 || file.type.startsWith("image/")
)

const addSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    priceInCents: z.coerce.number().int().min(1),
    file: fileSchema.refine(file => file.size > 0, "Required"),
    image: imageSchema.refine(file => file.size > 0, "Required")
})

export async function addProduct(prevState: unknown, formData: FormData) {
    try {
        const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
        if (result.success === false) {
            return result.error.formErrors.fieldErrors
        }

        const data = result.data

        // Create directories if they don't exist
        await fs.mkdir("products", { recursive: true })
        await fs.mkdir("public/products", { recursive: true })

        const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
        const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`

        // Write files
        await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
        await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()))

        // Create product in database
        await db.product.create({ 
            data: {
                isAvailableForPurchase: false,
                name: data.name,
                description: data.description,
                priceInCents: data.priceInCents,
                filePath,
                imagePath
            },
        })

        revalidatePath("/")
        revalidatePath("/products")
        redirect("/admin/products")
    } catch (error) {
        console.error("Error adding product:", error)
        return { _form: ["Failed to add product. Please try again."] }
    }
}

export async function toggleProductAvailability(
    id: string, 
    isAvailableForPurchase: boolean
) {
    try {
        await db.product.update({ where: { id }, data: {
            isAvailableForPurchase }}
        )

        revalidatePath("/")
        revalidatePath("/products")
    } catch (error) {
        console.error("Error toggling product availability:", error)
        throw new Error("Failed to update product availability")
    }
}

export async function deleteProduct(
    id: string
) {
    try {
        const product = await db.product.findUnique({ where: { id } })
        if (product == null) return notFound()

        await db.product.delete({where: { id }})

        // Clean up files
        try {
            await fs.unlink(product.filePath)
        } catch (error) {
            console.warn("Failed to delete product file:", error)
        }
        
        try {
            await fs.unlink(`public${product.imagePath}`)
        } catch (error) {
            console.warn("Failed to delete product image:", error)
        }

        revalidatePath("/")
        revalidatePath("/products")
    } catch (error) {
        console.error("Error deleting product:", error)
        throw new Error("Failed to delete product")
    }
}

const editSchema = addSchema.extend({
    file: fileSchema.optional(),
    image: imageSchema.optional()
})

export async function updateProduct(id: string, prevState: unknown, formData: FormData) {
    try {
        const result = editSchema.safeParse(Object.fromEntries(formData.entries()))
        if (result.success === false) {
            return result.error.formErrors.fieldErrors
        }

        const data = result.data
        const product = await db.product.findUnique({ where: { id } })

        if (product == null) return notFound()

        let filePath = product.filePath
        if (data.file != null && data.file.size > 0) {
            try {
                await fs.unlink(product.filePath)
            } catch (error) {
                console.warn("Failed to delete old file:", error)
            }
            filePath = `products/${crypto.randomUUID()}-${data.file.name}`
            await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
        }

        let imagePath = product.imagePath
        if (data.image != null && data.image.size > 0) {
            try {
                await fs.unlink(`public${product.imagePath}`)
            } catch (error) {
                console.warn("Failed to delete old image:", error)
            }
            imagePath = `/products/${crypto.randomUUID()}-${data.image?.name}`
            await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()))
        }

        await db.product.update({ 
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                priceInCents: data.priceInCents,
                filePath,
                imagePath,
            }
        })

        revalidatePath("/")
        revalidatePath("/products")
        redirect("/admin/products")
    } catch (error) {
        console.error("Error updating product:", error)
        return { _form: ["Failed to update product. Please try again."] }
    }
}