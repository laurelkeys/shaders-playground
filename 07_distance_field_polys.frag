#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// returns the n-sided polygon's distance field value
float dist_polygon(in vec2 pos, in int n) {
    float a = atan(pos.x, pos.y) + PI; // angle from the current position
    float r = TWO_PI / float(n); // polygon's interior angles value
    //r /= min(256.0, u_time);

    // shaping function that modulates the distance
    return cos(floor(0.5 + a/r) * r - a) * length(pos);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st = 2.0 * st - 1.0; // remap the space to -1 to 1
    st.y *= u_resolution.y / u_resolution.x;

    vec3 color = vec3(0.0);

    // number of sides of the regular polygon
    int n = 3;

    float d = dist_polygon(st, n);
    color = vec3(1.0 - smoothstep(0.4, 0.41, d));
    // color = vec3(d); // uncomment to see the distance field

    gl_FragColor = vec4(color, 1.0);
}

// ref.: https://thndl.com/square-shaped-shaders.html