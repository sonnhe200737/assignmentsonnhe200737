import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getUsersByEmail,
  updateUser
} from "../services/userService";

function ForgotPassword() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword
  ] = useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const navigate = useNavigate();

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Please fill all fields."
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      const response =
        await getUsersByEmail(
          email.trim().toLowerCase()
        );

      const user =
        response.data[0];

      if (!user) {
        setError(
          "Email not found."
        );
        return;
      }

      await updateUser(
        user.id,
        {
          ...user,
          password
        }
      );

      setSuccess(
        "Password updated successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      console.log(error);

      setError(
        "Something went wrong."
      );
    }
  };

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <div className="card shadow">

            <div className="card-body p-4">

              <h2 className="mb-4">
                Reset Password
              </h2>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}

              <form
                onSubmit={
                  handleSubmit
                }
              >

                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                />

                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                />

                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  className="btn btn-primary w-100"
                  type="submit"
                >
                  Reset Password
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;