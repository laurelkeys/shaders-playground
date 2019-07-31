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

    float peak = 0.6 * 0.5 * (sin(u_time) + 1.0) + 0.2;
    // float y = smoothstep(0.2, peak, st.x) - smoothstep(peak, 0.8, st.x);
    float y = smoothstep(0.2, peak, st.x) - smoothstep(0.5, 0.8, st.x);

    vec3 color = vec3(y);

    float percent = plot(st, y);
    color = (1.0 - percent) * color + percent * vec3(0.0, 1.0, 0.0); // lerp

    gl_FragColor = vec4(color, 1.0);
}

// def smoothstep(edge0, edge1, x):
//     t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0)
//     return t * t * (3.0 - 2.0 * t)
// ref.: https://thebookofshaders.com/glossary/?search=smoothstep