import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "react-router-dom";

import {
  getCourseById,
  getLessonsByCourseId,
  getLessonProgress,
  completeLesson,
  checkLessonCompleted
} from "../services/courseService";

import {
  useAuth
} from "../contexts/AuthContext";

function Learning() {
  const { id } = useParams();

  const { currentUser } =
    useAuth();

  const [course, setCourse] =
    useState(null);

  const [lessons, setLessons] =
    useState([]);

  const [
    selectedLesson,
    setSelectedLesson
  ] = useState(null);

  const [
    completedLessons,
    setCompletedLessons
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const courseResponse =
        await getCourseById(id);

      const lessonResponse =
        await getLessonsByCourseId(id);

      const progressResponse =
        await getLessonProgress(
          currentUser.id
        );

      setCourse(
        courseResponse.data
      );

      setLessons(
        lessonResponse.data
      );

      setCompletedLessons(
        progressResponse.data
      );

      if (
        lessonResponse.data.length > 0
      ) {
        setSelectedLesson(
          lessonResponse.data[0]
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    const currentIndex =
      lessons.findIndex(
        (lesson) =>
          lesson.id ===
          selectedLesson.id
      );

    if (currentIndex > 0) {
      setSelectedLesson(
        lessons[currentIndex - 1]
      );
    }
  };

  const handleNext = () => {
    const currentIndex =
      lessons.findIndex(
        (lesson) =>
          lesson.id ===
          selectedLesson.id
      );

    if (
      currentIndex <
      lessons.length - 1
    ) {
      setSelectedLesson(
        lessons[currentIndex + 1]
      );
    }
  };

  const handleCompleteLesson =
    async () => {
      try {
        const checkResponse =
          await checkLessonCompleted(
            currentUser.id,
            selectedLesson.id
          );

        if (
          checkResponse.data.length >
          0
        ) {
          alert(
            "Lesson already completed"
          );
          return;
        }

        const progressData = {
          userId:
            currentUser.id,

          lessonId:
            selectedLesson.id,

          completedAt:
            new Date().toISOString()
        };

        await completeLesson(
          progressData
        );

        setCompletedLessons(
          [
            ...completedLessons,
            progressData
          ]
        );

        alert(
          "Lesson completed!"
        );
      } catch (error) {
        console.error(error);
      }
    };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border"
          role="status"
        ></div>

        <p className="mt-3">
          Loading...
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          Course not found
        </div>
      </div>
    );
  }

  const completedCount =
    completedLessons.filter(
      (progress) =>
        lessons.some(
          (lesson) =>
            lesson.id ===
            progress.lessonId
        )
    ).length;

  const progressPercent =
    lessons.length > 0
      ? Math.round(
          (completedCount /
            lessons.length) *
            100
        )
      : 0;

  return (
    <div className="container-fluid py-4">

      <div className="row">

        {/* SIDEBAR */}

        <div className="col-md-3">

          <div className="card shadow-sm">

            <div className="card-body">

              <h4>
                Course Content
              </h4>

              <p className="text-secondary">
                {completedCount}
                /
                {lessons.length}
                {" "}
                lessons completed
              </p>

              <div className="progress mb-3">

                <div
                  className="progress-bar"
                  style={{
                    width:
                      `${progressPercent}%`
                  }}
                >
                  {
                    progressPercent
                  }
                  %
                </div>

              </div>

              <div className="list-group">

                {lessons.map(
                  (lesson) => {

                    const completed =
                      completedLessons.some(
                        (
                          progress
                        ) =>
                          progress.lessonId ===
                          lesson.id
                      );

                    return (
                      <button
                        key={
                          lesson.id
                        }
                        type="button"
                        className={`list-group-item list-group-item-action ${
                          selectedLesson?.id ===
                          lesson.id
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedLesson(
                            lesson
                          )
                        }
                      >

                        <div>
                          <strong>

                            {completed
                              ? "✓ "
                              : ""}

                            Lesson
                            {" "}
                            {
                              lesson.order
                            }

                          </strong>
                        </div>

                        <small>
                          {
                            lesson.title
                          }
                        </small>

                      </button>
                    );
                  }
                )}

              </div>

            </div>

          </div>

        </div>

        {/* CONTENT */}

        <div className="col-md-9">

          <div className="card shadow">

            <div className="card-body p-4">

              <h1>
                {course.title}
              </h1>

              <hr />

              {selectedLesson && (
                <>

                  <h2>
                    {
                      selectedLesson.title
                    }
                  </h2>

                  <p className="text-secondary">
                    Duration:
                    {" "}
                    {
                      selectedLesson.duration
                    }
                    {" "}
                    mins
                  </p>

                  <hr />

                  <h4>
                    Lesson Content
                  </h4>

                  <p>
                    {
                      selectedLesson.content
                    }
                  </p>

                  <h4 className="mt-4">
                    Demo Code
                  </h4>

                  <pre className="bg-dark text-light p-4 rounded">

                    <code>
                      {
                        selectedLesson.code
                      }
                    </code>

                  </pre>

                  <button
                    className="btn btn-success mt-3"
                    onClick={
                      handleCompleteLesson
                    }
                  >
                    ✓ Mark as Complete
                  </button>

                  <div className="d-flex justify-content-between mt-4">

                    <button
                      className="btn btn-outline-secondary"
                      onClick={
                        handlePrevious
                      }
                      disabled={
                        lessons.findIndex(
                          (
                            lesson
                          ) =>
                            lesson.id ===
                            selectedLesson.id
                        ) === 0
                      }
                    >
                      ← Previous
                    </button>

                    <button
                      className="btn btn-primary"
                      onClick={
                        handleNext
                      }
                      disabled={
                        lessons.findIndex(
                          (
                            lesson
                          ) =>
                            lesson.id ===
                            selectedLesson.id
                        ) ===
                        lessons.length -
                          1
                      }
                    >
                      Next →
                    </button>

                  </div>

                </>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Learning;