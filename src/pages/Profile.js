import {
  useState
} from "react";

import {
  useAuth
} from "../contexts/AuthContext";

import {
  updateUser
} from "../services/userService";

function Profile() {
  const {
    currentUser,
    updateCurrentUser
  } = useAuth();

  const [editing, setEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [fullName, setFullName] =
    useState(
      currentUser.fullName
    );

  const [email, setEmail] =
    useState(
      currentUser.email
    );

  const [avatar, setAvatar] =
    useState(
      currentUser.avatar || ""
    );

  const handleImageUpload = (
    event
  ) => {
    const file =
      event.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onloadend = () => {
      setAvatar(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSave =
    async () => {
      try {
        setSaving(true);

        const updatedUser = {
          ...currentUser,
          fullName,
          email,
          avatar
        };

        await updateUser(
          currentUser.id,
          updatedUser
        );

        updateCurrentUser(
          updatedUser
        );

        alert(
          "Profile updated successfully!"
        );

        setEditing(false);
      } catch (error) {
        console.error(error);

        alert(
          "Failed to update profile."
        );
      } finally {
        setSaving(false);
      }
    };

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-lg-8">

          <div className="card shadow border-0">

            <div className="card-body p-5">

              <div className="row align-items-center">

                {/* Avatar */}

                <div className="col-md-3 text-center">

                  <div
                    className="rounded-circle bg-primary text-white mx-auto overflow-hidden d-flex justify-content-center align-items-center"
                    style={{
                      width: "150px",
                      height: "150px",
                      fontSize: "60px",
                      fontWeight: "bold"
                    }}
                  >
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="avatar"
                        style={{
                          width:
                            "100%",
                          height:
                            "100%",
                          objectFit:
                            "cover"
                        }}
                      />
                    ) : (
                      fullName
                        ?.charAt(0)
                        .toUpperCase()
                    )}
                  </div>

                  {editing && (
                    <div className="mt-3">

                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={
                          handleImageUpload
                        }
                      />

                    </div>
                  )}

                </div>

                {/* Information */}

                <div className="col-md-9">

                  {!editing ? (
                    <>
                      <h2 className="fw-bold">
                        {
                          currentUser.fullName
                        }
                      </h2>

                      <p className="text-secondary fs-5">
                        {
                          currentUser.email
                        }
                      </p>

                      <span className="badge bg-primary fs-6">
                        {
                          currentUser.role
                        }
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="mb-3">

                        <label className="form-label">
                          Full Name
                        </label>

                        <input
                          type="text"
                          className="form-control"
                          value={
                            fullName
                          }
                          onChange={(
                            e
                          ) =>
                            setFullName(
                              e.target
                                .value
                            )
                          }
                        />

                      </div>

                      <div className="mb-3">

                        <label className="form-label">
                          Email
                        </label>

                        <input
                          type="email"
                          className="form-control"
                          value={
                            email
                          }
                          onChange={(
                            e
                          ) =>
                            setEmail(
                              e.target
                                .value
                            )
                          }
                        />

                      </div>

                      <span className="badge bg-primary">
                        {
                          currentUser.role
                        }
                      </span>
                    </>
                  )}

                </div>

              </div>

              <hr className="my-4" />

              {!editing ? (
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    setEditing(
                      true
                    )
                  }
                >
                  Edit Profile
                </button>
              ) : (
                <div className="d-flex gap-2">

                  <button
                    className="btn btn-success"
                    onClick={
                      handleSave
                    }
                    disabled={
                      saving
                    }
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      setEditing(
                        false
                      )
                    }
                  >
                    Cancel
                  </button>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;