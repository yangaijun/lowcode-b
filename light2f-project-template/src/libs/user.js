class User {
  #tokenKey = 'tokenKey';
  #userIdKey = 'userId';
  #userNameKey = 'userName';
  #userMenuPathsKey = 'userMenuPaths'
  #store = window.localStorage;
 
  getToken() {
    return this.#store.getItem(this.#tokenKey);
  }
  setToken(token) {
    this.#store.setItem(this.#tokenKey, token);
  }
  removeToken() {
    this.#store.removeItem(this.#tokenKey);
  }

  getUserName() {
    return this.#store.getItem(this.#userNameKey);
  }
  setUserName(userName) {
    this.#store.setItem(this.#userNameKey, userName);
  }
  removeUserName() {
    this.#store.removeItem(this.#userNameKey);
  }

  getUserId() {
    const id = this.#store.getItem(this.#userIdKey);
    return id ? Number(id) : null
  }
  setUserId(userId) {
    this.#store.setItem(this.#userIdKey, userId);
  }
  removeUserId() {
    this.#store.removeItem(this.#userIdKey);
  }

  setUserMenuPaths(paths) {
    if (Array.isArray(paths)) {
      this.#store.setItem(this.#userMenuPathsKey, JSON.stringify(paths))
    }
  }
  getUserMenuPaths() {
    let paths = this.#store.getItem(this.#userMenuPathsKey);
    if (paths) {
      paths = JSON.parse(paths)
      if (Array.isArray(paths)) {
        return paths
      }
    }
    return null
  }
  removeUserMenuPaths() {
    this.#store.removeItem(this.#userMenuPathsKey);
  }

  clearUser() {
    this.removeToken();
    this.removeUserName();
    this.removeUserId();
    this.removeUserMenuPaths();
  }
}

export default new User();
