import styles from "../styles/Nav.module.css";
import Image from 'next/image';
import crossIcon from "../public/cross.svg";

export default function LoginSignup({ onClose } : { onClose: () => void }) {
  return (
    <div className={styles.mainModal}>
      <div className={styles.modal}>
        <div className="flex justify-end">
          <button onClick={onClose} className="p-1 border border-gray-800 rounded-md hover:bg-gray-200">
            <Image
              src={crossIcon}
              width={20} 
              height={20} 
              alt="cross icon"
            />
          </button>
        </div>
      </div>
    </div>
  )
}