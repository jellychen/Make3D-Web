
/**
 * 需要拦截的事件
 */
const eventsToIntercept = [
    // 鼠标事件
    'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'contextmenu',
    
    // 键盘事件
    'keydown', 'keyup', 'keypress',
    
    // 输入、焦点事件
    'input', 'change', 'focus', 'blur',
    
    // 触摸事件
    'touchstart', 'touchend', 'touchmove',
    
    // 剪贴板事件
    'copy', 'paste', 'cut',

    // 拖拽事件
    'dragstart', 'drop', 'dragover',
];

/**
 * 
 * 事件回调函数
 * 
 * @param {*} event 
 */
const callback = event => {
    event.preventDefault();                 // 阻止默认行为
    event.stopPropagation();                // 阻止向下传递
    event.stopImmediatePropagation();       // 阻止其他监听器执行
};

/**
 * 拦截全部的事件
 */
export default class DocumentEventInterceptStop {
    /**
     * 
     * 是否开启
     * 
     * @param {*} enable 
     */
    static Enable(enable) {
        if (enable) {
            for (const e of eventsToIntercept) {
                document.addEventListener   (e, callback, true);
            }
        } else {
            for (const e of eventsToIntercept) {
                document.removeEventListener(e, callback, true);
            }
        }
    }
}
