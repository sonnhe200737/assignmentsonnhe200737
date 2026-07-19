import { useAuth } from "../contexts/AuthContext";

function AdminHeader() {

  const { currentUser } =
    useAuth();

  return (
    <div
      className="bg-white shadow-sm d-flex justify-content-between align-items-center px-4"
      style={{ height: "70px" }}
    >
      <h4>
        Admin Dashboard
      </h4>

      <div>
        Welcome,
        <strong>
          {" "}
          {currentUser.fullName}
        </strong>
      </div>
    </div>
  );
}

export default AdminHeader;