#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define cos_01(x) 0.5 + 0.5 * cos(x)

#define SPHERE_RADIUS 0.25
#define T_MAX 20.0

// how far inside/outside the spheres in the scene is the point at 'pos'?
float map(in vec3 pos) {
    float d1 = length(pos) - SPHERE_RADIUS;
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
    return t;
}

void main() {
    // pixel values normalized to [-1, 1] on the y axis, 
    // with (0, 0) at the center of the screen
	vec2 p = (2.0 * gl_FragCoord.xy - u_resolution) / u_resolution.y;
    
    // camera (ray origin)
    vec3 ro = vec3(0, 0, 1);
    // point we're looking at (ray direction)
    vec3 rd = normalize(vec3(p, -1.5));

    vec3 color = vec3(0.225);

    float t = cast_ray(ro, rd);

    if (t < T_MAX) {
        // we hit something
        vec3 hit_point = ro + t * rd;
        vec3 normal = calc_normal(hit_point);

        vec3 sun_dir = normalize(vec3(0.8, 0.4, -0.2));
        // key light (sun diffuse)
        float sun_dif = clamp(dot(normal, sun_dir), 0.0, 1.0);
        float sky_dif = clamp(0.5 + 0.5 * dot(normal, vec3(0.0, 1.0, 0.0)), 0.0, 1.0);

        // sun shadow (asks: "can this point be seen from the light source?")
        // obs.: we offset the query point a little to prevent self intersections
        float sun_sha = step(-cast_ray(hit_point + normal * 0.001, sun_dir), -10.); // -0 < -t ? 0 : 1
        // t < 0 ? 0 : 1
        
        color  = vec3(1.0, 0.7, 0.5) * sun_dif * sun_sha;
        // the more a surface is facing up (y axis), the more sunlight it'll catch
        color += vec3(0.0, 0.1, 0.3) * sky_dif;
    }


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