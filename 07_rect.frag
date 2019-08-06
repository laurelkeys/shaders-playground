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
    float blur_x = 1.0 - u_mouse.x / u_resolution.x;
    float blur_y = u_mouse.y / u_resolution.y;

    // bottom-left
    vec2 bl = smoothstep(vec2(size), vec2(size+blur_x), st);
    // top-right
    vec2 tr = smoothstep(vec2(size), vec2(size+blur_y), 1.0 - st);

    // sharp edges
    // bl = step(vec2(size), st);
    // tr = step(vec2(size), 1.0 - st);

    // the color is black if it's in a corner
    color = vec3(bl.x * bl.y * tr.x * tr.y);

    gl_FragColor = vec4(color,1.0);
}