export default function ApiUrl() {
    return process.env.NODE_ENV == "development" ? import.meta.env.VITE_API_URL_DEV?.toString() : import.meta.env.VITE_API_URL_PROD?.toString()
}