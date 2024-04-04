import React, { useState } from "react";
import styles from "./Modal.module.css"

interface ModalProps {
  children: React.ReactNode;
  btnLabel: string;
}

const Modal: React.FC<ModalProps> = ({ children, btnLabel }) => {
  const [isOpen, setIsOpen] = useState(false);



  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>{btnLabel}</button>

      {isOpen && (
        <dialog open onClose={closeModal} className={styles.modal}>
          <button onClick={closeModal}>Close</button>
          {children}
        </dialog>
      )}
    </div>
  );
};

export default Modal;
