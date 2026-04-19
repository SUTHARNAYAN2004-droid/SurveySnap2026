// InputField.jsx - Reusable input field component
// label, type, value, onChange props se customize hota hai
export default function InputField({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div className="mb-4">
      {/* Label - agar pass kiya gaya ho to dikhao */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
