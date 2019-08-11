#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float sin_01(float x) {
    return 0.5 * (1.0 + sin(x));
}

float sin_ab(float x, float a, float b) {
    return a + (b - a) * sin_01(x);
}

void main() {
	vec2 st = gl_FragCoord.xy / u_resolution;
    
    float pct = pow(distance(st, vec2(0.4)), 
                    distance(st, vec2(sin_ab(u_time, 0.2, 0.6))));
    
    vec3 color = vec3(pct);
	gl_FragColor = vec4(color, 1.0);
}