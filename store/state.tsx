import { createContext, useContext, useState } from "react";

const UserContext = createContext({});

export default function AppStore({ children } : { children: React.ReactNode }) {
  const [user, setUser] = useState({});

  return (
    <UserContext.Provider value={{
      user,
      setUser
    }}>
      {children}
    </UserContext.Provider>
  );
}


export function useUserContext() {
  return useContext(UserContext);
}