/* eslint-disable no-unused-vars */

export default 
`
vec4 AlphaBlend(vec4 src, vec4 dst) {
    float outA = src.a + dst.a * (1.0 - src.a);
    vec3 outRGB = (src.rgb * src.a + dst.rgb * dst.a * (1.0 - src.a)) / outA;
    return vec4(outRGB, outA);
}

vec4 AdditiveBlend(vec4 src, vec4 dst) {
    vec3 outRGB = src.rgb * src.a + dst.rgb;
    float outA = clamp(src.a + dst.a, 0.0, 1.0);
    return vec4(outRGB, outA);
}

vec4 MultiplyBlend(vec4 src, vec4 dst) {
    vec3 outRGB = dst.rgb * src.rgb;
    float outA = src.a + dst.a * (1.0 - src.a);
    return vec4(outRGB, outA);
}

vec4 ScreenBlend(vec4 src, vec4 dst) {
    vec3 outRGB = 1.0 - (1.0 - src.rgb) * (1.0 - dst.rgb);
    float outA = src.a + dst.a * (1.0 - src.a);
    return vec4(outRGB, outA);
}

vec4 OverlayBlend(vec4 src, vec4 dst) {
    vec3 outRGB = mix(
        2.0 * dst.rgb * src.rgb,
        1.0 - 2.0 * (1.0 - dst.rgb) * (1.0 - src.rgb),
        step(0.5, dst.rgb)
    );
    float outA = src.a + dst.a * (1.0 - src.a);
    return vec4(outRGB, outA);
}

vec4 DifferenceBlend(vec4 src, vec4 dst) {
    vec3 outRGB = abs(dst.rgb - src.rgb);
    float outA = src.a + dst.a * (1.0 - src.a);
    return vec4(outRGB, outA);
}

vec4 Blend(vec4 src, vec4 dst, int mode) {
    if (mode == 0) return AlphaBlend     (src, dst);
    if (mode == 1) return AdditiveBlend  (src, dst);
    if (mode == 2) return MultiplyBlend  (src, dst);
    if (mode == 3) return ScreenBlend    (src, dst);
    if (mode == 4) return OverlayBlend   (src, dst);
    if (mode == 5) return DifferenceBlend(src, dst);
    return src;
}
`
