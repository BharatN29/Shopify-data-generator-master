import dotenv from "dotenv";

dotenv.config()

const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL || ""
const SHOPIFY_API_URL = `${SHOPIFY_STORE_URL}/admin`
const SHOPIFY_AUTH_TOKEN = process.env.SHOPIFY_AUTH_TOKEN || ""
const CUSTOMER_DATA_URL = process.env.CUSTOMER_DATA_URL || ""
const PRODUCT_DATA_URL = process.env.PRODUCT_DATA_URL || ""
export {
    SHOPIFY_STORE_URL,
    SHOPIFY_API_URL,
    SHOPIFY_AUTH_TOKEN,
    CUSTOMER_DATA_URL,
    PRODUCT_DATA_URL
}