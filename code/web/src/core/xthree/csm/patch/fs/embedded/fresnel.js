/* eslint-disable no-unused-vars */

export default
`
//
// M3d factor = 5.0
//
float Fresnel(float cosTheta, float factor) {
    return pow(1.0 - cosTheta, factor);
}
`
