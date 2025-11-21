/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';
import Base   from '../base';

/**
 * 用来调整元素
 */
export default class SelectorTransformer extends Base {
    /**
     * ec
     */
    #ec;

    /**
     * 被选中的元素
     */
    #selected_container;

    /**
     * 临时变量
     */
    #vec3_0 = new XThree.Vector3();
    #vec3_1 = new XThree.Vector3();
    #vec3_2 = new XThree.Vector3();
    #vec3_3 = new XThree.Vector3();
    #vec4_0 = new XThree.Vector4();
    #vec4_1 = new XThree.Vector4();
    #vec4_2 = new XThree.Vector4();
    #vec4_3 = new XThree.Vector4();
    #mat4_0 = new XThree.Matrix4();
    #mat4_1 = new XThree.Matrix4();
    #mat4_2 = new XThree.Matrix4();
    #mat4_3 = new XThree.Matrix4();
    #mat4_4 = new XThree.Matrix4();
    #mat4_5 = new XThree.Matrix4();

    /**
     * 变换事件
     */
    #on_transform_translate_begin = event => this.#onTransformTranslateBegin(event);
    #on_transform_translate       = event => this.#onTransformTranslate(event);
    #on_transform_translate_end   = event => this.#onTransformTranslateEnd(event);
    #on_transform_scale_begin     = event => this.#onTransformScaleBegin(event);
    #on_transform_scale           = event => this.#onTransformScale(event);
    #on_transform_scale_end       = event => this.#onTransformScaleEnd(event);
    #on_transform_rotate_begin    = event => this.#onTransformRotateBegin(event);
    #on_transform_rotate          = event => this.#onTransformRotate(event);
    #on_transform_rotate_end      = event => this.#onTransformRotateEnd(event);

    /**
     * 记录
     */
    #scale_x = 1;
    #scale_y = 1;
    #scale_z = 1;

    /**
     * 记录
     */
    #rotate_angle = 0;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} ec 
     */
    constructor(coordinator, ec) {
        super(coordinator);
        this.#selected_container = coordinator.selected_container;
        this.#ec = ec;
        this.setEnable(true);
    }

