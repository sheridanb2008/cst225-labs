precision mediump float;
uniform sampler2D uTexture;
varying vec2 vTexcoords;
void main(void) {
    
    vec3 albedo = texture2D(uTexture, vTexcoords).rgb;
	    
	vec3 diffuseSurface = albedo * vec3(1,1,1);
        
    vec3 diffuseColor = diffuseSurface;
    
    vec3 finalColor = diffuseColor;
	
    gl_FragColor = vec4(finalColor, 1.0);
}
	