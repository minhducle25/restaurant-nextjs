import {z} from "zod";
import { de } from "zod/locales";

const configSchema = z.object({
    NEXT_PUBLIC_API_ENDPOINT: z.string(),
    NEXT_PULIC_URL: z.string(),
})

const configProject = configSchema.safeParse({
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PULIC_URL: process.env.NEXT_PULIC_URL,
})

if (!configProject.success) {
    console.error("Invalid client configuration", configProject.error.format())
    throw new Error("Invalid client configuration")
}
const evnConfig = configProject.data
export default evnConfig