#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 tile(vec2 st, float zoom) {
    st *= zoom;
    return fract(st);
}

float circle(vec2 st, float radius) {
    vec2 pos = vec2(0.5) - st;
    radius *= 0.75;
    return 1.0 - smoothstep(0.95 * radius,
                            1.05 * radius,
                            dot(pos, pos) * PI);
}

// float circle(vec2 st, float radius) {
//     return 1.0 - smoothstep(radius - .005,
//                             radius + .005, 
//                             distance(vec2(0.5), st));
// }

float circle_pattern(vec2 st, float radius) {
    return circle(st + vec2( 0.0, -0.5), radius) +
           circle(st + vec2( 0.0,  0.5), radius) +
           circle(st + vec2(-0.5,  0.0), radius) +
           circle(st + vec2( 0.5,  0.0), radius);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    // st.y *= u_resolution.y / u_resolution.x;
    vec3 color = vec3(0.0);

    vec2 grid_noise = vec2(0.01, 0.02);
    vec2 grid1 = tile(st + grid_noise.x * vec2(cos(u_time), sin(u_time)),
                      7.0);
    vec2 grid2 = tile(st + grid_noise.y * vec2(cos(u_time),sin(u_time)),
                      3.0);

    color += mix(vec3(0.075, 0.114, 0.329),
                 vec3(0.973, 0.843, 0.675),
                 circle_pattern(grid1, 0.23) - circle_pattern(grid1, 0.01));
    color = mix(color, 
                vec3(0.761, 0.247, 0.102), 
                circle_pattern(grid2, 0.2));
    color -= circle_pattern(grid2, 0.05);

    gl_FragColor = vec4(color, 1.0);
}
