precision mediump float;

uniform vec3 uLightPosition;
uniform vec3 uCameraPosition;
uniform sampler2D uTexture;

varying vec2 vTexcoords;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main(void) {
    // todo - diffuse contribution
    // 1. normalize the light direction and store in a separate variable
    vec3 normalLight = normalize(vec3(uLightPosition - vWorldPosition));
    // 2. normalize the world normal and store in a separate variable
    vec3 normalWorld = normalize(vec3(vWorldNormal));
    // 3. calculate the lambert term
    float lambert = max(dot(normalLight, normalWorld), 0.0);


    vec3 albedo = texture2D(uTexture, vTexcoords).rgb;


	vec3 diffuseSurface = albedo * vec3(1,1,1);



    vec3 diffuseColor = diffuseSurface * lambert;

    vec3 finalColor = diffuseColor;

    gl_FragColor = vec4(finalColor, 1.0);
}
