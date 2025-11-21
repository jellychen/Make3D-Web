/* eslint-disable no-unused-vars */

export default class Context {
    /**
     * 动画
     */
    animation = true;

    /**
     * normal|glass
     */
    style = "normal";

    /**
     * 事件函数，选中
     */
    on_selected;

    /**
     * 事件函数，取消回调
     */
    on_cancle;
}
