
import isNumber   from 'lodash/isNumber';
import isFunction from 'lodash/isFunction';

/**
 * 引用计数
 */
export default class RefCount {
    /**
     * 所属对象
     */
    #host;
    #count = 1;

    /**
     * 销毁函数
     */
    #destructor;

    /**
     * 获取宿主对象
     */
    get host() {
        return this.#host;
    }

    /**
     * 获取引用计数
     */
    get count() {
        return this.#count;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     * @param {*} init_ref_count 
     * @param {*} destructor 
     */
    constructor(host = undefined, init_ref_count = 1, destructor = undefined) {
        this.#host       = host;
        this.#count      = isNumber(init_ref_count) ? init_ref_count : 1;
        this.#destructor = destructor;
    }

    /**
     * 添加引用计数
     */
    addRef() {
        this.#count++;
    }

    /**
     * 删除引用计数
     */
    delRef() {

        this.#count--;

        if (this.#count <= 0) {
            if (isFunction(this.#destructor)) {
                this.#destructor(this.#host);
            }
            
            //
            // 如果有 __destructor__ 就调用
            //
            if (this.#host && isFunction(this.#host.__$$_destructor__)) {
                this.#host.__$$_destructor__();
            }
        }
    }
}
