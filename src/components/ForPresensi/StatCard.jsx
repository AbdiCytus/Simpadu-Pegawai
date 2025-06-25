const StatCard = ({ color, title, value }) => (
  <div className="bg-white p-2.5 rounded-lg shadow-md flex items-center gap-3 sm:gap-4">
    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-md ${color}`}></div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-xl sm:text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default StatCard;
