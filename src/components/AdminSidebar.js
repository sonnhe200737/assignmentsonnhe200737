import { NavLink } from "react-router-dom";

function AdminSidebar() {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{ width: "250px" }}
    >
      <h3 className="mb-4">
        Admin Panel
      </h3>

      <div className="nav flex-column">

        <NavLink
          to="/admin"
          className="nav-link text-white"
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/courses"
          className="nav-link text-white"
        >
          Courses
        </NavLink>

        <NavLink
          to="/admin/lessons"
          className="nav-link text-white"
        >
          Lessons
        </NavLink>

        <NavLink
          to="/admin/users"
          className="nav-link text-white"
        >
          Users
        </NavLink>

        <NavLink
          to="/admin/enrollments"
          className="nav-link text-white"
        >
          Enrollments
        </NavLink>

      </div>
    </div>
  );
}

export default AdminSidebar;