/* eslint-disable no-unused-vars */

import Timer      from './timer/v';
import Key        from './key/v';
import UserDefine from './user-define/v';

/**
 * 
 * 构建设置面板
 * 
 * @param {*} type 
 * @param {*} user_data 
 */
export default function(type, user_data) {
    switch(type) {
    case 'key':
    case 'keydown':
    case 'keyup':
    case 'keypress': {
        const editor = new Key();
        editor.updateUserData(user_data);
        return editor;
    }

    case 'timer': {
        const editor = new Timer();
        editor.updateUserData(user_data);
        return editor;
    }

    case 'user-define': {
        const editor = new UserDefine();
        editor.updateUserData(user_data);
        return editor;
    }
    }
}
