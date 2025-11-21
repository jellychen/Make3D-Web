/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * shader
 */
const shader_vs = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}`;

const shader_fs = `
precision highp float;
uniform sampler2D tDiffuse;
varying vec2 vUv;

void main() {
    vec4 color = texture2D(tDiffuse, vUv);

    // filter-black-white
#ifdef BLACK_WHITE
#if BLACK_WHITE
    {
        float arg = (color.r + color.g + color.b) / 3.0;
        if (arg >= 100.0/256.0) {
            color = vec4(1.0, 1.0, 1.0, color.a);
        } else {
            color = vec4(0.0, 0.0, 0.0, color.a);
        }
    }
#endif
#endif

    // filter-brown
#ifdef BROWN
#if BROWN
    {
        float new_r = color.r * 0.393 + color.g * 0.769 + color.b * 0.189;
        float new_g = color.r * 0.349 + color.g * 0.686 + color.b * 0.168;
        float new_b = color.r * 0.272 + color.g * 0.534 + color.b * 0.131;
        color = vec4(new_r, new_g, new_b, color.a);
    }
#endif
#endif

    // casting
#ifdef CASTING
#if CASTING
    {
        float new_r = color.r / (color.g + color.b + 1.0);
        float new_g = color.g / (color.r + color.b + 1.0);
        float new_b = color.b / (color.g + color.r + 1.0);
        color = vec4(new_r, new_g, new_b, color.a);
    }
#endif
#endif

    // color-reverse
#ifdef COLOR_REVERSE
#if COLOR_REVERSE
    {
        color = vec4(1.0 - color.r, 1.0 - color.g, 1.0 - color.b, color.a);
    }
#endif
#endif

    // comic-strip
#ifdef COMIC_STRIP
#if COMIC_STRIP
    {
        float r = color.r;
        float g = color.g;
        float b = color.b;
        float a = color.a;
        float new_r = abs(g - b + g + r) * r;
        float new_g = abs(b - g + b + r) * r;
        float new_b = abs(b - g + b + r) * g;
        color = vec4(new_r, new_g, new_b, a);
    }
#endif
#endif

    // filter-freeze
#ifdef FREEZE
#if FREEZE
    {
        float r = color.r;
        float g = color.g;
        float b = color.b;
        float a = color.a;
        float new_r = clamp((r - g - b) * 3.0 / 2.0, 0.0, 1.0);
        float new_g = clamp((g - r - b) * 3.0 / 2.0, 0.0, 1.0);
        float new_b = clamp((b - g - r) * 3.0 / 2.0, 0.0, 1.0);
        color = vec4(new_r, new_g, new_b, a);
    }
#endif
#endif

    // filter-mean
#ifdef MEAN
#if MEAN
    {
        float v = (color.r + color.g + color.b) / 3.0;
        color = vec4(v, v, v, color.a);
    }
#endif
#endif

    // filter-monochrome
#ifdef MONOCHROME
#if MONOCHROME
    {
        vec4 new_color = vec4(0, 0, 0, color.a);

#ifdef MONOCHROME_CHANNEL_R
#if MONOCHROME_CHANNEL_R
        new_color.r = color.r;
#endif
#endif

#ifdef MONOCHROME_CHANNEL_G
#if MONOCHROME_CHANNEL_G
        new_color.g = color.g;
#endif
#endif

#ifdef MONOCHROME_CHANNEL_B
#if MONOCHROME_CHANNEL_B
        new_color.b = color.b;
#endif
#endif

        color = new_color; 
    }
#endif
#endif

    // filter-reminiscence
#ifdef REMINISCENCE
#if REMINISCENCE
    {
        float r = color.r;
        float g = color.g;
        float b = color.b;
        float a = color.a;
        float new_r = (0.393 * r + 0.769 * g + 0.189 * b);
        float new_g = (0.349 * r + 0.686 * g + 0.168 * b);
        float new_b = (0.272 * r + 0.534 * g + 0.131 * b);
        color = vec4(new_r, new_g, new_b, a);
    }
#endif
#endif

    gl_FragColor = color;
}`;

/**
 * 单Pass滤镜
 */
export default class Filter extends XThree.ShaderMaterial {
    /**
     * 
     */
    #monochrome_channel = 'red';

    /**
     * 构造函数
     */
    constructor() {
        super({
            vertexShader: shader_vs,
            fragmentShader: shader_fs,

            defines: {
                BLACK_WHITE: 0,
                BROWN: 0,
                CASTING: 0,
                COLOR_REVERSE: 0,
                COMIC_STRIP: 0,
                FREEZE: 0,
                MEAN: 0,
                MONOCHROME: 0,
                MONOCHROME_CHANNEL_R: 1,
                MONOCHROME_CHANNEL_G: 1,
                MONOCHROME_CHANNEL_B: 1,
                REMINISCENCE: 0,
            },

            uniforms: {
                tDiffuse: {
                    value: null
                },
            },
        });

        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'filter';
    }

    /**
     * 
     * 准备
     * 
     * @param {*} context 
     */
    prepare(context) { }

    /**
     * 
     * 设置要处理的图
     * 
     * @param {*} texture 
     */
    setTexture(texture) {
        this.uniforms.tDiffuse.value = texture;
        this.needsUpdate = true;
    }

    /**
     * 
     * 黑白滤镜
     * 
     * @returns Boolean
     */
    getBlackWhite() {
        return 1 == this.defines.BLACK_WHITE;
    }

    /**
     * 
     * 黑白滤镜
     * 
     * @param {Boolean} enable 
     */
    setBlackWhite(enable) {
        if (true === enable) {
            if (0 == this.defines.BLACK_WHITE) {
                this.defines.BLACK_WHITE = 1;
                this.needsUpdate = true;
            }
        } else {
            if (1 == this.defines.BLACK_WHITE) {
                this.defines.BLACK_WHITE = 0;
                this.needsUpdate = true;
            }
        }
    }

    /**
     * 
     * 褐色滤镜
     * 
     * @returns Boolean
     */
    getBrown() {
        return 1 == this.defines.BROWN;
    }

    /**
     * 
     * 褐色滤镜
     * 
     * @param {Boolean} enable 
     */
    setBrown(enable) {
        if (true === enable) {
            if (0 == this.defines.BROWN) {
                this.defines.BROWN = 1;
                this.needsUpdate = true;
            }
        } else {
            if (1 == this.defines.BROWN) {
                this.defines.BROWN = 0;
                this.needsUpdate = true;
            }
        }
    }

    /**
     * 
     * 熔铸
     * 
     * @returns Boolean
     */
    getCasting() {
        return 1 == this.defines.CASTING;
    }

    /**
     * 
     * 熔铸
     * 
     * @param {Boolean} enable 
     */
    setCasting(enable) {
        if (true === enable) {
            if (0 == this.defines.CASTING) {
                this.defines.CASTING = 1;
                this.needsUpdate = true;
            }
        } else {
            if (1 == this.defines.CASTING) {
                this.defines.CASTING = 0;
                this.needsUpdate = true;
            }
        }
    }

    /**
     * 
     * 颜色反转
     * 
     * @returns Boolean
     */
    getColorReverse() {
        return 1 == this.defines.COLOR_REVERSE;
    }

    /**
     * 
     * 设置颜色反转
     * 
     * @param {Boolean} enable 
     */
    setColorReverse(enable) {
        if (true === enable) {
            if (0 == this.defines.COLOR_REVERSE) {
                this.defines.COLOR_REVERSE = 1;
                this.needsUpdate = true;
            }
        } else {
            if (1 == this.defines.COLOR_REVERSE) {
                this.defines.COLOR_REVERSE = 0;
                this.needsUpdate = true;
            }
        }
    }

    /**
     * 
     * 连环画
     * 
     * @returns Boolean
     */
    getComicStrip() {
        return 1 == this.defines.COMIC_STRIP;
    }

    /**
     * 
     * 设置连环画
     * 
     * @param {Boolean} enable 
     */
    setComicStrip(enable) {
        if (true === enable) {
            if (0 == this.defines.COMIC_STRIP) {
                this.defines.COMIC_STRIP = 1;
                this.needsUpdate = true;
            }
        } else {
            if (1 == this.defines.COMIC_STRIP) {
                this.defines.COMIC_STRIP = 0;
                this.needsUpdate = true;
            }
        }
    }

    /**
     * 
     * 冰冻特效
     * 
     * @returns Boolean
     */
    getFreeze() {
        return 1 == this.defines.FREEZE;
    }

    /**
     * 
     * 设置冰冻特效
     * 
     * @param {Boolean} enable 
     */
    setFreeze(enable) {
        if (true === enable) {
            if (0 == this.defines.FREEZE) {
                this.defines.FREEZE = 1;
                this.needsUpdate = true;
            }
        } else {
            if (1 == this.defines.FREEZE) {
                this.defines.FREEZE = 0;
                this.needsUpdate = true;
            }
        }
    }

    /**
     * 
     * 均值
     * 
     * @returns Boolean
     */
    getMean() {
        return 1 == this.defines.MEAN;
    }

    /**
     * 
     * 开启均值
     * 
     * @param {Boolean} enable 
     */
    setMean(enable) {
        if (true === enable) {
            if (0 == this.defines.MEAN) {
                this.defines.MEAN = 1;
                this.needsUpdate = true;
            }
        } else {
            if (1 == this.defines.MEAN) {
                this.defines.MEAN = 0;
                this.needsUpdate = true;
            }
        }
    }

    /**
     * 
     * 均值
     * 
     * @returns Boolean
     */
    getReminiscence() {
        return 1 == this.defines.REMINISCENCE;
    }

    /**
     * 
     * 设置均值特效
     * 
     * @param {Boolean} enable 
     */
    setReminiscence(enable) {
        if (true === enable) {
            if (0 == this.defines.REMINISCENCE) {
                this.defines.REMINISCENCE = 1;
                this.needsUpdate = true;
            }
        } else {
            if (1 == this.defines.REMINISCENCE) {
                this.defines.REMINISCENCE = 0;
                this.needsUpdate = true;
            }
        }
    }

    /**
     * 
     * 单色通道
     * 
     * @returns Boolean
     */
    getMonochrome() {
        return 1 == this.defines.MONOCHROME;
    }

    /**
     * 
     * 开启单色通道
     * 
     * @param {Boolean} enable 
     */
    setMonochrome(enable) {
        if (true === enable) {
            if (0 == this.defines.MONOCHROME) {
                this.defines.MONOCHROME = 1;
                this.needsUpdate = true;
            }
        } else {
            if (1 == this.defines.MONOCHROME) {
                this.defines.MONOCHROME = 0;
                this.needsUpdate = true;
            }
        }
    }

    /**
     * 
     * 设置单色通道
     * 
     * @param {string} channel 
     */
    setMonochromeChannel(channel) {
        let channel_lowercase = channel.toLocaleLowerCase();
        if (this.#monochrome_channel === channel_lowercase) {
            return;
        }

        this.defines.MONOCHROME_CHANNEL_R = 0;
        this.defines.MONOCHROME_CHANNEL_G = 0;
        this.defines.MONOCHROME_CHANNEL_B = 0;

        if ('red' === channel_lowercase) {
            this.defines.MONOCHROME_CHANNEL_R = 1;
        } else if ('green' === channel_lowercase) {
            this.defines.MONOCHROME_CHANNEL_G = 1;
        } else if ('blue' === channel_lowercase) {
            this.defines.MONOCHROME_CHANNEL_B = 1;
        }

        this.#monochrome_channel = channel_lowercase;
        this.needsUpdate = true;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
