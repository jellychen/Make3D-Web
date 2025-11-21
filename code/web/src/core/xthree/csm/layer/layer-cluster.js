/* eslint-disable no-unused-vars */

import isObject      from "lodash/isObject";
import isString      from "lodash/isString";
import CSM           from "../material";
import ShaderUniform from "../shader-uniform/base";
import LayerCreator  from "./layer-creator";

/**
 * 用来记录唯一的编号
 */
let CACHE_KEY_ID = 0;

/**
 * 一组层
 */
export default class LayerCluster {
    /**
     * 数据
     */
    #material    = new CSM(this);  // 材质
    #vid         = 0;              // 变量自增长
    #layers      = [];             // 层的数据
    #need_update = true;
    
    /**
     * 获取
     */
    get layers() {
        return this.#layers;
    }

    /**
     * 获取材质
     */
    get material() {
        return this.#material;
    }

    /**
     * 获取
     */
    get needUpdate() {
        return this.#need_update;
    }

    /**
     * 设置
     */
    set needUpdate(v) {
        if (v) {
            this.markNeedsUpdate();
        }
    }

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * 创建层
     * 
     * @param {*} type 
     * @returns 
     */
    createLayer(type) {
        const layer = LayerCreator(type);
        if (!layer) {
            return null;
        }

        const context  = {};
        context.shader = this.#material;
        context.genId  = () => ++this.#vid;
        for (const attr in layer) {
            const v = layer[attr];
            if (!(v instanceof ShaderUniform)) {
                continue;
            }
            v.setup(context);
        }
        return layer;
    }

    /**
     * 
     * 构建材质
     * 
     * @param {*} requirement 
     */
    rebuild(requirement) {
        //
        // 修改标志
        //
        this.#need_update = false;

        //
        // 统计全部的宏定义
        //
        let defines = {};
        for (const layer of this.#layers) {
            const layer_defines = layer.defines();
            if (isObject(layer_defines)) {
                defines = {
                    ...defines      ,
                    ...layer_defines,
                };
            }
            layer.prepare(requirement);
        }


        //
        // 统计全部的 uniform shader 中的定义
        //
        let uniforms_declare = '';
        for (const layer of this.#layers) {
            for (const attr in layer) {
                const v = layer[attr];
                if (!(v instanceof ShaderUniform)) {
                    continue;
                }
                
                const code = v.emitGlslCode();
                if (isString(code)) {
                    uniforms_declare += code;
                    uniforms_declare += "\r\n";
                }
            }
        }

        //
        // 统计全部的 uniform
        //
        let uniforms = {};
        for (const layer of this.#layers) {
            for (const attr in layer) {
                const v = layer[attr];
                if (!(v instanceof ShaderUniform)) {
                    continue;
                }

                const define = v.valueDefine();
                if (isObject(define)) {
                    uniforms = {
                        ...uniforms,
                        ...define  ,
                    };
                }
            }
        }

        //
        // 释放存在blend
        //
        requirement.fs.blend = this.#layers.length > 1;

        //
        // 统计全部的 VS 代码
        //
        let vs = '';
        for (const layer of this.#layers) {
            if (!layer.enable) {
                continue;
            }

            //
            // 生成
            //
            const code = layer.vs();
            if (!isString(code)) {
                continue;
            }

            //
            // 加入代码
            //
            vs += code + "\r\n";
        }

        //
        // 统计全部的 FS 代码
        //
        let fs = '';
        let fs_first = true;
        for (const layer of this.#layers) {
            if (!layer.enable) {
                continue;
            }

            //
            // 生成
            //
            const code = layer.fs();
            if (!isString(code)) {
                continue;
            }

            //
            // 颜色
            //
            const alpha = layer.alpha ? layer.alpha.name : "";
            const blend = layer.blend ? layer.blend.name : "";

            //
            // 加入代码
            //
            fs += code + "\r\n";

            //
            // 如果是
            //
            if (fs_first) {
                fs_first = false;

                //
                // 第一个颜色作为底色
                //
                fs += `m3d_out.a *= ${alpha};   \r\n`;
                fs += `m3d_cur_color = m3d_out; \r\n`;
                fs += `m3d_out = V_4(0);        \r\n`;
            } else if(layer.isEffect) {
                //
                // 对颜色做处理
                //
                fs += `m3d_out.a *= ${alpha};   \r\n`;
                fs += `m3d_cur_color = m3d_out; \r\n`;
                fs += `m3d_out = V_4(0);        \r\n`;
            } else {
                //
                // 和底色合成
                //
                fs += `m3d_out.a *= ${alpha};                                  \r\n`;
                fs += `m3d_cur_color = Blend(m3d_out, m3d_cur_color, ${blend});\r\n`;
                fs += `m3d_out = V_4(0);                                       \r\n`;
            }
        }

        //
        // 设置到
        //
        this.#material.setup({
            defines                           ,
            uniforms                          ,
            uniforms_declare                  ,
            vs                                ,
            fs                                ,
            cache_key: `CMS:${++CACHE_KEY_ID}`,
        });
    }

    /**
     * 设置标记需要重建
     */
    markNeedsUpdate() {
        this.#need_update = true;
        this.#material.markNeedRebuild();
    }

    /**
     * 销毁
     */
    dispose() {
        
    }
}
