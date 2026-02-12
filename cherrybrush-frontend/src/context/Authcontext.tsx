import React, { createContext, useEffect , useState , useContext } from "react";
import api from "../api/axiosinstance.ts"; 

interface AuthContextType {
    user: { token: String } | null;
    setUser: React.Dispatch<React.SetStateAction<{ token:String } | null>>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined> (undefined);

const AuthProvider = ({children} : {children: React.ReactNode}) => {
  const [user, setUser] = useState<{ token: String } | null> (null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token");
    const validateToken = async () => {
        if (!token) {
          setLoading(false)
          return;
        } 
  
        try {
            const res = await api.get("/auth", {
              headers: { Authorization: `Bearer ${token}` },
            });
            
            if (res.data.valid) {
                setUser({ token });
          } else {
            localStorage.removeItem("token");
            setUser(null);
            console.log(res.data.valid)
          }
        } catch (err) {
          localStorage.removeItem("token");
          setUser(null);
        } finally {
          setLoading(false)
        }
      };
  
      validateToken();
  }, []);

  const logout = () => {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
  }

  return(
      <AuthContext.Provider value={{user, setUser, logout}}>
          {children}    
      </AuthContext.Provider>
  )
}

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth not within AuthProvider")
    return context
} 

export { useAuth, AuthProvider }