/* eslint-disable no-unused-vars */

import XThree          from '@xthree/basic';
import LightSupervisor from '@core/cinderella/core/light/supervisor';
import Constants       from './constants';
import Builder         from './builder';

/**
 * 零时变量
 */
const _mat4_0  = new XThree.Matrix4();
const _color_0 = new XThree.Color();
const _color_1 = new XThree.Color();

/**
 * Mixin
 */
Object.assign(Builder.prototype, {
    /**
     * 构建
     * 
     * @param {*} parent_node 
     * @returns 
     */
    builderLight(parent_node) {
        if (!this.scene_light_supervisor) {
            this.scene_light_supervisor = new LightSupervisor(this.scene);
        }

        // 获取灯光类型
        const light_t = this.read_I32();

        // 方向光
        if (Constants.T_LIGHT_DIR == light_t) {
            const holder = this.scene_light_supervisor.dir();
            const light  = holder.light;
            this.read_Mat4(_mat4_0);
            this.read_Color(_color_0);
            holder.resetMatrix(_mat4_0);
            light.setColor(_color_0.getHex());
            light.setIntensity(this.read_F32());
            this.read_I32_AndCheck(Constants.T_LIGHT_END);
            parent_node.add(holder);
            return this;
        }

        // 点光源
        if (Constants.T_LIGHT_POINT == light_t) {
            const holder = this.scene_light_supervisor.point();
            const light  = holder.light;
            this.read_Mat4(_mat4_0);
            this.read_Color(_color_0);
            holder.resetMatrix(_mat4_0);
            light.setColor(_color_0.getHex());
            light.setIntensity(this.read_F32());
            this.read_I32_AndCheck(Constants.T_LIGHT_END);
            parent_node.add(holder);
            return this;
        }

        // 聚光灯
        if (Constants.T_LIGHT_SPOT == light_t) {
            const holder = this.scene_light_supervisor.spot();
            const light  = holder.light;
            this.read_Mat4(_mat4_0);
            this.read_Color(_color_0);
            holder.resetMatrix(_mat4_0);
            light.setColor(_color_0.getHex());
            light.setIntensity(this.read_F32());
            light.setAngle(this.read_F32());
            this.read_I32_AndCheck(Constants.T_LIGHT_END);
            parent_node.add(holder);
            return this;
        }

        throw new Error('data error');
    },
});
