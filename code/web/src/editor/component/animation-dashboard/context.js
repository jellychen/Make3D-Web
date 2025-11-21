/* eslint-disable no-unused-vars */

/**
 * 上下文
 */
export default class Context {
    /**
     * 获取
     */
    getBoundingClientRect    = () => {};

    /**
     * 获取当前操作的元素
     */
    getRelatedObject3D       = () => {};

    /**
     * 重置到开头
     */
    resetToFront             = () => {};

    /**
     * 
     * 设置游标的位置
     * 
     * @param {*} time 
     */
    updateCursorTime         = time => {};

    /**
     * 
     * 更新动画到指定的位置
     * 
     * @param {*} time 
     */
    updateAnimationAtTime    = time => {};

    /**
     * 
     * 确保时间可见性
     * 
     * @param {*} time 
     * @param {*} limit 
     */
    makeSureTimeVisible      = (time, limit) => {};

    /**
     * 标记动画数据需要更新
     */
    makeAnimationNeedUpdate  = () => {};

    /**
     * 增加标记
     */
    addNewMarkerAtCursorTime = () => {};

    /**
     * 
     * 区间变化
     * 
     * @param {*} start 
     * @param {*} end 
     */
    updateRange              = (start, end) => {};

    /**
     * 
     * 选择指定的标记
     * 
     * @param {*} marker 
     */
    selectMarker             = marker => {};

    /**
     * 启动动画
     */
    startAnimation           = () => {};

    /**
     * 终止动画
     */
    stopAnimation            = () => {};

    /**
     * 
     * 更新场景的变换组件
     * 
     * @param {*} now 
     */
    updateSceneTransformer   = now => {};

    /**
     * 下一帧执行渲染
     */
    renderNextFrame          = () => {};

    /**
     * 关闭动画编辑器
     */
    close                    = () => {};
}
