import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import { useAuth } from "../contexts/AuthContext";

import {
  getCourseById,
  enrollCourse,
  checkEnrollment
} from "../services/courseService";

function Payment() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { currentUser } =
    useAuth();

  const [course, setCourse] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [processing, setProcessing] =
    useState(false);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse =
    async () => {
      try {
        const response =
          await getCourseById(id);

        setCourse(response.data);
      } catch (error) {
        console.error(
          "Failed to load course:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  const handlePayNow =
    async () => {
      try {
        setProcessing(true);

        const existed =
          await checkEnrollment(
            Number(currentUser.id),
            Number(id)
          );

        if (
          existed.data.length === 0
        ) {
          await enrollCourse({
            userId: Number(
              currentUser.id
            ),
            courseId: Number(id),
            enrolledAt:
              new Date().toISOString()
          });
        }

        navigate(
          `/payment-success/${id}`
        );
      } catch (error) {
        console.error(
          "Payment failed:",
          error
        );

        alert(
          "Unable to complete payment."
        );
      } finally {
        setProcessing(false);
      }
    };

  const handleCancel = () => {
    navigate(`/courses/${id}`);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        ></div>

        <p className="mt-3">
          Loading checkout...
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          Course not found.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="mb-4">
                Checkout
              </h2>

              <div className="mb-3">
                <h4>
                  {course.title}
                </h4>

                <p className="text-secondary mb-1">
                  Instructor:
                  {" "}
                  {
                    course.instructor
                  }
                </p>

                <p className="text-secondary">
                  {
                    course.categoryName
                  }
                </p>
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center">
                <span>
                  Course Price
                </span>

                <strong className="fs-5">
                  $
                  {course.price.toFixed(
                    2
                  )}
                </strong>
              </div>

              <hr />

              <h5 className="mt-4 mb-3">
                Payment Method
              </h5>

              <div className="form-check border rounded p-3">
                <input
                  type="radio"
                  checked
                  readOnly
                  className="form-check-input"
                />

                <label className="form-check-label ms-2">
                  Credit Card
                </label>
              </div>

              <button
                className="btn btn-primary mt-4 w-100"
                onClick={
                  handlePayNow
                }
                disabled={
                  processing
                }
              >
                {processing ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>

                    Processing...
                  </>
                ) : (
                  "Pay Now"
                )}
              </button>

              <button
                className="btn btn-outline-secondary mt-2 w-100"
                onClick={
                  handleCancel
                }
                disabled={
                  processing
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;