export default function Card({
  title,
  body,
  footer,
  subtitle,
  className,
}: any) {
  return (
    <div
      className={
        "flex flex-col  text-black mb-auto py-5 shadow-lg rounded-xl divide-y divide-neutral-200 border border-neutral-300 w-full select-none " +
        className
      }
    >
      {title && (
        <h2 className="font-bold text-sm mb-3  pt-3 text-neutral-700 px-5">
          {title}
        </h2>
      )}
      {subtitle && (
        <div className="text-sm font-light py-3 px-5">{subtitle}</div>
      )}

      {body && <div className="text-neutral-400  px-5 py-3">{body}</div>}
      {footer && <div className="px-5 py-5 flex justify-start  ">{footer}</div>}
    </div>
  );
}
