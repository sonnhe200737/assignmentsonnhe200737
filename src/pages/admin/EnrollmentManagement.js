import {
    useEffect,
    useState,
    useMemo
} from "react";

import AdminLayout from "../../layouts/AdminLayout";

import {
    getAllEnrollments,
    getAllCourses,
    deleteEnrollment
} from "../../services/courseService";

import {
    getAllUsers
} from "../../services/userService";
function EnrollmentManagement() {
    const [enrollments, setEnrollments] =
        useState([]);

    const [users, setUsers] =
        useState([]);

    const [courses, setCourses] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");
    const [
        courseFilter,
        setCourseFilter
    ] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [
                enrollmentRes,
                userRes,
                courseRes
            ] = await Promise.all([
                getAllEnrollments(),
                getAllUsers(),
                getAllCourses()
            ]);

            setEnrollments(
                enrollmentRes.data
            );

            setUsers(userRes.data);

            setCourses(courseRes.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getUserName = (
        userId
    ) => {
        const user = users.find(
            u => u.id == userId
        );

        return user
            ? user.fullName
            : "Unknown";
    };

    const getCourseName = (
        courseId
    ) => {
        const course =
            courses.find(
                c => c.id == courseId
            );

        return course
            ? course.title
            : "Unknown";
    };

    const filteredEnrollments =
        useMemo(() => {
            let data = [...enrollments];

            if (search) {
                data = data.filter(
                    (enrollment) =>
                        getUserName(
                            enrollment.userId
                        )
                            .toLowerCase()
                            .includes(
                                search.toLowerCase()
                            )
                );
            }

            if (courseFilter) {
                data = data.filter(
                    (enrollment) =>
                        enrollment.courseId ==
                        courseFilter
                );
            }

            return data;
        }, [
            enrollments,
            search,
            courseFilter,
            users
        ]);

    const handleDelete =
        async (id) => {
            if (
                !window.confirm(
                    "Delete this enrollment?"
                )
            ) {
                return;
            }

            await deleteEnrollment(id);

            loadData();
        };

    if (loading) {
        return (
            <AdminLayout>
                Loading...
            </AdminLayout>
        );
    }
    return (
        <AdminLayout>

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>
                    Enrollment Management
                </h2>

            </div>

            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-6">

                            <input
                                className="form-control"
                                placeholder="Search student..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="col-md-6">

                            <select
                                className="form-select"
                                value={courseFilter}
                                onChange={(e) =>
                                    setCourseFilter(
                                        e.target.value
                                    )
                                }
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

            <div className="card shadow">

                <div className="table-responsive">

                    <table className="table table-hover">

                        <thead className="table-dark">

                            <tr>

                                <th>ID</th>

                                <th>Student</th>

                                <th>Course</th>

                                <th>Enroll Date</th>

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredEnrollments.map(
                                enrollment => (

                                    <tr
                                        key={
                                            enrollment.id
                                        }
                                    >

                                        <td>
                                            {
                                                enrollment.id
                                            }
                                        </td>

                                        <td>
                                            {getUserName(
                                                enrollment.userId
                                            )}
                                        </td>

                                        <td>
                                            {getCourseName(
                                                enrollment.courseId
                                            )}
                                        </td>

                                        <td>
                                            {
                                                enrollment.enrolledAt
                                            }
                                        </td>

                                        <td>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    handleDelete(
                                                        enrollment.id
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

        </AdminLayout>
    );
}

export default EnrollmentManagement;