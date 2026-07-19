import {
  useEffect,
  useState
} from "react";

import AdminLayout from "../../layouts/AdminLayout";

import {
  getAllUsers,
  updateUser,
  deleteUser
} from "../../services/userService";
function UserManagement() {
  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res =
        await getAllUsers();

      setUsers(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus =
    async (user) => {
      await updateUser(
        user.id,
        {
          ...user,
          status:
            user.status ===
            "active"
              ? "inactive"
              : "active"
        }
      );

      loadUsers();
    };

  const handleDelete =
    async (user) => {
      if (
        user.status !==
        "inactive"
      ) {
        alert(
          "Only inactive users can be deleted"
        );
        return;
      }

      if (
        !window.confirm(
          "Delete this user?"
        )
      ) {
        return;
      }

      await deleteUser(user.id);

      loadUsers();
    };

  if (loading) {
    return (
      <AdminLayout>
        Loading...
      </AdminLayout>
    );
  }
    return (
    <AdminLayout>

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2>
          User Management
        </h2>

      </div>

      <div className="card shadow">

        <div className="table-responsive">

          <table className="table table-hover">

            <thead className="table-dark">

              <tr>

                

                <th>Name</th>

                <th>Email</th>

                <th>Role</th>

                <th>Status</th>

                <th width="220">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {users.map(user => (

                <tr key={user.id}>

                  

                  <td>
                    {user.fullName}
                  </td>

                  <td>
                    {user.email}
                  </td>

                  <td>

                    <span
                      className={`badge ${
                        user.role ===
                        "admin"
                          ? "bg-danger"
                          : "bg-primary"
                      }`}
                    >
                      {user.role}
                    </span>

                  </td>

                  <td>

                    <span
                      className={`badge ${
                        user.status ===
                        "active"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {user.status}
                    </span>

                  </td>

                  <td>

                    {user.role !==
                      "admin" && (
                      <>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() =>
                            handleToggleStatus(
                              user
                            )
                          }
                        >
                          {user.status ===
                          "active"
                            ? "Disable"
                            : "Enable"}
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDelete(
                              user
                            )
                          }
                        >
                          Delete
                        </button>
                      </>
                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </AdminLayout>
  );
}

export default UserManagement;