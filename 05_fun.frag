#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float plot(vec2 st, float percent) {
    float epsilon = 0.005;
    return smoothstep(percent-epsilon, percent, st.y) -
           smoothstep(percent, percent+epsilon, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;

    float x = st.x;
    float y = x;
    // y = mod(x, 0.5); // return x modulo of 0.5
    // y = fract(x); // return only the fraction part of a number
    // y = ceil(x);  // nearest integer that is greater than or equal to x
    // y = floor(x); // nearest integer less than or equal to x
    // y = sign(x);  // extract the sign of x
    // y = abs(x);   // return the absolute value of x
    // y = clamp(x,0.0,1.0); // constrain x to lie between 0.0 and 1.0
    // y = min(0.0,x);   // return the lesser of x and 0.0
    // y = max(0.0,x);   // return the greater of x and 0.0

    vec3 color = vec3(y);

    float percent = plot(st, y);
    color = (1.0 - percent) * color + percent * vec3(0.0, 1.0, 0.0); // lerp

    gl_FragColor = vec4(color, 1.0);
}

// ref.: https://thebookofshaders.com/05/
//       http://www.flong.com/texts/code/
//       http://www.iquilezles.org/www/articles/functions/functions.htm
