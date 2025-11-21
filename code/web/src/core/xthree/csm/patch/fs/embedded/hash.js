/* eslint-disable no-unused-vars */

export default
`
vec3 hash(uvec3 x) {
    const uint k = 1103515245U;
    x = ((x>>8U)^x.yzx)*k;
    x = ((x>>8U)^x.yzx)*k;
    x = ((x>>8U)^x.yzx)*k;
    return vec3(x)*(1.0 / float(0xffffffffU));
}
`
