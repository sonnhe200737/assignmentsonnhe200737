import axios from "axios";

const USER_API_URL =
  "http://localhost:9999/users";

/*
 * Tìm user dựa theo email
 */
export const getUsersByEmail =
  (email) => {
    return axios.get(
      USER_API_URL,
      {
        params: {
          email
        }
      }
    );
  };

/*
 * Tạo user mới
 */
export const createUser =
  (userData) => {
    return axios.post(
      USER_API_URL,
      userData
    );
  };

/*
 * Cập nhật user
 */
export const updateUser = (
  id,
  userData
) => {
  return axios.put(
    `${USER_API_URL}/${id}`,
    userData
  );
};