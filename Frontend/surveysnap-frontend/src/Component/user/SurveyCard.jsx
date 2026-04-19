// SurveyCard.jsx - Ek survey ka card component
// Abhi static/dummy data hai - TODO: Props se dynamic data pass karna hai
export default function SurveyCard() {
  return (
    <div className="border p-4 rounded shadow">
      {/* TODO: title aur date props se leni chahiye */}
      <h2 className="text-lg font-bold">Customer Feedback Survey</h2>
      <p className="text-gray-500">Created on: 10 March</p>
    </div>
  );
}
