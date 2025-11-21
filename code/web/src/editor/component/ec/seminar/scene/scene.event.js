/* eslint-disable no-unused-vars */

import Scene from './scene';

/**
 * Mixin
 */
Object.assign(Scene.prototype, {
    /**
     * 
     * 键盘按下
     * 
     * @param {*} event 
     */
    onKeyDown(event) {
        if (!this.coordinator.is_abattoir_focused) {
            return;
        }
    },

    /**
     * 
     * 键盘按键弹起
     * 
     * @param {*} event 
     */
    onKeyUp(event) {
        if (!this.coordinator.is_abattoir_focused) {
            return;
        }

        switch (event.code) {
        case 'Backspace':
            return this.removeAllSelectedObjects();
        }
    }
});