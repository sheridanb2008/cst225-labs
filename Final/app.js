'use strict'

var gl;

var appInput = new Input();
var time = new Time();
var camera = new OrbitCamera(appInput);

var sunGeometry = null; // this will be created after loading from a file
var earthGeometry = null;
var starsGeometry = null;
var moonGeometry = null;
var groundGeometry = null;

var projectionMatrix = new Matrix4();
var lightPosition = new Vector3(0,0,0);

// the shader that will be used by each piece of geometry (they could each use their own shader but in this case it will be the same)
var phongShaderProgram;
var flatShaderProgram;
// auto start the app when the html page is ready
window.onload = window['initializeAndStartRendering'];

// we need to asynchronously fetch files from the "server" (your local hard drive)
var loadedAssets = {
    phongTextVS: null, phongTextFS: null,
    vertexColorVS: null, vertexColorFS: null,
    sphereJSON: null,
    marbleImage: null,
    crackedMudImage: null
};

// -------------------------------------------------------------------------
function initializeAndStartRendering() {
    initGL();
    loadAssets(function() {
        createShaders(loadedAssets);
        createScene();
        
            updateAndRender();
        
    });
}

// -------------------------------------------------------------------------
function initGL(canvas) {
    var canvas = document.getElementById("webgl-canvas");

    try {
        gl = canvas.getContext("webgl");
        gl.canvasWidth = canvas.width;
        gl.canvasHeight = canvas.height;

        gl.enable(gl.DEPTH_TEST);
    } catch (e) {}

    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

// -------------------------------------------------------------------------
function loadAssets(onLoadedCB) {
    var filePromises = [
        fetch('./shaders/phong.vs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/phong.pointlit.fs.glsl').then((response) => { return response.text(); }),
        fetch('./data/sphere.json').then((response) => { return response.json(); }),
        fetch('./shaders/flat.color.vs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/flat.color.fs.glsl').then((response) => { return response.text(); }),
        loadImage('./data/sun.jpg'),
        loadImage('./data/earth.jpg'),
        loadImage('./data/moon.png'),
        loadImage('./data/stars.jpg')

    ];

    Promise.all(filePromises).then(function(values) {
        // Assign loaded data to our named variables
        loadedAssets.phongTextVS = values[0];
        loadedAssets.phongTextFS = values[1];
        loadedAssets.sphereJSON = values[2];
        loadedAssets.flatTextVS = values[3];
        loadedAssets.flatTextFS = values[4];
        loadedAssets.sunImage = values[5];
        loadedAssets.earthImage = values[6];
        loadedAssets.moonImage = values[7];
        loadedAssets.starsImage = values[8];
    }).catch(function(error) {
        console.error(error.message);
    }).finally(function() {
        onLoadedCB();
    });
}

// -------------------------------------------------------------------------
function createShaders(loadedAssets) {
    phongShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.phongTextVS, loadedAssets.phongTextFS);

    phongShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(phongShaderProgram, "aVertexPosition"),
        vertexNormalsAttribute: gl.getAttribLocation(phongShaderProgram, "aNormal"),
        vertexTexcoordsAttribute: gl.getAttribLocation(phongShaderProgram, "aTexcoords")
    };

    phongShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uProjectionMatrix"),
        lightPositionUniform : gl.getUniformLocation(phongShaderProgram, "uLightPosition"),
        cameraPositionUniform: gl.getUniformLocation(phongShaderProgram, "uCameraPosition"),
        textureUniform: gl.getUniformLocation(phongShaderProgram, "uTexture"),
    };

    flatShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.flatTextVS, loadedAssets.flatTextFS);

    flatShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(flatShaderProgram, "aVertexPosition"),
        vertexNormalsAttribute: gl.getAttribLocation(flatShaderProgram, "aNormal"),
        vertexTexcoordsAttribute: gl.getAttribLocation(flatShaderProgram, "aTexcoords")
    };

    flatShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(flatShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(flatShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(flatShaderProgram, "uProjectionMatrix"),
        lightPositionUniform: gl.getUniformLocation(flatShaderProgram, "uLightPosition"),
        cameraPositionUniform: gl.getUniformLocation(flatShaderProgram, "uCameraPosition"),
        textureUniform: gl.getUniformLocation(flatShaderProgram, "uTexture"),
    };
}

// -------------------------------------------------------------------------
function createScene() {
   
    starsGeometry = new WebGLGeometryJSON(gl, flatShaderProgram);
    starsGeometry.create(loadedAssets.sphereJSON, loadedAssets.starsImage);



    earthGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    earthGeometry.create(loadedAssets.sphereJSON, loadedAssets.earthImage);

    moonGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    moonGeometry.create(loadedAssets.sphereJSON, loadedAssets.moonImage);

    sunGeometry = new WebGLGeometryJSON(gl, flatShaderProgram);
    sunGeometry.create(loadedAssets.sphereJSON, loadedAssets.sunImage);

    // Scaled Images
    starsGeometry.worldMatrix.scale(2.5, 2.5, 2.5);
    starsGeometry.worldMatrix.translate(0, 0, 0);
}

// -------------------------------------------------------------------------

function updateAndRender() {
    requestAnimationFrame(updateAndRender);

    var aspectRatio = gl.canvasWidth / gl.canvasHeight;

    
    time.update();
    camera.update(time.deltaTime);
    var degrees = (time.deltaTime - time.lastTime) * 0.01;

    earthGeometry.worldMatrix.setRotationY(degrees)
    sunGeometry.worldMatrix.setRotationY(degrees)
    moonGeometry.worldMatrix.setRotationY(degrees)
    
    earthGeometry.worldMatrix.scale(0.09, 0.09, 0.09);
    earthGeometry.worldMatrix.translate(40 * Math.cos(degrees * 0.05), 0, 40 * Math.sin(degrees * 0.05));

    sunGeometry.worldMatrix.scale(0.15, 0.15, 0.15);
    sunGeometry.worldMatrix.translate(0, 0, 0);

    moonGeometry.worldMatrix.scale(0.02, 0.02, 0.02);
    moonGeometry.worldMatrix.translate((earthGeometry.worldMatrix.getElement(0, 3) + (10 * Math.sin(degrees * 0.1))), 0, (earthGeometry.worldMatrix.getElement(2, 3)) +(10 * Math.cos(degrees * 0.1)));

    
    

     

    
    
    
    

    // specify what portion of the canvas we want to draw to (all of it, full width and height)
    gl.viewport(0, 0, gl.canvasWidth, gl.canvasHeight);

    // this is a new frame so let's clear out whatever happened last frame
    gl.clearColor(0.707, 0.707, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(phongShaderProgram);
    var uniforms = phongShaderProgram.uniforms;
    var cameraPosition = camera.getPosition();
    
    gl.uniform3f(uniforms.lightPositionUniform, lightPosition.x, lightPosition.y, lightPosition.z);
    gl.uniform3f(uniforms.cameraPositionUniform, cameraPosition.x, cameraPosition.y, cameraPosition.z);
    

    projectionMatrix.setPerspective(45, aspectRatio, 0.1, 1000);
    starsGeometry.render(camera, projectionMatrix, flatShaderProgram);
   
    sunGeometry.render(camera, projectionMatrix, flatShaderProgram);
    earthGeometry.render(camera, projectionMatrix, phongShaderProgram);
    moonGeometry.render(camera, projectionMatrix, phongShaderProgram);
    
}
