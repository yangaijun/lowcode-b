import Http from "libs/http"

class HotelRoomService {
    //插入或修改
    insertOrUpdate(params) {
        return Http.post(`HotelRoom/insertOrUpdate`, params)
    }
    //删除
    delete(params) {
        return Http.post(`HotelRoom/delete`, params)
    }
    //删除多条
    removeByIds(params) {
        return Http.post(`hotelroom/removeByIds`, params)
    }
    //查询
    search(params) {
        return Http.post(`HotelRoom/search`, params)
    }
    roomTypeOptions(params) {
        return Http.post(`HotelRoomType/search`, params)
    }
}

const hotelRoomService = new HotelRoomService()
export default hotelRoomService
