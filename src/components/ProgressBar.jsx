export default function ProgressBar({ percentage }) {
  return (
    <div className="w-full bg-gray-300/30 rounded-full h-4 mb-6">
      <div
        className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}