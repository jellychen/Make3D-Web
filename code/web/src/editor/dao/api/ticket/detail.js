/* eslint-disable no-unused-vars */

import isObject   from 'lodash/isObject';
import isInteger  from 'lodash/isInteger';
import isString   from 'lodash/isString';
import HttpClient from '../http-client';

/**
 * 获取信息
 */
export default async function(ticket) {
    if (!isString(ticket) || ticket.length == 0) {
        return false;
    }

    try {
        const client = new HttpClient();
        client.setUrl(`//api.make3d.online/v1/accode/detail`);
        client.setMethod('GET');
        client.setQuery('token', ticket);
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
            version   : content.version,
            uuid      : content.uuid,
            months    : parseInt(content.months),
            created_at: new Date(content.created_at),
            isused    : content.isused,
        };
    } catch(e) {
        console.error(e);
    }
}