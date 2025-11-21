
import axios from 'axios';

/**
 * 
 * 下载指定的URL为Arraybuffer
 * 
 * @param {*} url 
 * @param {*} timeout 
 * @returns 
 */
export default async function(url, timeout) {
    const response = await axios({
        url,
        method      : 'GET',
        responseType: 'arraybuffer',
        timeout     : timeout
    });

    if (response.data instanceof ArrayBuffer) {
        return response.data;
    }
}