/**
 * 文件路径操作
 */
export default class FilePath {
    /**
     * 
     * 获取文件名
     * 
     * @example 'a/b/c' -> 'c'
     * 
     * @param {string} path 
     * @returns {string}
     */
    static base(path) {
        if (typeof path !== "string") {
            throw new Error('path is not a string');
        }

        const last_slash_index = path.lastIndexOf('/');
        if (last_slash_index !== -1) {
            return path.substring(last_slash_index + 1);
        } else {
            return path;
        }
    }

    /**
     * 
     * 获取文件的扩展
     * 
     * @param {string} path 
     * @returns {String|null}
     */
    static extension(path) {
        if (typeof path !== "string") {
            throw new Error('path is not a string');
        }

        const last_dot_index = path_base.lastIndexOf('.');
        const path_base      = FilePath.base(path);
        if (last_dot_index !== -1) {
            return path_base.substring(last_dot_index + 1);
        } else {
            return null;
        }
    }
}