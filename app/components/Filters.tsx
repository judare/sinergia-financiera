import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ListFilter, Plus, Search, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/app/components/UI/Dropdown";
import { motion } from "framer-motion";
import DS from "design-system";

const Input = ({ value, onChange }: { value: string; onChange: any }) => {
  return (
    <div className="relative">
      <Search className="absolute top-5 -mt-0.5 left-3 text-white size-5 stroke-[3px]" />
      <input
        type="text"
        className="bg-transparent  font-base py-4 outline-none px-3 pl-12"
        placeholder="Buscar"
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
      />
    </div>
  );
};

interface IFilter {
  label: string;
  type?: string;
  icon: any;
  name: string;
  multiple?: boolean;
  value?: any;
  options?: {
    label: string;
    value: string;
    image?: string;
  }[];
}

const ContentOptions = ({
  showing,
  currentOptions,
  form,
  putValue,
  putFilter,
  toggleValue,
}: {
  showing: any;
  currentOptions: IFilter | null;
  form: any;
  putValue: any;
  putFilter: any;
  toggleValue: any;
}) => {
  const [searchOptions, setSearchOptions] = useState("");

  const filteredOptions = () => {
    if (!searchOptions) return currentOptions?.options;
    let s = searchOptions.toLowerCase();
    return currentOptions?.options?.filter((option: any) =>
      option.label.toLowerCase().includes(s),
    );
  };

  if (!showing) return null;
  if (!currentOptions) return null;

  let showSearch = (currentOptions?.options?.length || 0) > 10;
  return (
    <>
      {currentOptions?.type == "text" ? (
        <Input
          value={form[currentOptions?.name || ""]}
          onChange={(val: any) => putValue(currentOptions?.name || "", val)}
        />
      ) : null}

      {showSearch && (
        <div className="border-b border-white/10">
          <Input
            value={searchOptions}
            onChange={(e: any) => setSearchOptions(e)}
          />
        </div>
      )}
      {(currentOptions?.options?.length || 0) > 0 && (
        <div
          className={`flex flex-col gap-0 font-light scrollable-div max-h-96 overflow-y-auto pb-3  ${showSearch ? "" : "pt-3"}`}
        >
          {filteredOptions()?.map((option: any, index: number) => (
            <motion.div
              className="flex items-center gap-1 px-2 py-2 text-sm  hover:bg-white/10 rounded-2xl cursor-pointer transition-all duration-100 font-semibold"
              key={option.value + "-" + index}
              onClick={() => {
                if (currentOptions.multiple) {
                  toggleValue(currentOptions?.name || "", option.value);
                } else {
                  putFilter(currentOptions.name, option.value);
                }
              }}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index < 20 ? 0.05 * index : 1,
                duration: 0.15,
                ease: [0, 0.71, 0.2, 1.01],
              }}
            >
              {currentOptions?.multiple && (
                <DS.Checkbox
                  value={form?.[currentOptions?.name || ""]?.includes(
                    option.value,
                  )}
                  onChange={(_: any, e: any) => {
                    e.stopPropagation();
                    toggleValue(currentOptions?.name || "", option.value);
                  }}
                />
              )}
              {option.image && (
                <img
                  src={option.image}
                  className="size-5 rounded-full shrink-0"
                />
              )}
              <div className="truncate">{option.label}</div>
              {option.count && (
                <div className="shrink-0 ml-auto pl-2">{option.count}</div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
};

export const DropDownFilters = ({
  children,
  putValue,
  toggleValue,
  filters,
  form,
}: {
  children: any;
  putValue: any;
  toggleValue: any;
  filters: IFilter[];
  form: any;
}) => {
  const [open, setOpen] = useState(false);
  const [showing, setShowing] = useState<null | string>(null);
  let currentOptions: IFilter | null =
    filters.find((filter: any) => filter.name == showing) || null;

  const putFilterWrapper = (...args: any) => {
    putValue(...args);
    setOpen(!!currentOptions?.multiple);
  };

  return (
    <DropdownMenu
      onOpenChange={(open: boolean) => {
        setOpen(open);
        setShowing(null);
      }}
      open={open}
    >
      <DropdownMenuTrigger className="outline-none">
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-48 max-w-64 select-none ">
        <ContentOptions
          showing={showing}
          currentOptions={currentOptions!}
          form={form}
          putValue={putValue}
          putFilter={putFilterWrapper}
          toggleValue={toggleValue}
        />
        {!showing && (
          <div className="flex flex-col gap-0 font-light py-3 ">
            {filters.map((filter: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2 px-2 py-2 text-sm font-semibold hover:bg-white/10 rounded-2xl cursor-pointer transition-all duration-100"
                onClick={() => {
                  !filter.options &&
                    filter.value &&
                    putFilterWrapper(filter.name, filter.value);
                  (filter.options || typeof filter.value == "undefined") &&
                    setShowing(filter.name);
                }}
              >
                <div className="flex items-center gap-2">
                  <filter.icon className="size-4" />
                  <div>{filter.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function Filters({
  filters,
  setFilters,
  rowsCount = -1,
  className,
  size = "md",
  defaultFilters = {},
}: {
  size?: "sm" | "md" | "lg";
  filters: IFilter[];
  setFilters: any;
  rowsCount?: number;
  className?: string;
  defaultFilters?: any;
}) {
  const [form, setForm] = useState<any>({ ...defaultFilters });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let f: any = { ...defaultFilters };
    for (const filter of filters) {
      let name = filter.name;
      let val = searchParams.get(name);
      if (val) {
        f[name] = filter.multiple
          ? val.split(",").map((v: any) => (isNaN(v) ? v : +v))
          : val;
      }
    }
    setForm(f);
  }, []);

  const syncToUrl = (newForm: any) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const filter of filters) {
      params.delete(filter.name);
    }
    for (const [key, value] of Object.entries(newForm)) {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && (value as any[]).length === 0)
      ) {
        params.set(
          key,
          Array.isArray(value) ? (value as any[]).join(",") : String(value),
        );
      }
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const putValue = (name: any, value: any) => {
    const newForm = { ...form, [name]: value };
    setForm(newForm);
    setFilters(newForm);
    syncToUrl(newForm);
  };

  const toggleValue = (name: any, value: any) => {
    let newForm = { ...form };
    if (!newForm[name]) newForm[name] = [];
    if (newForm[name].includes(value)) {
      newForm[name] = newForm[name].filter((v: any) => v != value);
    } else {
      newForm[name] = [...newForm[name], value];
    }
    setForm(newForm);
    setFilters(newForm);
    syncToUrl(newForm);
  };

  const putFilter = (name: any, value: any) => {
    putValue(name, value);
  };

  const currentFilters = () => {
    let f: any = form;
    let keys = Object.keys(f);
    let obj: any = [];
    keys.map((key: any) => {
      let filterObj = filters.find((filter: IFilter) => filter.name == key);
      if (!filterObj) return null;

      let value = null;
      let image = null;
      if (filterObj?.options && !filterObj?.multiple) {
        let found = filterObj?.options.find(
          (option: any) => option.value == f[key],
        );
        value = found?.label;
        image = found?.image;
      } else if (filterObj?.options && filterObj?.multiple) {
        let found = filterObj?.options
          .filter((option: any) => f[key].includes(option.value))
          ?.map((o: any) => o.label);
        value = found.join(", ");
        image = null;
      } else if (filterObj?.type == "text") {
        value = f[key];
      }
      obj.push({
        label: filterObj?.label,
        icon: filterObj?.icon,
        name: key,
        value,
        image,
        multiple: filterObj?.multiple,
        options: filterObj?.options,
        type: filterObj?.type,
      });
    });

    return obj;
  };

  const classes = `h-10  rounded-lg bg-white text-neutral-600  font-light  
  ${size == "sm" && "py-1 px-3"} ${size != "sm" && "py-1 px-5 "}`;

  return (
    <div className={className}>
      <div
        className={
          "flex justify-between text-neutral-800 mb-5 select-none items-center w-full"
        }
      >
        <div className="flex gap-2 items-center">
          <DropDownFilters
            putValue={putValue}
            toggleValue={toggleValue}
            filters={filters}
            form={form}
          >
            <div
              className={
                "flex gap-2 items-center cursor-pointer text-neutral-900 font-semibold " +
                classes
              }
            >
              <ListFilter className="size-5 stroke-[2px]" />
              <div>Filtros</div>
            </div>
          </DropDownFilters>

          {rowsCount >= 0 && (
            <div className="font-light text-sm text-neutral-500">
              {rowsCount} registros
            </div>
          )}
        </div>
      </div>

      {currentFilters().length > 0 && (
        <div className="flex items-center flex-wrap gap-2 mb-5">
          {currentFilters().map((filter: any, index: number) => (
            <motion.div
              key={index}
              className={`text-black bg-neutral-100 rounded-2xl flex gap-2 items-center h-full select-none 
                ${size == "sm" && "px-2 py-1 text-sm "}
                ${size != "sm" && "px-5 py-1 text-base "}
                `}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.3, ease: [0, 0.71, 0.2, 1.01] }}
            >
              <filter.icon
                className={`${size == "sm" && "size-4"} ${
                  size != "sm" && "size-5"
                }`}
              />
              <div>{filter.label}</div>

              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div
                    className={`flex items-center gap-1 py-2 bg-white px-3 rounded-full ${
                      size == "sm" && "text-xs"
                    } ${size != "sm" && "text-sm"}`}
                  >
                    {filter.image && (
                      <img
                        src={filter.image}
                        className="size-6 rounded-full shrink-0"
                      />
                    )}

                    <div className="max-w-40 truncate ">
                      {filter.value || "#Empty"}
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-48 max-w-64 ">
                  <ContentOptions
                    showing={true}
                    currentOptions={{
                      label: filter.label,
                      name: filter.name,
                      options: filter.options,
                      type: filter.type,
                      icon: filter.icon,
                      multiple: filter.multiple,
                    }}
                    form={form}
                    putValue={putValue}
                    putFilter={putFilter}
                    toggleValue={toggleValue}
                  />
                </DropdownMenuContent>
              </DropdownMenu>

              <div
                className="hover:bg-neutral-200 rounded-full size-6 flex items-center justify-center"
                onClick={() => {
                  const newForm = { ...form };
                  delete newForm[filter.name];
                  setForm(newForm);
                  setFilters(newForm);
                  syncToUrl(newForm);
                }}
              >
                <X className="size-4" />
              </div>
            </motion.div>
          ))}

          <DropDownFilters
            putValue={putValue}
            toggleValue={toggleValue}
            filters={filters}
            form={form}
          >
            <div
              className={`text-black bg-neutral-100 hover:bg-neutral-200  flex gap-2 items-center  select-none px-3 py-1 text-base  h-10 rounded-full`}
              onClick={() => {}}
            >
              <Plus className="size-4" />
            </div>
          </DropDownFilters>
        </div>
      )}
    </div>
  );
}
