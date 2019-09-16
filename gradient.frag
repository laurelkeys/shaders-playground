#ifdef GL_ES
precision mediump float;
#endif
 
#define COLOR_COUNT 5.0
#define START_COLOR vec3(0.0, 0.0, 0.0)
#define END_COLOR   vec3(1.0, 1.0, 1.0)

uniform vec2 u_resolution;

void main() {
    float width = u_resolution.x / COLOR_COUNT;
    float t = mod(floor(gl_FragCoord.x / width), COLOR_COUNT);
    vec3 color = mix(START_COLOR, END_COLOR, t / (COLOR_COUNT-1.0));
    gl_FragColor = vec4(color, 1.0);
}

// ref.: http://xdpixel.com/category/procedural-textures/page/2/