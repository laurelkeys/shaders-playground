#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
	vec2 st = gl_FragCoord.xy / u_resolution;

    vec4 circles = vec4(
        distance(st, vec2(0.75)),       // 1 -----
        distance(st, vec2(0.25, 0.75)), // | y  x |
        distance(st, vec2(0.25)),       // | z  w |
        distance(st, vec2(0.75, 0.25))  // 0 ---- 1
    );
    
    vec3 color = vec3(circles.zyx);
	gl_FragColor = vec4(color, 1.0);
}