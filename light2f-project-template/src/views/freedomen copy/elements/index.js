"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getElementDom = void 0;
var input_1 = __importDefault(require("./input"));
var avatar_1 = __importDefault(require("./avatar"));
var select_1 = __importDefault(require("./select"));
var button_1 = __importDefault(require("./button"));
var cascader_1 = __importDefault(require("./cascader"));
var checkboxs_1 = __importDefault(require("./checkboxs"));
var mentions_1 = __importDefault(require("./mentions"));
var inputnumber_1 = __importDefault(require("./inputnumber"));
var divider_1 = __importDefault(require("./divider"));
var date_1 = __importDefault(require("./date"));
var daterange_1 = __importDefault(require("./daterange"));
var dropdown_1 = __importDefault(require("./dropdown"));
var image_1 = __importDefault(require("./image"));
var img_1 = __importDefault(require("./img"));
var progress_1 = __importDefault(require("./progress"));
var rate_1 = __importDefault(require("./rate"));
var radios_1 = __importDefault(require("./radios"));
var autocomplete_1 = __importDefault(require("./autocomplete"));
var slider_1 = __importDefault(require("./slider"));
var switch_1 = __importDefault(require("./switch"));
var tag_1 = __importDefault(require("./tag"));
var tags_1 = __importDefault(require("./tags"));
var text_1 = __importDefault(require("./text"));
var tree_1 = __importDefault(require("./tree"));
var treeselect_1 = __importDefault(require("./treeselect"));
var upload_1 = __importDefault(require("./upload"));
var steps_1 = __importDefault(require("./steps"));
var timepicker_1 = __importDefault(require("./timepicker"));
var timerange_1 = __importDefault(require("./timerange"));
var segmented_1 = __importDefault(require("./segmented"));
var alert_1 = __importDefault(require("./alert"));
var elementMap = {
    alert: alert_1.default,
    avatar: avatar_1.default,
    autocomplete: autocomplete_1.default,
    input: input_1.default,
    select: select_1.default,
    button: button_1.default,
    cascader: cascader_1.default,
    checkboxs: checkboxs_1.default,
    mentions: mentions_1.default,
    inputnumber: inputnumber_1.default,
    date: date_1.default,
    daterange: daterange_1.default,
    divider: divider_1.default,
    dropdown: dropdown_1.default,
    image: image_1.default,
    img: img_1.default,
    progress: progress_1.default,
    radios: radios_1.default,
    rate: rate_1.default,
    slider: slider_1.default,
    switch: switch_1.default,
    tag: tag_1.default,
    tags: tags_1.default,
    text: text_1.default,
    tree: tree_1.default,
    steps: steps_1.default,
    treeselect: treeselect_1.default,
    upload: upload_1.default,
    timepicker: timepicker_1.default,
    timerange: timerange_1.default,
    segmented: segmented_1.default
};
function getElementDom(type) {
    return elementMap[type];
}
exports.getElementDom = getElementDom;
