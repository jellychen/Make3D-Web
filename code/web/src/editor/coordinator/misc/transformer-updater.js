/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 临时
 */
const _vec3_0 = new XThree.Vector3();
const _vec3_1 = new XThree.Vector3();
const _vec3_2 = new XThree.Vector3();

/**
 * Transformer 更新器
 */
export default class TransformerUpdater {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 实时渲染
     */
    #cinderella;
    #cinderella_conf_context;

    /**
     * 变换器
     */
    #transformer;

    /**
     * 选择器的池子
     */
    #selected_container;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} cinderella 
     */
    constructor(coordinator, cinderella) {
        this.#coordinator             = coordinator;
        this.#cinderella              = cinderella;
        this.#cinderella_conf_context = this.#cinderella.getConfContext();
        this.#transformer             = this.#cinderella_conf_context.transformer;
        this.#selected_container      = this.#coordinator.selected_container;
    }

    /**
     * 更新
     */
    update() {
        // if active ignore
        if (this.#transformer.active) {
            return;
        }

        // Check if the selected container is not empty
        let has_visible_selected_elements = false;
        if (!this.#selected_container.empty()) {
            
            // If there is only one element in the selected container
            // Get the object from the selected container
            // If the object is visible
            // Set the matrix of the transformer to the matrix of the object
            // Set the flag to true
            if (1 == this.#selected_container.count()) {
                const object = this.#selected_container.getOneValue();
                if (object.visible) {
                    this.#transformer.setMatrix(object.getMatrixWorld(true));
                    has_visible_selected_elements = true;
                }
            } 
            
            // If there is more than one element in the selected container
            else {
                let vec3 = _vec3_0;
                let count = 0;
                vec3.set(0, 0, 0);

                // Loop through each element in the selected container
                // If the element is visible
                // Set the flag to true
                // Add the base point of the element to the vector3 object
                // Increment the count variable
                this.#selected_container.foreach(e => {
                    if (e.visible) {
                        has_visible_selected_elements = true;
                        vec3.add(e.getBasePoint(true));
                        count++;
                    }
                });

                // If there are more than 0 elements
                // Divide the vector3 object by the count
                // Set the position of the transformer to the vector3 object
                if (count > 0) {
                    vec3.multiplyScalar(1.0 / count);
                    this.#transformer.setPositionVec3(vec3);
                }
            }
        }

        // If there are visible selected elements, enable the outline and transformer
        if (has_visible_selected_elements) {
            this.#cinderella_conf_context.setEnableOutline(true);
            this.#cinderella_conf_context.setEnableTransformer(true);
        } 

        // Otherwise, disable the outline and transformer
        else {    
            this.#cinderella_conf_context.setEnableOutline(false);
            this.#cinderella_conf_context.setEnableTransformer(false);
        }
    }

    /**
     * 销毁
     */
    dispose() {
        ;
    }
}
