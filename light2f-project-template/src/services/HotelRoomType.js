import Http from "libs/http"

class HotelRoomTypeService {
    //插入或修改
    insertOrUpdate(params) {
        return Http.post(`HotelRoomType/insertOrUpdate`, params)
    }
    //删除
    delete(params) {
        return Http.post(`HotelRoomType/delete`, params)
    }
    //删除多条
    removeByIds(params) {
        return Http.post(`hotelroomtype/removeByIds`, params)
    }
    //查询
    search(params) {
        return Http.post(`HotelRoomType/search`, params)
    }
}

const hotelRoomTypeService = new HotelRoomTypeService()
export default hotelRoomTypeService
