/* eslint-disable no-unused-vars */

import isObject   from 'lodash/isObject';
import isInteger  from 'lodash/isInteger';
import HttpClient from '../http-client';

/**
 * 
 * 启动支付流程
 * 
 * @param {*} user_uuid 
 * @param {*} cls       1/3/12
 * @param {*} email 
 */
export default async function(user_uuid, cls, email) {
    try {
        const client = new HttpClient();
        client.setUrl(`//api.make3d.online/v1/payment/creem/checkout-session`);
        client.setMethod('GET');
        client.setQuery('uid', user_uuid);
        client.setQuery('cls', cls);
        client.setQuery('email', email);
        const response = await client.Exec();
        if (!response.ok) {
            return false;
        }

        const data = JSON.parse(await response.text());
        if (!isObject(data)) {
            return false;
        }

        if (!isInteger(data.success) || data.success != 0) {
            return false;
        }

        const content = data.content;
        return {
            request_id: content.request_id,
            url       : content.url,
        };
    } catch(e) {
        console.error(e);
    }
    return false;
}