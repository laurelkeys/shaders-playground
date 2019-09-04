#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float circle(in vec2 _st, in float _radius) {
    vec2 l = _st - vec2(0.5);
    return 1. - smoothstep(_radius-(_radius*0.01),
                           _radius+(_radius*0.01),
                           dot(l,l)*4.0);
}

float square(in vec2 pos, in vec2 dim) {
	vec2 st = gl_FragCoord.xy / u_resolution;
    st.y = 1.0 - st.y;
    
    vec2 uv = pos / dim;
    
    dim = 1. / dim;
    
    float row = step(st.y, uv.y) - step(st.y, uv.y - dim.y);
    float col = step(st.x, uv.x) - step(st.x, uv.x - dim.x);
    return row * col;
}

void main() {
	vec2 st = gl_FragCoord.xy / u_resolution;

    vec2 dim = vec2(3.0, 3.0);
    st *= dim;      // Scale up the space
    st = fract(st); // Wrap arround 1.0

    vec3 color = vec3(st, 0.0);
    // color = vec3(circle(st, 0.5));
    color += square(vec2(2.0, 2.0), dim);

	gl_FragColor = vec4(color, 1.0);
}
