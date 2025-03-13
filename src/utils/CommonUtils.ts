import {jwtDecode} from 'jwt-decode';
import { getFromLocalStorage } from './LocalStorageUtils';

export const getErrorMessage = (error) => {
  return error
    ? error.response
      ? error.response.data
        ? error.response.data.error_description
          ? error.response.data.error_description
          : error.response.data.errors.length > 0
          ? error.response.data.errors[0].message
          : error.message
        : error.message
      : error.message
    : 'Something went wrong';
};

export const isAdmin = () => {
  // return true;
  const userInfoLocalStorage = getFromLocalStorage('userInfo');
  if (userInfoLocalStorage) {
    const token = JSON.parse(userInfoLocalStorage).token;
    const decodedToken = jwtDecode(token);
    return decodedToken?.authorities?.includes('ROLE_ADMIN');
  }
  return false;
};
