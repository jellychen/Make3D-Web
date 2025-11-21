
import isUndefined from "lodash/isUndefined";
import Serializer  from "@core/serializer";

/**
 * m3d模型加载
 */
export default class M3dLoader {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 场景
     */
    #scene;

    /**
     * 构造函数
     */
    constructor(coordinator, scene) {
        this.#coordinator = coordinator;
        this.#scene = scene;
    }

    /**
     * 
     * @param {*} file 
     */
    async load_M3d(file) {
        const m3d_arraybuffer = new Serializer.M3dArrayBuffer();
        await m3d_arraybuffer.loadBlob(file);
        const buffer = m3d_arraybuffer.getContentArrayBuffer();
        if (!buffer) {
            return;
        }
        
        //
        // 加载开始
        //
        const builder = new Serializer.Builder(buffer);
        if (!await builder.load()) {
            builder.dispose();
            return;
        }

        //
        // 添加到场景中
        //
        const group = builder.getRootAsGroup();
        if (isUndefined(group)) {
            return;
        }

        //
        // 更新uuid, 防止冲突
        //
        group.updateUUID();

        this.#scene.add(group);
        this.#coordinator.markTreeViewNeedUpdate(true);
        this.#coordinator.renderNextFrame();
    }
}
