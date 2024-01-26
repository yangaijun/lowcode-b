import user from "libs/user"
import d from 'dayjs';

export const dayjs = d

export function getToken() {
    return user.getUserProjectToken()
}

export function setToken(token) {
    user.setUserProjectToken(token)
}

export function setUserId(id) {
    user.setUserProjectUserId(id)
}

export function getUserId() {
    return user.getUserProjectUserId()
}

export function clearUser() {
    user.removeUserProjectToken()
    user.removeUserProjectUserId()
}

export function download(res, fileName) {
    const url = window.URL.createObjectURL(new Blob([res]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
}