import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <section className="bg-light py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <span className="badge bg-primary mb-3">
                Online Learning Platform
              </span>

              <h1 className="display-4 fw-bold mb-3">
                Learn new skills and grow your future
              </h1>

              <p className="lead text-secondary mb-4">
                Explore practical courses, learn at your own pace, and
                improve your professional skills.
              </p>

              <div className="d-flex gap-3">
                <Link className="btn btn-primary btn-lg" to="/courses">
                  Explore Courses
                </Link>

                <Link className="btn btn-outline-primary btn-lg" to="/register">
                  Get Started
                </Link>
              </div>
            </div>

            <div className="col-lg-5 mt-5 mt-lg-0">
              <div className="bg-white rounded-4 shadow p-5 text-center">
                <div className="display-1">🎓</div>

                <h3 className="mt-3">Start learning today</h3>

                <p className="text-secondary mb-0">
                  Build skills through simple and practical courses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Why learn with SkillUp?</h2>

            <p className="text-secondary">
              Everything you need for a simple learning journey.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <h4>Flexible Learning</h4>

                  <p className="text-secondary mb-0">
                    Learn anytime and continue courses at your own pace.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <h4>Practical Courses</h4>

                  <p className="text-secondary mb-0">
                    Study useful topics from beginner to advanced levels.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <h4>Track Progress</h4>

                  <p className="text-secondary mb-0">
                    Monitor completed lessons and learning progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;