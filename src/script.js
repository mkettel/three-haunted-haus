import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// fog
const fog = new THREE.Fog('#262837', 1, 15) // color, near, far
scene.fog = fog
//add to gui
gui.add(fog, 'near').min(1).max(15).step(0.1)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
const environmentMapTexture = textureLoader.load('/textures/environmentMaps/3.jpg')

// bricks
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

// grass
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping



/**
 * House
 */
const house = new THREE.Group() // Group is a container for objects
scene.add(house)

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture, // color
    aoMap: bricksAmbientOcclusionTexture, // ambient occlusion
    normalMap: bricksNormalTexture, // normal
    roughnessMap: bricksRoughnessTexture, // roughness
   })
)
walls.geometry.setAttribute( // add the normal map
  'uv2',
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)
walls.position.y = 2.5 * 0.5
house.add(walls)

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: '#b35f45' })
)
roof.position.y = 2.5 + .5
roof.rotation.y = Math.PI * .25
house.add(roof)

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture, // color
    transparent: true, // alpha
    alphaMap: doorAlphaTexture, // alpha
    aoMap: doorAmbientOcclusionTexture, // ambient occlusion
    displacementMap: doorHeightTexture, // height
    displacementScale: 0.1, // height
    metalnessMap: doorMetalnessTexture, // metalness
    normalMap: doorNormalTexture, // normal
    roughnessMap: doorRoughnessTexture, // roughness
   })
)
door.geometry.setAttribute( // add the normal map
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.position.y = 1
door.position.z = 2 + .01
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })

//1
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.position.set(1.1, 0.2, 2.4)
bush1.scale.set(0.5, 0.65, 0.5)
//2
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.position.set(-1.2, 0.15, 2.3)
bush2.scale.set(0.30, 0.25, 0.20)
//3
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.position.set(-1.5, 0.2, 2.3)
bush3.scale.set(0.35, 0.45, 0.25)
//4
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.position.set(1.8, 0.2, 2.3)
bush4.scale.set(0.20, 0.25, 0.15)

house.add(bush1, bush2, bush3, bush4) // Add all bushes to the house

// Graves
// creating the grave Group
const graves = new THREE.Group()
scene.add(graves)

// creating the graves geometry and material
const graveGeometry = new THREE.BoxGeometry(.6, .8, .2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

// creating the graves. we want a loop to create 50 graves
for (let i = 0; i < 50; i++) {
  // creating the mesh
  const angle = Math.random() * Math.PI * 2 // random angle full circle
  const radius = 4 + Math.random() * 4 // random radius between 3 and 6 to make sure they are not too close to the house
  const x = Math.sin(angle) * radius // x position of the grave
  const z = Math.cos(angle) * radius // z position of the grave for the y position we want them to be on the ground so we set it to 0

  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  grave.position.set(x, 0.3, z)
  grave.rotation.y = (Math.random() - 0.5 ) * 0.4 // random rotation
  grave.rotation.z = (Math.random() - 0.3) * 0.4 // random rotation
  grave.castShadow = true // cast shadow
  graves.add(grave) // add the grave to the graves group

}


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
      map: grassColorTexture, // color
      aoMap: grassAmbientOcclusionTexture, // ambient occlusion
      normalMap: grassNormalTexture, // normal
      roughnessMap: grassRoughnessTexture, // roughness
     })
)
floor.geometry.setAttribute( // add the normal map
  'uv2',
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
// floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7) // color, intensity, distance
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

// Ghosts
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3) // color, intensity, distance
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 2, 3) // color, intensity, distance
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 2, 3) // color, intensity, distance
scene.add(ghost3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 2
camera.position.z = 6
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837') // background color set to dark grey to it matches the fog


// Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
// walls.receiveShadow = true
// roof.castShadow = true

floor.receiveShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7
// doorLight.shadow.camera.near = 1

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7








/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    const ghostAngle = elapsedTime * 0.7
    ghost1.position.x = Math.cos(ghostAngle) * 4
    ghost1.position.z = Math.sin(ghostAngle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = - elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = - elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