    /**
     * 
     * 打开或者关闭
     * 
     * @param {boolean} enable 
     */
    setEnable(enable) {
        if (true === enable) {
            this.transformer.addEventListener('translate-begin',    this.#on_transform_translate_begin);
            this.transformer.addEventListener('translate',          this.#on_transform_translate);
            this.transformer.addEventListener('translate-end',      this.#on_transform_translate_end);
            this.transformer.addEventListener('scale-begin',        this.#on_transform_scale_begin);
            this.transformer.addEventListener('scale',              this.#on_transform_scale);
            this.transformer.addEventListener('scale-end',          this.#on_transform_scale_end);
            this.transformer.addEventListener('rotate-begin',       this.#on_transform_rotate_begin);
            this.transformer.addEventListener('rotate',             this.#on_transform_rotate);
            this.transformer.addEventListener('rotate-end',         this.#on_transform_rotate_end);
        } else {
            this.transformer.removeEventListener('translate-begin', this.#on_transform_translate_begin);
            this.transformer.removeEventListener('translate',       this.#on_transform_translate);
            this.transformer.removeEventListener('translate-end',   this.#on_transform_translate_end);
            this.transformer.removeEventListener('scale-begin',     this.#on_transform_scale_begin);
            this.transformer.removeEventListener('scale',           this.#on_transform_scale);
            this.transformer.removeEventListener('scale-end',       this.#on_transform_scale_end);
            this.transformer.removeEventListener('rotate-begin',    this.#on_transform_rotate_begin);
            this.transformer.removeEventListener('rotate',          this.#on_transform_rotate);
            this.transformer.removeEventListener('rotate-end',      this.#on_transform_rotate_end);
        }
    }

    /**
     * 
     * 是否可以被复制，如果打开了光追就不允许添加元素了
     * 
     * @returns 
     */
    #canbeCopyed() {
        return !this.#ec.isOpenRTWindow();
    }

    /**
     * 在变换前先拷贝
     */
    #copyBeforeTransform() {
        if (this.#selected_container.empty()) {
            return;
        }

        // 拷贝一份 并添加被拷贝者的父亲上面
        const copyed_arr = [];
        this.#selected_container.foreach(object => {
            const scene  = this.scene;
            const parent = object.parent;
            const copyed = object.clone(true);
            parent.add(copyed);
            copyed_arr.push(copyed);
        });

        // 记录历史
        this.#ec.historical_recorder.deleteObjects(copyed_arr);
        this.#ec.historical_recorder.saveSelectorContainer();
        this.#selected_container.replace(copyed_arr);

        // 通知场景发生了变化
        this.coordinator.markTreeViewNeedUpdate(true);
    }

    /**
     * 如果可以的话，先复制
     */
    #copyBeforeTransformIfCan() {
        if (this.coordinator.keyboard_watcher.alt_or_meta && this.#canbeCopyed()) {
            this.#copyBeforeTransform();
        }
    }

    /**
     * 变换开始
     */
    #onTransformBegin() {
        ;
    }

    /**
     * 
     * 变换平移 开始
     * 
     * @param {*} event 
     */
    #onTransformTranslateBegin(event) {
        this.#onTransformBegin();
        if (this.#selected_container.empty()) {
            return;
        }

        this.#copyBeforeTransformIfCan();
        this.#ec.historical_recorder.saveSelectedElementMatrix(this);
    }

    /**
     * 
     * 变换平移
     * 
     * @param {*} event 
     */
    #onTransformTranslate(event) {
        if (this.#selected_container.empty()) {
            return;
        }

        // 在世界坐标系下计算
        const matrix = this.transformer.getMeshMatrixWorld().rotation();
        this.#mat4_0.copy(matrix).invert();
        this.#mat4_1.makeTranslation(event.data.x, event.data.y, event.data.z);
        this.#mat4_1.multiply(this.#mat4_0).premultiply(matrix);

        // 针对每个元素，转化到局部坐标系进行计算
        this.#selected_container.foreach((object) => {
            const m = object.getParentMatrixWorld();
            this.#mat4_2.copy(m).invert();
            this.#mat4_3.copy(this.#mat4_1);
            this.#mat4_3.multiply(m).premultiply(this.#mat4_2);

            // 调整
            object.notifyTransformWillChanged(this);
            object.applyMatrix4(this.#mat4_3);
            object.notifyTransformChanged(this);
        });

        // 变换了
        this.#onTransform();

        // 更新
        this.renderNextFrame();
    }

    /**
     * 
     * 变换平移 结束
     * 
     * @param {*} event 
     */
    #onTransformTranslateEnd(event) {
        this.#onTransformEnd();
    }

    /**
     * 
     * 变换缩放开始
     * 
     * @param {*} event 
     */
    #onTransformScaleBegin(event) {
        this.#onTransformBegin();
        if (this.#selected_container.empty()) {
            return;
        }

        this.#copyBeforeTransformIfCan();

        this.#scale_x = 1.0;
        this.#scale_y = 1.0;
        this.#scale_z = 1.0;
        this.#ec.historical_recorder.saveSelectedElementMatrix(this);
    }

    /**
     * 
     * 变换缩放组件
     * 
     * @param {*} event 
     */
    #onTransformScale(event) {
        if (this.#selected_container.empty()) {
            return;
        }

        // 用来处理缩放系数
        let x = event.data.x;
        let y = event.data.y;
        let z = event.data.z;

        // 如果按下了Shift，就执行同比放大
        if (true === this.keyboard_watcher.shift) {
            if (event.data.axis == 0) {
                // x 轴
                y = z = x;
            } else if (event.data.axis == 1) {
                // y 轴
                x = z = y;
            } else if (event.data.axis == 2) {
                // z 轴
                x = y = z;
            }
        }

        // 计算缩放系数
        const a = x / this.#scale_x;
        const b = y / this.#scale_y;
        const c = z / this.#scale_z;

        // 更新
        this.#scale_x = x;
        this.#scale_y = y;
        this.#scale_z = z;

        // 在世界坐标系下计算
        const matrix = this.transformer.getMeshMatrixWorld().removeScaleFactor();
        this.#mat4_0.copy(matrix).invert();
        this.#mat4_1.makeScale(a, b, c);
        this.#mat4_1.multiply(this.#mat4_0).premultiply(matrix);
        
        // 针对每个元素，转化到局部坐标系进行计算
        this.#selected_container.foreach((object) => {
            let m = object.getParentMatrixWorld();
            this.#mat4_2.copy(m).invert();
            this.#mat4_3.copy(this.#mat4_1);
            this.#mat4_3.multiply(m).premultiply(this.#mat4_2);

            // 调整
            object.notifyTransformWillChanged(this);
            object.applyMatrix4(this.#mat4_3);
            object.notifyTransformChanged(this);
        });

        // 变换了
        this.#onTransform();

        // 更新
        this.renderNextFrame();
    }

    /**
     * 
     * 变换缩放结束
     * 
     * @param {*} event 
     */
    #onTransformScaleEnd(event) {
        this.#onTransformEnd();
    }

    /**
     * 
     * 变换旋转开始
     * 
     * @param {*} event 
     */
    #onTransformRotateBegin(event) {
        this.#onTransformBegin();
        if (this.#selected_container.empty()) {
            return;
        }
        
        this.#copyBeforeTransformIfCan();
        this.#rotate_angle = 0;
        this.#ec.historical_recorder.saveSelectedElementMatrix(this);
    }

    /**
     * 
     * 变换组件旋转组件
     * 
     * @param {*} event 
     */
    #onTransformRotate(event) {
        if (this.#selected_container.empty()) {
            return;
        }

        // 用来处理旋转系数
        const angle = event.data.angle;
        const angle_offset = angle - this.#rotate_angle;
        this.#rotate_angle = angle;

        // 在世界坐标系下计算
        this.#vec3_0.copy(this.transformer.getCenter());
        const matrix = this.transformer.getMeshMatrixWorld();
        const axis   = event.data.axis;
        if (0 == axis) {
            // x 轴
            this.#vec4_0.set(1, 0, 0, 0);
        } else if (1 == axis) {
            // y 轴
            this.#vec4_0.set(0, 1, 0, 0);
        } else if (2 == axis) {
            // z 轴
            this.#vec4_0.set(0, 0, 1, 0);
        }
        this.#vec4_0.applyMatrix4(matrix).normalize();

        // 针对每个元素，转化到局部坐标系进行计算
        this.#selected_container.foreach((object) => {
            this.#mat4_0.copy(object.getParentMatrixWorld()).invert();
            this.#vec4_1.copy(this.#vec4_0);
            this.#vec4_1.applyMatrix4(this.#mat4_0).normalize();
            this.#vec3_1.set(this.#vec4_1.x, this.#vec4_1.y, this.#vec4_1.z);
            this.#vec3_2.copy(this.#vec3_0);
            this.#vec3_2.applyMatrix4(this.#mat4_0);
            this.#mat4_2.makeTranslation(this.#vec3_2);
            this.#mat4_3.makeTranslation(this.#vec3_2.negate());
            this.#mat4_4.identity();
            this.#mat4_4.makeRotationAxis(this.#vec3_1, angle_offset);
            this.#mat4_4.multiply(this.#mat4_3);
            this.#mat4_4.premultiply(this.#mat4_2);
            
            // 调整
            object.notifyTransformWillChanged(this);
            object.applyMatrix4(this.#mat4_4);
            object.notifyTransformChanged(this);
        });

        // 变换了
        this.#onTransform();

        // 更新
        this.renderNextFrame();
    }

    /**
     * 
     * 变换旋转开始
     * 
     * @param {*} event 
     */
    #onTransformRotateEnd(event) {
        this.#onTransformEnd();
    }

    /**
     * 变换了
     */
    #onTransform() {
        const scene = this.scene;
        this.#selected_container.foreach(object => {
            scene.notifer(this, object, 'child-transform-changed');
        });
    }

    /**
     * 变换结束
     */
    #onTransformEnd() {
        ;
    }

    /**
     * 销毁
     */
    dispose() {
        this.setEnable(false);
    }
}
