/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 临时变量
 */
const _mat4_0 = new XThree.Matrix4();
const _mat4_1 = new XThree.Matrix4();
const _mat4_2 = new XThree.Matrix4();

/**
 * Mixin
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 
     * 获取自己的位置
     * 
     * @returns 
     */
    getIndex() {
        if (!this.parent) {
            return -1;
        }
        return this.parent.getChildIndex(this);
    },

    /**
     * 
     * 获取 child 的索引
     * 
     * @param {*} child 
     */
    getChildIndex(child) {
        return this.children.indexOf(child);
    },

    /**
     *
     * 判断 object 是不是当前元素的祖先
     *  
     * @param {*} object 
     */
    isAncestor(object) {
        let parent = this.parent;
        while (parent) {
            if (object == parent) {
                return true;
            }
            parent = parent.parent;
        }
        return false;
    },

    /**
     * 
     * 在自己的基础上面构建一个群组
     * 
     * @param {*} reason 
     * @returns 
     */
    createFolder(reason) {
        if (!this.parent) {
            return false;
        }
        
        const parent = this.parent;
        const index  = parent.children.indexOf(this);
        this.parent  = null;
        const group  = new XThree.Group();
        group.add(this);
        group.parent = parent;
        parent.children[index] = group;
        
        return true;
    },

    /**
     * 
     * 插入到最前面
     * 
     * @param {*} reason 
     * @param {*} will_insert 
     * @returns 
     */
    insertFront(reason, will_insert) {
        if (!will_insert || this == will_insert) {
            return false;
        }

        //
        // 防止出现死循环
        // 如果 this 是 will_insert 的孩子
        // 
        if (this.isAncestor(will_insert)) {
            return false;
        }

        will_insert.willbeChildOf(reason, this);

        if (0 == this.children.length) {
            this.add(will_insert);
        } else {
            will_insert.removeFromParent();
            will_insert.parent = this;
            this.children.splice(0, 0, will_insert);
        }

        return true;
    },

    /**
     * 
     * 插入后面
     * 
     * @param {*} reason 
     * @param {*} will_insert 
     * @returns 
     */
    insertBack(reason, will_insert) {
        if (!will_insert || this == will_insert) {
            return false;
        }

        //
        // 防止出现死循环
        // 如果 this 是 will_insert 的孩子
        // 
        if (this.isAncestor(will_insert)) {
            return false;
        }

        will_insert.willbeChildOf(reason, this);
        this.add(will_insert);
        
        return true;
    },

    /**
     * 
     * 插入到指定的元素前面
     * 
     * @param {*} reason 
     * @param {*} child 
     * @param {*} will_insert 
     * @returns 
     */
    insertBefore(reason, child, will_insert) {
        if (!child || !will_insert || child == will_insert) {
            return false;
        }

        if (this == child || this == will_insert) {
            return false;
        }

        //
        // 防止出现死循环
        // 如果 this 是 will_insert 的孩子
        // 
        if (this.isAncestor(will_insert)) {
            return false;
        }

        // 防止 child 和 will_insert 在一个children中
        const index_0 = this.children.indexOf(child);
        if (index_0 < 0) {
            return false;
        }

        const index_1 = this.children.indexOf(will_insert);

        will_insert.willbeChildOf(reason, this);
        will_insert.removeFromParent();
        will_insert.parent = this;

        if (index_1 >= 0 && index_0 > index_1) {
            this.children.splice(index_0 - 1, 0, will_insert);
        } else {
            this.children.splice(index_0, 0, will_insert);
        }

        return true;
    },

    /**
     * 
     * 插入到指定的元素后面
     * 
     * @param {*} reason 
     * @param {*} child 
     * @param {*} will_insert 
     * @returns 
     */
    insertAfter(reason, child, will_insert) {
        if (!child || !will_insert || child == will_insert) {
            return false;
        }

        if (this == child || this == will_insert) {
            return false;
        }

        //
        // 防止出现死循环
        // 如果 this 是 will_insert 的孩子
        // 
        if (this.isAncestor(will_insert)) {
            return false;
        }

        // 防止 child 和 will_insert 在一个children中
        const index_0 = this.children.indexOf(child);
        if (index_0 < 0) {
            return false;
        }

        const index_1 = this.children.indexOf(will_insert);

        will_insert.willbeChildOf(reason, this);
        will_insert.removeFromParent();
        will_insert.parent = this;

        if (index_1 >= 0 && index_0 > index_1) {
            this.children.splice(index_0, 0, will_insert);
        } else {
            this.children.splice(index_0 + 1, 0, will_insert);
        }

        will_insert.parent = this;

        return true;
    },

    /**
     * 
     * 自己将要会成为object的孩子
     * 
     * @param {*} reason 
     * @param {*} object 
     */
    willbeChildOf(reason, object) {
        const wm0 = this  .getMatrixWorld(true);
        const wm1 = object.getMatrixWorld(true);

        // wm1 右乘 this.matrix = wm0
        // this.matrix = wm1逆 * wm0
        this.notifyTransformWillChanged(reason);
        _mat4_0.copy(wm1).invert();
        this.matrix.identity().premultiply(wm0).premultiply(_mat4_0);
        this.decompose();
        this.notifyTransformChanged(reason);
    }
});
