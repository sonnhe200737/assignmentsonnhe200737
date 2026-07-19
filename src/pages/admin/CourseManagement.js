import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
    getAllCourses,
    createCourse,
    updateCourse,
    deleteCourse
} from "../../services/courseService";

function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [level, setLevel] = useState("");
    const [sort, setSort] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);

    const [editingCourse, setEditingCourse] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        image: "",
        categoryName: "",
        level: "",
        price: "",
        description: ""
    });

    const PAGE_SIZE = 5;

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const res = await getAllCourses();
            setCourses(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    const categories = [
        ...new Set(
            courses.map(c => c.categoryName)
        )
    ];

    const levels = [...new Set(courses.map(c => c.level))];

    const filteredCourses = useMemo(() => {
        let data = [...courses];

        if (search) {
            data = data.filter(course =>
                course.title
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        if (category) {
            data = data.filter(
                course => course.categoryName === category
            );
        }

        if (level) {
            data = data.filter(course => course.level === level);
        }

        if (sort === "asc") {
            data.sort((a, b) => a.title.localeCompare(b.title));
        }

        if (sort === "desc") {
            data.sort((a, b) => b.title.localeCompare(a.title));
        }

        return data;
    }, [courses, search, category, level, sort]);

    const totalPages = Math.ceil(filteredCourses.length / PAGE_SIZE);

    const displayedCourses = filteredCourses.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    if (loading) {
        return (
            <AdminLayout>
                <h3>Loading...</h3>
            </AdminLayout>
        );
    }
    const handleAdd = () => {
        setEditingCourse(null);

        setFormData({
            title: "",
            image: "",
            categoryName: "",
            level: "",
            price: "",
            description: ""
        });

        setShowModal(true);
    };
    const handleEdit = (course) => {

        setEditingCourse(course);

        setFormData(course);

        setShowModal(true);

    };
    const handleDelete = async (id) => {

        if (!window.confirm("Delete this course?")) {
            return;
        }

        await deleteCourse(id);

        loadCourses();

    };
    const handleSubmit = async () => {

        if (editingCourse) {

            await updateCourse(
                editingCourse.id,
                formData
            );

        } else {

            await createCourse(formData);

        }

        setShowModal(false);

        loadCourses();

    };
    return (
        <AdminLayout>

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>Course Management</h2>

                <button
                    className="btn btn-primary"
                    onClick={handleAdd}
                >
                    + Add Course
                </button>
            </div>

            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <div className="row g-3">

                        <div className="col-md-4">

                            <input
                                className="form-control"
                                placeholder="Search course..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />

                        </div>

                        <div className="col-md-3">

                            <select
                                className="form-select"
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="">All Category</option>

                                {categories.map(item => (
                                    <option key={item}>{item}</option>
                                ))}

                            </select>

                        </div>

                        <div className="col-md-2">

                            <select
                                className="form-select"
                                value={level}
                                onChange={(e) => {
                                    setLevel(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="">All Level</option>

                                {levels.map(item => (
                                    <option key={item}>{item}</option>
                                ))}

                            </select>

                        </div>

                        <div className="col-md-3">

                            <select
                                className="form-select"
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="">Default</option>

                                <option value="asc">
                                    A → Z
                                </option>

                                <option value="desc">
                                    Z → A
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

            </div>

            <div className="card shadow">

                <div className="table-responsive">

                    <table className="table table-hover align-middle mb-0">

                        <thead className="table-dark">

                            <tr>

                                <th>ID</th>

                                <th>Image</th>

                                <th>Title</th>

                                <th>Category</th>

                                <th>Level</th>

                                <th>Price</th>

                                <th width="180">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {displayedCourses.map(course => (

                                <tr key={course.id}>

                                    <td>{course.id}</td>

                                    <td>

                                        <img
                                            src={course.image}
                                            alt=""
                                            width="80"
                                            className="rounded"
                                        />

                                    </td>

                                    <td>{course.title}</td>

                                    <td>{course.categoryName}</td>

                                    <td>

                                        <span className="badge bg-info">
                                            {course.level}
                                        </span>

                                    </td>

                                    <td>${course.price}</td>

                                    <td>

                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEdit(course)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(course.id)}
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

            <nav className="mt-4">

                <ul className="pagination justify-content-center">

                    {Array.from(
                        { length: totalPages },
                        (_, index) => (

                            <li
                                key={index}
                                className={`page-item ${currentPage === index + 1
                                    ? "active"
                                    : ""
                                    }`}
                            >

                                <button
                                    className="page-link"
                                    onClick={() =>
                                        setCurrentPage(index + 1)
                                    }
                                >
                                    {index + 1}
                                </button>

                            </li>

                        )
                    )}

                </ul>

            </nav>
            {showModal && (

                <div
                    className="modal d-block"
                    style={{
                        background: "rgba(0,0,0,.5)"
                    }}
                >

                    <div className="modal-dialog modal-lg">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5>

                                    {editingCourse
                                        ? "Edit Course"
                                        : "Add Course"}

                                </h5>

                                <button
                                    className="btn-close"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                />

                            </div>

                            <div className="modal-body">

                                <input
                                    className="form-control mb-3"
                                    placeholder="Title"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control mb-3"
                                    placeholder="Image URL"
                                    value={formData.image}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            image: e.target.value
                                        })
                                    }
                                />

                                <select
                                    className="form-select mb-3"
                                    value={formData.categoryName || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            categoryName: e.target.value
                                        })
                                    }
                                >
                                    <option value="">Select Category</option>
                                    <option value="Web Development">Web Development</option>
                                    <option value="Data Science">Data Science</option>
                                    <option value="UI/UX Design">UI/UX Design</option>
                                    <option value="Business">Business</option>
                                </select>

                                <select
                                    className="form-select mb-3"
                                    value={formData.level || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            level: e.target.value
                                        })
                                    }
                                >
                                    <option value="">Select Level</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>

                                <input
                                    className="form-control mb-3"
                                    placeholder="Price"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            price: e.target.value
                                        })
                                    }
                                />

                                <textarea
                                    className="form-control"
                                    rows="5"
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value
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
                                    onClick={handleSubmit}
                                >
                                    {editingCourse
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

export default CourseManagement;