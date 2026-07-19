import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createUser,
  getUsersByEmail
} from "../services/userService";

function Register() {
  /*
   * Dùng một object state để quản lý toàn bộ form.
   */
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  /*
   * Lưu lỗi riêng cho từng field.
   */
  const [fieldErrors, setFieldErrors] = useState({});

  /*
   * Lưu lỗi chung như lỗi API hoặc JSON Server chưa chạy.
   */
  const [error, setError] = useState("");

  /*
   * Lưu trạng thái đang đăng ký.
   */
  const [loading, setLoading] = useState(false);

  /*
   * Điều khiển hiện/ẩn password.
   */
  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const navigate = useNavigate();

  /*
   * Cập nhật form khi người dùng nhập.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value
    }));

    /*
     * Khi người dùng nhập lại một field,
     * xóa thông báo lỗi cũ của field đó.
     */
    setFieldErrors((previousErrors) => ({
      ...previousErrors,
      [name]: ""
    }));

    setError("");
  };

  /*
   * Kiểm tra dữ liệu form.
   *
   * Trả về object chứa lỗi.
   * Nếu object rỗng nghĩa là form hợp lệ.
   */
  const validateForm = () => {
    const errors = {};

    const normalizedFullName =
      formData.fullName.trim();

    const normalizedEmail =
      formData.email.trim().toLowerCase();

    if (normalizedFullName === "") {
      errors.fullName =
        "Please enter your full name.";
    } else if (normalizedFullName.length < 2) {
      errors.fullName =
        "Full name must contain at least 2 characters.";
    }

    if (normalizedEmail === "") {
      errors.email =
        "Please enter your email.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail
      )
    ) {
      errors.email =
        "Please enter a valid email address.";
    }

    if (formData.password === "") {
      errors.password =
        "Please enter your password.";
    } else if (formData.password.length < 6) {
      errors.password =
        "Password must contain at least 6 characters.";
    }

    if (formData.confirmPassword === "") {
      errors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.confirmPassword !== formData.password
    ) {
      errors.confirmPassword =
        "Passwords do not match.";
    }

    return errors;
  };

  /*
   * Xử lý đăng ký tài khoản.
   */
  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");

    const validationErrors = validateForm();

    /*
     * Object.keys(errors) trả về danh sách
     * tên các field đang có lỗi.
     */
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const normalizedEmail =
        formData.email.trim().toLowerCase();

      /*
       * Kiểm tra email đã tồn tại chưa.
       */
      const emailResponse =
        await getUsersByEmail(normalizedEmail);

      const existingUsers = emailResponse.data;

      if (existingUsers.length > 0) {
        setFieldErrors({
          email:
            "This email address is already registered."
        });

        return;
      }

      /*
       * Tạo object user mới.
       *
       * Không gửi confirmPassword lên database.
       * Role luôn là student.
       */
      const newUser = {
        fullName: formData.fullName.trim(),
        email: normalizedEmail,
        password: formData.password,
        role: "student",
        avatar: "",
        status: "active"
      };

      /*
       * POST user mới vào JSON Server.
       */
      await createUser(newUser);

      /*
       * Chuyển sang Login và gửi thông báo
       * đăng ký thành công qua location state.
       */
      navigate("/login", {
        replace: true,
        state: {
          registerSuccess:
            "Your account was created successfully. Please sign in."
        }
      });
    } catch (error) {
      console.error("Registration failed:", error);

      setError(
        "Unable to create your account. Please make sure JSON Server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="register-card">
              <div className="card-body p-4 p-md-5">
                <div className="register-heading">
                  <div className="register-icon">
                    <i className="bi bi-person-plus"></i>
                  </div>

                  <h2 className="fw-bold text-center mb-2">
                    Create Your Account
                  </h2>

                  <p className="text-secondary text-center mb-4">
                    Join SkillUp and start learning today.
                  </p>
                </div>

                {error && (
                  <div
                    className="alert alert-danger"
                    role="alert"
                  >
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label
                      className="form-label fw-semibold"
                      htmlFor="fullName"
                    >
                      Full Name
                    </label>

                    <div className="register-input-wrapper">
                      <i className="bi bi-person"></i>

                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        className={`form-control register-input ${fieldErrors.fullName
                            ? "is-invalid"
                            : ""
                          }`}
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        disabled={loading}
                        autoComplete="name"
                        onChange={handleChange}
                      />

                      {fieldErrors.fullName && (
                        <div className="invalid-feedback">
                          {fieldErrors.fullName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label
                      className="form-label fw-semibold"
                      htmlFor="registerEmail"
                    >
                      Email
                    </label>

                    <div className="register-input-wrapper">
                      <i className="bi bi-envelope"></i>

                      <input
                        id="registerEmail"
                        name="email"
                        type="email"
                        className={`form-control register-input ${fieldErrors.email
                            ? "is-invalid"
                            : ""
                          }`}
                        placeholder="Enter your email"
                        value={formData.email}
                        disabled={loading}
                        autoComplete="email"
                        onChange={handleChange}
                      />

                      {fieldErrors.email && (
                        <div className="invalid-feedback">
                          {fieldErrors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label
                      className="form-label fw-semibold"
                      htmlFor="registerPassword"
                    >
                      Password
                    </label>

                    <div className="register-input-wrapper">
                      <i className="bi bi-lock"></i>

                      <input
                        id="registerPassword"
                        name="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        className={`form-control register-input register-password-input ${fieldErrors.password
                            ? "is-invalid"
                            : ""
                          }`}
                        placeholder="Create a password"
                        value={formData.password}
                        disabled={loading}
                        autoComplete="new-password"
                        onChange={handleChange}
                      />

                      <button
                        type="button"
                        className="register-password-toggle"
                        disabled={loading}
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        onClick={() => {
                          setShowPassword(
                            (previousValue) =>
                              !previousValue
                          );
                        }}
                      >
                        <i
                          className={
                            showPassword
                              ? "bi bi-eye-slash"
                              : "bi bi-eye"
                          }
                        ></i>
                      </button>

                      {fieldErrors.password && (
                        <div className="invalid-feedback">
                          {fieldErrors.password}
                        </div>
                      )}
                    </div>

                    <div className="form-text">
                      Password must contain at least 6 characters.
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      className="form-label fw-semibold"
                      htmlFor="confirmPassword"
                    >
                      Confirm Password
                    </label>

                    <div className="register-input-wrapper">
                      <i className="bi bi-shield-lock"></i>

                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        className={`form-control register-input register-password-input ${fieldErrors.confirmPassword
                            ? "is-invalid"
                            : ""
                          }`}
                        placeholder="Enter your password again"
                        value={formData.confirmPassword}
                        disabled={loading}
                        autoComplete="new-password"
                        onChange={handleChange}
                      />

                      <button
                        type="button"
                        className="register-password-toggle"
                        disabled={loading}
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        onClick={() => {
                          setShowConfirmPassword(
                            (previousValue) =>
                              !previousValue
                          );
                        }}
                      >
                        <i
                          className={
                            showConfirmPassword
                              ? "bi bi-eye-slash"
                              : "bi bi-eye"
                          }
                        ></i>
                      </button>

                      {fieldErrors.confirmPassword && (
                        <div className="invalid-feedback">
                          {fieldErrors.confirmPassword}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary register-submit-button w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        ></span>
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                <div className="register-divider">
                  <span>or</span>
                </div>

                <p className="text-center text-secondary mb-0">
                  Already have an account?{" "}
                  <Link
                    className="register-login-link"
                    to="/login"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;