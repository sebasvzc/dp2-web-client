import { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import PropTypes from 'prop-types';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const loginUser = useCallback(async (userInfo) => {
    console.log('userInfo',userInfo)

    try {
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const logoutUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const contextData = useMemo(() => ({
    user,
    loginUser,
    logoutUser,
  }), [user, loginUser, logoutUser]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;