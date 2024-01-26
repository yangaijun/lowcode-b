import Http from "libs/http"

class HotelVipService {
    //插入或修改
    insertOrUpdate(params) {
        return Http.post(`HotelVip/insertOrUpdate`, params)
    }
    //删除
    delete(params) {
        return Http.post(`HotelVip/delete`, params)
    }
    //删除多条
    removeByIds(params) {
        return Http.post(`hotelvip/removeByIds`, params)
    }
    //查询
    search(params) {
        return Http.post(`HotelVip/search`, params)
    }
}

const hotelVipService = new HotelVipService()
export default hotelVipService
