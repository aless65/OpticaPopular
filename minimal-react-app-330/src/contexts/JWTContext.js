import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    console.log(localStorage.getItem('usuario'))
    if (storedUser !== null) {
      const parsedUser = JSON.parse(storedUser);
      const usuario = {
        displayName: parsedUser.empe_NombreCompleto,
        email: parsedUser.empe_CorreoElectronico,
        photoURL: 'https://www.svgrepo.com/show/57853/avatar.svg',
        role: parsedUser.usua_EsAdmin === true ? 'Admin' : 'Not admin',
      };
      setIsAuthenticated(true);
      setUser(usuario);
    }
  }, []);

  const login = async (email, password) => {
    // Login logic here...
  };

  const logout = async () => {
    localStorage.removeItem('usuario');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        method: 'jwt',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
