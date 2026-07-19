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