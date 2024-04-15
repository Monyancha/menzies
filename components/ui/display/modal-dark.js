export default function ModalDark({
  children = null,
  cRef = null,
  className = "",
  title = null,
  onClose = () => {},
} = {}) {
  function closeModal() {
    onClose();
    cRef.current.close();
  }

  return (
    <div className="flex flex-col items-center w-full">
      <dialog
        ref={cRef}
        className={`bg-base-300 rounded text-base-content shadow-2xl backdrop:bg-v3-darkest backdrop:bg-opacity-50 border border-base-200 tr-eo overflow-auto ${className}`}
      >
        <div className="flex flex-row justify-between">
          <span className="text-md font-semibold">{title}</span>
          <button
            className="px-2 py-1 rounded tr-eo hover:bg-base-200 hover:shadow-xl active:scale-95"
            onClick={closeModal}
          >
            <i className="fa-solid fa-x text-xs"></i>
          </button>
        </div>

        {children}
      </dialog>
    </div>
  );
}
