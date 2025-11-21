/* eslint-disable no-unused-vars */

import isString   from 'lodash/isString';
import HttpClient from '../http-client';

/**
 * 
 * 获取信息
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
        client.setUrl(`//api.make3d.online/v1/vip/get-data-by-user-uuid`);
        client.setMethod('GET');
        client.setQuery('uuid', user_uuid);
        const response = await client.Exec();
        if (!response.ok) {
            return;
        }
        
        const data = JSON.parse(await response.text());
        const content = data.content;
        return {
            current  : new Date(content.current ),
            deadline : new Date(content.deadline),
        };
    } catch(e) {
        console.error(e);
    }
    return;    
}