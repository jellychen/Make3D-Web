/* eslint-disable no-unused-vars */

import Base from '../base';

/**
 * 默认参数
 */
const DEFAULT_COLOR     = 0xFFFFFF;
const DEFAULT_INTENSITY = 10.0;
const DEFAULT_DISTANCE  = 0;
const DEFAULT_ANGLE     = Math.PI / 4;

/**
 * light spot
 */
export default class LightSpot extends Base {
    /**
     * 灯光
     */
    #light_holder;
    #light;

    /**
     * 
     * 构造函数
     * 
     * @param {*} ec 
     * @param {*} coordinator 
     * @param {*} assistor 
     */
    constructor(ec, coordinator, assistor) {
        super(ec, coordinator, assistor);
    }

    /**
     * 启动
     */
    start() {
        super.start();
        const cinderella   = this.cinderella;
        const creator      = cinderella.getLightSupervisor();
        this.#light_holder = creator.spot();
        this.#light        = this.#light_holder.light;

        // 设置默认
        this.#light.setColor(DEFAULT_COLOR);
        this.#light.setIntensity(DEFAULT_INTENSITY);
        this.#light.setDistance(DEFAULT_DISTANCE);
        this.#light.setAngle(DEFAULT_ANGLE);
        this.#light.setEnableCastShadow(true);

        // 添加
        this.historical_recorder.beginGroup();
        this.scene.add(this.#light_holder);
        this.historical_recorder.deleteObject(this.#light_holder);
        this.historical_recorder.saveSelectorContainer();
        this.selected_container.replace(this.#light_holder);
        this.historical_recorder.endGroup();

        this.coordinator.updateTransformer();
        this.coordinator.markTreeViewNeedUpdate(true);
        this.coordinator.renderNextFrame();
    }
}
