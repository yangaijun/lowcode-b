import Http from "libs/http"

class LoginService {
    //登录
    login(params) {
        return Http.post(`user/login`, params)
    }
}

const loginService = new LoginService()
export default loginService
