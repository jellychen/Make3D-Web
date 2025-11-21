/* eslint-disable no-unused-vars */

import Base       from '../base';
import NavToolbar from './toolbar/v';

/**
 * 模拟器
 */
export default class EcSimulator extends Base {
    /**
     * 导航条
     */
    #nav_toolbar;

    /**
     * 被选中的元素
     */
    #selected_container;

    /**
     * 辅助场景
     */
    #collaborator;

    /**
     * 场景orbit方位
     */
    #orbit_camera_stand_controller;
    #orbit_orientation;

    /**
     * 进行操作的元素
     */
    #object;

    /**
     * 操作
     */
    #manipulator;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(coordinator);
        // this.#selected_container = coordinator.selected_container;
        // if (1 !== this.#selected_container.count()) {
        //     throw new Error('EcModifier must only select one!')
        // }

        // this.#collaborator = this.collaborator;
        // this.#object = this.#selected_container.getOneValue();
        // this.#orbit_camera_stand_controller = this.orbit.getCameraStandController();
        // this.#orbit_orientation = this.orbit.backupOrientation();
        // this.#orbit_camera_stand_controller.lookAtObject(this.#object);

        // // 隐藏右侧菜单
        // this.coordinator.moderator.setVisible(false);

        // 构建导航条
        this.#nav_toolbar = new NavToolbar(this.coordinator);
        this.nav.setToolbarContent(this.#nav_toolbar);

        // 配置
        this.cinderella_conf_context.setEnableTransformer(false);
        this.cinderella_conf_context.setEnableHaft(false);
        this.cinderella_conf_context.setEnablePlaneDetector(false);
        this.cinderella_conf_context.setEnableSelectBox(false);

        // // 标记编辑状态
        // this.#object.setEditing(true);
    }

    /**
     * 
     * 获取类型
     * 
     * @returns 
     */
    getType() {
        return "simulator";
    }

    /**
     * 
     * 接收到外部命令
     * 
     * @param {info} object 
     */
    onRecvCommand(info = undefined) {
        // if (!isObject(info) || !isString(info.type)) {
        //     return;
        // }
        // this.disposeManipulator();
        // this.#manipulator = ManipulatorCreator(info.type, this, this.#object);
    }

    /**
     * 销毁 manipulator
     */
    disposeManipulator() {
        // if (this.#manipulator) {
        //     this.#manipulator.dispose();
        //     this.#manipulator = undefined;
        // }
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();

        // // 恢复
        // this.cinderella.getSceneLayersAdapter().enableAll();

        // // 清除编辑态
        // this.#object.setEditing(false);

        // // 恢复相机方位
        // this.#orbit_camera_stand_controller.toOrientation(this.#orbit_orientation);

        // // 销毁操作
        // this.disposeManipulator();
    }
}
