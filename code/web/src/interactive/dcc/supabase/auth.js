
import isString from 'lodash/isString';
import Auth     from '@common/supabase/authentication';

/**
 * 入口
 */
export default class APP {
    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 启动函数
     */
    async start() {
        const params = new URL(document.location).searchParams;
        let provider = params.get('provider');
        if (!isString(provider)) {
            window.close();
            return;
        }
        provider = provider.toLocaleLowerCase();

        // 获取跳转的地址
        const relative = '/auth/redirected.html';
        const absolute = new URL(relative, window.location.origin).href;
        

        // 登录
        await Auth.SignIn(provider, absolute);
    }
}

const app = new APP(); await app.start();

