#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define cos_01(x) 0.5 + 0.5 * cos(x)

#define SPHERE_RADIUS 0.25
#define T_MAX 20.0

float map(in vec3 pos) {
    // how far inside/outside the sphere is the point at 'pos'?
    float d = length(pos) - SPHERE_RADIUS;
    return d;
}

void main() {
    // pixel values normalized to [-1, 1] on the y axis, 
    // with (0, 0) at the center of the screen
	vec2 p = (2.0 * gl_FragCoord.xy - u_resolution) / u_resolution.y;
    
    // camera (ray origin)
    vec3 ro = vec3(0, 0, 2);
    // point we're looking at (ray direction)
    vec3 rd = normalize(vec3(p, -1.5));

    vec3 color = vec3(0.225);

    // ray march
    float t = 0.0;
    for (int i = 0; i < 100; ++i) {
        vec3 pos = ro + t * rd; // p(t)

        float h = map(pos); // hit point
        if (h < 0.001) break; // we're close enough to the surface (0.0)

        t += h;
        if (t >= T_MAX) break; // we've explored enough 
    }

    if (t < T_MAX) {
        // we hit something
        color = vec3(1.0);
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