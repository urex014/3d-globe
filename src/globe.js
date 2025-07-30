import * as THREE from 'three';
import earthTextureURL from  './textures/earth.jpg';
import bumpMapURL from './textures/earth-bump.jpg'
import specularMapURL from './textures/earth-specular.jpg';
import cloudsMapURL from './textures/earth-clouds.jpg';

export function initGlobe(container){
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75,container.clientWidth/container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry();
    // const material = new THREE.MeshStandardMaterial({color:0x2194ce, wireframe:true});
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load(earthTextureURL);
    const bumpMap = textureLoader.load(bumpMapURL);
    const specularMap = textureLoader.load(specularMapURL);
    const cloudTexture = textureLoader.load(cloudsMapURL);
    const material = new THREE.MeshPhongMaterial({
        map:earthTexture,
        bumpMap: bumpMap,
        bumpScale: 0.05,
        specularMap: specularMap,
        specular: new THREE.Color('grey'),
    })
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    const cloudGeometry = new THREE.SphereGeometry();
    const cloudMaterial = new THREE.MeshLambertMaterial({
        map:cloudTexture,
        transparent:true,
        opacity:0.4,
        depthWrite: false,
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry,cloudMaterial);
    scene.add(cloudMesh)

    const light = new THREE.AmbientLight(0xffffff,1);
    light.position.set(5,5,5);
    scene.add(light);

    camera.position.z = 5;
    let rotationDelta = 0;

    function animate(){
        requestAnimationFrame(animate);
        globe.rotation.y += rotationDelta;
        cloudMesh.rotation.y += rotationDelta*1.2;
        renderer.render(scene,camera);
    }
    animate();
    return{
        setRotationDelta: (delta)=>{rotationDelta = delta;},
    }
    
}