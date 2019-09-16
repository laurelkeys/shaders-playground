#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    st.y *= u_resolution.y / u_resolution.x;
    
    vec2 dim = vec2(5.0, 5.0);
    float color = mod(floor(st.x * dim.x) + floor(st.y * dim.y), 2.0);
    
    gl_FragColor = vec4(vec3(color), 1.0);
}