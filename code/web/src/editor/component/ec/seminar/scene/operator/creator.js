/* eslint-disable no-unused-vars */

import isString   from 'lodash/isString';

import Plane      from './plane';
import PlaneGrid  from './plane-grid';
import Polygon    from './polygon';
import Cube       from './cube';
import Cone       from './cone';
import Cylinder   from './cylinder';
import Sphere     from './sphere';
import Pyramid    from './pyramid';
import Torus      from './torus';
import Helix      from './helix';
import Susan      from './susan';
import SVG        from './svg';

import Tube       from './tube';

import LightDir   from './light/dir';
import LightPoint from './light/point';
import LightSpot  from './light/spot';

/**
 * 
 * 工厂
 * 
 * @param {*} ec 
 * @param {*} type 
 * @param {*} coordinator 
 * @param {*} assistor 
 * @returns 
 */
export default function Creator(ec, type, coordinator, assistor) {
    if (!isString(type)) {
        return null;
    }
    
    let smc = undefined;
    if      ('plane'       === type) smc = Plane;
    else if ('plane.grid'  === type) smc = PlaneGrid;
    else if ('polygon'     === type) smc = Polygon;
    else if ('cone'        === type) smc = Cone;
    else if ('cube'        === type) smc = Cube;
    else if ('cylinder'    === type) smc = Cylinder;
    else if ('sphere'      === type) smc = Sphere;
    else if ('pyramid'     === type) smc = Pyramid;
    else if ('torus'       === type) smc = Torus;
    else if ('helix'       === type) smc = Helix;
    else if ('susan'       === type) smc = Susan;
    else if ('svg'         === type) smc = SVG;
    else if ('light.point' === type) smc = LightPoint;
    else if ('light.dir'   === type) smc = LightDir;
    else if ('light.spot'  === type) smc = LightSpot;
    else if ('tube'        === type) smc = Tube;

    // 构建
    if (smc) {
        return new smc(ec, coordinator, assistor);
    }
    
    return null;
}
