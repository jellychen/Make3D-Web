
import Bowser   from 'bowser';
import Notifier from '@common/misc/notifier';

/**
 * 获取浏览器的信息
 */
const browser = Bowser.getParser(window.navigator.userAgent).parsedResult;

/**
 * 用来拦截一些默认的系统事件
 */
export default class SystemEventInterceptor {
    /**
     * 拦截Ctrl+S
     */
    #interceptor_save;

    /**
     * 保存回调的函数
     */
    onsave;

    /**
     * 构造函数
     */
    constructor() {
        /**
         * 禁用页面的ctrl功能，来禁止ctrl+s保存功能
         */
        this.#interceptor_save = (e) => {
            if (e.code === 'KeyS') {
                if ("macOS" === browser.os.name && e.metaKey) {
                    if (this.onsave) {
                        this.onsave();
                    }
                    e.preventDefault();
                } else if (e.ctrlKey) {
                    if (this.onsave) {
                        this.onsave();
                    }
                    e.preventDefault();
                }
                Notifier.dispatch(':save', {});
            }
        };
    }

    /**
     * 
     * 开启或者关闭
     * 
     * @param {Boolean} value 
     */
    enable(value) {
        if (true === value) {
            window.addEventListener('keydown',    this.#interceptor_save);
        } else {
            window.removeEventListener('keydown', this.#interceptor_save);
        }
    }
}
