export function TheadDark(props) {
  return <thead className="bg-base-200 text-error">{props.children}</thead>;
}

export function TrowDark(props) {
  return (
    <tr className="border-b border-base-content/10 text-base-content bg-base-300 even:bg-base-100 even:bg-opacity-10 even:text-opacity-75 hover:bg-opacity-80 hover:bg-base-300 tr-eo">
      {props.children}
    </tr>
  );
}
