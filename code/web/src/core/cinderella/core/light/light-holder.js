
import isFunction       from 'lodash/isFunction';
import XThree           from '@xthree/basic';
import XThreeRenderable from '@xthree/renderable';

/**
 * 基础参数
 */
const LOCATGION_MIN = -3; // 灯光的位置随机的范围
const LOCATGION_MAX = +3; // 灯光的位置随机的范围

const vec3_0 = new XThree.Vector3(0, 0, 0);
const vec3_1 = new XThree.Vector3(0, 0, 0);
const vec3_2 = new XThree.Vector3(0, 0, 0);
const vec3_3 = new XThree.Vector3(0, 0, 0);
const vec3_4 = new XThree.Vector3(0, 0, 0);
const mat4_0 = new XThree.Matrix4();
const ray    = new XThree.Ray();

/**
 * Light Holder
 */
export default class LightHolder extends XThree.Group {
    /**
     * 容器
     */
    #associate_container;

    /**
     * 灯光的图标
     */
    #icon = new XThreeRenderable.LightIcon();

    /**
     * 存储的灯光
     */
    #light;

    /**
     * 获取
     */
    get light() {
        return this.#light;
    }

    /**
     * 类型
     */
    get is_light_placeholder() {
        return true;
    }

    /**
     * 获取
     */
    get object() {
        return this.#light;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} light 
     * @param {*} associate_container 
     */
    constructor(light, associate_container) {
        super();
        this.setOverall(true);
        this.add(light);
        this.add(this.#icon);
        this.type                 = light.type;
        this.#light               = light;
        this.#light.setEnableSelectable(false);
        this.#icon .setEnableSelectable(false);
        this.#icon.castShadow     = false;
        this.#associate_container = associate_container;
        this.#associate_container.add(this);

        // 监听
        this.#light.addEventListener('light-after-changed', () => {
            this.#icon.setColor(this.#light.color.getHex());
        });

        // 初始化位置
        {
            const x = Math.Random(LOCATGION_MIN, LOCATGION_MAX);
            const y = Math.Random(LOCATGION_MIN, LOCATGION_MAX);
            const z = Math.Random(0            , LOCATGION_MAX);
            this.setPosition(x, y, z);
            this.setLookAt(0, 0, 0);
        }
    }

    /**
     * 
     * 重写射线拾取
     * 
     * @param {*} raycaster 
     * @param {*} intersects 
     */
    raycast(raycaster, intersects) {
        if (!raycaster.isolate) {
            return;
        }

        vec3_0.set(0, 0, 0);
        vec3_1.set(0, 0, 0);
        mat4_0.copy(this.matrixWorld).invert();
        ray   .copy(raycaster.ray).applyMatrix4(mat4_0);
        vec3_2.copy(ray.direction).normalize();
        vec3_1.sub (ray.origin);
        const distance = vec3_1.dot(vec3_2);
        if (distance < 0) {
            return;
        }

        vec3_3.set(0, 0, 0);
        vec3_3.applyMatrix4(this.matrixWorld);
        vec3_4.copy(vec3_3);
        vec3_4.project(raycaster.camera);
        const x0 = (vec3_4.x + 1.0) * 0.5 * raycaster.isolate.w;
        const y0 = (1.0 - vec3_4.y) * 0.5 * raycaster.isolate.h;
        const x1 = raycaster.hit_ui_x;
        const y1 = raycaster.hit_ui_y;
        const di = Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2);
        if (di >= 10 * 10) {
            return;
        } else {
            intersects.push({
                distance: distance,
                point   : vec3_3.clone(),
                object  : this,
            });
        }
    }
    
    /**
     * 
     * 拷贝
     * 
     * @returns 
     */
    clone() {
        const light  = this.#light.clone();
        const holder = new LightHolder(light, this.#associate_container);
        holder.position.copy(this.position);
        holder.rotation.copy(this.rotation);
        holder.scale   .copy(this.scale);
        return holder;
    }

    /**
     * 
     * 设置位置
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     */
    setPosition(x, y, z) {
        this.position.set(x, y, z);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     */
    setLookAt(x, y, z) {
        this.lookAt(x, y, z);
    }

    /**
     * 
     * 设置开启辅助线
     * 
     * @param {boolean} enable 
     */
    setEnableHelper(enable) {
        if (enable) {
            for (const item of this.#associate_container.all()) {
                if (item == this) {
                    ;
                } else {
                    item.setEnableHelper(false);
                }
            }
        }
        this.#light.setEnableHelper(enable);
    }

    /**
     * 
     * 如果存在helper 更新辅助
     * 
     * @returns 
     */
    updateHelperIfHas() {
        this.#light.updateHelperIfHas();
    }

    /**
     * 
     * 函数转发
     * 
     * @param {*} enable 
     */
    setEnableCastShadow(enable) {
        if (this.#light && isFunction(this.#light.setEnableCastShadow)) {
            this.#light.setEnableCastShadow(enable);
        }
    }

    /**
     * 
     * 函数转发
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.material.setColor(color);
        if (this.#light && isFunction(this.#light.setColor)) {
            this.#light.setColor(color);
        }
    }

    /**
     * 
     * 函数转发
     * 
     * @param {*} value 
     */
    setIntensity(value) {
        if (this.#light && isFunction(this.#light.setIntensity)) {
            this.#light.setIntensity(value);
        }
    }

    /**
     * 
     * 函数转发
     * 
     * @param {*} distance 
     */
    setDistance(distance) {
        if (this.#light && isFunction(this.#light.setDistance)) {
            this.#light.setDistance(distance);
        }
    }

    /**
     * 
     * 函数转发
     * 
     * @param {*} angle 
     */
    setAngle(angle) {
        if (this.#light && isFunction(this.#light.setAngle)) {
            this.#light.setAngle(angle);
        }
    }

    /**
     * 把位置更新到light里面
     */
    update() {
        const light = this.#light;
        if (!light.target) {
            return;
        }

        this.updateMatrixWorld(true);
        
        const location = this.getBasePoint(false);
        vec3_0.set(0, 0, 1);
        vec3_0.transformDirection(this.matrixWorld);
        vec3_1.x = location.x;
        vec3_1.y = location.y;
        vec3_1.z = location.z;
        vec3_1.add(vec3_0);
        light.target.matrixWorld.makeTranslation(vec3_1);
    }

    /**
     * 销毁
     */
    dispose() {
        this.#associate_container.del(this);
        this.#light.dispose();
        this.removeFromParent();
    }
}
