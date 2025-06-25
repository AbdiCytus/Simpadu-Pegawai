const StatusButton = ({ char, label, isSelected, onClick, color }) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200
               ${
                 isSelected
                   ? `${color} text-white shadow-md`
                   : "bg-gray-200 text-gray-500 hover:bg-gray-300"
               }`}>
    {char}
  </button>
);

export default StatusButton;
