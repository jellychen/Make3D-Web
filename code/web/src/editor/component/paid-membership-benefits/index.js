/* eslint-disable no-unused-vars */

import Benefits from './v';

/**
 * 
 * 显示
 * 
 * @returns 
 */
export default function Show() {
    const benefits = new Benefits();
    document.body.appendChild(benefits);
    return benefits;
}