
import isString  from 'lodash/isString';
import ToastWarn from "./v";

/**
 * 
 * 显示
 * 
 * @param {*} data 
 * @returns 
 */
export default function(data) {
    const toast = new ToastWarn();
    if (isString(data.token)) {
        toast.setLabelToken(data.token);
    } else if (isString(data.data)) {
        toast.setLabelData(data.data);
    }
    document.body.appendChild(toast);
    return toast;
}
