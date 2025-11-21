/**
 * 
 * 防止被多次调用的函数
 * 
 * @param {*} callback 
 * @returns 
 */
export default function(callback) {
    let called = false;
    return function(...args) {
        if (called) {
            return;
        } else {
            called = true;
            return callback.apply(this, args);
        }
    }
}
