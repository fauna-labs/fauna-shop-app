import { useState } from "react";
import styles from "../styles/Nav.module.css";
import Image from 'next/image';
import crossIcon from "../public/cross.svg";
import { useUserContext } from '../store/state';

const inputStyles = `
p-2 mb-2 mt-2 rounded-lg border border-gray-800 w-full focus:outline-none focus:ring focus:ring-violet-300
`
const btnStyles = `mb-1 mt-2 border border-gray-800 rounded-md p-2 hover:bg-gray-200`

export default function LoginSignup({ onClose } : { onClose: () => void }) {
  const [showSignup, setShowSignup] = useState(false);

  const userCtx = useUserContext() as any;
  const { user, setUser } = userCtx;

  const doSignup = (e: any) => {
    e.preventDefault();
    setUser({
      username: "Shadid",
      token: "1234567890"
    });
  }

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

        { showSignup ? (
          <div className="flex flex-col p-3">
            <h2 className="text-xl pb-2 pt-2">Sign Up</h2>
            <form onSubmit={doSignup} className="flex flex-col">
              <div>
                <label htmlFor="username">Username</label>
                <input name="username" placeholder="Username" className={inputStyles}/>
              </div>
              <div className="flex flex-col">
                <label htmlFor="email">Email</label>
                <input placeholder="jon@email.com" name="email" className={inputStyles}/>
              </div>
              <div className="flex flex-col">
                <label htmlFor="email">Password</label>
                <input type="password" name="password" placeholder="Password" className={inputStyles}/>
              </div>
              <button type="submit" className={btnStyles}>Sign Up</button>
            </form>
            <button 
              className="mt-3 underline hover:decoration-purple-800"
              onClick={() => setShowSignup(false)}
            >
              Already have an account Login now.
            </button>
          </div>
        ) : (
          <div className="flex flex-col p-3">
            <h2 className="text-xl pb-2 pt-2">Login</h2>
            <form onSubmit={doSignup} className="flex flex-col">
              <div className="flex flex-col">
                <label htmlFor="email">Email</label>
                <input placeholder="jon@email.com" name="email" className={inputStyles}/>
              </div>
              <div className="flex flex-col">
                <label htmlFor="email">Password</label>
                <input type="password" name="password" placeholder="Password" className={inputStyles}/>
              </div>
              <button type="submit" className={btnStyles}>Login</button>
            </form>
            <button 
              className="mt-3 underline hover:decoration-purple-800"
              onClick={() => setShowSignup(true)}
            >
              Don't have an account Signup now.
            </button>
          </div>
        ) }

      </div>
    </div>
  )
}