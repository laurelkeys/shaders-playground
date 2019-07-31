#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592653589793

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 colorA = vec3(0.149, 0.141, 0.912);
vec3 colorB = vec3(1.000, 0.833, 0.224);

float plot(vec2 st, float percent) {
    float half_epsilon = 0.01;
    return smoothstep(half_epsilon, -half_epsilon, abs(percent-st.y));
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);

    vec3 percent = vec3(st.x);

    percent.r = smoothstep(0.2, 0.8, st.x);
    // percent.r = smoothstep(0.8, 0.2, st.x);
    percent.g = 0.5*sin(st.x * 4.0 * PI)+0.5;
    percent.b = pow(st.x, 0.5);

    color = mix(colorA, colorB, percent);

    // plot transition lines for each channel
    color = mix(color, vec3(1.0, 0.0, 0.0), plot(st, percent.r));
    color = mix(color, vec3(0.0, 1.0, 0.0), plot(st, percent.g));
    color = mix(color, vec3(0.0, 0.0, 1.0), plot(st, percent.b));

    gl_FragColor = vec4(color, 1.0);
}