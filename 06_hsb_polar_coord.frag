#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform float u_time;

// ref.: Iñigo Quiles https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb_smooth(vec3 c) {    
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0),
                             6.0) - 3.0) -1.0,
                     0.0,
                     1.0);
    rgb = smoothstep(0.0, 1.0, rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(0.0);

    // use polar coordinates instead of cartesian
    vec2 toCenter = vec2(0.5) - st; // vec2(0.5 - st.x, 0.5 - st.y)
    float angle = atan(toCenter.y, toCenter.x);
    float radius = 2.0 * length(toCenter);

    // map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius
    float hue = (angle / TWO_PI) + 0.5 * u_time;
    color = hsb2rgb_smooth(vec3(hue, radius, 1.0));

    gl_FragColor = vec4(color, 1.0);
}
