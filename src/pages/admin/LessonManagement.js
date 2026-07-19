import { useEffect, useMemo, useState } from "react";

import AdminLayout from "../../layouts/AdminLayout";

import {
  getAllLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  getAllCourses
} from "../../services/courseService";

function LessonManagement() {
const [lessons, setLessons] = useState([]);
const [courses, setCourses] = useState([]);

const [loading, setLoading] = useState(true);

const [search, setSearch] = useState("");
const [courseFilter, setCourseFilter] =
  useState("");

const [currentPage, setCurrentPage] =
  useState(1);

const [showModal, setShowModal] =
  useState(false);

const [editingLesson, setEditingLesson] =
  useState(null);

const [formData, setFormData] =
  useState({
    courseId: "",
    title: "",
    duration: "",
    order: "",
    content: "",
    code: ""
  });

const PAGE_SIZE = 5;

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    const lessonRes =
      await getAllLessons();

    const courseRes =
      await getAllCourses();

    setLessons(lessonRes.data);

    setCourses(courseRes.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};
const filteredLessons = useMemo(() => {
  let data = [...lessons];

  if (search) {
    data = data.filter((lesson) =>
      lesson.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }

  if (courseFilter) {
    data = data.filter(
      (lesson) =>
        lesson.courseId ==
        courseFilter
    );
  }

  return data;
}, [
  lessons,
  search,
  courseFilter
]);
const totalPages = Math.ceil(
  filteredLessons.length /
    PAGE_SIZE
);

const displayedLessons =
  filteredLessons.slice(
    (currentPage - 1) *
      PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const handleAdd = () => {
  setEditingLesson(null);

  setFormData({
    courseId: "",
    title: "",
    duration: "",
    order: "",
    content: "",
    code: ""
  });

  setShowModal(true);
};
const handleEdit = (lesson) => {
  setEditingLesson(lesson);

  setFormData(lesson);

  setShowModal(true);
};
const handleDelete = async (id) => {
  if (
    !window.confirm(
      "Delete this lesson?"
    )
  ) {
    return;
  }

  await deleteLesson(id);

  loadData();
};
const handleSubmit = async () => {
  if (editingLesson) {
    await updateLesson(
      editingLesson.id,
      formData
    );
  } else {
    await createLesson(formData);
  }

  setShowModal(false);

  loadData();
};
return (
  <AdminLayout>

    <div className="d-flex justify-content-between align-items-center mb-4">

      <h2>Lesson Management</h2>

      <button
        className="btn btn-primary"
        onClick={handleAdd}
      >
        + Add Lesson
      </button>

    </div>

    {/* FILTER */}

    <div className="card shadow-sm mb-4">

      <div className="card-body">

        <div className="row g-3">

          <div className="col-md-6">

            <input
              type="text"
              className="form-control"
              placeholder="Search lesson..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

          </div>

          <div className="col-md-6">

            <select
              className="form-select"
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(
                  e.target.value
                );
                setCurrentPage(1);
              }}
            >
              <option value="">
                All Courses
              </option>

              {courses.map(
                (course) => (
                  <option
                    key={course.id}
                    value={course.id}
                  >
                    {course.title}
                  </option>
                )
              )}

            </select>

          </div>

        </div>

      </div>

    </div>

    {/* TABLE */}

    <div className="card shadow">

      <div className="table-responsive">

        <table className="table table-hover align-middle mb-0">

          <thead className="table-dark">

            <tr>

              <th>ID</th>

              <th>Course</th>

              <th>Lesson Title</th>

              <th>Order</th>

              <th>Duration</th>

              <th width="180">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {displayedLessons.map(
              (lesson) => (

                <tr key={lesson.id}>

                  <td>
                    {lesson.id}
                  </td>

                  <td>

                    {
                      courses.find(
                        (course) =>
                          course.id ==
                          lesson.courseId
                      )?.title
                    }

                  </td>

                  <td>
                    {lesson.title}
                  </td>

                  <td>
                    {lesson.order}
                  </td>

                  <td>
                    {lesson.duration} mins
                  </td>

                  <td>

                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() =>
                        handleEdit(
                          lesson
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        handleDelete(
                          lesson.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>

    {/* PAGINATION */}

    <nav className="mt-4">

      <ul className="pagination justify-content-center">

        {Array.from(
          {
            length: totalPages
          },
          (_, index) => (

            <li
              key={index}
              className={`page-item ${
                currentPage ===
                index + 1
                  ? "active"
                  : ""
              }`}
            >

              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage(
                    index + 1
                  )
                }
              >
                {index + 1}
              </button>

            </li>

          )
        )}

      </ul>

    </nav>

    {/* MODAL */}

    {showModal && (

      <div
        className="modal d-block"
        style={{
          background:
            "rgba(0,0,0,.5)"
        }}
      >

        <div className="modal-dialog modal-lg">

          <div className="modal-content">

            <div className="modal-header">

              <h5>

                {editingLesson
                  ? "Edit Lesson"
                  : "Add Lesson"}

              </h5>

              <button
                className="btn-close"
                onClick={() =>
                  setShowModal(false)
                }
              />

            </div>

            <div className="modal-body">

              <select
                className="form-select mb-3"
                value={
                  formData.courseId
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    courseId:
                      Number(
                        e.target
                          .value
                      )
                  })
                }
              >

                <option value="">
                  Select Course
                </option>

                {courses.map(
                  (course) => (
                    <option
                      key={
                        course.id
                      }
                      value={
                        course.id
                      }
                    >
                      {
                        course.title
                      }
                    </option>
                  )
                )}

              </select>

              <input
                className="form-control mb-3"
                placeholder="Lesson Title"
                value={
                  formData.title
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title:
                      e.target
                        .value
                  })
                }
              />

              <input
                className="form-control mb-3"
                placeholder="Order"
                value={
                  formData.order
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order:
                      Number(
                        e.target
                          .value
                      )
                  })
                }
              />

              <input
                className="form-control mb-3"
                placeholder="Duration"
                value={
                  formData.duration
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration:
                      Number(
                        e.target
                          .value
                      )
                  })
                }
              />

              <textarea
                rows="4"
                className="form-control mb-3"
                placeholder="Content"
                value={
                  formData.content
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content:
                      e.target
                        .value
                  })
                }
              />

              <textarea
                rows="5"
                className="form-control"
                placeholder="Code"
                value={
                  formData.code
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code:
                      e.target
                        .value
                  })
                }
              />

            </div>

            <div className="modal-footer">

              <button
                className="btn btn-secondary"
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={
                  handleSubmit
                }
              >
                {editingLesson
                  ? "Update"
                  : "Create"}
              </button>

            </div>

          </div>

        </div>

      </div>

    )}

  </AdminLayout>
);
}

export default LessonManagement;