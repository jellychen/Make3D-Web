
import LoginBaned from './v';

/**
 * 
 * 显示登录被Baned
 * 
 * @returns 
 */
export default function() {
    const panel = new LoginBaned();
    document.body.appendChild(panel);
    return panel;
}