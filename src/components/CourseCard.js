import { Link } from "react-router-dom";

function CourseCard({ course }) {
  return (
    <div className="card h-100 border-0 shadow-sm course-card">
      <img
        src={course.image}
        className="card-img-top course-card-image"
        alt={course.title}
      />

      <div className="card-body d-flex flex-column">
        <div className="mb-2">
          <span className="badge bg-primary-subtle text-primary">
            {course.categoryName}
          </span>

          <span className="badge bg-light text-dark ms-2">
            {course.level}
          </span>
        </div>

        <h5 className="card-title fw-bold">
          {course.title}
        </h5>

        <p className="text-secondary small mb-2">
          By {course.instructor}
        </p>

        <p className="card-text text-secondary">
          {course.description}
        </p>

        <div className="small text-secondary mb-3">
          <span>{course.duration} hours</span>
          <span className="mx-2">•</span>
          <span>{course.lessonCount} lessons</span>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div>
            <span className="text-warning fw-bold">
              ★ {course.rating}
            </span>

            <span className="text-secondary small ms-1">
              ({course.studentCount})
            </span>
          </div>

          <strong className="text-primary">
            ${course.price.toFixed(2)}
          </strong>
        </div>

        <Link
          className="btn btn-outline-primary w-100 mt-3"
          to={`/courses/${course.id}`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default CourseCard;