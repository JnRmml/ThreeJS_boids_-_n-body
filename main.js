const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 200;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const agents = [];
const meshes = [];
const numAgents = 100;
let mode = "boids"; // "boids" oder "nbody"
let forceMultipliers = {
  alignment: 1.0,
  cohesion: 1.0,
  separation: 1.0,
  gravity: 1.0
};

const forceLines = []; // Array für Linienobjekte
const forceLineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });


const gui = new dat.GUI();
gui.add(forceMultipliers, 'alignment', 0, 5).step(0.1);
gui.add(forceMultipliers, 'cohesion', 0, 5).step(0.1);
gui.add(forceMultipliers, 'separation', 0, 5).step(0.1);
gui.add(forceMultipliers, 'gravity', 0, 5).step(0.1);

const geometry = new THREE.CircleGeometry(1.5, 8);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
for (let i = 0; i < numAgents; i++) {
  const pos = new THREE.Vector3(
    (Math.random() - 0.5) * 150,
    (Math.random() - 0.5) * 150,
    0
  );
  const vel = new THREE.Vector3(
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 2,
    0
  );
  const agent = new Agent(pos, vel);
  agents.push(agent);

  const mesh = new THREE.Mesh(geometry, material.clone());
  mesh.material.color.setHSL(i / numAgents, 1.0, 0.5);
  scene.add(mesh);
  meshes.push(mesh);
}

function updateForceLines() {
    for (const line of forceLines) {
        scene.remove(line);
    }
    forceLines.length = 0;

    const selectedAgent = agents[0]; // Visualisierung für diesen Agent

  for (let i = 0; i < agents.length; i++) {
        const other = agents[i];
        if (other === selectedAgent) continue;

        const d = selectedAgent.position.distanceTo(other.position);
        if (d < selectedAgent.neighborDist) {
        // Kraftvektor ähnlich wie in flock()
        let dir = other.position.clone().sub(selectedAgent.position);
        let forceVec = dir.clone().setLength(1 / (d || 1)); // Stärke invers zum Abstand

        // Kraftstärke zur Visualisierung (z. B. Länge)
        let strength = forceVec.length(); // oder manuell skalieren

        const geometry = new THREE.BufferGeometry().setFromPoints([
            selectedAgent.position,
            other.position
        ]);

        // Interpolation nach Stärke – von grün (schwach) zu rot (stark)
        const color = new THREE.Color().setHSL(0.33 - Math.min(strength * 10, 0.33), 1, 0.5);

        const lineMat = new THREE.LineBasicMaterial({ color });
        const line = new THREE.Line(geometry, lineMat);
        scene.add(line);
        forceLines.push(line);
        }
    }
}
frameCount = 0;

function animate() {
   requestAnimationFrame(animate);

  for (let i = 0; i < agents.length; i++) {
    const agent = agents[i];
    if (mode === "boids") {
      agent.flock(agents);
      frameCount++;

        if (frameCount % 10 === 0) {
            // Linien nur alle 2 Frames neu zeichnen
            updateForceLines(); // Funktion aus dem oberen Code
        }



    } else if (mode === "nbody") {
      agent.gravitate(agents);
    }

    agent.update();
    agent.edges(100);
    meshes[i].position.copy(agent.position);
  }

  renderer.render(scene, camera);
}

function logMultipliers() {
  console.table(forceMultipliers);
}
animate();

window.addEventListener("keydown", (e) => {
  if (e.key === "b" || e.key === "B") {
    mode = "boids";
    console.log("Modus: BOIDS");
  } else if (e.key === "n" || e.key === "N") {
    mode = "nbody";
    console.log("Modus: N-BODY");
  }
  const key = e.key.toLowerCase();
  const changeAmount = 0.1;

  switch (key) {
    case 'q': // alignment +
      forceMultipliers.alignment = Math.min(forceMultipliers.alignment + changeAmount, 5.0);
      console.log('Alignment ↑', forceMultipliers.alignment.toFixed(2));
      break;
    case 'a': // alignment -
      forceMultipliers.alignment = Math.max(forceMultipliers.alignment - changeAmount, 0.0);
      console.log('Alignment ↓', forceMultipliers.alignment.toFixed(2));
      break;

    case 'w': // cohesion +
      forceMultipliers.cohesion = Math.min(forceMultipliers.cohesion + changeAmount, 5.0);
      console.log('Cohesion ↑', forceMultipliers.cohesion.toFixed(2));
      break;
    case 's': // cohesion -
      forceMultipliers.cohesion = Math.max(forceMultipliers.cohesion - changeAmount, 0.0);
      console.log('Cohesion ↓', forceMultipliers.cohesion.toFixed(2));
      break;

    case 'e': // separation +
      forceMultipliers.separation = Math.min(forceMultipliers.separation + changeAmount, 5.0);
      console.log('Separation ↑', forceMultipliers.separation.toFixed(2));
      break;
    case 'd': // separation -
      forceMultipliers.separation = Math.max(forceMultipliers.separation - changeAmount, 0.0);
      console.log('Separation ↓', forceMultipliers.separation.toFixed(2));
      break;

    case 'r': // gravity +
      forceMultipliers.gravity = Math.min(forceMultipliers.gravity + changeAmount, 5.0);
      console.log('Gravitation ↑', forceMultipliers.gravity.toFixed(2));
      break;
    case 'f': // gravity -
      forceMultipliers.gravity = Math.max(forceMultipliers.gravity - changeAmount, 0.0);
      console.log('Gravitation ↓', forceMultipliers.gravity.toFixed(2));
      break;

    default:
      break;
  }
 logMultipliers();

});