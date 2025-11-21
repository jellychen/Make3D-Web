/* eslint-disable no-undef */

const svgs = require.context('@assets/svg/dcc/icons', true, /\.svg$/); // svg

/**
 *  
 * 根据文件名获取SVG
 * 
 * @param {*} file_name 
 * @returns 
 */
export default function getSvg(file_name) {
   if (undefined == file_name) {
       return null;
   }

   //
   // {
   //      viewBox
   //      url
   // }
   //

   try {
       return svgs(`./${file_name}`).default;
   } catch(e) {
        console.error(e);
   }
}
