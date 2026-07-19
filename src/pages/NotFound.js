import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-1 fw-bold text-primary">
        404
      </h1>

      <h2>Page Not Found</h2>

      <p className="text-secondary">
        The page you are looking for does not exist.
      </p>

      <Link className="btn btn-primary" to="/">
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;