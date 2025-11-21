/* eslint-disable no-unused-vars */

import isArray from 'lodash/isArray';
import Base    from '../base';
import Picker  from '@core/cinderella/core/picker';

/**
 * 选择器
 */
export default class Selector extends Base {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 宿主
     */
    #ec;

    /**
     * 主场景
     */
    #abattoir;

    /**
     * 场景
     */
    #scene;

    /**
     * 被选中的元素
     */
    #selected_container;

    /**
     * 事件回调
     */
    #on_click              = event => this.#onClick(event);
    #on_dbclick            = event => this.#onDbClick(event);
    #on_box_select_begin   = event => this.#onBoxSelectBegin(event);
    #on_box_select_changed = event => this.#onBoxSelectChanged(event);
    #on_box_select_end     = event => this.#onBoxSelectEnd(event);

    /**
     * Picker 
     */
    #picker = new Picker();

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} ec 
     */
    constructor(coordinator, ec) {
        super(coordinator);
        this.#coordinator        = coordinator;
        this.#abattoir           = this.#coordinator.abattoir;
        this.#scene              = coordinator.scene;
        this.#selected_container = coordinator.selected_container;
        this.#ec                 = ec;
        this.setEnable(true);
    }

    /**
     * 
     * 设置可用性
     * 
     * @param {boolean} enable 
     */
    setEnable(enable) {
        if (enable) {
            this.#coordinator.updateTransformer();
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
        // Check if the abattoir is focused
        if (!this.#abattoir.is_focused) {
            return;
        }

        // Check if the shift key is pressed
        // Get the x and y coordinates of the click event
        // Set the pick info with the x, y coordinates and the camera
        const shift_pressed = this.keyboard_watcher.shift;
        const x0 = event.x;
        const y0 = event.y;
        const x  = this.toNDC_X(x0);
        const y  = this.toNDC_Y(y0);
        this.#picker.setPickInfo(x, y, this.camera, this.#coordinator.cinderella, x0, y0);

        // Pick the object at the x, y coordinates
        // Check if the selected object is an array and has a length greater than 0
        // Set the selected object to the first object in the array
        let selected = this.#picker.pick(this.scene);
        if (!selected || !isArray(selected) || 0 === selected.length) {
            selected = undefined;
        } else {
            selected = selected[0].object;
        }

        // Save the historical selector container
        // Select the shift container with the selected object and the shift key
        this.#ec.historical_recorder.saveSelectorContainer();
        if (this.#selected_container.selectShift(selected, shift_pressed)) {
            this.coordinator.updateTransformer();
            this.coordinator.markTreeViewNeedUpdate(false);
            this.coordinator.renderNextFrame();
        } else {
            this.#ec.historical_recorder.dismissLastest();
        }
    }

    /**
     * 
     * 双击
     * 
     * @param {*} event 
     */
    #onDbClick(event) { }

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
        ;
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
        // Disable the Cinderella configuration transformer
        
        const selected = this.#picker.pickBoxSelect(this.scene);
        this.cinderella_conf_context.setEnableTransformer(false);
        
        // If no objects are selected
        // If shift key is not pressed
        // Clear the selected container
        if (!selected || !isArray(selected) || 0 === selected.length) {
            if (!shift_pressed) {
                if (this.#selected_container.clear()) {
                    this.coordinator.updateTransformer();
                    this.coordinator.markTreeViewNeedUpdate(false);
                    this.coordinator.renderNextFrame();
                } else {
                    this.#ec.historical_recorder.dismissLastest();
                }
            }
        } 
        
        // If shift key is not pressed
        // Replace the selected container with the new selection
        else {
            if (!shift_pressed) {
                if (this.#selected_container.replace(selected)) {
                    this.coordinator.updateTransformer();
                    this.coordinator.markTreeViewNeedUpdate(false);
                    this.coordinator.renderNextFrame();
                } else {
                    this.#ec.historical_recorder.dismissLastest();
                }
            } 
            
            // Select the new objects in the selected container
            else {
                if (this.#selected_container.select(selected)) {
                    this.coordinator.updateTransformer();
                    this.coordinator.markTreeViewNeedUpdate(false);
                    this.coordinator.renderNextFrame();
                } else {
                    this.#ec.historical_recorder.dismissLastest();
                }
            }
        }
    }

    /**
     * 
     * 移除所有筛选后的元素
     * 
     * @returns 
     */
    removeAllSelectedObjects() {
        // This function removes and disposes of all selected objects
        // If the selected container is not empty, return
        if (this.#selected_container.empty()) {
            return;
        }

        // Save
        this.#ec.historical_recorder.recoverDeletedElements(this);

        // Create a new set to store the selected objects
        // Iterate through the selected container and add each object to the set
        // Clear the selected container
        // Iterate through the set and dispose of each object
        const set = new Set();
        this.#selected_container.foreach(object => {
            set.add(object);
        });

        this.#selected_container.clear();
        for (const object of set) {
            object.removeFromParent();
        }
        
        // Render the next frame
        this.coordinator.updateTransformer();
        this.coordinator.markTreeViewNeedUpdate(true);
        this.coordinator.renderNextFrame();

        return true;
    }

    /**
     * 销毁
     */
    dispose() {
        this.setEnable(false);
        this.#picker.dispose();
    }
}
