import Http from "libs/http"

class HotelPrebookService {
    //插入或修改
    insertOrUpdate(params) {
        return Http.post(`HotelPrebook/insertOrUpdate`, params)
    }
    //删除
    delete(params) {
        return Http.post(`HotelPrebook/delete`, params)
    }
    //删除多条
    removeByIds(params) {
        return Http.post(`hotelprebook/removeByIds`, params)
    }
    //查询
    search(params) {
        return Http.post(`HotelPrebook/search`, params)
    }
    vipOptions(params) {
        return Http.post(`HotelVip/search`, params)
    }
    roomTypeOptions(params) {
        return Http.post(`HotelRoomType/search`, params)
    }
    cancel(params) {
        return Http.post(`HotelPrebook/cancel`, params)
    }
    toOrder(params) {
        return Http.post(`HotelPrebook/toOrder`, params)
    }
    roomSearch(params) {
        return Http.post(`HotelRoom/search`, params)
    }
}

const hotelPrebookService = new HotelPrebookService()
export default hotelPrebookService
