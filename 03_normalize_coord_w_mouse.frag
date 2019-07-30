#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    /* u_resolution = vec2(width, height)
     * u_mouse = vec2(curr_m_x, curr_m_y), with:
     *   curr_m_x \in [0, width] and curr_m_y \in [0, height]
     *
     * therefore, st = vec2(curr_m_x/width, curr_m_y/height),
     * normalizing it's values to the [0.0, 1.0] range
     */
	vec2 st = u_mouse / u_resolution;
    float z = abs(sin(u_time));
	gl_FragColor = vec4(st.x, st.y, z, 1.0);

    // (R, G) values:
    //  _____________
    // |0,1       1,1|
    // |             |
    // |             |
    // |             |
    // |0,0       1,0|
    // |_____________|
}
