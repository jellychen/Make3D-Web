/* eslint-disable no-unused-vars */

import isString   from 'lodash/isString';
import HttpClient from '../http-client';

/**
 * 
 * 记录用户使用日志
 * 
 * @param {*} user_uuid 
 * @returns 
 */
export default async function(user_uuid) {
    if (!isString(user_uuid)) {
        throw new Error('user_uuid error');
    }

    try {
        const client = new HttpClient();
        client.setUrl(`//api.make3d.online/v1/user/use-recoder`);
        client.setMethod('GET');
        client.setQuery('uuid', user_uuid);
        return await client.Exec().ok;
    } catch(e) {
        console.error(e);
    }
    return;
}