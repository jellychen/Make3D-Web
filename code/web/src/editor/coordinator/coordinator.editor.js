
import isString    from 'lodash/isString';
import EcCreator   from '../component/ec/creator';
import Coordinator from './coordinator';

/**
 * Mixin
 */
Object.assign(Coordinator.prototype, {
    /**
     * 
     * 设置编辑的模式
     * 
     * scene            // 场景模式
     * modifier         // 修改器
     * editor           // 编辑器
     * boolean          // 布尔
     * sculptor         // 雕刻
     * uv               // UV
     * simulator        // 模拟器
     * 
     * @param {string} token 
     */
    setEditorMode(token) {
        if (!isString(token)) {
            return;
        }

        if (this.ec_mode === token) {
            return;
        } else {
            this.ec_mode = token;
        }

        // 调整Nav的显示逻辑
        if (this.nav) {
            this.nav.setEditorMode(token);
        }

        // 调整编辑器逻辑
        if (this.ec) {
            this.ec.dispose();
            this.ec = undefined;
        }

        // 创建新的EC
        this.ec = EcCreator(token, this);

        // 发送事件
        this.dispatchEvent('mode-changed', token);
    }
});
