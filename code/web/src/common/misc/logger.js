
/**
 * 日志统一入口
 */
export default {
    /**
     * 
     * 日志
     * 
     * @param  {...any} arguments 
     */
    log(...params) {
        if (this.onlog) {
            this.onlog(...params);
        } else {
            console.log(...params);
        }
    },

    /**
     * 
     * 信息
     * 
     * @param  {...any} params 
     */
    info(...params) {
        if (this.oninfo) {
            this.oninfo(...params);
        } else {
            console.info(...params);
        }
    },

    /**
     * 
     * 警告
     * 
     * @param  {...any} params 
     */
    warn(...params) {
        if (this.onwarn) {
            this.onwarn(...params);
        } else {
            console.warn(...params);
        }
    },

    /**
     * 
     * 错误
     *  
     * @param  {...any} params 
     */
    error(...params) {
        if (this.onerror) {
            this.onerror(...params);
        } else {
            console.error(...params);
        }
    },

    /**
     * 
     * 加载url
     * 
     * @param  {...any} params 
     */
    logLoadUrl(...params) {
        if (this.onloadurl) {
            this.onloadurl(...params);
        } else {
            console.log('load url:', ...params);
        }
    },

    /**
     * 
     * 加载URL成功
     * 
     * @param  {...any} params 
     */
    logLoadUrlSuccess(...params) {
        if (this.onloadurlsucess) {
            this.onloadurlsucess(...params);
        } else {
            console.log('load url success:', ...params);
        }
    },

    /**
     *
     * 加载URL失败
     *  
     * @param  {...any} params 
     */
    logLoadUrlFail(...params) {
        if (this.onloadurlfail) {
            this.onloadurlfail(...params);
        } else {
            console.log('load url fail:', ...params);
        }
    },
};
