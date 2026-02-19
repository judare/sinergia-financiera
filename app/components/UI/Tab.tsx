import React from "react";

const Tab = ({
  tab,
  name,
  icon: Icon,
  currentTab,
  onSelect,
  className = "",
}: any) => {
  const current = currentTab == tab;
  return (
    <div
      className={`py-1 border-b-2 -mb-1.5
      ${current ? " border-black" : "border-transparent"}
    `}
    >
      <div
        className={`flex text-xs items-center gap-2 select-none px-3 py-1.5 font-medium rounded-lg  text-black transition-all duration-200 cursor-pointer hover:bg-neutral-100
        ${current ? " text-black" : "text-neutral-500 "}
        ${className}`}
        onClick={() => onSelect(tab)}
      >
        <Icon
          className={`size-4 flex items-center justify-center rounded-lg  `}
          strokeWidth="2.5"
        />
        {name && <div>{name}</div>}
      </div>
    </div>
  );
};

export default Tab;
