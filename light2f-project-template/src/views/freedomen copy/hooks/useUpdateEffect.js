"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function useUpdateEffect(fn, deps) {
    var didMountRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
        if (didMountRef.current)
            fn();
        else
            didMountRef.current = true;
    }, deps);
}
exports.default = useUpdateEffect;
