#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define SPHERE_RADIUS 0.25
#define T_MAX 20.0

// signed distance function to an ellipsoid
float sd_ellipsoid(in vec3 pos, vec3 radii) {
    float k0 = length(pos / radii);
    float k1 = length(pos / radii / radii);
    return k0 * (k0 - 1.0) / k1;
}

// signed distance function to the blobby character 'guy'
float sd_guy(in vec3 pos) {
    float t = 0.5; //fract(u_time);
    float y = 4.0 * t * (1.0 - t);
    float dy = 4.0 * (1.0 - 2.0 * t); // derivative of y

    vec2 u = vec2(1.0, dy);
    vec2 v = vec2(-dy, 1.0); // perpendicular to the tangent vector u (dot(u, v) == 0)

    vec3 cen = vec3(0.0, y, 0.0);
    float sy = 0.5 + 0.5 * y; // squash and stretch
    float sz = 1.0 / sy; // scale z for the ellipsoid to preserve it's volume
    vec3 radii = vec3(SPHERE_RADIUS, SPHERE_RADIUS * sy, SPHERE_RADIUS * sz);

    float sd = sd_ellipsoid(pos - cen, radii);

    return sd;
}

// how far inside/outside the spheres in the scene is the point at 'pos'?
float map(in vec3 pos) {
    float d1 = sd_guy(pos);
    // ground plane at y = -SPHERE_RADIUS (so the sphere perctly touches it)
    float d2 = pos.y - (-SPHERE_RADIUS); // a plane's SDF is how high above it you are
    return min(d1, d2);
}

// approximates the surface normal to get a sense of orientation
vec3 calc_normal(in vec3 pos) {
    vec2 e = vec2(0.0001, 0.0);
    // surface gradient
    return normalize(vec3(                     // how much do things change in the:
        map(pos + e.xyy) - map(pos - e.xyy),   //   left-right axis
        map(pos + e.yxy) - map(pos - e.yxy),   //   top-down
        map(pos + e.yyx) - map(pos - e.yyx))); //   front-back
}

float cast_ray(in vec3 ro, in vec3 rd) {
    float t = 0.0;
    for (int i = 0; i < 100; ++i) {
        vec3 pos = ro + t * rd; // p(t)

        float h = map(pos); // hit point distance to the sphere center
        if (h < 0.001) break; // we're close enough to the surface (0.0)

        t += h; // ray march
        if (t >= T_MAX) break; // we've explored enough 
    }

    if (t >= T_MAX) t = -1.0; // we're "inside" the "outside" of the scene
    return t;
}

void main() {
    // pixel values normalized to [-1, 1] on the y axis, 
    // with (0, 0) at the center of the screen
	vec2 p = (2.0 * gl_FragCoord.xy - u_resolution) / u_resolution.x;
    float an = 8.0 * u_mouse.x / u_resolution.x;
    //float an = 1.5 * u_time;

    // target point
    vec3 ta = vec3(0.0, 0.5, 0.0);

    // camera (ray origin)
    vec3 ro = ta + vec3(1.5 * sin(an), 0.0, 1.5 * cos(an));

    // camera transformation
    vec3 ww = normalize(ta - ro);                  // front versor
    vec3 uu = normalize(cross(ww, vec3(0, 1, 0))); // right versor
    vec3 vv = normalize(cross(uu, ww));            // top versor

    // point we're looking at (ray direction)
    vec3 rd = normalize(p.x * uu + p.y * vv + 1.8 * ww);

    // base sky color gradient
    vec3 color = vec3(0.4, 0.75, 1.0) - 0.7 * rd.y;
    // make the horizon line brighter and less saturated
    color = mix(color, vec3(0.7, 0.75, 0.8), exp(-10.0 * rd.y));

    float t = cast_ray(ro, rd);

    if (t >= 0.0) {
        // we hit something
        vec3 hit_point = ro + t * rd;
        vec3 normal = calc_normal(hit_point);

        vec3 matte = vec3(0.18); // albedo, "whiteness" (obs.: grass albedo ~= 0.25)

        vec3 sun_dir = normalize(vec3(0.8, 0.4, -0.2));
        // key light (sun diffuse)
        float sun_dif = clamp(dot(normal, sun_dir), 0.0, 1.0);
        // sun shadow (asks: "can this point be seen from the light source?")
        // obs.: we offset the query point a little to prevent self intersections
        float sun_sha = step(cast_ray(hit_point + normal * 0.001, sun_dir), 0.0); // 0 if t < 0.0

        // fill light (sky diffuse)
        float sky_dif = clamp(0.5 + 0.5 * dot(normal, vec3(0.0, 1.0, 0.0)), 0.0, 1.0);

        // bounce light
        float bou_dif = clamp(0.5 + 0.5 * dot(normal, vec3(0.0, -1.0, 0.0)), 0.0, 1.0);
        
        color  = matte * vec3(7.0, 4.5, 3.0) * sun_dif * sun_sha;
        // the more a surface is facing up (y axis), the more sky light it'll catch
        color += matte * vec3(0.5, 0.8, 0.9) * sky_dif;
        color += matte * vec3(0.7, 0.3, 0.2) * bou_dif;
    }

    // gamma correction
    color = pow(color, vec3(0.4545));

    gl_FragColor = vec4(color, 1);
}

// coordinate system (0 is the center of the screen)
//
//     y (up)
//     |
//     |
//     0 ----- x (right)
//    /
//   /
//  z (out*)
//
// * as in the right hand rule