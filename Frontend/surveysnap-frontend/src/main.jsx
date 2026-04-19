// main.jsx - Application ka entry point
// React DOM yahan root element mein App component render karta hai
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Global styles (Tailwind CSS)

// index.html mein jo <div id="root"> hai, usme poori app mount hoti hai
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* StrictMode development mein extra warnings dikhata hai */}
    <App />
  </React.StrictMode>
);
