/* eslint-disable no-unused-vars */

import isFunction  from 'lodash/isFunction';
import GlobalScope from '@common/global-scope';

/**
 * 用来存放可编辑态的数据
 */
export default class EditableMesh_Bucket {
    /**
     * 存储soup
     */
    #soup;

    /**
     * 获取soup
     */
    get soup() {
        return this.#soup;
    }

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * 是否存在Soup
     * 
     * @returns 
     */
    hasSoup() {
        return this.#soup;
    }

    /**
     * 
     * 设置Soup
     * 
     * @param {*} soup 
     */
    setSoup(soup) {
        if (this.#soup == soup) {
            return;
        }

        this.disposeSoup();
        
        if (soup) {
            this.#soup = soup.clone();
        }
    }

    /**
     * 
     * 转移soup的所有权
     * 
     * @returns 
     */
    transferSoupOwnership() {
        const soup = this.#soup;
        this.#soup = undefined;
        return soup;
    }

    /**
     * 销毁soup
     */
    disposeSoup() {
        if (!this.#soup) {
            return;
        }

        if (isFunction(this.#soup.dispose)) {
            this.#soup.dispose();
        }

        if (isFunction(this.#soup.delete)) {
            this.#soup.delete();
        }

        this.#soup = undefined;
    }

    /**
     * 
     * 拷贝
     * 
     * @param {*} deep 
     * @returns 
     */
    clone(deep = true) {
        if (deep) {
            const Chameleon = GlobalScope.Chameleon;
            const {
                GeoSolidSoup,
            } = Chameleon;

            //
            // 构建
            //
            const bucket = new EditableMesh_Bucket();
            if (this.#soup) {
                const copyed = GeoSolidSoup.MakeShared();
                this.#soup.cloneTo(copyed.getPtr());
                bucket.setSoup(copyed);

                //
                // 销毁
                // setSoup 本身会增加引用计数
                // 所以这里需要释放
                //
                copyed.delete();
            }
            return bucket;
        } else {
            this.__$$_add_ref__();
            return this;
        }
    }

    /**
     * 销毁
     */
    dispose() {
        this.disposeSoup();
    }
}
