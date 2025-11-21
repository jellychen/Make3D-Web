/* eslint-disable no-unused-vars */

import OCCTLoader from '@editor/arena/occt-loader';
import Base       from '../base';
import NavToolbar from './toolbar/v';
import Setter     from './setter/v';

/**
 * 管道工具
 */
export default class EcTube extends Base {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 导航条
     */
    #nav_toolbar;

    /**
     * 设置面板
     */
    #setter;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(coordinator);
        this.#coordinator = coordinator;

        // 设置器
        this.#setter = new Setter(this);
        this.#coordinator.moderator.container.appendChild(this.#setter);

        // 导航条
        this.#nav_toolbar = new NavToolbar(this);
        this.nav.setToolbarContent(this.#nav_toolbar);

        //
        // 加载OCCT内核
        //
        OCCTLoader().then(occt => {});
    }

    /**
     * 
     * 获取类型
     * 
     * @returns 
     */
    getType() {
        return "tube";
    }

    /**
     * 
     * 接收到外部命令
     * 
     * @param {info} object 
     */
    onRecvCommand(info = undefined) {
        ;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
        if (this.#setter) {
            this.#setter.remove();
            this.#setter = undefined;
        }
    }
}
