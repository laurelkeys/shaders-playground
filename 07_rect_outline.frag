#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float istep(float edge, float x) {
    return 1.0 - step(edge, x);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);

    float size = 0.2;
    
    float margin_x = 0.1;
    float margin_y = 0.1;

    float left = istep(margin_x, st.x) + step(margin_x + size, st.x);
    float m_left = istep(margin_x, st.x);
    float top = istep(margin_y, st.y) + step(margin_y + size, st.y);
    float m_top = istep(margin_y, st.y);

    // the color is black if it's in a corner
    color = vec3(left*top + m_left + m_top);

    gl_FragColor = vec4(color,1.0);
}