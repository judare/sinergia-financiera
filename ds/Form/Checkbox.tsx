import Checkbox from "@/app/components/UI/Checkbox";

type CheckboxProps = {
  [x: string]: any;
  label?: string;
  value: boolean;
  onChange?: (value: boolean, e?: any) => void;
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
        onToggle={(e: any) =>
          extraProps.onChange && extraProps.onChange(!value, e)
        }
        isChecked={value}
      />
      {(label || extraProps.children) && (
        <div
          className="text-sm font-light text-neutral-600 dark:text-neutral-300"
          onClick={(e: any) =>
            extraProps.onChange && extraProps.onChange(!value, e)
          }
        >
          {label || extraProps.children}
        </div>
      )}
    </div>
  );
}
