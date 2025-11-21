
import XThree    from '@xthree/basic';
import Constants from './constants';
import Helper    from './dir-helper';

/**
 * 方向光，默认打开阴影投射
 */
export default class LightDir extends XThree.DirectionalLight {
    /**
     * 成员变量
     */
    #scene;
    #helper;

    /**
     * 
     * 构造函数
     * 
     * @param {*} scene 
     */
    constructor(scene) {
        super();
        this.#scene                       = scene;
        this.distance                     = 0;
        this.matrixAutoUpdate             = false;
        this.target.matrixWorldAutoUpdate = false;
        this.target.matrixAutoUpdate      = false;
        this.castShadow                   = true;
        this.matrix.identity();
        this.resetShadowConf(false);
    }

    /**
     * 重置
     */
    resetShadowConf(render_next_frame = true) {
        this.shadow.camera.near    = Constants.DEFAULT_SHADOW_CAMERA_NEAR;
        this.shadow.camera.far     = Constants.DEFAULT_SHADOW_CAMERA_FAR;
        this.shadow.camera.right   = Constants.DEFAULT_SHADOW_CAMERA_RIGHT;
        this.shadow.camera.left    = Constants.DEFAULT_SHADOW_CAMERA_LEFT;
        this.shadow.camera.top	   = Constants.DEFAULT_SHADOW_CAMERA_TOP;
        this.shadow.camera.bottom  = Constants.DEFAULT_SHADOW_CAMERA_BOTTOM;
        this.shadow.mapSize.width  = Constants.DEFAULT_SHADOW_CAMERA_MAPSIZE_WIDTH;
        this.shadow.mapSize.height = Constants.DEFAULT_SHADOW_CAMERA_MAPSIZE_HEIGHT;
        this.shadow.radius         = Constants.DEFAULT_SHADOW_CAMERA_RADIUS;
        this.shadow.bias           = Constants.DEFAULT_SHADOW_CAMERA_BIAS_LIGHT_DIR;

        if (render_next_frame) {
            this.requestAnimationFrameIfNeed();
        }
    }

    /**
     * 
     * 获取类型
     * 
     * @returns 
     */
    getType() {
        return this.type;
    }

    /**
     * 
     * 克隆
     * 
     * @returns 
     */
    clone() {
        const object = new LightDir(this.#scene);
        object.copy(this, false);
        return object;
    }

    /**
     * 
     * 设置开启辅助线
     * 
     * @param {boolean} enable 
     */
    setEnableHelper(enable) {
        const scene = this.getRoot();
        if (!(scene instanceof XThree.Scene)) {
            return false;
        }

        if (false === enable) {
            if (this.#helper) {
                this.#helper.removeFromParentAndDispose();
                this.#helper = undefined;
                scene.requestAnimationFrameIfNeed();
            }
        } else {
            if (!this.#helper) {
                this.#helper = new Helper(this);
                scene.getCollaborator().add(this.#helper);
                scene.requestAnimationFrameIfNeed();
            }
        }
        return true;
    }

    /**
     * 
     * 如果存在helper 更新辅助
     * 
     * @returns 
     */
    updateHelperIfHas() {
        if (!this.#helper) {
            return false;
        }

        const scene = this.getRoot();
        if (!(scene instanceof XThree.Scene)) {
            this.#helper.removeFromParentAndDispose();
            this.#helper = undefined;
        } else {
            this.#helper.update();
        }
        return true;
    }

    /**
     * 
     * 动态修改颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.color.setHex(color);
        this.requestAnimationFrameIfNeed();
    }

    /**
     * 
     * 设置颜色的能量
     * 
     * @param {Number} value 
     */
    setIntensity(value) {
        this.intensity = value;
        this.requestAnimationFrameIfNeed();
    }

    /**
     * 
     * 打开光源投射
     * 
     * @param {Boolean} enable 
     */
    setEnableCastShadow(enable) {
        this.castShadow = enable;
        this.requestAnimationFrameIfNeed();
    }

    /**
     * 在场景中就执行次帧重绘
     */
    requestAnimationFrameIfNeed() {
        this.#scene.requestAnimationFrameIfNeed();
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
        this.setEnableHelper(false);
    }
}
