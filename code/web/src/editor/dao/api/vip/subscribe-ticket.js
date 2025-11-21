/* eslint-disable no-unused-vars */

import isString   from 'lodash/isString';
import HttpClient from '../http-client';

/**
 * 
 * 返回 0 表示成功，
 * 返回 1 表示被人用了
 * 
 * @param {*} user_uuid 
 * @param {*} token 
 * @returns 
 */
export default async function(user_uuid, token) {
    if (!isString(user_uuid) || !isString(token)) {
        return false;
    }

    try {
        const client = new HttpClient();
        client.setUrl(`//api.make3d.online/v1/vip/subscribe-ticket`);
        client.setMethod('GET');
        client.setQuery('uuid', user_uuid);
        client.setQuery('token', token);
        const response = await client.Exec();
        if (!response.ok) {
            return false;
        }

        const data = JSON.parse(await response.text());
        if (data.success == 0) {
            return false;
        }
        return parseInt(data.content.status);
    } catch(e) {
        console.error(e);
    }
    return;
}