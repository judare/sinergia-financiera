import Checkbox from "@/app/components/UI/Checkbox";

type CheckboxProps = {
  [x: string]: any;
  label?: string;
  value: boolean;
  onChange?: (value: boolean) => void;
};
export default function CheckboxForm({
  label = "",
  value,
  ...extraProps
}: CheckboxProps) {
  return (
    <div
      className={`flex items-center gap-2 select-none ${extraProps.className}`}
    >
      <Checkbox
        onToggle={() => extraProps.onChange && extraProps.onChange(!value)}
        isChecked={value}
      />
      <div
        className="text-sm font-light text-neutral-600 dark:text-neutral-300"
        onClick={() => extraProps.onChange && extraProps.onChange(!value)}
      >
        {label || extraProps.children}
      </div>
    </div>
  );
}
