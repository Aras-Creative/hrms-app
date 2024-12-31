const Modal = ({ title, isOpen, position = "center", rounded = "rounded-xl", onClose, children, width = "[65%]" }) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-${position} bg-black bg-opacity-50`}>
      <div className={`bg-white  ${rounded} shadow-lg w-${width}`}>{children}</div>
    </div>
  );
};

const Header = ({ children }) => {
  return (
    <div className="py-4 border-b border-zinc-300 mb-5">
      <h2 className="text-lg font-semibold px-6">{children}</h2>
    </div>
  );
};

const Body = ({ children }) => {
  return <div className="px-6">{children}</div>;
};

const Footer = ({ children }) => <div className="flex justify-end gap-4 pt-4 pb-6 px-6">{children}</div>;

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;
