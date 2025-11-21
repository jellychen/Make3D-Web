
/**
 * 
 * 加载远程的Wasm模块
 * 
 * @param {string} mainScriptUrl 
 * @param {string} workScriptUrl 
 * @param {string} wasmUrl 
 * @param {function} callback 
 */
export default function (mainScriptUrl, workScriptUrl, wasmUrl, callback) {
    callback = callback || (() => { });
    import(/* webpackIgnore: true */ mainScriptUrl).then(({default: module}) => {
        module({
            mainScriptUrlOrBlob: mainScriptUrl,

            preRun: () => {
            },

            locateFile(path) {
                if (path.endsWith('.wasm')) {
                    return wasmUrl;
                } else if (path.endsWith('.worker.js')) {
                    return workScriptUrl;
                }
            }
                
        }).then((m) => {
            callback(true, m);
        }).catch(err => {
            console.warn(err);
            callback(false, err);
        })
    }).catch(err => {
        console.warn(err);
        callback(false, err);
    });
}
