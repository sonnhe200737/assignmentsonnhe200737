import {
  useEffect,
  useState
} from "react";

import AdminLayout from "../../layouts/AdminLayout";

import {
  getAllCourses,
  getAllEnrollments
} from "../../services/courseService";

import {
  getAllUsers
} from "../../services/userService";

function Dashboard() {
  const [stats, setStats] =
    useState({
      totalCourses: 0,
      totalUsers: 0,
      totalEnrollments: 0,
      revenue: 0
    });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [
        coursesResponse,
        usersResponse,
        enrollmentsResponse
      ] = await Promise.all([
        getAllCourses(),
        getAllUsers(),
        getAllEnrollments()
      ]);

      const courses =
        coursesResponse.data;

      const users =
        usersResponse.data;

      const enrollments =
        enrollmentsResponse.data;

      let revenue = 0;

      enrollments.forEach(
        (enrollment) => {
          const course =
            courses.find(
              (c) =>
                Number(c.id) ===
                Number(
                  enrollment.courseId
                )
            );

          if (course) {
            revenue +=
              Number(course.price);
          }
        }
      );

      setStats({
        totalCourses:
          courses.length,
        totalUsers:
          users.length,
        totalEnrollments:
          enrollments.length,
        revenue
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminLayout>

      <h2 className="mb-4">
        Dashboard
      </h2>

      <div className="row g-4">

        <div className="col-md-3">
          <div className="card shadow h-100">
            <div className="card-body text-center">
              <i className="bi bi-book display-5 text-primary"></i>

              <h5 className="mt-3">
                Total Courses
              </h5>

              <h2>
                {stats.totalCourses}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow h-100">
            <div className="card-body text-center">
              <i className="bi bi-people display-5 text-success"></i>

              <h5 className="mt-3">
                Total Users
              </h5>

              <h2>
                {stats.totalUsers}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow h-100">
            <div className="card-body text-center">
              <i className="bi bi-journal-check display-5 text-warning"></i>

              <h5 className="mt-3">
                Enrollments
              </h5>

              <h2>
                {stats.totalEnrollments}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow h-100">
            <div className="card-body text-center">
              <i className="bi bi-cash-stack display-5 text-danger"></i>

              <h5 className="mt-3">
                Revenue
              </h5>

              <h2>
                $
                {stats.revenue.toFixed(2)}
              </h2>
            </div>
          </div>
        </div>

      </div>

    </AdminLayout>
  );
}

export default Dashboard;