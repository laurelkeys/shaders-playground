#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float circle(in vec2 _st, in float _radius, 
             in vec2 _center, in float _smooth_edge_pct) {
    vec2 dist = _st - _center;
    float half_pct = _smooth_edge_pct / 2.0;
	return 1.0 - smoothstep(_radius * (1.0 - half_pct),
                            _radius * (1.0 + half_pct),
                            dot(dist, dist) * 4.0);
}

void main() {
	vec2 st = gl_FragCoord.xy / u_resolution.xy;

	vec3 color = vec3(circle(st, 0.9, vec2(0.5), 0.02));
	gl_FragColor = vec4(color, 1.0);
}