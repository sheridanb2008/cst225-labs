precision mediump float;

uniform vec3 uLightDirection;
uniform vec3 uCameraPosition;
uniform sampler2D uTexture;

varying vec2 vTexcoords;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main(void) {
    // todo - diffuse contribution
    // 1. normalize the light direction and store in a separate variable
    vec3 normalLight = normalize(vec3(uLightDirection));
    // 2. normalize the world normal and store in a separate variable
    vec3 normalWorld = normalize(vec3(vWorldNormal));
    // 3. calculate the lambert term
    float lambert = max(dot(normalLight, normalWorld), 0.0);

    // todo - specular contribution
    // 1. in world space, calculate the direction from the surface point to the eye (normalized)
	vec3 toEyeNormalize = normalize(uCameraPosition - vWorldPosition);
    // 2. in world space, calculate the reflection vector (normalized)
	vec3 reflectionVector = max(reflect(-normalLight, normalWorld), 0.0);
	// 3. calculate the phong term
	float phong = pow(dot(reflectionVector, toEyeNormalize),64.0);

    vec3 albedo = texture2D(uTexture, vTexcoords).rgb;

    // todo - combine
    // 1. apply light and material interaction for diffuse value by using the texture color as the material
	vec3 diffuseSurface = albedo * vec3(1,1,1);
    // 2. apply light and material interaction for phong, assume phong material color is (0.3, 0.3, 0.3)
	vec3 phongSurface = albedo * vec3(0.3,0.3,0.3);

    vec3 ambient = albedo * 0.1;
    vec3 diffuseColor = diffuseSurface * lambert;
    vec3 specularColor = phongSurface * phong;
    vec3 finalColor = ambient + diffuseColor + specularColor;
	// ambient + diffuseColor + specularColor
    gl_FragColor = vec4(finalColor, 1.0);
}
