#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float sin_01(float x) {
    return 0.5 * (1.0 + sin(x));
}

float istep(float edge, float x) {
    return 1.0 - step(edge, x);
}

void main() {
	vec2 st = gl_FragCoord.xy / u_resolution;

    vec2 center = vec2(0.5);
    vec3 color = vec3(distance(st, center) * 
                        (sin_01(u_time) + 0.5));

	gl_FragColor = vec4(color, 1.0);
}