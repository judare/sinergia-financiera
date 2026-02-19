import { Check } from "lucide-react";
const Checkbox = ({ onToggle, isChecked = false, className }: any) => {
  return (
    <div
      className={`size-5 border-2 border-neutral-400 rounded-md mr-2 transition-all duration-100 text-white ${
        isChecked ? "bg-black border-transparent" : "hover:bg-neutral-200"
      } ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle && onToggle();
      }}
    >
      {isChecked && <Check className="size-4" />}
    </div>
  );
};

export default Checkbox;
