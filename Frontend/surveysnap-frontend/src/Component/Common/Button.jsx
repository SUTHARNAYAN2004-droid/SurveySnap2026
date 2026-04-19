// Button.jsx - Reusable button component
// title prop se button ka text set hota hai
export default function Button({ title }) {
  return (
    <button className="bg-blue-600 text-white px-4 py-2 rounded">
      {title}
    </button>
  );
}
