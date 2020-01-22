// ref.: https://www.youtube.com/watch?v=9g8CdctxmeU

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define saturate(x) clamp(x, 0.0, 1.0)

// intersection ///////////////////////////////////////////////////////////////

float iSphere(in vec3 ro, in vec3 rd, in vec4 sph) {
    // a sphere centered at the origin has equation |xyz| = r, 
    // meaning |xyz|^2 = r^2, thus <xyz, xyz> = r^2
    vec3 oc = ro - sph.xyz; // sph = { x, y, z, r }

    // now, xyz = ro + t*rd and |rd| = 1, 
    // therefore |ro|^2 + t^2 + 2t*<ro, rd> = r^2, 
    // which is a quadratic equation, t^2 +2<ro, rd>t + |ro|^2 - r^2 = 0, so
    float b = 2.0 * dot(oc, rd);
    float c = dot(oc, oc) - sph.w*sph.w;
    float h = b*b - 4.0*c;

    if (h < 0.0)
        return -1.0;

    float t = (-b - sqrt(h)) / 2.0;
    return t;
}

float iPlane(in vec3 ro, in vec3 rd) {
    // plane y = 0 => ro.y + t*rd.y = 0
    return -ro.y / rd.y;
}

// normals ////////////////////////////////////////////////////////////////////

vec3 nSphere(in vec3 pos, in vec4 sph) {
    return (pos - sph.xyz) / sph.w; // sph = { x, y, z, r }
}

vec3 nPlane(in vec3 pos) {
    return vec3(0.0, 1.0, 0.0);
}

///////////////////////////////////////////////////////////////////////////////

vec4 sph1 = vec4(0.0, 1.0, 0.0, 1.0);

float intersect(in vec3 ro, in vec3 rd, out float t) {
    t = 1000.0;
    float id = -1.0;
    float tsph = iSphere(ro, rd, sph1); // intersect with a sphere
    float tpla = iPlane(ro, rd); // intersect with a plane
    if (tsph > 0.0) {
        id = 1.0;
        t = tsph;
    }
    if (tpla > 0.0 && tpla < t) {
        id = 2.0;
        t = tpla;
    }
    return id;
}

void main(void) {
    // pixel coordinates from 0 to 1
    vec2 uv = (gl_FragCoord.xy / u_resolution.xy);
    vec2 aspect_ratio = vec2(u_resolution.x / u_resolution.y, 1.0);

    // move the sphere with time
    sph1.x = 0.5 * cos(u_time);
    sph1.z = 0.5 * sin(u_time);

    // ray with origin ro and direction rd
    vec3 ro = vec3(0.0, 0.5, 2.5);
    vec3 rd = normalize(vec3((2.0 * uv - 1.0) * aspect_ratio, -1.0));
    vec3 light = normalize(vec3(1.0));
    
    // intersect the ray with the 3D scene
    float t;
    float id = intersect(ro, rd, t);
    vec3 pos = ro + t*rd;

    vec3 color = vec3(0.9);
    // obs.: we need surface normals to add shadows
    if (0.5 < id && id < 1.5) {
        // sphere hit
        vec3  nor = nSphere(pos, sph1);
        float dif = saturate(dot(nor, light));
        float ao  = 0.5 + 0.5 * nor.y;
        color = vec3(0.9, 0.8, 0.6) * dif * ao 
                + vec3(0.1, 0.2, 0.4) * ao;
    } else if (1.5 < id) {
        // plane hit
        vec3  nor = nPlane(pos);
        float amb = smoothstep(0.0, 2.0 * sph1.w, 
                               length(pos.xz - sph1.xz));
        color = vec3(amb);
    }

    gl_FragColor = vec4(sqrt(color), 1.0);
}

// ref.: https://help.poliigon.com/en/articles/1712652-what-are-the-different-texture-maps-for