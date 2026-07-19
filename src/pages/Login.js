import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { getUsersByEmail } from "../services/userService";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  /*
   * State lưu giá trị email người dùng nhập.
   */
  const [email, setEmail] = useState("");

  /*
   * State lưu giá trị password người dùng nhập.
   */
  const [password, setPassword] = useState("");

  /*
   * State lưu thông báo lỗi.
   */
  const [error, setError] = useState("");

  /*
   * State xác định hệ thống có đang xử lý đăng nhập hay không.
   */
  const [loading, setLoading] = useState(false);

  /*
   * useNavigate dùng để chuyển trang bằng JavaScript.
   */
  const navigate = useNavigate();

  const location = useLocation();
  const registerSuccess = location.state?.registerSuccess;

  const { login } = useAuth();

  const redirectPath = location.state?.from?.pathname || "/";

  /*
   * Hàm chạy khi người dùng submit form đăng nhập.
   */
  const handleLogin = async (event) => {
    /*
     * Ngăn trình duyệt reload trang khi submit form.
     */
    event.preventDefault();

    /*
     * Xóa thông báo lỗi cũ trước mỗi lần đăng nhập.
     */
    setError("");

    /*
     * Loại bỏ khoảng trắng thừa ở đầu và cuối email.
     */
    const normalizedEmail = email.trim().toLowerCase();

    /*
     * Validate dữ liệu trước khi gọi API.
     */
    if (normalizedEmail === "") {
      setError("Please enter your email.");
      return;
    }

    if (password === "") {
      setError("Please enter your password.");
      return;
    }

    try {
      /*
       * Bắt đầu xử lý đăng nhập.
       * Nút Sign In sẽ bị khóa.
       */
      setLoading(true);

      /*
       * Gọi JSON Server để tìm user theo email.
       */
      const response = await getUsersByEmail(normalizedEmail);

      /*
       * JSON Server trả về một array.
       *
       * Nếu tìm thấy email:
       * response.data = [{ user object }]
       *
       * Nếu không tìm thấy:
       * response.data = []
       */
      const matchedUsers = response.data;

      /*
       * Lấy user đầu tiên trong array.
       */
      const foundUser = matchedUsers[0];

      /*
       * Không tìm thấy user có email tương ứng.
       */
      if (!foundUser) {
        setError("Email or password is incorrect.");
        return;
      }

      /*
       * So sánh password người dùng nhập
       * với password đang lưu trong db.json.
       */
      if (foundUser.password !== password) {
        setError("Email or password is incorrect.");
        return;
      }
      if (foundUser.status === "disabled") {
        setError(
          "Your account has been disabled. Please contact administrator."
        );
        return;
      }

      /*
       * Không nên lưu password vào localStorage.
       *
       * Dùng destructuring để tách password
       * khỏi object user.
       */
      const {
        password: userPassword,
        ...safeUser
      } = foundUser;

      /*
       * localStorage chỉ lưu được dữ liệu dạng string.
       *
       * JSON.stringify chuyển object thành chuỗi JSON.
       */
      login(safeUser);

      /*
       * Đăng nhập thành công thì chuyển về Home.
       *
       * replace: true giúp người dùng không quay lại
       * trang Login bằng nút Back của trình duyệt.
       */
      if (safeUser.role === "admin") {
        navigate("/admin", {
          replace: true
        });
      } else {
        navigate(redirectPath, {
          replace: true
        });
      };
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        "Unable to sign in. Please make sure JSON Server is running."
      );
    } finally {
      /*
       * Luôn chạy dù đăng nhập thành công hay thất bại.
       */
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="login-card">
              <div className="card-body p-4 p-md-5">
                <div className="login-heading">
                  <div className="login-icon">
                    <i className="bi bi-person"></i>
                  </div>

                  <h2 className="fw-bold text-center mb-2">
                    Welcome Back
                  </h2>

                  <p className="text-secondary text-center mb-4">
                    Sign in to continue learning.
                  </p>
                </div>

                {registerSuccess && (
                  <div
                    className="alert alert-success"
                    role="alert"
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    {registerSuccess}
                  </div>
                )}

                {error && (
                  <div
                    className="alert alert-danger"
                    role="alert"
                  >
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label
                      className="form-label fw-semibold"
                      htmlFor="email"
                    >
                      Email
                    </label>

                    <div className="login-input-wrapper">
                      <i className="bi bi-envelope"></i>

                      <input
                        className="form-control login-input"
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        disabled={loading}
                        autoComplete="email"
                        onChange={(event) => {
                          setEmail(event.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="password"
                      >
                        Password
                      </label>

                      <button
                        type="button"
                        className="forgot-password-button"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="login-input-wrapper">
                      <i className="bi bi-lock"></i>

                      <input
                        className="form-control login-input"
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        disabled={loading}
                        autoComplete="current-password"
                        onChange={(event) => {
                          setPassword(event.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <button
                    className="btn btn-primary login-submit-button w-100"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        ></span>
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                <div className="login-divider">
                  <span>or</span>
                </div>

                <p className="text-center text-secondary mb-0">
                  Don&apos;t have an account?{" "}
                  <Link
                    className="login-register-link"
                    to="/register"
                  >
                    Create an account
                  </Link>
                </p>

                {/* <div className="login-demo-account">
                  <p className="fw-semibold mb-2">
                    Demo accounts
                  </p>

                  <div>
                    Student: student@gmail.com / 123456
                  </div>

                  <div>
                    Admin: admin@gmail.com / admin123
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;