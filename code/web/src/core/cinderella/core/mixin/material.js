
// https://github.com/memononen/nanovg/blob/master/src/nanovg.c

import XThree from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Material.prototype, {
    /**
     * 
     * 设置不透明度 0 - 1
     * 
     * @param {Number} opacity 
     */
    setOpacity(opacity = 1) {
        this.opacity = opacity;
    },

    /**
     * 
     * 设置是否开启透明渲染
     * 
     * @param {Boolean} transparent 
     */
    setTransparent(transparent) {
        this.transparent = transparent;
    },

    /**
     * 
     * 设置渲染面 
     * 
     * XThree.FrontSide/XThree.BackSide/XThree.DoubleSide
     * 
     * @param {*} side 
     */
    setSide(side) {
        this.side = side;
    },

    /**
     * 
     * 使用纹理
     * 
     * @param {*} texture 
     * @returns 
     */
    useTexture(texture) {
        if (texture instanceof XThree.Texture) {
            texture.__$$_add_ref__();
        }
        return texture;
    },

    /**
     * 
     * 取消使用纹理
     * 
     * @param {*} texture 
     * @returns 
     */
    unuseTexture(texture) {
        if (texture instanceof XThree.Texture) {
            texture.__$$_del_ref__();
        }
        return texture;
    }
});
