
import { createClient } from '@supabase/supabase-js';
import Conf             from './conf';

/**
 * 登录
 */
class Authentication {
    /**
     * 客户端
     */
    #client;

    /**
     * 构造函数
     */
    constructor() {
        this.#client = createClient(Conf.url, Conf.key);
    }

    /**
     * 
     * 刷新
     * 
     * @returns 
     */
    async RefreshSession() {
        return this.#client.auth.getSession();
    }

    /**
     * 
     * 获取用户信息
     * 
     * @returns 
     */
    async UserInfo() {
        try {
            const { data } = await this.#client.auth.getUser();
            if (data && data.user) {
                return data.user;
            }
        } catch(e) {
            console.error(e);
        }
    }

    /**
     * 
     * 登录
     * 
     * @param {*} provider  figma/google
     * @param {*} redirect 
     * @returns 
     */
    async SignIn(provider, redirect) {
        return await this.#client.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: redirect,
            },
        });
    }

    /**
     * 
     * 通过调整新的窗口来登录
     * 
     * @param {*} provider 
     */
    SignInPopupWindow(provider) {
        const relative       = `/auth/index.html?provider=${provider}`;
        const absolute       = new URL(relative, window.location.origin).href;
        const dualScreenLeft = window.screenLeft ?? window.screenX;
        const dualScreenTop  = window.screenTop ?? window.screenY;
        const w              = 800;
        const h              = 600;
        const width          = window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
        const height         = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height;
        const left           = dualScreenLeft + (width - w) / 2;
        const top            = dualScreenTop + (height - h) / 2;

        window.open(absolute, "Make3D-Auth", [
            `width=${w}`,
            `height=${h}`,
            `top=${top}`,
            `left=${left}`,
            'scrollbars=yes',
            'resizable=yes'
          ].join(','));
    }

    /**
     * 登出
     */
    async SignOut() {
        return await this.#client.auth.signOut();
    }
}

export default new Authentication();
