
import Auth                   from '@common/supabase/authentication';
import GlobalBroadcastChannel from '@common/global-broadcast-channel';

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
        console.log(await Auth.RefreshSession());
        console.log(await Auth.UserInfo());
        GlobalBroadcastChannel.postMessage(
            'user-login-changed', { 
                time: performance.now()
            });
        setTimeout(() => window.close(), 100);
    }
}

const app = new APP(); await app.start();
