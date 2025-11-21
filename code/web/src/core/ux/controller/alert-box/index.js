
import AlertBox from './v';

/**
 * 
 * icon success'|'info'|'warn'|'error'
 * text_content 
 * text_content_token 
 * {Function} callback 
 * 
 * @param {*} data 
 * @returns 
 */
export default function(data = {}) {
    data = data || {};

    // 创建
    const box = new AlertBox();

    // 图标
    if (data.icon) {
        box.setStatusIcon(data.icon);
    }

    // 文本
    if (data.text_content_token) {
        box.setTextToken(data.text_content_token);
    } else if (data.text_content) {
        box.setTextData(data.text_content);
    }
    
    // 关闭回调
    if (data.callback) {
        box.setCloseCallback(data.callback);
    }

    // 显示
    box.show();
    
    return box;
}
