export default function ApiUrl() {
    // Vite sets NODE_ENV=production for every `vite build`, including --mode development.
    // MODE is what actually reflects which .env file was used.
    return import.meta.env.MODE === "production"
        ? import.meta.env.VITE_API_URL_PROD?.toString()
        : import.meta.env.VITE_API_URL_DEV?.toString()
}