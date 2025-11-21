/* eslint-disable no-unused-vars */

export default
`
vec2 m3d_matcap_uv;

{
    vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
    
    // 0.495 to remove artifacts caused by undersized matcap disks
	m3d_matcap_uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
}
`
