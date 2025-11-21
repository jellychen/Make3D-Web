/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import XThree                from '@xthree/basic';
import ParametersScoped      from '@core/houdini/scoped-parameters';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import MoreMenu              from './v-more';
import Input                 from './v-label-input';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-coordinate';

/**
 * 临时变量
 */
const _vec3_0 = new XThree.Vector3();
const _mat4_0 = new XThree.Matrix4();

/**
 * 位置信息
 */
export default class Coordinate extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 当前关注 element
     */
    #attached_element;

    /**
     * 更多菜单
     */
    #more;

    /**
     * 元素
     */
    #t_x;
    #t_y;
    #t_z;
    #s_x;
    #s_y;
    #s_z;
    #r_x;
    #r_y;
    #r_z;

    /**
     * 遮罩 
     */
    #mask;

    /**
     * 元素回调
     */
    #on_transform_changed = event => this.#onTransformChanged(event);

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#more  = this.getChild('#more');
        this.#t_x   = this.getChild('#t-x');
        this.#t_y   = this.getChild('#t-y');
        this.#t_z   = this.getChild('#t-z');
        this.#s_x   = this.getChild('#s-x');
        this.#s_y   = this.getChild('#s-y');
        this.#s_z   = this.getChild('#s-z');
        this.#r_x   = this.getChild('#r-x');
        this.#r_y   = this.getChild('#r-y');
        this.#r_z   = this.getChild('#r-z');
        this.#mask  = this.getChild('#mask');
        this.#more .onclick = event => this.#onClickMore(event);

        this.#t_x.ondatachanged = () => this.#updatePropertiesToMesh();
        this.#t_y.ondatachanged = () => this.#updatePropertiesToMesh();
        this.#t_z.ondatachanged = () => this.#updatePropertiesToMesh();
        this.#s_x.ondatachanged = () => this.#updatePropertiesToMesh();
        this.#s_y.ondatachanged = () => this.#updatePropertiesToMesh();
        this.#s_z.ondatachanged = () => this.#updatePropertiesToMesh();
        this.#r_x.ondatachanged = () => this.#updatePropertiesToMesh();
        this.#r_y.ondatachanged = () => this.#updatePropertiesToMesh();
        this.#r_z.ondatachanged = () => this.#updatePropertiesToMesh();
    }

    /**
     * 
     * 设置协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        this.#coordinator = coordinator;
    }

    /**
     * 回滚到默认值
     */
    resetToDefault() {
        if (this.#attached_element) {
            this.#attached_element.unobserverTransformChanged();
        }
        this.#attached_element = undefined;
        this.#t_x.value = 0;
        this.#t_y.value = 0;
        this.#t_z.value = 0;
        this.#s_x.value = 1;
        this.#s_y.value = 1;
        this.#s_z.value = 1;
        this.#r_x.value = 0;
        this.#r_y.value = 0;
        this.#r_z.value = 0;
    }

    /**
     * 
     * attach 指定的元素
     * 
     * @param {*} element 
     */
    attach(element) {
        this.detach();
        this.#attached_element = element;
        if (this.#attached_element) {
            this.#attached_element.observerTransformChanged();
            this.#attached_element.addEventListener('transform-changed', this.#on_transform_changed);
        } else {
            ;
        }
        this.#update();
    }

    /**
     * detach
     */
    detach() {
        if (this.#attached_element) {
            this.#attached_element.unobserverTransformChanged();
            this.#attached_element.removeEventListener('transform-changed', this.#on_transform_changed);
            this.#attached_element = undefined;
        }
    }

    /**
     * 
     * 设置
     * 
     * @param {*} show 
     */
    showMask(show) {
        if (show) {
            this.#resetInputValueDefault();
            this.#mask.style.display = 'block';
        } else {
            this.#mask.style.display = 'none';
        }
    }

    /**
     * 
     * 接受到信息
     * 
     * @param {*} event 
     */
    #onTransformChanged(event) {
        if (event.reason == this) {
            return;
        }
        this.#update();
    }

    /**
     * 把数据更新到界面上面
     */
    #update() {
        if (!this.#attached_element) {
            return;
        }

        this.#t_x.value = this.#attached_element.position.x;
        this.#t_y.value = this.#attached_element.position.y;
        this.#t_z.value = this.#attached_element.position.z;
        this.#s_x.value = this.#attached_element.scale   .x;
        this.#s_y.value = this.#attached_element.scale   .y;
        this.#s_z.value = this.#attached_element.scale   .z;
        this.#r_x.value = XThree.MathUtils.radToDeg(this.#attached_element.rotation.x);
        this.#r_y.value = XThree.MathUtils.radToDeg(this.#attached_element.rotation.y);
        this.#r_z.value = XThree.MathUtils.radToDeg(this.#attached_element.rotation.z);
    }

    /**
     * 重置输入框的显示
     */
    #resetInputValueDefault() {
        this.#t_x.value = 0;
        this.#t_y.value = 0;
        this.#t_z.value = 0;
        this.#s_x.value = 1;
        this.#s_y.value = 1;
        this.#s_z.value = 1;
        this.#r_x.value = 0;
        this.#r_y.value = 0;
        this.#r_z.value = 0;
        
        // 调整
        this.#coordinator.updateTransformer();
    }

    /**
     * 更新数据到元素上面
     */
    #updatePropertiesToMesh() {
        if (!this.#attached_element) {
            return;
        }

        // 
        // recoder
        // 如果是scene的场景，需要保留原来的值
        if (this.#coordinator.isEcScene()) {
            const ec = this.#coordinator.ec;
            if (ec && isFunction(ec.saveHistorical_ElementMatrix)) {
                ec.saveHistorical_ElementMatrix(this.#attached_element);
            }
        }

        // 设置值
        this.#attached_element.notifyTransformWillChanged(this);
        this.#attached_element.position.x = this.#t_x.value;
        this.#attached_element.position.y = this.#t_y.value;
        this.#attached_element.position.z = this.#t_z.value;
        this.#attached_element.scale   .x = this.#s_x.value;
        this.#attached_element.scale   .y = this.#s_y.value;
        this.#attached_element.scale   .z = this.#s_z.value;
        this.#attached_element.rotation.x = XThree.MathUtils.degToRad(this.#r_x.value);
        this.#attached_element.rotation.y = XThree.MathUtils.degToRad(this.#r_y.value);
        this.#attached_element.rotation.z = XThree.MathUtils.degToRad(this.#r_z.value);
        this.#attached_element.getMatrixWorld(true);
        this.#attached_element.notifyTransformChanged(this);
        this.#attached_element.requestRenderNextFrame();

        // 调整
        this.#coordinator.updateTransformer();
    }

    /**
     * 
     * 点击更多
     * 
     * @param {*} event 
     */
    #onClickMore(event) {
        const menu = new MoreMenu(token => {
            switch(token) {
            case 'apply.transform.correction':
                this.#applyTransformCorrection();
                break;
            case 'apply.transform.scale':
                this.#applyTransformScale();
                break;
            case 'apply.transform.rotation':
                this.#applyTransformRotation();
                break;
            case 'apply.transform.scale-rotation':
                this.#applyTransformScaleAndRotation();
                break;
            case 'apply.transform.all':
                this.#applyTransformAll();
                break;
            case 'reset.transform.translate':
                this.#resetTransformTranslate();
                break;
            case 'reset.transform.scale':
                this.#resetTransformScale();
                break;
            case 'reset.transform.rotation':
                this.#resetTransformRotation();
                break;
            case 'reset.transform.all':
                this.#resetTransformAll();
                break;
            }
        });
        menu.show(this.#more);
    }

    /**
     * 变换
     * 
     * 把局部坐标系搞到AABB的中心
     * 
     */
    #applyTransformCorrection() {
        if (!this.#attached_element) {
            return;
        }

        // 计算AABB的中心
        const geometry = this.#attached_element.geometry;
        if (!geometry) {
            return;
        }

        geometry.computeBoundingBox();
        const aabb = geometry.boundingBox;
        if (!aabb) {
            return;
        }
        aabb.getCenter(_vec3_0);

        // 执行变换
        const x = _vec3_0.x;
        const y = _vec3_0.y;
        const z = _vec3_0.z;
        if (x == 0 && y == 0 && z == 0) {
            return;
        } else {
            this.#attached_element.notifyTransformWillChanged(this);
            _mat4_0.makeTranslation(-x, -y, -z);
            this.#geoApplyMat4(_mat4_0);
            this.#attached_element.position.x += x;
            this.#attached_element.position.y += y;
            this.#attached_element.position.z += z;
            this.#attached_element.getMatrixWorld(true);
            this.#attached_element.notifyTransformChanged(this);
            this.#attached_element.requestRenderNextFrame();
            this.#update();
            this.#coordinator.updateTransformer();
        }
    }

    /**
     * 变换
     */
    #applyTransformScale() {
        if (!this.#attached_element) {
            return;
        }

        if (this.#attached_element.scale.x == 1 &&
            this.#attached_element.scale.y == 1 &&
            this.#attached_element.scale.z == 1) {
            return;
        } else {
            this.#attached_element.notifyTransformWillChanged(this);
            const x = this.#attached_element.scale.x;
            const y = this.#attached_element.scale.y;
            const z = this.#attached_element.scale.z;
            _mat4_0.makeScale(x, y, z);
            this.#attached_element.scale.set(1, 1, 1);
            this.#geoApplyMat4(_mat4_0);
            this.#attached_element.getMatrixWorld(true);
            this.#attached_element.notifyTransformChanged(this);
            this.#attached_element.requestRenderNextFrame();
            this.#update();
            this.#coordinator.updateTransformer();
        }
    }

    /**
     * 变换
     */
    #applyTransformRotation() {
        if (!this.#attached_element) {
            return;
        }

        if (this.#attached_element.rotation.x == 0 &&
            this.#attached_element.rotation.y == 0 &&
            this.#attached_element.rotation.z == 0) {
            return;
        } else {
            this.#attached_element.notifyTransformWillChanged(this);
            _mat4_0.makeRotationFromQuaternion(this.#attached_element.quaternion);
            this.#attached_element.rotation.set(0, 0, 0);
            this.#geoApplyMat4(_mat4_0);
            this.#attached_element.getMatrixWorld(true);
            this.#attached_element.notifyTransformChanged(this);
            this.#attached_element.requestRenderNextFrame();
            this.#update();
            this.#coordinator.updateTransformer();
        }
    }

    /**
     * 变换
     */
    #applyTransformScaleAndRotation() {
        if (!this.#attached_element) {
            return;
        }

        if (this.#attached_element.scale.x    == 1 &&
            this.#attached_element.scale.y    == 1 &&
            this.#attached_element.scale.z    == 1 &&
            this.#attached_element.rotation.x == 0 &&
            this.#attached_element.rotation.y == 0 &&
            this.#attached_element.rotation.z == 0) {
            return;
        } else {
            this.#attached_element.notifyTransformWillChanged(this);
            const q = this.#attached_element.quaternion;
            const s = this.#attached_element.scale;
            _vec3_0.set(0, 0, 0);
            _mat4_0.compose(_vec3_0, q, s);
            this.#attached_element.scale.set(1, 1, 1);
            this.#attached_element.rotation.set(0, 0, 0);
            this.#geoApplyMat4(_mat4_0);
            this.#attached_element.getMatrixWorld(true);
            this.#attached_element.notifyTransformChanged(this);
            this.#attached_element.requestRenderNextFrame();
            this.#update();
            this.#coordinator.updateTransformer();
        }
    }

    /**
     * 变换
     */
    #applyTransformAll() {
        if (!this.#attached_element) {
            return;
        }

        if (this.#attached_element.position.x == 0 &&
            this.#attached_element.position.y == 0 &&
            this.#attached_element.position.z == 0 &&
            this.#attached_element.scale   .x == 1 &&
            this.#attached_element.scale   .y == 1 &&
            this.#attached_element.scale   .z == 1 &&
            this.#attached_element.rotation.x == 0 &&
            this.#attached_element.rotation.y == 0 &&
            this.#attached_element.rotation.z == 0) {
            return;
        } else {
            this.#attached_element.notifyTransformWillChanged(this);
            const p = this.#attached_element.position;
            const q = this.#attached_element.quaternion;
            const s = this.#attached_element.scale;
            _mat4_0.compose(p, q, s);
            this.#attached_element.position.set(0, 0, 0);
            this.#attached_element.scale.set(1, 1, 1);
            this.#attached_element.rotation.set(0, 0, 0);
            this.#geoApplyMat4(_mat4_0);
            this.#attached_element.getMatrixWorld(true);
            this.#attached_element.notifyTransformChanged(this);
            this.#attached_element.requestRenderNextFrame();
            this.#update();
            this.#coordinator.updateTransformer();
        }
    }

    /**
     * 变换
     */
    #resetTransformTranslate() {
        if (!this.#attached_element) {
            return;
        }

        if (this.#attached_element.position.x == 0 &&
            this.#attached_element.position.y == 0 &&
            this.#attached_element.position.z == 0) {
            return;
        } else {
            this.#attached_element.notifyTransformWillChanged(this);
            this.#attached_element.position.set(0, 0, 0);
            this.#attached_element.getMatrixWorld(true);
            this.#attached_element.notifyTransformChanged(this);
            this.#attached_element.requestRenderNextFrame();
            this.#update();
            this.#coordinator.updateTransformer();
        }
    }

    /**
     * 变换
     */
    #resetTransformScale() {
        if (!this.#attached_element) {
            return;
        }

        if (this.#attached_element.scale.x == 1 &&
            this.#attached_element.scale.y == 1 &&
            this.#attached_element.scale.z == 1) {
            return;
        } else {
            this.#attached_element.notifyTransformWillChanged(this);
            this.#attached_element.scale.set(1, 1, 1);
            this.#attached_element.getMatrixWorld(true);
            this.#attached_element.notifyTransformChanged(this);
            this.#attached_element.requestRenderNextFrame();
            this.#update();
            this.#coordinator.updateTransformer();
        }
    }

    /**
     * 变换
     */
    #resetTransformRotation() {
        if (!this.#attached_element) {
            return;
        }

        if (this.#attached_element.rotation.x == 1 &&
            this.#attached_element.rotation.y == 1 &&
            this.#attached_element.rotation.z == 1) {
            return;
        } else {
            this.#attached_element.notifyTransformWillChanged(this);
            this.#attached_element.rotation.set(0, 0, 0);
            this.#attached_element.getMatrixWorld(true);
            this.#attached_element.notifyTransformChanged(this);
            this.#attached_element.requestRenderNextFrame();
            this.#update();
            this.#coordinator.updateTransformer();
        }
    }

    /**
     * 变换
     */
    #resetTransformAll() {
        if (!this.#attached_element) {
            return;
        }

        if (this.#attached_element.position.x == 0 &&
            this.#attached_element.position.y == 0 &&
            this.#attached_element.position.z == 0 &&
            this.#attached_element.scale   .x == 1 &&
            this.#attached_element.scale   .y == 1 &&
            this.#attached_element.scale   .z == 1 &&
            this.#attached_element.rotation.x == 0 &&
            this.#attached_element.rotation.y == 0 &&
            this.#attached_element.rotation.z == 0) {
            return;
        } else {
            this.#attached_element.notifyTransformWillChanged(this);
            this.#attached_element.rotation.set(0, 0, 0);
            this.#attached_element.position.set(0, 0, 0);
            this.#attached_element.scale   .set(1, 1, 1);
            this.#attached_element.getMatrixWorld(true);
            this.#attached_element.notifyTransformChanged(this);
            this.#attached_element.requestRenderNextFrame();
            this.#update();
            this.#coordinator.updateTransformer();
        }
    }

    /**
     * 
     * 变换几何
     * 
     * @param {*} matrix 
     * @returns 
     */
    #geoApplyMat4(matrix) {
        if (isFunction(this.#attached_element.getEditableSoup)) {
            const soup = this.#attached_element.getEditableSoup();
            if (soup) {
                ParametersScoped.setMat4(0, matrix);
                soup.transform_PS0();
            }
        }
        this.#attached_element.geoApplyMat4(matrix);
    }

    /**
     * 销毁
     */
    dispose() {
        this.detach();
    }
}

CustomElementRegister(tagName, Coordinate);
