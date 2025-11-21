
import BlockAo           from './ao/v';
import BlockClearcoat    from './clearcoat/v';
import BlockColor        from './color/v';
import BlockEmissive     from './emissive/v';
import BlockMetalness    from './metalness/v';
import BlockNormal       from './normal/v';
import BlockRoughness    from './roughness/v';
import BlockSheen        from './sheen/v';
import BlockSpecular     from './specular/v';
import BlockTransmission from './transmission/v';

/**
 * 
 * 构建
 * 
 * @param {*} type 
 * @param {*} coordinator 
 */
export default function Creator(type, coordinator) {
    switch(type) {
    case 'ao':
        return new BlockAo(coordinator);
    case 'clearcoat':
        return new BlockClearcoat(coordinator);
    case 'color':
        return new BlockColor(coordinator);
    case 'emissive':
        return new BlockEmissive(coordinator);
    case 'metalness':
        return new BlockMetalness(coordinator);
    case 'normal':
        return new BlockNormal(coordinator);
    case 'roughness':
        return new BlockRoughness(coordinator);
    case 'sheen':
        return new BlockSheen(coordinator);
    case 'specular':
        return new BlockSpecular(coordinator);
    case 'transmission':
        return new BlockTransmission(coordinator);
    }
}
