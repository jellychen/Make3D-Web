
/**
 * 内存相关的数据
 */
export default class Mem {
    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 获取内存信息
     */
    get info() {
        const data = performance.memory;
        return [
            data.usedJSHeapSize,
            data.jsHeapSizeLimit
        ];
    }

    /**
     * 获取内存使用率
     */
    get currentUsedPercent() {
        return this.info[0] / this.info[1];
    }

    /**
     * 打印数据
     */
    printfMB() {
        console.log("Use Memory:", this.info[0] / 1024 / 1024);
    }
}
