/* eslint-disable no-unused-vars */

import isArray from 'lodash/isArray';
import XThree  from '@xthree/basic';
import Base    from '../base';
import Picker  from '@core/cinderella/core/picker';

/**
 * 选择器
 */
export default class Selector extends Base {
    /**
     * 宿主
     */
    #ec;

    /**
     * 场景
     */
    #scene;

    /**
     * 被选中的元素
     */
    #selected_container;

    /**
     * Picker 
     */
    #picker = new Picker();

    /**
     * 临时
     */
    #vec3_0 = new XThree.Vector3();
    #vec3_1 = new XThree.Vector3();

    /**
     * 事件回调
     */
    #on_click              = event => this.#onClick(event);
    #on_dbclick            = event => this.#onDbClick(event);
    #on_box_select_begin   = event => this.#onBoxSelectBegin(event);
    #on_box_select_changed = event => this.#onBoxSelectChanged(event);
    #on_box_select_end     = event => this.#onBoxSelectEnd(event);

    /**
     * 获取
     */
    get ec() {
        return this.#ec;
    }

    /**
     * 获取
     */
    get historical_recorder() {
        return this.#ec.historical_recorder;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} ec 
     * @param {*} coordinator 
     */
    constructor(ec, coordinator) {
        super(coordinator);
        this.#ec = ec;
        this.#scene = coordinator.scene;
        this.#selected_container = coordinator.selected_container;
        this.setEnable(true);
    }

    /**
     * 
     * 设置可用性
     * 
     * @param {boolean} enable 
     */
    setEnable(enable) {
        if (true === enable) {
            this.interactive_controller.addEventListener('click'  ,              this.#on_click);
            this.interactive_controller.addEventListener('dbclick',              this.#on_dbclick);
            this.interactive_controller.addEventListener('box-select-begin',     this.#on_box_select_begin);
            this.interactive_controller.addEventListener('box-select-changed',   this.#on_box_select_changed);
            this.interactive_controller.addEventListener('box-select-end',       this.#on_box_select_end);
        } else {
            this.interactive_controller.removeEventListener('click'  ,            this.#on_click);
            this.interactive_controller.removeEventListener('dbclick',            this.#on_dbclick);
            this.interactive_controller.removeEventListener('box-select-begin',   this.#on_box_select_begin);
            this.interactive_controller.removeEventListener('box-select-changed', this.#on_box_select_changed);
            this.interactive_controller.removeEventListener('box-select-end',     this.#on_box_select_end);
        }
    }

    /**
     * 
     * 点选
     * 
     * @param {*} event 
     */
    #onClick(event) {
        // Check if shift key is pressed
        // Get the x and y coordinates of the click event in normalized device coordinates
        // Set the pick info with the x, y coordinates and the camera
        const shift_pressed = this.keyboard_watcher.shift;
        const x = this.toNDC_X(event.x);
        const y = this.toNDC_Y(event.y);
        this.#picker.setPickInfo(x, y, this.camera);

        // Pick the object at the x, y coordinates
        // If no object is selected or the selected object is not an array or the array is empty, 
        // set selected to undefined
        let selected = this.#picker.pick(this.scene);
        if (!selected || !isArray(selected) || 0 === selected.length) {
            selected = undefined;
        } else {
            selected = selected[0].object;
        }

        // Save the selector container
        // Select the object with the shift key pressed
        // Update the transformer
        this.#ec.historical_recorder.saveSelectorContainer();        
        this.#selected_container.selectShift(selected, shift_pressed);
        this.coordinator.updateTransformer();

        //
        this.coordinator.markTreeViewNeedUpdate(false);

        // renderer
        this.coordinator.renderNextFrame();
    }

    /**
     * 
     * 双击
     * 
     * @param {*} event 
     */
    #onDbClick(event) {
        ;
    }

    /**
     * 
     * 框选开始
     * 
     * @param {*} event 
     */
    #onBoxSelectBegin(event) {
        this.#ec.historical_recorder.saveSelectorContainer();
    }

    /**
     * 
     * 框选
     * 
     * @param {*} event 
     */
    #onBoxSelectChanged(event) {
        this.#boxSelected(event.x0, event.y0, event.x1, event.y1);
    }

    /**
     * 
     * 框选
     * 
     * @param {*} event 
     */
    #onBoxSelectEnd(event) {
        this.updateTransformer();
        this.coordinator.markTreeViewNeedUpdate(false);
    }

    /**
     * 
     * 执行框选逻辑
     * 
     * @param {Number} x0 NDC 坐标
     * @param {Number} y0 NDC 坐标
     * @param {Number} x1 NDC 坐标
     * @param {Number} y1 NDC 坐标
     */
    #boxSelected(x0, y0, x1, y1) {
        // Check if shift key is pressed
        // Set the camera for the picker
        // Set the select box A coordinates
        // Set the select box B coordinates
        const shift_pressed = this.keyboard_watcher.shift;
        this.#picker.setCamera(this.camera);
        this.#picker.setSelectBoxA(x0, y0);
        this.#picker.setSelectBoxB(x1, y1);

        // Pick the objects in the scene within the select box
        // Disable the Cinderella transformer
        // If no objects are selected
        const selected = this.#picker.pickBoxSelect(this.scene);
        this.cinderella_conf_context.setEnableTransformer(false);
        if (!selected || !isArray(selected) || 0 === selected.length) {
            // If shift key is not pressed
            // Clear the selected container
            if (!shift_pressed) {
                if (this.#selected_container.clear()) {
                    this.coordinator.markTreeViewNeedUpdate(false);
                    this.renderNextFrame();
                }
                return;
            }
        } else {
            // If shift key is not pressed
            // Replace the selected container with the new selection
            if (!shift_pressed) {
                if (this.#selected_container.replace(selected)) {
                    this.coordinator.markTreeViewNeedUpdate(false);
                    this.renderNextFrame();
                }
            } 
            
            // Select the new objects in the selected container
            // Render the next frame
            else {
                if (this.#selected_container.select(selected)) {
                    this.coordinator.markTreeViewNeedUpdate(false);
                    this.renderNextFrame();
                }
            }
        }
    }

    /**
     * 更新变换器
     */
    updateTransformer() {
        if (this.#selected_container.empty()) {
            this.cinderella_conf_context.setEnableOutline(false);
            this.cinderella_conf_context.setEnableTransformer(false);
        } else {
            this.cinderella_conf_context.setEnableOutline(true);
            this.cinderella_conf_context.setEnableTransformer(true);

            // 如果值选择了一个元素，那么这个元素的变换设置给变换组件
            if (1 == this.#selected_container.count()) {
                const object = this.#selected_container.getOneValue();
                const matrix = object.getMatrixWorld(false);
                this.transformer.setMatrix(matrix);
            } 
            
            // 如果选择了多个元素, 计算中点
            else {
                this.#vec3_0.set(0, 0, 0);
                this.#selected_container.foreach(e => {
                    this.#vec3_0.add(e.getBasePoint(false));
                });
                this.#vec3_0.multiplyScalar(1.0 / this.#selected_container.count());
                this.transformer.setPositionVec3(this.#vec3_0);
            }
        }
    }

    /**
     * 下一帧执行渲染
     */
    renderNextFrame() {
        this.coordinator.renderNextFrame();
    }

    /**
     * 销毁
     */
    dispose() {
        this.setEnable(false);
        this.#picker.dispose();
    }
}
