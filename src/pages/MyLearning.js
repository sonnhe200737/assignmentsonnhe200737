import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import {
  getEnrollmentsByUser,
  getCourseById
} from "../services/courseService";

function MyLearning() {
  const { currentUser } = useAuth();

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadMyCourses();
  }, []);

  const loadMyCourses = async () => {
    try {
      setLoading(true);

      const enrollmentsResponse =
        await getEnrollmentsByUser(
          currentUser.id
        );

      const enrollments =
        enrollmentsResponse.data;

      if (enrollments.length === 0) {
        setCourses([]);
        return;
      }

      const courseResponses =
        await Promise.all(
          enrollments.map(
            (enrollment) =>
              getCourseById(
                enrollment.courseId
              )
          )
        );

      const enrolledCourses =
        courseResponses.map(
          (response) =>
            response.data
        );

      setCourses(enrolledCourses);
    } catch (error) {
      console.error(
        "Failed to load enrolled courses:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        ></div>

        <p className="mt-3">
          Loading your courses...
        </p>
      </div>
    );
  }

  return (
    <div className="my-learning-page">
      <section className="my-learning-heading">
        <div className="container py-5">
          <h1 className="fw-bold mb-2">
            My Learning
          </h1>

          <p className="text-secondary mb-0">
            Welcome back,
            {" "}
            {currentUser.fullName}.
            Continue learning from your enrolled courses.
          </p>
        </div>
      </section>

      <section className="container py-5">
        {courses.length === 0 ? (
          <div className="my-learning-empty">
            <div className="my-learning-empty-icon">
              <i className="bi bi-journal-bookmark"></i>
            </div>

            <h3>
              You have not enrolled in any courses yet
            </h3>

            <p className="text-secondary">
              Explore the course library and enroll
              in a course to start learning.
            </p>

            <Link
              className="btn btn-primary"
              to="/courses"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {courses.map((course) => (
              <div
                className="col-md-6 col-lg-4"
                key={course.id}
              >
                <div className="card h-100 shadow-sm">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="card-img-top"
                    style={{
                      height: "220px",
                      objectFit: "cover"
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        "/images/courses/default-course.jpg";
                    }}
                  />

                  <div className="card-body d-flex flex-column">
                    <span className="badge bg-primary mb-2">
                      {
                        course.categoryName
                      }
                    </span>

                    <h5 className="card-title">
                      {course.title}
                    </h5>

                    <p className="text-secondary small mb-2">
                      Instructor:
                      {" "}
                      {
                        course.instructor
                      }
                    </p>

                    <p className="small text-secondary">
                      {
                        course.lessonCount
                      }{" "}
                      lessons •{" "}
                      {
                        course.duration
                      }{" "}
                      hours
                    </p>

                    <div className="mt-auto">
                      <Link
                        className="btn btn-success w-100"
                        to={`/learning/${course.id}`}
                      >
                        Continue Learning
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default MyLearning;