import user from './user';
import qs from 'qs';
import ihistory from './history';
import { setUserMenuPaths as setSliceUserMenuPaths, setPageLoading as setSlicePageLoading, clearUserMenuPaths } from 'slices/userSlice'
import d from 'dayjs';
import store from 'store';

function getNextPath(path, state) {
    let newPath = path
    if (state) {
        newPath += "?" + qs.stringify(state)
    }
    return newPath
}

export const dayjs = d;

export const history = {
    push(path, state) {
        ihistory.push(getNextPath(path, state))
    },
    replace(path, state) {
        ihistory.replace(getNextPath(path, state))
    },
    go(next) {
        ihistory.go(next)
    }
}

export function parseURLParams(search = ihistory.location.search) {
    return qs.parse(search, { ignoreQueryPrefix: true })
}

export function getToken() {
    return user.getToken();
}

export function setToken(token) {
    user.setToken(token)
}

export function setUserId(id) {
    user.setUserId(id)
}

export function getUserId() {
    return user.getUserId();
}

export function logout() {
    user.clearUser()
    store.dispatch(clearUserMenuPaths())
    
    history.replace('/login')
}

export function download(resp, fileName) {
    const url = window.URL.createObjectURL(new Blob([resp]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
}

export function setUserMenuPaths(menuPaths) {
    store.dispatch(setSliceUserMenuPaths(menuPaths))
}

export function setPageLoading(loading = true) {
    store.dispatch(setSlicePageLoading(loading))
}

export default {
    history,
    dayjs,
    parseURLParams,
    setToken,
    getToken,
    setUserId,
    getUserId,
    logout,
    download,
    setUserMenuPaths,
    setPageLoading
}