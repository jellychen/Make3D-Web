/* eslint-disable no-unused-vars */

// https://www.npmjs.com/package/opfs-tools

import { file, dir, write } from 'opfs-tools';

/**
 * FS
 */
export default class FS {
    /**
     * 
     * 文件夹
     * 
     * 属性
     *      kind
     *      name
     *      path
     *      parent
     * 
     * 方法
     *      create(): Promise<OPFSDirWrap>;
     *      exists(): Promise<boolean>;
     *      remove(): Promise<void>;
     *      children(): Promise<Array<OPFSDirWrap | OPFSFileWrap>>;
     * 
     * @param {*} path 
     * @returns 
     */
    static Dir(path) { return dir(path); }

    /**
     * 
     * 打开一个指定的文件
     * 
     * @param {*} path 
     * @returns 
     */
    static File(path) { return file(path); }
}
