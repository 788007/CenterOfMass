//creates ball objects when called w/ new
function Mover(radius, loc, vel, acc, color){
  this.radius = radius;
  this.color = color;
  //let volume = area and density = 1, so mass = area
  this.mass = Math.PI * this.radius * this.radius;
  this.loc = loc;
  this.vel = vel;
  this.acc = acc;

}

//using equation p = m * v
//returns vector
Mover.prototype.momentum = function(){
  return vector2d.scalarMult(this.vel, this.mass);
}

//using equation K = 1/2 * m * v^2
//returns scalar
Mover.prototype.kineticEnergy = function(){
  var v = this.vel.magnitude();
  return this.mass * v * v / 2;
}

//updates ball position
Mover.prototype.update = function () {
  this.checkEdges();
  this.loc.add(this.vel);
  this.vel.add(this.acc);
}

//reverses direction when ball hits edge
Mover.prototype.checkEdges = function () {
  if(this.loc.x + this.radius >= canvas.width){
    this.loc.x = canvas.width - this.radius;
    this.vel.x *= -1;
  }
  if(this.loc.x - this.radius < 0){
    this.loc.x = this.radius;
    this.vel.x *= -1;
  }
  if(this.loc.y + this.radius >= canvas.height){
    this.loc.y = canvas.height - this.radius;
    this.vel.y *= -1;
  }
  if(this.loc.y - this.radius < 0){
    this.loc.y = this.radius;
    this.vel.y *= -1;
  }
}

//draws ball
Mover.prototype.draw = function () {
  this.update();
  ctx.beginPath();
  ctx.arc(this.loc.x, this.loc.y, this.radius, 0, Math.PI * 2);
  ctx.fillStyle = this.color;
  ctx.fill();
};
