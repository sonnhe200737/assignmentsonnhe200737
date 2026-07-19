import axios from "axios";

const USER_API_URL =
  "http://localhost:9999/users";

/*
 * Đăng nhập
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
 * Đăng ký
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

/*
 * ==========================
 * ADMIN
 * ==========================
 */

/*
 * Lấy tất cả user
 */
export const getAllUsers =
  () => {
    return axios.get(
      USER_API_URL
    );
  };

/*
 * Lấy user theo id
 */
export const getUserById =
  (id) => {
    return axios.get(
      `${USER_API_URL}/${id}`
    );
  };

/*
 * Xóa user
 */
export const deleteUser =
  (id) => {
    return axios.delete(
      `${USER_API_URL}/${id}`
    );
  };