#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

// YUV to RGB matrix
mat3 yuv2rgb = mat3(1.0,  0.0,      1.13983,
                    1.0, -0.39465, -0.58060,
                    1.0,  2.03211,  0.0);

// RGB to YUV matrix
mat3 rgb2yuv = mat3( 0.2126,   0.7152,  0.0722,
                    -0.09991, -0.33609, 0.43600,
                     0.615,   -0.5586, -0.05639);

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(0.0);

    // UV values goes from -1 to 1
    st = 2.0 * (st - 0.5); // [0, 1] -> [-1, 1]

    // we pass st as the y and z values of a 3D vector 
    // to be properly multiplied by a 3x3 matrix
    color = yuv2rgb * vec3(0.5, st.x, st.y);

    gl_FragColor = vec4(color, 1.0);
}