class Agent {
  constructor(position, velocity) {
    this.position = position.clone();
    this.velocity = velocity.clone();
    this.acceleration = new THREE.Vector3();

    this.mass = 1;
    this.maxSpeed = 2;
    this.maxForce = 0.05;
    this.neighborDist = 25;
    

  }
  
  applyForce(force) {
    this.acceleration.add(force.clone().divideScalar(this.mass));
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.clampLength(0, this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.set(0, 0, 0);
  }

  edges(bounds = 100) {
    // Wrap-around (2D: X/Y)
    if (this.position.x > bounds) this.position.x = -bounds;
    if (this.position.x < -bounds) this.position.x = bounds;
    if (this.position.y > bounds) this.position.y = -bounds;
    if (this.position.y < -bounds) this.position.y = bounds;
  }

  flock(agents) {
    const alignment = new THREE.Vector3();
    const cohesion = new THREE.Vector3();
    const separation = new THREE.Vector3();
    let count = 0;

    for (let other of agents) {
      const d = this.position.distanceTo(other.position);
      if (other !== this && d < this.neighborDist) {
        alignment.add(other.velocity);
        cohesion.add(other.position);

        let diff = this.position.clone().sub(other.position);
        diff.divideScalar(d); // Gewichtung
        separation.add(diff);
        count++;
      }
    }

    if (count > 0) {
        alignment.divideScalar(count)
         .setLength(this.maxSpeed)
         .sub(this.velocity)
         .clampLength(0, this.maxForce)
         .multiplyScalar(forceMultipliers.alignment);

cohesion.divideScalar(count)
        .sub(this.position)
        .setLength(this.maxSpeed)
        .sub(this.velocity)
        .clampLength(0, this.maxForce)
        .multiplyScalar(forceMultipliers.cohesion);

separation.divideScalar(count)
          .setLength(this.maxSpeed)
          .sub(this.velocity)
          .clampLength(0, this.maxForce)
          .multiplyScalar(forceMultipliers.separation);



      this.applyForce(alignment);
      this.applyForce(cohesion);
      this.applyForce(separation);
    }
  }

gravitate(agents, G = 10) {
  for (let other of agents) {
    if (other === this) continue;

    const dir = other.position.clone().sub(this.position);
    const distSq = dir.lengthSq();

    if (distSq < 1e-4) continue; // Singularität noch robuster vermeiden

    // Newtonsche Gravitationskraft
    const forceMag = (G * this.mass * other.mass) / distSq;

    const force = dir.normalize().multiplyScalar(forceMag); // Normalisiere vorher
force.multiplyScalar(forceMultipliers.gravity);

    this.applyForce(force);
  }
}

  


}