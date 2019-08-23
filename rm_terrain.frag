#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// ref.: http://www.iquilezles.org/www/articles/terrainmarching/terrainmarching.htm

// height function y = f(x,z)
float f(in float x, in float z) {
    // return 2.0;
    return sin(x) * sin(z);
}

vec3 get_normal(in vec3 p) {
    float eps = 0.001;
    return normalize(vec3(f(p.x-eps, p.z) - f(p.x+eps, p.z),
                          2.0 * eps,
                          f(p.x, p.z-eps) - f(p.x, p.z+eps)));
}

vec3 terrain_color(in vec3 ro, in vec3 rd, in float t) {
    vec3 p = ro + rd * t;
    vec3 n = get_normal(p);
    // const vec3 s = getShading( p, n );
    // const vec3 m = getMaterial( p, n );
    // return applyFog( m * s, t );
    return n;
}

// raymarch
bool cast_ray(in vec3 ro, in vec3 rd, out float t_res) {
    // scene dependent values
    const float dt = 0.01;
    const float t_min = 0.001;
    const float t_max = 10.0; // "visibility distance"

    //float lh = 0.0;
    //float ly = 0.0;

    for (float t = t_min; t < t_max; t += dt) {
        vec3 p = ro + rd * t;
        float h = f(p.x, p.z);
        if (p.y < h) {
            //t_res = t - dt + dt * (lh-ly) / (p.y-ly-h+lh); // interpolate the intersection distance
            t_res = t - 0.5 * dt; // point between the last two values of t
            return true; // the ray's crossed the terrain surface
        }
        //lh = h;
        //ly = p.y;
    }
    
    return false; // the ray didn't hit the terrain surface
}

void main() {
    // pixel values normalized to [-1, 1] on the y axis, 
    // with (0, 0) at the center of the screen
	vec2 p = (2.0 * gl_FragCoord.xy - u_resolution) / u_resolution.y;
    
    // camera (ray origin)
    vec3 ro = vec3(0, 1.3, 10);
    // point we're looking at (ray direction)
    vec3 rd = normalize(vec3(p, -1.5));

    vec3 color = vec3(0.4, 0.75, 1.0) - 0.7 * rd.y;

    float t_res;
    if (cast_ray(ro, rd, t_res)) {
        // the terrain surface was hit
        color = terrain_color(ro, rd, t_res);
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