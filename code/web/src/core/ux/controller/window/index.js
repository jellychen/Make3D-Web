/* eslint-disable no-unused-vars */

import Window from './v';

/**
 * 
 * 打开新的窗口
 * 
 * @param {*} data 
 * @param {*} parent_node 
 */
export default function(data, parent_node = undefined) {
    data = data || {};

    // 构建一个窗口
    const window = new Window();

    // 设置窗体风格
    // normal|glass
    if (data.style) {
        window.setWindowStyle(data.style);
    }

    // title
    if (data.title_data) {
        window.setTitle(data.title_data);
    } else if (data.title_token) {
        window.setTitleToken(data.title_token);
    }

    // 加载loading 
    if (data.loading) {
        window.setContentLoading();
    }

    // 关闭监听函数
    if (data.on_close) {
        window.onclose = data.on_close;
    }

    // 内容元素
    if (data.content) {
        window.setContent(data.content);
    }

    // 显示
    window.show(true, parent_node);

    return window;
}