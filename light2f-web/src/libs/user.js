import { parseURLParams } from "./utils";

function getProjectId() {
  const { projectId } = parseURLParams()

  return projectId || ""
}
class User {
  #store = window.localStorage;

  #tokenKey = 'l2fubs0aev';
  #userIdKey = 'l2fvbsda3c';
  #userNameKey = 'l2fdnck1am';
  #userAvatarKey = 'l2fmp87s9sd';
  #roleTypekey = 'l2fuamo90vep';
  #userProjectTokenKey = 'l2fyup0topt';
  #userProjectUserIdKey = 'l2fkyu0id1l';
  #userProjectBaseUrlTipKey = 'l2ftip084azy';
  #userProjectAxiosHeadersKey = 'l2faxs1hder';
  #userProjectMenuPaths_dev = 'l2fpma1pasdv';
  #userProjectMenuPaths_preview = 'l2fpma1pve';
  #userProjectUserIdTypeKey = 'l2fuidtyp85v';
  #virHistory = 'l2fhm28pil0';

  constructor() {
    if (process.env.NODE_ENV === 'production') {
      //禁用localStorage
      Object.defineProperty(window, 'localStorage', {
        get() {
          console.log('---- localStorage 已被禁用！ ----')
        }
      })
    }
  }
  //user project token
  setUserProjectToken(token) {
    return this.#store.setItem(this.#userProjectTokenKey + getProjectId(), token)
  }
  getUserProjectToken() {
    return this.#store.getItem(this.#userProjectTokenKey + getProjectId())
  }
  removeUserProjectToken() {
    this.#store.removeItem(this.#userProjectTokenKey + getProjectId())
  }
  //user project token
  setUserProjectUserId(id) {
    if (!id && id !== 0) return

    this.#store.setItem(this.#userProjectUserIdTypeKey + getProjectId(), typeof id)

    this.#store.setItem(this.#userProjectUserIdKey + getProjectId(), id)
  }
  getUserProjectUserId() {
    const userId = this.#store.getItem(this.#userProjectUserIdKey + getProjectId())
    if (userId !== null && this.#store.getItem(this.#userProjectUserIdTypeKey + getProjectId())) {
      return Number(userId)
    }
    return userId
  }
  removeUserProjectUserId() {
    this.#store.removeItem(this.#userProjectUserIdKey + getProjectId())
    this.#store.removeItem(this.#userProjectUserIdTypeKey + getProjectId())
  }
  //user project menu paths, isPreview ? 区分项目预览还是开发
  setUserProjectMenuPaths(paths, isPreview) {
    if (Array.isArray(paths)) {
      this.#store.setItem(
        (isPreview ? this.#userProjectMenuPaths_preview : this.#userProjectMenuPaths_dev) + getProjectId(),
        JSON.stringify(paths)
      )
    }
  }
  getUserProjectMenuPaths(isPreview) {
    let paths = this.#store.getItem((isPreview ? this.#userProjectMenuPaths_preview : this.#userProjectMenuPaths_dev) + getProjectId());
    if (paths) {
      paths = JSON.parse(paths)
      if (Array.isArray(paths)) {
        return paths
      }
    }
    return null
  }
  removeUserProjectMenuPaths(isPreview) {
    this.#store.removeItem((isPreview ? this.#userProjectMenuPaths_preview : this.#userProjectMenuPaths_dev) + getProjectId());
  }
  //user no axios baseURL tip
  setUserProjectBaseUrlTip(tip) {
    const value = tip ? "true" : "false"
    this.#store.setItem(this.#userProjectBaseUrlTipKey + getProjectId(), value)
  }
  /**
   * 缺省是 true,即有提示
   */
  getUserProjectBaseUrlTip() {
    return this.#store.getItem(this.#userProjectBaseUrlTipKey + getProjectId()) !== 'false'
  }
  removeUserProjectBaseUrlTip() {
    this.#store.removeItem(this.#userProjectBaseUrlTipKey + getProjectId())
  }
  //调试时，axios 的 headers 信息
  getUserProjectAxiosHeaders() {
    return this.#store.getItem(this.#userProjectAxiosHeadersKey + getProjectId())
  }
  setUserProjectAxiosHeaders(headers) {
    if (!headers) return

    this.#store.setItem(this.#userProjectAxiosHeadersKey + getProjectId(), headers)
  }
  removeUserProjectAxiosHeaders() {
    this.#store.removeItem(this.#userProjectAxiosHeadersKey + getProjectId())
  }
  //用户可以使用LocalStorage
  getUserStorage() {
    const prefixKey = "user_" + getProjectId() + "_"
    const self = this

    return {
      getItem(key) {
        return self.#store.getItem(prefixKey + key)
      },
      setItem(key, value) {
        return self.#store.setItem(prefixKey + key, value)
      },
      removeItem(key) {
        return self.#store.removeItem(prefixKey + key)
      }
    }
  }

