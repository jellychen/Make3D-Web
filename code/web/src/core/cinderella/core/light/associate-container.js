import { isFunction } from "lodash";

/**
 * 容器
 */
export default class AssociateContainer {
    /**
     * 成员变量
     */
    #array        = [];
    #is_disposing = false;

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * 添加容器
     * 
     * @param {*} light 
     */
    add(light) {
        if (!light) {
            return;
        }
        this.#array.push(light);
    }

    /**
     * 
     * 删除指定的灯光
     * 
     * @param {*} light 
     */
    del(light) {
        if (this.#is_disposing || !light) {
            return;
        }
        
        const index = this.#array.indexOf(light);
        if (index !== -1) {
            this.#array.splice(index, 1);
        }
    }

    /**
     * 
     * 获取全部的灯光
     * 
     * @returns 
     */
    all() {
        return this.#array;
    }

    /**
     * 关闭全部的灯光的辅助
     */
    dismissAllHelper() {
        for (const item of this.#array) {
            item.setEnableHelper(false);
        }
    }

    /**
     * 备份和设置
     */
    bckAndSetLightHolderHidden() {
        for (const light of this.#array) {
            light.userData.__$$_bck_visible__ = light.visible;
            light.visible = false;
        }
    }

    /**
     * 恢复
     */
    restoreLightHolderVisible() {
        for (const light of this.#array) {
            light.visible = light.userData.__$$_bck_visible__;
        }
    }

    /**
     * 对每个进行更新
     */
    update() {
        for (const light of this.#array) {
            light.update();
            light.updateHelperIfHas();
        }
    }

    /**
     * 
     * 用户选择发生变化
     * 
     * @param {*} selected_container 
     */
    onSelectedChange(selected_container) {
        if (selected_container.count() != 1) {
            this.dismissAllHelper();
        } else {
            const selected = selected_container.getOneValue();
            if (selected.is_light_placeholder) {
                if (isFunction(selected.setEnableHelper)) {
                    selected.setEnableHelper(true);
                }
            } else {
                this.dismissAllHelper();
            }
        }
    }

    /**
     * 销毁全部的数据
     */
    dispose() {
        this.#is_disposing = true;
        for (const i in this.#array) {
            this.#array[i].dispose();
        }
        this.#array = [];
        this.#is_disposing = false;
    }
}
