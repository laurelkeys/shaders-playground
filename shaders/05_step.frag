#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

float plot(vec2 st, float percent) {
    float epsilon = 0.01;
    return smoothstep(percent-epsilon, percent, st.y) -
           smoothstep(percent, percent+epsilon, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;

    float edge = 0.5 * (sin(u_time) + 1.0);
    float y = step(edge, st.x); // 0.0 if st.x < edge else 1.0

    vec3 color = vec3(y);

    float percent = plot(st, y);
    color = (1.0 - percent) * color + percent * vec3(0.0, 1.0, 0.0); // lerp

    gl_FragColor = vec4(color, 1.0);
}