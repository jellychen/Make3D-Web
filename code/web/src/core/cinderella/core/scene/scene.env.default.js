/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree              from '@xthree/basic';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment';
import Scene               from "./scene";

/**
 * Mixin
 */
Object.assign(Scene.prototype, {
    /**
     * 设置默认的环境
     */
    setDefaultEnvironment() {
        if (this.environment && this.environment instanceof XThree.Texture) {
            if (this.environment != this.default_env_texture) {
                this.environment.__$$_del_ref__();
            }
        }

        //
        // 构建
        //
        if (!this.default_env_texture) {
            const generator = new XThree.PMREMGenerator(this.renderer);
            this.default_env_texture = 
                generator.fromScene(new RoomEnvironment(), 0.04).texture;
            generator.dispose();
        }
        
        this.environment = this.default_env_texture;
        this.background = null;
        this.requestAnimationFrameIfNeed();
    }
});
