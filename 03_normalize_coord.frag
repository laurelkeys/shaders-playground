#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    /* u_resolution = vec2(width, height)
     * gl_FragCoord.xy = vec2(curr_x, curr_y), with:
     *   curr_x \in [0, width] and curr_y \in [0, height]
     *
     * therefore, st = vec2(curr_x/width, curr_y/height),
     * normalizing it's values to the [0.0, 1.0] range
     */
    vec2 st = gl_FragCoord.xy / u_resolution;
    gl_FragColor = vec4(st.x, st.y, 0.0, 1.0);
}

// obs.: st are used for spatial coordinates of a texture ("stpq = xyzw = rgba")
// https://computergraphics.stackexchange.com/questions/4537/what-does-st-mean-in-the-context-of-opengl/4539#4539