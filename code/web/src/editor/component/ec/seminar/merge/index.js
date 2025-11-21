/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';
import Base   from '../base';
import Arena  from './v-arena';

/**
 * 融合
 */
export default class EcMerge extends Base {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * arena
     */
    #arena;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(coordinator);
        this.#coordinator = coordinator;
        this.setEnableCustomizeMenu(true);

        //
        // 显示
        //
        this.#arena = new Arena(this.#coordinator, this);
        this.#arena.show(document.body);
    }

    /**
     * 
     * 获取类型
     * 
     * @returns 
     */
    getType() {
        return "merge";
    }

    /**
     * 回滚到默认的模式
     */
    returnToDefaultEditeMode() {
        this.nav.setEditorModeDefault();
    }

    /**
     * 下一帧渲染
     */
    renderNextFrame() {
        this.#coordinator.renderNextFrame();
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();

        // 销毁菜单回调
        this.setEnableCustomizeMenu(false);
    }
}

