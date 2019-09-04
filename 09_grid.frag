#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define sin_01(x) (0.5 * (1.0 + sin(x)))
#define cos_01(x) (0.5 * (1.0 + cos(x)))

float sin_ab(float x, float a, float b) {
    return a + (b - a) * sin_01(x);
}

float cos_ab(float x, float a, float b) {
    return a + (b - a) * cos_01(x);
}

float circle(in vec2 st, in float radius) {
    const float eps = 0.01;
    vec2 l = st - vec2(0.5);
    return 1.0 - smoothstep(
        radius * (1.0 - eps), radius * (1.0 + eps), dot(l, l) * 4.0);
}

void main() {
	vec2 st = gl_FragCoord.xy / u_resolution;

    vec2 dim = vec2(3.0, 3.0);
    st *= dim;
    st = fract(st);

    vec3 color = vec3(0.0);
    color = vec3(st, 0.0);
    // color = vec3(circle(st, 0.5));

	gl_FragColor = vec4(color, 1.0);
}