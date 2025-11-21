/* eslint-disable no-unused-vars */

import isArray from 'lodash/isArray';

/**
 * 
 * 加载字体
 * 
 * @param {*} conf 
 */
export default async function(conf) {
    const faces = [];
    const tasks = [];
    if (isArray(conf)) {
        for (const font of conf) {
            try {
                const face = new FontFace(font.name, `url('${font.url}')`);
                tasks.push(face.load());
                faces.push(face);
            } catch(e) {
                console.error(e);
            }
        }
    } else {
        const font = conf;
        try {
            const face = new FontFace(font.name, `url('${font.url}')`);
            tasks.push(face.load());
            faces.push(face);
        } catch(e) {
            console.error(e);
        }
    }

    await Promise.allSettled(tasks);
    for (const face of faces) {
        try {
            document.fonts.add(face);
        } catch (e) {
            console.error(e);
        }
    }
    return faces;
}
