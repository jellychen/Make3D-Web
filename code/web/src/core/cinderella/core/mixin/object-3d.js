/* eslint-disable no-unused-vars */

import isBoolean   from 'lodash/isBoolean';
import isFunction  from 'lodash/isFunction';
import isString    from 'lodash/isString';
import XThree      from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 
     * 请求在下一帧重绘
     * 
     * @returns 
     */
    requestRenderNextFrame() {
        const root = this.getRoot();
        if (root && isFunction(root.requestAnimationFrameIfNeed)) {
            try {
                root.requestAnimationFrameIfNeed();
            } catch (e) {
                console.error(e);
            }
            return true;
        }
    },

    /**
     * 
     * 获取弱引用
     * 
     * @returns 
     */
    getWeakRef() {
        if (!this.userData.__$$_weak_ref__) {
            this.userData.__$$_weak_ref__ = new WeakRef(this);
        }
        return this.userData.__$$_weak_ref__;
    },

    /**
     * 
     * 获取详细的类型
     * 
     * unknown
     * 
     * object
     * object-group
     * points
     * line
     * line-segments
     * line-loop
     * mesh
     * sprite
     * bone
     * skinned-mesh
     * lod
     * 
     * @returns 
     */
    getDetailType() {
        if ('Object3D'            == this.type) {
            return "object";
        } else if ('Group'        == this.type) {
            return "object-group";
        } else if ('Points'       == this.type) {
            return "points";
        } else if ('Line'         == this.type) {
            return "line";
        } else if ('LineSegments' == this.type) {
            return "line-segments";
        } else if ('LineLoop'     == this.type) {
            return "line-loop";
        } else if ('Mesh'         == this.type) {
            return "mesh";
        } else if ('Sprite'       == this.type) {
            return "sprite";
        } else if ('Bone'         == this.type) {
            return "bone";
        } else if ('SkinnedMesh'  == this.type) {
            return "skinned-mesh";
        } else if ('LOD'          == this.type) {
            return "lod";
        } else {
            return "unknown";
        }
    },

    /**
     * 
     * 判断可见性
     * 
     * @returns 
     */
    isVisible(recursion = false) {
        if (!recursion) {
            return this.visible;
        }

        if (!this.visible) {
            return false;
        }

        if (this.parent) {
            return this.parent.isVisible(true);
        }
        return true;
    },

    /**
     * 
     * 获取名称
     * 
     * @returns 
     */
    getName() {
        if (this instanceof XThree.Scene) {
            return 'Scene';
        }
        return isString(this.name)? this.name: "";
    },

    /**
     * 
     * 有名称返回名称，否则返回UUID
     * 
     * @returns 
     */
    getNameOrUUID() {
        const name = this.getName();
        if (name && '' !== name) {
            return name;
        }
        return isString(this.uuid)? this.uuid: "";
    },

    /**
     * 
     * 有名称就返回名称，否则返回类型
     * 
     * @returns 
     */
    getNameOrTypeAsName() {
        const name = this.getName();
        if (name && '' !== name) {
            return name;
        }
        return this.type;
    },

    /**
     * 
     * 获取当前元素的UUID
     * 
     * @returns 
     */
    getUUID() {
        return this.uuid;
    },

    /**
     * 
     * 重置几何包围盒
     * 
     * @param {Boolean} calc 
     */
    resetGeometryBoundingBoxIfHas(calc = false) {
        if (!(this instanceof XThree.Mesh)) {
            return false;
        }

        if (!this.geometry) {
            return false;
        }

        this.geometry.resetBoundingBox(calc);
        return true;
    },

    /**
     * 获取当前几何的包围盒
     */
    getGeometryBoundingBoxIfHas() {
        if (!(this instanceof XThree.Mesh)) {
            return null;
        }

        if (!this.geometry) {
            return null;
        }
        return this.geometry.getBoundingBox();
    },

    /**
     * 
     * 判断元素是不是在场景中
     * 
     * @returns Boolean
     */
    isInScene() {
        return this.getRoot() instanceof XThree.Scene;
    },

    /**
     * 
     * 获取父亲
     * 
     * @returns 
     */
    getParent() {
        return this.parent;
    },

    /**
     * 
     * 把自己从父亲中移除
     * 
     * @returns 
     */
    removeFromParent() {
        if (this.parent) {
            this.parent.remove(this);
            return true;
        }
        return false;
    },

    /**
     * 
     * 获取根节点
     * 
     * @returns 
     */
    getRoot() {
        let parent = this;
        while (parent.parent) {
            parent = parent.parent;
        }
        return parent;
    },

    /**
     * 
     * 获取场景
     * 
     * @returns 
     */
    getScene() {
        const root = this.getRoot();
        if (root instanceof XThree.Scene) {
            return root;
        }
    },

    /**
     * 判断是不是容器
     */
    isContainer() {
        return this instanceof XThree.Group || this instanceof XThree.Scene;
    },

    /**
     * 判断是不是存在孩子
     */
    hasChildren() {
        return this.children.length > 0;
    },

    /**
     * 
     * 获取孩子
     * 
     * @returns 
     */
    getChildren() {
        return this.children;
    },

    /**
     * 
     * 如果设置了 overall
     * 
     * 代表当前元素和孩子会被当成一个整体，用来给TreeView会用一项来显示
     * 
     */
    isOverall() {
        return this.userData.overall;
    },

    /**
     * 
     * 设置 overall
     * 
     * @param {*} overall 
     */
    setOverall(overall) {
        this.userData.overall = overall;
    },

    /**
     * 
     * 判断是不是被折叠
     * 
     * @param {*} recursion 递归判断
     * @returns 
     */
    isFolded(recursion = false) {
        if (!recursion) {
            return !!this.userData.folded;
        }

        if (this.userData.folded) {
            return true;
        }

        if (this.parent) {
            return this.parent.isFolded(recursion);
        }

        return false;
    },

    /**
     * 
     * 设置是不是被折叠
     * 
     * @param {Boolean} folded 
     */
    setFolded(folded) {
        this.userData.folded = true === folded;
    },

    /**
     * 递归展开 
     */
    setUnfoldedRecursion() {
        if (isBoolean(this.userData.folded)) {
            this.userData.folded = false;
        }

        if (this.parent) {
            this.parent.setUnfoldedRecursion();
        }
    },
});
