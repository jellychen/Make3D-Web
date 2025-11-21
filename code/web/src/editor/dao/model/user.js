
import API             from '@editor/dao/api';
import EventDispatcher from '@common/misc/event-dispatcher';
import Auth            from '@common/supabase/authentication';

/**
 * 用户数据
 */
class User extends EventDispatcher {
    /**
     * 具体数据
     */
    #authed       = false;
    #uid          = 0;
    #create_at    = new Date(0);
    #name         = 'undefined';
    #email        = 'undefined';
    #image        = 'undefined';
    #vip          = false;
    #vip_deadline = new Date(0);

    /**
     * 获取
     */
    get authed() {
        return this.#authed;
    }

    /**
     * 获取
     */
    get uid() {
        return this.#uid;
    }

    /**
     * 获取
     */
    get create_at() {
        return this.#create_at;
    }

    /**
     * 获取
     */
    get name() {
        return this.#name;
    }

    /**
     * 获取
     */
    get email() {
        return this.#email;
    }

    /**
     * 获取
     */
    get image() {
        return this.#image;
    }

    /**
     * 获取
     */
    get vip() {
        return this.#vip;
    }

    /**
     * 获取
     */
    get vip_deadline() {
        return this.#vip_deadline;
    }

    /**
     * 构造函数
     */
    constructor() {
        super();
    }

    /**
     * 重置
     */
    #Reset() {
        this.#authed       = false;
        this.#uid          = 0;
        this.#create_at    = new Date(0);
        this.#name         = 'undefined';
        this.#email        = 'undefined';
        this.#image        = 'undefined';
        this.#vip_deadline = new Date(0);
    }

    /**
     * 刷新登录态
     */
    async Refresh() {

        // 重置
        this.#Reset();

        // 获取数据
        const result = await Auth.RefreshSession();
        if (!result || !result.data || !result.data.session) {
            return;
        }

        const session = result.data.session;
        if (!session.user || !session.user.user_metadata) {
            return;
        }

        // 获取数据
        const user          = session.user;
        const user_metadata = session.user.user_metadata;

        // 获取数据
        const uid       = user.id;
        const create_at = new Date(user.created_at);
        const email     = user_metadata.email;
        const picture   = user_metadata.picture;
        const name      = user_metadata.name;

        // 保存数据
        this.#authed    = true;
        this.#uid       = uid;
        this.#create_at = create_at;
        this.#email     = email;
        this.#image     = picture;
        this.#name      = name;

        // 刷新 VIP
        await this.RefreshVip();

        return true;
    }

    /**
     * 
     * 提交一次使用记录
     * 
     * @returns 
     */
    async RefreshUseRecoder() {
        if (this.#authed) {
            await API.user.useRecoder(this.#uid);
        }
        return true;
    }

    /**
     * 
     * 刷新会员状态
     * 
     * @returns 
     */
    async RefreshVip() {
        //
        // 刷新VIP的数据
        //
        const data = await API.vip.getData(this.#uid);
        this.#vip_deadline = data.deadline;
        this.#vip = data.current < data.deadline;

        //
        // 发出通知
        //
        this.dispatch('changed', {});

        return true;
    }

    /**
     * 退出
     */
    async SignOut() {
        /**
         * 擦除数据
         */
        this.#Reset();

        /**
         * 发出退出
         */
        await Auth.SignOut();

        //
        // 发出通知
        //
        this.dispatch('changed', {});
    }
}

export default new User();
