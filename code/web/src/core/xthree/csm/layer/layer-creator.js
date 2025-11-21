/* eslint-disable no-unused-vars */

import Attenuation    from "./attenuation";
import Color          from "./color";
import Displacement   from "./displacement";
import Normal         from "./normal";
import Fresnel        from "./fresnel";
import Gradient       from "./gradient";
import Noise          from "./noise";
import NoiseSnowflake from "./noise-snowflake";
import Texture        from "./texture";
import Pbr            from "./pbr";
import Matcap         from "./matcap";
import Luminance      from "./luminance";

import Grey           from "./effect/grey";
import Brightness     from "./effect/brightness";
import Mean           from "./effect/mean";
import Reverse        from "./effect/reverse";
import Brown          from "./effect/brown";
import BlackWhite     from "./effect/black-white";
import Freeze         from "./effect/freeze";
import ComicStrip     from "./effect/comic-strip";
import Toon           from "./effect/toon";
import Exposure       from "./effect/exposure";

/**
 * 
 * 创建层
 * 
 * @param {*} type 
 * @returns 
 */
export default function(type) {
    switch (type) {
    case 'attenuation':
        return new Attenuation();
    case 'color':
        return new Color();
    case 'displacement':
        return new Displacement();
    case 'normal':
        return new Normal();
    case 'pbr':
        return new Pbr();
    case 'fresnel':
        return new Fresnel();
    case 'gradient':
        return new Gradient();
    case 'texture':
        return new Texture();
    case 'noise':
        return new Noise();
    case 'noise-snowflake':
        return new NoiseSnowflake();
    case 'matcap':
        return new Matcap();
    case 'luminance':
        return new Luminance();

    case 'grey':
        return new Grey();
    case 'brightness':
        return new Brightness();
    case 'mean':
        return new Mean();
    case 'reverse':
        return new Reverse();
    case 'brown':
        return new Brown();
    case 'black-white':
        return new BlackWhite();
    case 'freeze':
        return new Freeze();
    case 'comic-strip':
        return new ComicStrip();
    case 'exposure':
        return new Exposure();
    case 'toon':
        return new Toon();
    }
}
