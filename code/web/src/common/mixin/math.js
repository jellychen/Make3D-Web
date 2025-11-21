/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/**
 * 
 * 挤压
 * 
 * @param {Number} num 
 * @param {Number} min 
 * @param {Number} max 
 */
Math.clamp = (num, min, max) => {
    return Math.min(Math.max(num, min), max);
};

/**
 * 
 * 放大求余
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} multiple 
 */
Math.mod = (x, y, multiple = 1000) => {
    x = parseInt(x * multiple);
    y = parseInt(y * multiple);
    x = x % y;
    return x / multiple;
};

/**
 * 
 * 角度转弧度
 * 
 * @param {Number} num 
 * @returns 
 */
Math.D2A_ = (num) => {
    return num / 180 * Math.PI;
};

/**
 * 
 * 弧度转角度
 * 
 * @param {Number} num 
 * @returns 
 */
Math.A2D_ = (num) => {
    return num / Math.PI * 180;
};

/**
 * 
 * 计算
 * 
 * @param {Number} num 
 * @returns
 */
Math.NextPowerOfTwo = (n) => {
    if (n <= 0) return 1;   // 如果 n <= 0，直接返回 1，因为 2^0 = 1
    n--;                    // 先减去 1，以处理 n 本身为 2 的情况
    n |= n >> 1;            // 将 n 的每一位和其右边的一位进行或运算
    n |= n >> 2;            // 将 n 的每两位进行或运算
    n |= n >> 4;            // 将 n 的每四位进行或运算
    n |= n >> 8;            // 将 n 的每八位进行或运算
    n |= n >> 16;           // 将 n 的每十六位进行或运算（适用于较大的整数）
    return n + 1;           // 返回结果时加 1
};

/**
 * 随机数
 */
Math.Random = (min, max) => {
    return Math.random() * (max - min) + min;
};

/**
 * 随机数
 */
Math.RandomInt = (min, max) => {
    const minCeiled  = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
};
