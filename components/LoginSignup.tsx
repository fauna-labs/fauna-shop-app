import { useState } from "react";
import styles from "../styles/Nav.module.css";
import Image from 'next/image';
import crossIcon from "../public/cross.svg";
import { useUserContext } from '../store/state';
import { Client } from 'fauna';

const inputStyles = `
p-2 mb-2 mt-2 rounded-lg border border-gray-800 w-full focus:outline-none focus:ring focus:ring-violet-300
`
const btnStyles = `mb-1 mt-2 border border-gray-800 rounded-md p-2 hover:bg-gray-200`

const client = new Client({ 
  endpoint: process.env.NEXT_PUBLIC_FAUNA_ENDPOINT as any,
  secret: process.env.NEXT_PUBLIC_FAUNA_SECRET as any,
});

export default function LoginSignup({ onClose } : { onClose: () => void }) {
  const [showSignup, setShowSignup] = useState(false);
  const [state, setState] = useState({
    username: '',
    email: '',
    password: ''
  });

  const userCtx = useUserContext() as any;
  const { setUser } = userCtx;

  const doSignup = async (e: any) => {
    e.preventDefault();

    const { username, email, password } = state;
    try {
      const response = await client.query({
        query: `Signup("${username}", "${email}", "${password}")`
      })
      console.log('response', response);
      alert("Signup successful! Please login now.");
      setShowSignup(false)
    } catch (error) {
      alert("Somehting went wrong");
    }
  }

  const doLogin = async (e: any) => {
    e.preventDefault();

    const { email, password } = state;
    try {
      const response = await client.query({
        query: `Login("${email}", "${password}")`
      })
      console.log('response', response);
      window.localStorage.setItem('fauna-marketplace', JSON.stringify(response));
      setUser(response);
      alert("Login successful!");
      onClose();
    } catch (error) {
      console.log('error', error);
      alert("Invalid username or password");
    }
  }

  const handleChange = (e: any) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
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
                <input 
                  name="username" 
                  type="text"
                  placeholder="Username" 
                  className={inputStyles} 
                  onChange={handleChange}
                  value={state.username}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email">Email</label>
                <input 
                  placeholder="jon@email.com" 
                  name="email"
                  type="email"
                  className={inputStyles} 
                  onChange={handleChange}
                  value={state.email}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Password" 
                  className={inputStyles} 
                  onChange={handleChange}
                  value={state.password}
                />
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
            <form onSubmit={doLogin} className="flex flex-col">
              <div className="flex flex-col">
                <label htmlFor="email">Email</label>
                <input 
                  placeholder="jon@email.com" 
                  name="email" 
                  className={inputStyles}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Password" 
                  className={inputStyles}
                  onChange={handleChange}
                />
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