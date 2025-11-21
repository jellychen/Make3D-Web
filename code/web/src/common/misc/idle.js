
import isFunction from "lodash/isFunction";

/**
 * 任务池
 */
const _idle_queue = [];

/**
 * 
 * @param {function} task 
 */
export default function(task) {
    if (!isFunction(task)) {
        return;
    }

    if (_idle_queue.length == 0) {
        requestIdleCallback(() => {
            while (_idle_queue.length > 0) {
                const callback = _idle_queue.pop();
                try {
                    callback();
                } catch(e) {
                    console.error(e);
                }
            }
        });
    }
    _idle_queue.push(task);
}
