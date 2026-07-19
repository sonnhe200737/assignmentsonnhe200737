import api from "./api";

export const getAllCourses = () => {
  return api.get("/courses");
};

export const getCourseById = (id) => {
  return api.get(`/courses/${id}`);
};

export const createCourse = (course) => {
  return api.post("/courses", course);
};

export const updateCourse = (id, course) => {
  return api.put(`/courses/${id}`, course);
};

export const deleteCourse = (id) => {
  return api.delete(`/courses/${id}`);
};


// Hàm lấy danh sách enrollments của 1 user cụ thể đối với 1 khóa học cụ thể
export const checkEnrollment = (userId, courseId) => {
  return api.get(`/enrollments?userId=${userId}&courseId=${courseId}`);
};

// Hàm gửi request tạo mới bản ghi enroll học viên vào khóa học
export const enrollCourse = (enrollmentData) => {
  return api.post("/enrollments", enrollmentData);
};
export const getEnrollmentsByUser = (userId) => {
  return api.get(`/enrollments?userId=${userId}`);
};
export const getLessonsByCourseId = (
  courseId
) => {
  return api.get(
    `/lessons?courseId=${courseId}&_sort=order`
  );
};

export const getLessonProgress =
  (userId) => {
    return api.get(
      `/lessonProgress?userId=${userId}`
    );
  };

export const completeLesson =
  (data) => {
    return api.post(
      "/lessonProgress",
      data
    );
  };

export const checkLessonCompleted =
  (userId, lessonId) => {
    return api.get(
      `/lessonProgress?userId=${userId}&lessonId=${lessonId}`
    );
  };
 

  // ==============================
// ADMIN
// ==============================

// Lấy tất cả enrollments
export const getAllEnrollments = () => {
  return api.get("/enrollments");
};

// Lấy tất cả lessons
export const getAllLessons = () => {
  return api.get("/lessons");
};

// Lấy lesson theo id
export const getLessonById = (id) => {
  return api.get(`/lessons/${id}`);
};

// Thêm lesson
export const createLesson = (lesson) => {
  return api.post("/lessons", lesson);
};

// Sửa lesson
export const updateLesson = (id, lesson) => {
  return api.put(`/lessons/${id}`, lesson);
};

// Xóa lesson
export const deleteLesson = (id) => {
  return api.delete(`/lessons/${id}`);
};
export const deleteEnrollment = (
  id
) => {
  return api.delete(
    `/enrollments/${id}`
  );
};