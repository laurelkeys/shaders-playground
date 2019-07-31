#ifdef GL_ES
precision mediump float;
#endif

#define HALF_PI 1.5707963267948966

uniform vec2 u_resolution;
uniform float u_time;

vec3 colorA = vec3(0.149, 0.141, 0.912);
vec3 colorB = vec3(1.000, 0.833, 0.224);

void main() {
    vec3 color = vec3(0.0);

    // float percent = abs(sin(u_time));
    float percent = 0.5 * (1.0 + sin(2.0 * u_time - HALF_PI));

    // mix the two colors using percent (a value from 0.0-1.0)
    color = mix(colorA, colorB, percent); // lerp

    gl_FragColor = vec4(color, 1.0);
}