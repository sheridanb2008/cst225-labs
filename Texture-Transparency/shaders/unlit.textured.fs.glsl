precision mediump float;

uniform sampler2D uTexture;
uniform float uAlpha;

varying vec2 textCoords;

void main(void) {
    // gl_FragColor = vec4(1.0, 0.0, 0.0, uAlpha);
	//gl_FragColor = vec4(textCoords.x, textCoords.y, 0.0, 1);
	
	gl_FragColor = texture2D(uTexture, textCoords);
	gl_FragColor.a = uAlpha;
}
