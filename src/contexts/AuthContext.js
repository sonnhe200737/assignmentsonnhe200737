import {  createContext, useContext, useState  } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  /*
   * Hàm khởi tạo state.
   *
   * Khi ứng dụng vừa chạy, nó kiểm tra localStorage
   * xem trước đó người dùng đã đăng nhập chưa.
   */
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser =
      localStorage.getItem("currentUser");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error(
        "Failed to parse current user:",
        error
      );

      localStorage.removeItem("currentUser");

      return null;
    }
  });

  /*
   * Hàm login nhận user đã đăng nhập thành công.
   */
  const login = (user) => {
    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );

    /*
     * Dòng này rất quan trọng.
     *
     * Khi currentUser thay đổi,
     * tất cả component dùng AuthContext
     * sẽ render lại.
     */
    setCurrentUser(user);
  };

  /*
   * Hàm logout.
   */
  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  const authValue = {
    currentUser,
    login,
    logout,
    isAuthenticated: currentUser !== null
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

/*
 * Custom hook giúp component sử dụng AuthContext dễ hơn.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}