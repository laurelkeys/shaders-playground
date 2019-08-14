#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define cos_01(x) 0.5 + 0.5 * cos(x)

void main() {
    // pixel values normalized to [0, 1]
	vec2 uv = gl_FragCoord.xy / u_resolution;
    
    // time varying pixel color
    vec3 color = cos_01(u_time + uv.xyx + vec3(0, 2, 4));

	gl_FragColor = vec4(color, 1.0);
}