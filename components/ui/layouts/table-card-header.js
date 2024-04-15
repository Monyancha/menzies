function TableCardHeader({ children = null, actions = null } = {}) {
  return (
    <header className="flex flex-wrap justify-between items-end w-full">
      <div className="flex w-full md:w-6/12 flex-wrap">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
          {children}
        </div>
      </div>

      <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
        {actions}
      </div>
    </header>
  );
}

export default TableCardHeader;
