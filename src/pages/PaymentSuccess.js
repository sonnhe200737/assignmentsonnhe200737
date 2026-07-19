import {
  useParams,
  useNavigate
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import {
  getCourseById,
  enrollCourse,
  checkEnrollment
} from "../services/courseService";

import { useAuth } from "../contexts/AuthContext";

function PaymentSuccess() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { currentUser } =
    useAuth();

  const [course, setCourse] =
    useState(null);

  useEffect(() => {
    completePayment();
  }, []);

 const completePayment = async () => {
  try {
    const response =
      await getCourseById(id);

    setCourse(response.data);

    const existed =
      await checkEnrollment(
        Number(currentUser.id),
        Number(id)
      );

    if (existed.data.length === 0) {
      await enrollCourse({
        userId: Number(
          currentUser.id
        ),
        courseId: Number(id),
        enrolledAt:
          new Date().toISOString()
      });
    }
  } catch (error) {
    console.error(error);
  }
};

  if (!course) return null;

  return (
    <div className="container py-5 text-center">

      <div className="card shadow">
        <div className="card-body p-5">

          <h1 className="text-success">
            ✓ Payment Successful
          </h1>

          <p className="mt-3">
            You have successfully
            enrolled in:
          </p>

          <h3>
            {course.title}
          </h3>

          <button
            className="btn btn-success mt-4"
            onClick={() =>
              navigate(
                `/learning/${id}`
              )
            }
          >
            Go To Course
          </button>

        </div>
      </div>

    </div>
  );
}

export default PaymentSuccess;