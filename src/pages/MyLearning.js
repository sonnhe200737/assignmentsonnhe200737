import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

function MyLearning() {
  const { currentUser } = useAuth();

  return (
    <div className="my-learning-page">
      <section className="my-learning-heading">
        <div className="container py-5">
          <h1 className="fw-bold mb-2">
            My Learning
          </h1>

          <p className="text-secondary mb-0">
            Welcome back, {currentUser.fullName}.
            Continue learning from your enrolled courses.
          </p>
        </div>
      </section>

      <section className="container py-5">
        <div className="my-learning-empty">
          <div className="my-learning-empty-icon">
            <i className="bi bi-journal-bookmark"></i>
          </div>

          <h3>You have not enrolled in any courses yet</h3>

          <p className="text-secondary">
            Explore the course library and enroll in a course
            to start learning.
          </p>

          <Link
            className="btn btn-primary"
            to="/courses"
          >
            Explore Courses
          </Link>
        </div>  
      </section>
    </div>
  );
}

export default MyLearning;