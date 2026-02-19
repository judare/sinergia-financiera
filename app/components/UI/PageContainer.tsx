export default function PageContainer({ children, header }: any) {
  return (
    <div className="py-3 px-3 w-full   flex flex-col max-h-screen text-black">
      <div className="bg-white border-neutral-200 border rounded-2xl px-5 py-3 w-full h-full flex-1  scrollable-div overflow-y-auto relative ">
        {header && (
          <div className="mb-3 border-b border-neutral-200 pb-3">{header}</div>
        )}
        {children}
      </div>
    </div>
  );
}
