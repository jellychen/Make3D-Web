/* eslint-disable no-unused-vars */

import XThree           from '@xthree/basic';
import GlobalScope      from '@common/global-scope';
import ParametersScoped from '@core/houdini/scoped-parameters';
import Base             from '../base';

/**
 * 内插
 */
export default class Inset extends Base {
    /**
     * Wasm 对象链接
     */
    #connector;

    /**
     * wasm 实现
     */
    #connector_biz_controller;

    /**
     * 用来显示
     */
    #arena;

    /**
     * 拖柄
     */
    #haft;

    /**
     * 记录haft的偏移
     */
    #haft_offset = 0;

    /**
     * 事件
     */
    #on_haft_translate_begin = event => this.#onHaftTranslateBegin(event);
    #on_haft_translate       = event => this.#onHaftTranslate(event);
    #on_haft_translate_end   = event => this.#onHaftTranslateEnd(event);

    /**
     * 临时
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
    #mat3_0 = new XThree.Matrix3();

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} arena 
     * @param {*} connector 
     * @param {*} host 
     */
    constructor(coordinator, arena, connector, host) {
        super(coordinator, arena, host);
        this.#connector                = connector;
        this.#arena                    = arena;
        this.#haft                     = this.cinderella_conf_context.haft;
        this.#connector_biz_controller = this.#connector.getManipulatorInset();
        if (!this.#connector_biz_controller) {
            throw new Error("getManipulatorInset error !!!");
        }

        // 配置渲染器
        this.cinderella_conf_context.setEnableHaft(true);

        // 配置
        this.setCursor('default');
        this.setEnableSelector(false);
        this.setEnableSelectorTransformer(false);

        // 更新
        this.#updateHaft();

        // 监听事件
        this.#haft.addEventListener('begin',     this.#on_haft_translate_begin);
        this.#haft.addEventListener('translate', this.#on_haft_translate);
        this.#haft.addEventListener('end',       this.#on_haft_translate_end);

        // 标记重新渲染
        this.renderNextFrame();
    }

    /**
     * 调整拖柄
     */
    #updateHaft() {
        const count = this.#connector.countOfSelectedFaces();
        if (0 == count) {
            this.cinderella_conf_context.setEnableHaft(false);
        } else {
            this.cinderella_conf_context.setEnableHaft(true);
            this.#connector.normalSelectedFaces();
            this.#connector.centerOfSelectedFaces();
            ParametersScoped.getVec3(0, this.#vec3_0); // 法线
            ParametersScoped.getVec3(1, this.#vec3_1); // 位置
            
            // 变换到世界坐标系
            const matrix = this.host.matrixWorld;
            this.#mat3_0.getNormalMatrix(matrix);
            this.#vec3_0.applyMatrix3(this.#mat3_0);
            this.#vec3_1.applyMatrix4(matrix);
            
            // 设置
            this.#haft.setPositionInfo(this.#vec3_1, this.#vec3_0);
        }
    }

    /**
     * 拖柄开始拖动
     */
    #onHaftTranslateBegin() {
        const separately = this.keyboard_watcher.shift;
        this.#connector_biz_controller.begin(true == separately);
        this.#haft_offset = 0.00001;
    }

    /**
     * 
     * 拖柄拖动
     * 
     * @param {*} event 
     */
    #onHaftTranslate(event) {
        if (0 == event.data) {
            return;
        } else {
            this.#haft_offset += event.data;
            if (this.#connector_biz_controller.setOffset(this.#haft_offset)) {
                this.#arena.markNeedUpdate();
                this.renderNextFrame();
            }
        }
    }

    /**
     * 拖柄事件结束
     */
    #onHaftTranslateEnd() {
        this.#connector_biz_controller.dismiss();
        this.dismiss();
    }

    /**
     * 销毁
     */
    dispose() {
        // 通知 Wasm 销毁
        this.#connector.disposeAllManipulator();

        // 移除
        this.#haft.removeEventListener('begin',     this.#on_haft_translate_begin);
        this.#haft.removeEventListener('translate', this.#on_haft_translate);
        this.#haft.removeEventListener('end',       this.#on_haft_translate_end);
    }
}
