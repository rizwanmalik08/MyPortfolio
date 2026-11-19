import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import fs from 'fs';
import path from 'path';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('node_modules/three/examples/jsm/libs/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

function measure(rel) {
  const buf = fs.readFileSync(path.resolve('soda-store/public/assets', rel));
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  loader.parse(ab, '', (gltf) => {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    console.log(rel, 'Size:', size, 'Center:', center);
  });
}

measure('models/deit_soda2.glb');
measure('models/cherry.glb');
measure('models/blueberry.glb');
measure('models/leaves.glb');
