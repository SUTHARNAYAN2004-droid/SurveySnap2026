// Card.jsx - Reusable card wrapper component
// children prop se andar koi bhi content render hoga
export default function Card({ children }) {
  return (
    <div className="border p-4 rounded shadow bg-white">
      {children}
    </div>
  );
}
