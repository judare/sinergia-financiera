import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/app/components/UI/Dropdown";
import { ChevronDown } from "lucide-react";

export function DropBox({ children }: any) {
  return (
    <div className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-white shadow-md md:text-sm text-xs">
      {children}
    </div>
  );
}
export default function Drop({ selected, items, onClick }: any) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger className=" focus:outline-none">
        <DropBox>
          {selected.icon && (
            <selected.icon className="size-4 md:size-5 rounded-full shrink-0 " />
          )}

          {!selected.icon && (
            <img
              src={`/flags/${selected.code}.svg`}
              className="size-4 md:size-5 rounded-full shrink-0 "
            />
          )}

          <span>{selected.name.toUpperCase()}</span>

          <ChevronDown
            className={`size-4 md:size-5 ml-auto text-neutral-700 dark:text-neutral-500 transition-all duration-100 ${
              open ? "rotate-180" : ""
            }`}
          />
        </DropBox>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" w-48">
        <div className="flex flex-col w-full gap-1 py-2 cursor-default">
          {items.map((item: any) => (
            <div
              key={item.code}
              className="flex items-center gap-2 px-2 rounded-xl py-1 w-full truncate text-sm hover:bg-neutral-100"
              onClick={() => {
                onClick(item);
                setOpen(false);
              }}
            >
              {item.icon && (
                <item.icon className="size-5 rounded-full shrink-0 " />
              )}
              {!item.icon && (
                <img
                  src={`/flags/${item.code}.svg`}
                  className="size-5 rounded-full shrink-0 "
                />
              )}

              {item.name}
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