  //登录的token
  getToken() {
    return this.#store.getItem(this.#tokenKey);
  }
  /**
   * 设置token
   * @param {UserTypes} type 登录人角色类型
   * @param {String} token 
   */
  setToken(role, token) {
    this.#store.setItem(this.#roleTypekey, role)
    this.#store.setItem(this.#tokenKey, token);
  }
  resetToken(token) {
    this.#store.setItem(this.#tokenKey, token);
  }
  removeToken() {
    this.#store.removeItem(this.#tokenKey);
  }
  //用户的名称
  getUserName() {
    return this.#store.getItem(this.#userNameKey);
  }
  setUserName(userName) {
    this.#store.setItem(this.#userNameKey, userName);
  }
  removeUserName() {
    this.#store.removeItem(this.#userNameKey);
  }
  //用户头像
  setUserAvatar(avatar) {
    if (avatar) {
      this.#store.setItem(this.#userAvatarKey, avatar)
    }
  }
  getUserAvatar() {
    return this.#store.getItem(this.#userAvatarKey)
  }
  removeUserAvatar() {
    this.#store.removeItem(this.#userAvatarKey)
  }
  //当前登录人角色，正规用户，游客
  setRoleType(role) {
    this.#store.setItem(this.#roleTypekey, role)
  }
  getRoleType() {
    return this.#store.getItem(this.#roleTypekey)
  }
  //用户当前ID
  getUserId() {
    const id = this.#store.getItem(this.#userIdKey);
    if (id) {
      return Number(id)
    } else {
      return null
    }
  }
  setUserId(userId) {
    this.#store.setItem(this.#userIdKey, userId);
  }
  getVirHistory(key) {
    let hs = this.#store.getItem(this.#virHistory + "_" + key)
    if (hs) {
      hs = JSON.parse(hs)
    }
    return hs
  }
  pushVirHistory(key, item) {
    let hs = this.getVirHistory(key) || []
    hs.push(item)
    this.setVirHistory(key, hs)
  }
  setVirHistory(key, stacks) {
    this.#store.setItem(this.#virHistory + "_" + key, JSON.stringify(stacks))
  }
  clearVirHistory(key) {
    this.#store.removeItem(this.#virHistory + "_" + key)
  }
  //预览中，我知道了
  getIknow(key) {
    return this.#store.getItem(key)
  }
  setIknow(key) {
    this.#store.setItem(key, 'iknow')
  }
  logout() {
    this.#store.removeItem(this.#tokenKey);
    this.#store.removeItem(this.#roleTypekey);
    this.#store.removeItem(this.#userIdKey);
    this.#store.removeItem(this.#userNameKey);
    this.#store.removeItem(this.#userAvatarKey);
  }
}

export const UserType = {
  Guest: 'ITib9qN4hUq',
  User: 'B18A3orNYyr'
}

const user = new User();
export default user;
