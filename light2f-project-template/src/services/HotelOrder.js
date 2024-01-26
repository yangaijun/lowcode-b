import Http from "libs/http"

class HotelOrderService {
    //插入或修改
    insertOrUpdate(params) {
        return Http.post(`HotelOrder/insertOrUpdate`, params)
    }
    //删除
    delete(params) {
        return Http.post(`HotelOrder/delete`, params)
    }
    //删除多条
    removeByIds(params) {
        return Http.post(`hotelorder/removeByIds`, params)
    }
    //查询
    search(params) {
        return Http.post(`HotelOrder/search`, params)
    }
    vipOptions(params) {
        return Http.post(`HotelVip/search`, params)
    }
    roomTypeOptions(params) {
        return Http.post(`HotelRoomType/search`, params)
    }
    roomSearch(params) {
        return Http.post(`HotelRoom/search`, params)
    }
    checkOut(params) {
        return Http.post(`HotelOrder/checkOut`, params)
    }
}

const hotelOrderService = new HotelOrderService()
export default hotelOrderService
