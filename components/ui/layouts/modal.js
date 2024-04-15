function Modal(props) {
  const { actions, title, children, idRef } = props;

  return (
    <div className="modal" id={idRef}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="w-full">{children}</div>
        <div className="modal-action gap-2">{actions}</div>
      </div>
    </div>
  );
}

export const ModalBackButton = ({ title = "Back" } = {}) => {
  return (
    <a href="#" className="btn btn-outline gap-2">
      <i className="fa-solid fa-times-circle"></i>
      {title}
    </a>
  );
};

export default Modal;
