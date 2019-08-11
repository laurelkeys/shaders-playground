#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);

    float left = step(0.1, st.x);   // st.x < 0.1 ? 0.0 : 1.0
    float bottom = step(0.1, st.y); // st.y < 0.1 ? 0.0 : 1.0

    // left*bottom is similar to the logical AND, therefore
    // the color will be black (vec3(0.0)) on the bottom-left
    color = vec3(left * bottom);

    gl_FragColor = vec4(color, 1.0);
}