/* eslint-disable no-unused-vars */

/**
 * 
 * 加载单个字体
 * 
 * @param {*} name 
 * @param {*} url 
 * @returns 
 */
export default async function(name, url) {
    const face = new FontFace(name, `url('${url}')`);
    await face.load();
    try {
        document.fonts.add(face);
    } catch (e) {
        console.error(e);
    }
    return face;
}
