/* eslint-disable no-unused-vars */

/**
 * Item数据
 */
export default class ItemData {
    /**
     * 标记是不是分割线
     */
    sparator = false;
    
    /**
     * 数据
     */
    icon;
    text;
    text_token;

    /**
     * 令牌
     */
    token = 0;

    /**
     * 可用
     */
    enable = true;

    /**
     * 孩子信息
     */
    children = [];
}

/*
    [
        {
            icon,
            text,
            text_token,
            token,
            enable,
            children: [

            ]
        },

        {

        },

        {

        }
    ]
 */
