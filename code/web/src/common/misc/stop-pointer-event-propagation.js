/**
 * 事件冒泡
 */
const __stop_propagation_callback = (event) => {
    event.stopPropagation();
};

/**
 * 
 * 拦截事件
 * 
 * @param {*} element 
 * @param {boolean} enable 
 */
export default function(element, enable) {
    if (true === enable) {
        element.addEventListener   ('pointerdown'  , __stop_propagation_callback);
        element.addEventListener   ('pointerup'    , __stop_propagation_callback);
        element.addEventListener   ('pointermove'  , __stop_propagation_callback);
        element.addEventListener   ('pointercancel', __stop_propagation_callback);
        element.addEventListener   ('wheel'        , __stop_propagation_callback);
    } else {
        element.removeEventListener('pointerdown'  , __stop_propagation_callback);
        element.removeEventListener('pointerup'    , __stop_propagation_callback);
        element.removeEventListener('pointermove'  , __stop_propagation_callback);
        element.removeEventListener('pointercancel', __stop_propagation_callback);
        element.removeEventListener('wheel'        , __stop_propagation_callback);
    }
}
