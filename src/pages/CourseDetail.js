import { useEffect, useState } from "react";
import {
  Link,
  useParams,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  getCourseById,
  checkEnrollment,
  enrollCourse
} from "../services/courseService";

import { useAuth } from "../contexts/AuthContext";

function CourseDetail() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  const { isAuthenticated, currentUser } =
    useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchCourseDetail();
  }, [id, isAuthenticated, currentUser]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCourseById(id);

      setCourse(response.data);

      if (
        isAuthenticated &&
        currentUser?.id
      ) {
        const enrollCheck =
          await checkEnrollment(
            Number(currentUser.id),
            Number(id)
          );

        setIsEnrolled(
          enrollCheck.data.length > 0
        );
      }
    } catch (error) {
      console.error(
        "Failed to load course detail:",
        error
      );

      setError(
        "Unable to load this course."
      );
    } finally {
      setLoading(false);
    }
  };

  // const handleEnrollAction = async () => {
  //   if (isEnrolled) {
  //     navigate(`/learning/${id}`);
  //     return;
  //   }

  //   if (
  //     !isAuthenticated ||
  //     !currentUser
  //   ) {
  //     window.alert(
  //       "You need to sign in before enrolling in this course."
  //     );

  //     navigate("/login", {
  //       state: {
  //         from: location
  //       }
  //     });

  //     return;
  //   }

  //   try {
  //     setEnrolling(true);

  //     const enrollmentData = {
  //       userId: Number(
  //         currentUser.id
  //       ),
  //       courseId: Number(id),
  //       enrolledAt:
  //         new Date().toISOString()
  //     };

  //     await enrollCourse(
  //       enrollmentData
  //     );

  //     setIsEnrolled(true);

  //     setCourse((prev) => ({
  //       ...prev,
  //       studentCount:
  //         prev.studentCount + 1
  //     }));

  //     window.alert(
  //       "Enrolled successfully!"
  //     );

  //     navigate(`/learning/${id}`);
  //   } catch (error) {
  //     console.error(
  //       "Enrollment failed:",
  //       error
  //     );

  //     window.alert(
  //       "Failed to enroll. Please try again."
  //     );
  //   } finally {
  //     setEnrolling(false);
  //   }
  // };
const handleEnrollAction = () => {
  if (isEnrolled) {
    navigate(`/learning/${id}`);
    return;
  }

  if (
    !isAuthenticated ||
    !currentUser
  ) {
    window.alert(
      "You need to sign in before enrolling in this course."
    );

    navigate("/login", {
      state: { from: location }
    });

    return;
  }

  navigate(`/payment/${id}`);
};
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        ></div>

        <p className="text-secondary mt-3">
          Loading course details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>

        <Link
          className="btn btn-primary"
          to="/courses"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="course-detail-page">
      <section className="course-detail-hero">
        <div className="container py-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-4">
              <li className="breadcrumb-item">
                <Link to="/">
                  Home
                </Link>
              </li>

              <li className="breadcrumb-item">
                <Link to="/courses">
                  Courses
                </Link>
              </li>

              <li
                className="breadcrumb-item active"
                aria-current="page"
              >
                {course.title}
              </li>
            </ol>
          </nav>

          <div className="row g-4 align-items-start">
            <div className="col-lg-8">
              <div className="course-main-card">
                <div className="mb-3">
                  <span className="badge bg-primary me-2">
                    {
                      course.categoryName
                    }
                  </span>

                  <span className="badge bg-light text-dark border">
                    {course.level}
                  </span>
                </div>

                <h1 className="course-detail-title">
                  {course.title}
                </h1>

                <p className="course-detail-description">
                  {
                    course.description
                  }
                </p>

                <div className="course-meta-grid">
                  <div className="course-meta-item">
                    <div className="course-meta-icon">
                      ⏱
                    </div>

                    <div>
                      <strong>
                        {
                          course.duration
                        }{" "}
                        hours
                      </strong>

                      <span>
                        Course duration
                      </span>
                    </div>
                  </div>

                  <div className="course-meta-item">
                    <div className="course-meta-icon">
                      📚
                    </div>

                    <div>
                      <strong>
                        {
                          course.lessonCount
                        }{" "}
                        lessons
                      </strong>

                      <span>
                        Learning content
                      </span>
                    </div>
                  </div>

                  <div className="course-meta-item">
                    <div className="course-meta-icon">
                      ⭐
                    </div>

                    <div>
                      <strong>
                        {course.rating}
                      </strong>

                      <span>
                        Course rating
                      </span>
                    </div>
                  </div>

                  <div className="course-meta-item">
                    <div className="course-meta-icon">
                      👨‍🎓
                    </div>

                    <div>
                      <strong>
                        {
                          course.studentCount
                        }
                      </strong>

                      <span>
                        Students enrolled
                      </span>
                    </div>
                  </div>
                </div>

                <div className="course-instructor mt-4">
                  <span className="text-secondary">
                    Instructor
                  </span>

                  <strong>
                    {
                      course.instructor
                    }
                  </strong>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="course-enroll-card">
                <img
                  src={course.image}
                  alt={course.title}
                  className="course-detail-image"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/images/courses/default-course.jpg";
                  }}
                />

                <div className="course-enroll-content">
                  <div className="course-price-block">
                    <span className="text-secondary">
                      Course price
                    </span>

                    <strong>
                      {course.price === 0
                        ? "Free"
                        : `$${course.price.toFixed(
                            2
                          )}`}
                    </strong>
                  </div>

                  <button
                    type="button"
                    className={`btn btn-lg w-100 ${
                      isEnrolled
                        ? "btn-success"
                        : "btn-primary"
                    }`}
                    onClick={
                      handleEnrollAction
                    }
                    disabled={
                      enrolling
                    }
                  >
                    {enrolling ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing...
                      </>
                    ) : isEnrolled ? (
                      "Go to Course"
                    ) : (
                      "Enroll Now"
                    )}
                  </button>

                  <Link
                    className="btn btn-outline-secondary w-100 mt-3"
                    to="/courses"
                  >
                    View All Courses
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CourseDetail;