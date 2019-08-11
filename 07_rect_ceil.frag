#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);

    float size = 0.1;

    float left   = ceil(st.x - size);
    float right  = ceil(1.0 - st.x - size);
    float top    = ceil(1.0 - st.y - size);
    float bottom = ceil(st.y - size);

    // the color is black if it's in a corner
    color = vec3(left * right * bottom * top);

    gl_FragColor = vec4(color, 1.0);
}