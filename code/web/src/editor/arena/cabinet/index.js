/* eslint-disable no-unused-vars */

import Cabinet from "./v";

//
// 用来显示样品的图片的展示器
//
export default function() {
    const cabinet = new Cabinet();
    cabinet.show(document.body);
    return cabinet;
}
