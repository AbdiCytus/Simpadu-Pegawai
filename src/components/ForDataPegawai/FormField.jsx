const FormField = ({ label, children }) => (
  <div className="flex rounded-md border border-gray-300 overflow-hidden shadow-sm">
    <span className="bg-primary text-white w-40 sm:w-48 px-4 py-2 text-sm font-semibold flex items-center">
      {label}
    </span>
    <div className="w-full bg-white">{children}</div>
  </div>
);

export default FormField;
