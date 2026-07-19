import axios from "axios";

const USER_API_URL = "http://localhost:9999/users";

/*
 * Tìm user dựa theo email.
 *
 * API được gọi:
 * GET http://localhost:9999/users?email=student@gmail.com
 */
export const getUsersByEmail = (email) => {
  return axios.get(USER_API_URL, {
    params: {
      email: email
    }
  });
};

export const createUser = (userData) => {
  return axios.post(USER_API_URL, userData);
};