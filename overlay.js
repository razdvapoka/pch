import * as THREE from "three";

export const getOverlay = () => {
  const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
  const overlayMaterial = new THREE.ShaderMaterial({
    // wireframe: true,
    transparent: true,
    uniforms: {
      uAlpha: { value: 1 },
      uColorR: { value: 0 },
      uColorG: { value: 0 },
      uColorB: { value: 0 },
    },
    vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;
        uniform float uColorR;
        uniform float uColorG;
        uniform float uColorB;

        void main()
        {
            gl_FragColor = vec4(uColorR, uColorG, uColorB, uAlpha);
        }
    `,
  });
  return new THREE.Mesh(overlayGeometry, overlayMaterial);
};
