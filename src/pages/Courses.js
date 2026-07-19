import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

import CourseCard from "../components/CourseCard";
import { getAllCourses } from "../services/courseService";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Trang hiện tại người dùng đang xem.
  const [currentPage, setCurrentPage] = useState(1);

  // Số lượng khóa học hiển thị trên mỗi trang.
  const coursesPerPage = 6;

  useEffect(() => {
    fetchCourses();
  }, []);

  /*
   * Khi Search, Category, Level hoặc Sort thay đổi,
   * tự động quay về trang 1.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, category, level, sortBy]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllCourses();

      setCourses(response.data);
    } catch (error) {
      console.error("Failed to load courses:", error);

      setError(
        "Unable to load courses. Please make sure JSON Server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Search + Filter + Sort.
   *
   * useMemo giúp React chỉ tính lại danh sách này
   * khi courses, keyword, category, level hoặc sortBy thay đổi.
   */
  const filteredCourses = useMemo(() => {
    const result = courses.filter((course) => {
      const normalizedKeyword = keyword.trim().toLowerCase();

      const courseTitle = course.title?.toLowerCase() || "";
      const courseInstructor =
        course.instructor?.toLowerCase() || "";

      const matchesKeyword =
        normalizedKeyword === "" ||
        courseTitle.includes(normalizedKeyword) ||
        courseInstructor.includes(normalizedKeyword);

      const matchesCategory =
        category === "" || course.categoryName === category;

      const matchesLevel =
        level === "" || course.level === level;

      return matchesKeyword && matchesCategory && matchesLevel;
    });

    /*
     * Tạo mảng mới trước khi sort.
     *
     * sort() làm thay đổi trực tiếp mảng mà nó xử lý,
     * nên dùng [...result] để tránh ảnh hưởng mảng cũ.
     */
    return [...result].sort((courseA, courseB) => {
      if (sortBy === "rating-desc") {
        return Number(courseB.rating || 0) -
          Number(courseA.rating || 0);
      }

      if (sortBy === "price-asc") {
        return Number(courseA.price || 0) -
          Number(courseB.price || 0);
      }

      if (sortBy === "price-desc") {
        return Number(courseB.price || 0) -
          Number(courseA.price || 0);
      }

      if (sortBy === "title-asc") {
        return courseA.title.localeCompare(courseB.title);
      }

      return 0;
    });
  }, [courses, keyword, category, level, sortBy]);

  /*
   * Tạo danh sách category không bị trùng.
   */
  const categories = useMemo(() => {
    return [
      ...new Set(
        courses
          .map((course) => course.categoryName)
          .filter(Boolean)
      )
    ];
  }, [courses]);

  /*
   * Tạo danh sách level không bị trùng.
   */
  const levels = useMemo(() => {
    return [
      ...new Set(
        courses
          .map((course) => course.level)
          .filter(Boolean)
      )
    ];
  }, [courses]);

  /*
   * Tổng số trang.
   *
   * Ví dụ:
   * 14 khóa học / 6 khóa mỗi trang = 2.333
   * Math.ceil(2.333) = 3 trang.
   */
  const totalPages = Math.ceil(
    filteredCourses.length / coursesPerPage
  );

  /*
   * Vị trí kết thúc của trang hiện tại.
   *
   * Trang 1: 1 × 6 = 6
   * Trang 2: 2 × 6 = 12
   */
  const indexOfLastCourse =
    currentPage * coursesPerPage;

  /*
   * Vị trí bắt đầu của trang hiện tại.
   *
   * Trang 1: 6 - 6 = 0
   * Trang 2: 12 - 6 = 6
   */
  const indexOfFirstCourse =
    indexOfLastCourse - coursesPerPage;

  /*
   * Chỉ lấy các khóa học thuộc trang hiện tại.
   *
   * Trang 1: slice(0, 6)
   * Trang 2: slice(6, 12)
   */
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  /*
   * Tạo mảng số trang.
   *
   * totalPages = 4
   * pageNumbers = [1, 2, 3, 4]
   */
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const handleClearFilters = () => {
    setKeyword("");
    setCategory("");
    setLevel("");
    setSortBy("");
    setCurrentPage(1);
  };

  /*
   * Chuyển đến một trang cụ thể.
   */
  const handlePageChange = (pageNumber) => {
    /*
     * Không cho chuyển đến trang nhỏ hơn 1
     * hoặc lớn hơn tổng số trang.
     */
    if (pageNumber < 1 || pageNumber > totalPages) {
      return;
    }

    setCurrentPage(pageNumber);

    /*
     * Cuộn về đầu khu vực nội dung sau khi đổi trang.
     */
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>

        <p className="text-secondary mt-3">
          Loading courses...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>

        <button
          className="btn btn-primary"
          onClick={fetchCourses}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <section className="courses-heading-section">
        <div className="container py-5">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-3">
              <li className="breadcrumb-item">
                <Link to="/">
                  Home
                </Link>
              </li>

              <li
                className="breadcrumb-item active"
                aria-current="page"
              >
                Courses
              </li>
            </ol>
          </nav>

          <h1 className="fw-bold">
            Explore Courses
          </h1>

          <p className="text-secondary mb-0">
            Discover practical courses and start learning today.
          </p>
        </div>
      </section>

      <section className="container py-5">
        <div className="course-filter-card mb-4">
          <div className="row g-3">
            <div className="col-lg-4">
              <label
                className="form-label fw-semibold"
                htmlFor="courseKeyword"
              >
                Search
              </label>

              <input
                id="courseKeyword"
                type="text"
                className="form-control"
                placeholder="Search by title or instructor..."
                value={keyword}
                onChange={(event) => {
                  setKeyword(event.target.value);
                }}
              />
            </div>

            <div className="col-md-4 col-lg-2">
              <label
                className="form-label fw-semibold"
                htmlFor="courseCategory"
              >
                Category
              </label>

              <select
                id="courseCategory"
                className="form-select"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                }}
              >
                <option value="">
                  All categories
                </option>

                {categories.map((categoryName) => (
                  <option
                    key={categoryName}
                    value={categoryName}
                  >
                    {categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 col-lg-2">
              <label
                className="form-label fw-semibold"
                htmlFor="courseLevel"
              >
                Level
              </label>

              <select
                id="courseLevel"
                className="form-select"
                value={level}
                onChange={(event) => {
                  setLevel(event.target.value);
                }}
              >
                <option value="">
                  All levels
                </option>

                {levels.map((levelName) => (
                  <option
                    key={levelName}
                    value={levelName}
                  >
                    {levelName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 col-lg-2">
              <label
                className="form-label fw-semibold"
                htmlFor="courseSort"
              >
                Sort by
              </label>

              <select
                id="courseSort"
                className="form-select"
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value);
                }}
              >
                <option value="">
                  Default
                </option>

                <option value="rating-desc">
                  Highest rating
                </option>

                <option value="price-asc">
                  Price: Low to High
                </option>

                <option value="price-desc">
                  Price: High to Low
                </option>

                <option value="title-asc">
                  Title: A to Z
                </option>
              </select>
            </div>

            <div className="col-lg-2 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <p className="text-secondary mb-0">
            Showing{" "}
            <strong>{filteredCourses.length}</strong>
            {" "}of{" "}
            <strong>{courses.length}</strong>
            {" "}courses
          </p>

          {filteredCourses.length > 0 && (
            <p className="text-secondary mb-0">
              Page{" "}
              <strong>{currentPage}</strong>
              {" "}of{" "}
              <strong>{totalPages}</strong>
            </p>
          )}
        </div>

        {filteredCourses.length === 0 ? (
          <div className="empty-course-result">
            <h3>No courses found</h3>

            <p className="text-secondary">
              Try changing your keyword or filters.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {currentCourses.map((course) => (
                <div
                  className="col-md-6 col-lg-4"
                  key={course.id}
                >
                  <CourseCard course={course} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                className="course-pagination mt-5"
                aria-label="Course pagination"
              >
                <ul className="pagination justify-content-center mb-0">
                  <li
                    className={`page-item ${
                      currentPage === 1
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      disabled={currentPage === 1}
                      onClick={() => {
                        handlePageChange(currentPage - 1);
                      }}
                    >
                      Previous
                    </button>
                  </li>

                  {pageNumbers.map((pageNumber) => (
                    <li
                      key={pageNumber}
                      className={`page-item ${
                        currentPage === pageNumber
                          ? "active"
                          : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="page-link"
                        onClick={() => {
                          handlePageChange(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${
                      currentPage === totalPages
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      disabled={
                        currentPage === totalPages
                      }
                      onClick={() => {
                        handlePageChange(currentPage + 1);
                      }}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default Courses;