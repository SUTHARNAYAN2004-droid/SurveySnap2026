// Auto-detect karta hai - localhost pe bhi kaam karega, network pe bhi
// VITE_BACKEND_URL .env mein set karo apne WiFi IP ke saath
const BASE_URL = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:5000`;

export default BASE_URL;
