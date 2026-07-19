import { useEffect, useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { getCourseById } from "../services/courseService";
import { useAuth } from "../contexts/AuthContext";

function CourseDetail() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchCourseDetail();
  }, [id]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCourseById(id);
      setCourse(response.data);
    } catch (error) {
      console.error("Failed to load course detail:", error);
      setError("Unable to load this course.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-secondary mt-3">
          Loading course details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>

        <Link className="btn btn-primary" to="/courses">
          Back to Courses
        </Link>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const handleEnroll = () => {
    if (!isAuthenticated) {
      window.alert(
        "You need to sign in before enrolling in this course."
      );

      navigate("/login", {
        state: {
          from: location
        }
      });

      return;
    }

    console.log("User can enroll in this course");
  };

  return (
    <div className="course-detail-page">
      <section className="course-detail-hero">
        <div className="container py-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-4">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>

              <li className="breadcrumb-item">
                <Link to="/courses">Courses</Link>
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
                    {course.categoryName}
                  </span>

                  <span className="badge bg-light text-dark border">
                    {course.level}
                  </span>
                </div>

                <h1 className="course-detail-title">
                  {course.title}
                </h1>

                <p className="course-detail-description">
                  {course.description}
                </p>

                <div className="course-meta-grid">
                  <div className="course-meta-item">
                    <div className="course-meta-icon">⏱</div>

                    <div>
                      <strong>{course.duration} hours</strong>
                      <span>Course duration</span>
                    </div>
                  </div>

                  <div className="course-meta-item">
                    <div className="course-meta-icon">📚</div>

                    <div>
                      <strong>{course.lessonCount} lessons</strong>
                      <span>Learning content</span>
                    </div>
                  </div>

                  <div className="course-meta-item">
                    <div className="course-meta-icon">⭐</div>

                    <div>
                      <strong>{course.rating}</strong>
                      <span>Course rating</span>
                    </div>
                  </div>

                  <div className="course-meta-item">
                    <div className="course-meta-icon">👨‍🎓</div>

                    <div>
                      <strong>{course.studentCount}</strong>
                      <span>Students enrolled</span>
                    </div>
                  </div>
                </div>

                <div className="course-instructor mt-4">
                  <span className="text-secondary">
                    Instructor
                  </span>

                  <strong>{course.instructor}</strong>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="course-enroll-card">
                <img
                  src={course.image}
                  alt={course.title}
                  className="course-detail-image"
                  onError={(event) => {
                    event.currentTarget.src =
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
                        : `$${course.price.toFixed(2)}`}
                    </strong>
                  </div>

                  <button type="button" className="btn btn-primary btn-lg w-100" onClick={handleEnroll}>
                    Enroll Now
                  </button>

                  <Link
                    className="btn btn-outline-secondary w-100 mt-3"
                    to="/courses"
                  >
                    View All Courses
                  </Link>

                  <p className="small text-secondary text-center mt-3 mb-0">
                    Learn at your own pace.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="course-content-card mb-4">
                <h3>About This Course</h3>

                <p>{course.description}</p>
              </div>

              <div className="course-content-card">
                <h3>What You Will Learn</h3>

                <div className="row g-3 mt-1">
                  <div className="col-md-6">
                    <div className="learning-item">
                      ✓ Understand the fundamental concepts
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="learning-item">
                      ✓ Build practical projects
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="learning-item">
                      ✓ Apply knowledge through exercises
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="learning-item">
                      ✓ Improve professional skills
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="course-content-card">
                <h4>Course Information</h4>

                <div className="course-info-row">
                  <span>Instructor</span>
                  <strong>{course.instructor}</strong>
                </div>

                <div className="course-info-row">
                  <span>Level</span>
                  <strong>{course.level}</strong>
                </div>

                <div className="course-info-row">
                  <span>Duration</span>
                  <strong>{course.duration} hours</strong>
                </div>

                <div className="course-info-row">
                  <span>Lessons</span>
                  <strong>{course.lessonCount}</strong>
                </div>

                <div className="course-info-row">
                  <span>Category</span>
                  <strong>{course.categoryName}</strong>
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