/* eslint-disable no-unused-vars */

/**
 * 用来维护深度缓存
 * 
 * 只有在2种情况下需要更新
 *      1. GEO 发生了变化
 *      2. 相机变化
 */
export default class DepthBufferMaintainer {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 渲染器
     */
    #cinderella;

    /**
     * 场景
     */
    #arena;

    /**
     * 记录捕获深度是的相机数据版本
     */
    #depth_capture_camera_version = 0;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} arena 
     */
    constructor(coordinator, arena) {
        this.#coordinator = coordinator;
        this.#arena       = arena;
        this.#cinderella  = coordinator.cinderella;
    }

    /**
     * 
     * 捕获深度并同步读取
     * 
     * 只有场景发生变化，或者相机参数发生变化
     * 
     * @returns 
     */
    captureAndSyncReadBufferIfNeed() {
        const camera     = this.#cinderella.getCamera();
        const version    = camera.version;
        let need_rebuild = this.#arena.isDepthBufferDirty;
        if (this.#depth_capture_camera_version != version) {
            need_rebuild = true;
        }

        if (!need_rebuild) {
            return false;
        }
        
        this.#depth_capture_camera_version = version;
        this.#arena.depthBufferCaptureAndAsyncReadBuffer(camera);
        return true;
    }
}
