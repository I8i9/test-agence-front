/* eslint-disable no-unused-vars */
function DetailItem({ label, icon: Icon, children,className = '' }) {
  return (
    <div className={`flex w-fill h-fit items-start gap-2 ${className}`}>
      <Icon  className="w-4 h-4 shrink-0 text-gray-500" />
      <div className="flex flex-col items-start gap-2 w-full min-w-0  text-nowrap">
        <span className="text-gray-500 leading-none whitespace-nowrap">{label}</span>
        <div className="font-medium max-w-full truncate text-base leading-none">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DetailItem;