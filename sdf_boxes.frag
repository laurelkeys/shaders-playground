#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define cos_01(x) (0.5 + 0.5 * cos(x))

#define SPHERE_RADIUS 0.25
#define T_MAX 20.0

float sdSphere(in vec3 p, in float s) {
    return length(p) - s;
}

float sdBox(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float sdRoundBox(vec3 p, vec3 b, float r) {
    vec3 d = abs(p) - b;
    return length(max(d, 0.0)) - r + min(max(d.x, max(d.y, d.z)), 0.0);
}

// how far inside/outside the sphere is the point at 'pos'?
float map(in vec3 pos) {
    // float d = sdSphere(pos, SPHERE_RADIUS);
    // float d = sdRoundBox(pos, vec3(SPHERE_RADIUS), .01);
    // float d = sdBox(pos, vec3(SPHERE_RADIUS));
    // return d;
    return min(min(
               sdSphere(pos, 0.1), 
               sdBox(pos-vec3(0.3,0.,0.), vec3(0.1))), 
               sdRoundBox(pos+vec3(0.3,0.,0.), vec3(0.1), .01));
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

void main() {
    // pixel values normalized to [-1, 1] on the y axis, 
    // with (0, 0) at the center of the screen
	vec2 p = (2.0 * gl_FragCoord.xy - u_resolution) / u_resolution.x;

    // camera (ray origin)
    float angle = 2.0 * u_time;
    vec3 ro = vec3(1.0 * sin(angle), 0.0, 1.0 * cos(angle));

    // target point
    vec3 ta = vec3(0);

    // camera transformation (front, right, and top unit vectors)
    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(ww, vec3(0, 1, 0)));
    vec3 vv = normalize(cross(uu, ww));

    // point we're looking at (ray direction)
    vec3 rd = normalize(p.x * uu + p.y * vv + 1.5 * ww);

    vec3 color = vec3(0.225);

    float t = 0.0;
    for (int i = 0; i < 100; ++i) {
        vec3 pos = ro + t * rd; // p(t)

        float h = map(pos); // hit point distance to the sphere center
        if (h < 0.001) break; // we're close enough to the surface (0.0)

        t += h; // ray march
        if (t >= T_MAX) break; // we've explored enough 
    }

    if (t < T_MAX) {
        // we hit something
        vec3 hit_point = ro + t * rd;
        vec3 norm = calc_normal(hit_point);
        color = vec3(norm.zzz);
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