/* eslint-disable no-unused-vars */

import EditorWindow from "./editor"

/**
 * 导出
 */
export default new class {
    /**
     * 
     * 打开主页
     * 
     * @returns 
     */
    gotoDashboard() {
        return true;
    }

    /**
     * 
     * 启动一个新的编辑器窗口
     * 
     * @returns 
     */
    startNewEditor() {
        return new EditorWindow();
    }
}
