
import LightDir           from './dir';
import LightPoint         from './point';
import LightSpot          from './spot';
import LightHolder        from './light-holder';
import AssociateContainer from './associate-container';

/**
 * 灯光创建
 */
export default class Supervisor {
    /**
     * 成员变量
     */
    #scene;
    #associate_container = new AssociateContainer();

    /**
     * 获取池子
     */
    get container() {
        return this.#associate_container;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} scene 
     */
    constructor(scene) {
        this.#scene = scene;
    }

    /**
     * 平行方向光
     */
    dir() {
        return new LightHolder(new LightDir(this.#scene), this.#associate_container);
    }

    /**
     * 点光源
     */
    point() {
        return new LightHolder(new LightPoint(this.#scene), this.#associate_container);
    }

    /**
     * 聚光灯
     */
    spot() {
        return new LightHolder(new LightSpot(this.#scene), this.#associate_container);
    }

    /**
     * 
     * 获取容器
     * 
     * @returns 
     */
    getAssociateContainer() {
        return this.#associate_container;
    }

    /**
     * 更新
     */
    update() {
        this.#associate_container.update();
    }
}
