export default function GenericModal({ children, isOpen, setOpen }) {
  return (
    <div
      className={`tw:fixed tw:inset-0 tw:bg-black/50 tw:z-50 ${
        isOpen ? "tw:block" : "tw:hidden"
      }`}
      onClick={() => setOpen(false)}
    >
      <div className="tw:fixed tw:inset-0 tw:flex tw:items-center tw:justify-center">
        <div className="" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </div>
  );
}
