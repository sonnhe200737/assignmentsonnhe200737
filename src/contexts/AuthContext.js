import {
  createContext,
  useContext,
  useState
} from "react";

const AuthContext =
  createContext(null);

export function AuthProvider({
  children
}) {

  const [
    currentUser,
    setCurrentUser
  ] = useState(() => {

    const storedUser =
      localStorage.getItem(
        "currentUser"
      );

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(
        storedUser
      );
    } catch (error) {

      console.error(
        "Failed to parse current user:",
        error
      );

      localStorage.removeItem(
        "currentUser"
      );

      return null;
    }

  });

  /*
   * LOGIN
   */
  const login = (user) => {

    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );

    setCurrentUser(user);
  };

  /*
   * LOGOUT
   */
  const logout = () => {

    localStorage.removeItem(
      "currentUser"
    );

    setCurrentUser(null);
  };

  /*
   * UPDATE USER
   * Dùng khi sửa profile
   */
  const updateCurrentUser =
    (updatedUser) => {

      localStorage.setItem(
        "currentUser",
        JSON.stringify(
          updatedUser
        )
      );

      setCurrentUser(
        updatedUser
      );
    };

  const authValue = {
    currentUser,
    login,
    logout,
    updateCurrentUser,
    isAuthenticated:
      currentUser !== null
  };

  return (
    <AuthContext.Provider
      value={authValue}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}