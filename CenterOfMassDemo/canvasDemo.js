window.onload = init; // Wait for the page to load before we begin animation
var canvas;
var ctx;
var balls = [];
var num_balls = 2;
var center_of_mass;

function init(){
  //get the canvas
  canvas = document.getElementById('cnv');
  // Set the dimensions of the canvas
  canvas.width = window.innerWidth * 0.85;
  canvas.height = window.innerHeight * 0.85 ;
  canvas.style.marginTop = canvas.height * 0.08 + 'px';
  canvas.style.marginBottom = canvas.height * 0.08 + 'px';
  canvas.style.marginRight = canvas.width * 0.08 + 'px';
  canvas.style.marginLeft = canvas.width * 0.08 + 'px';
  canvas.style.border = 'solid black 2px';
  canvas.style.backgroundColor = 'rgba(0,44,55, .5)';
  // get the context
  ctx = canvas.getContext('2d'); // This is the context

  var loc1 = new vector2d(20, canvas.height/3);
  var vel1 = new vector2d(2, 0);
  var b1 = new Mover(20, loc1, vel1, new vector2d(0,0), 'red');

  var loc2 = new vector2d(canvas.width - 10, canvas.height/3);
  var vel2 = new vector2d(-2, 0);
  var b2 = new Mover(10, loc2, vel2, new vector2d(0,0), 'blue');
  balls.push(b1);
  balls.push(b2);

  var p_initial = vector2d.add(b1.momentum(), b2.momentum());
  var total_mass = b1.mass + b2.mass;
  var vel_cm = vector2d.scalarDiv(p_initial, total_mass);\
  var r = Math.sqrt(total_mass / Math.PI);
  center_of_mass = {
    radius : r,
    velocity : function(){
      
    }
  }


  animate(); // Call to your animate function
}

//calculate total kinetic energy of system: K = 1/2 * m * v^2
function totalKineticEnergy() {
  var sum = 0;
  for(var i = 0; i < balls.length; i++){
    sum += balls[i].kineticEnergy();
  }
  return sum;
}

//returns a random pastel color
function randomColor(){
  var hue = Math.floor(Math.random() * 360);
  var l = Math.random() * 15 + 70;
  var pastel = 'hsl(' + hue + ', 100%, ' + l + '%)';
  return pastel;
}

//check if balls should bounce off each other
function checkBallBounces () {

  for(var i = 0; i < balls.length ; i++){
    for(var j = i + 1; j < balls.length; j++){

      //check if edges of 2 balls are touching
      var dist = vector2d.distance(balls[i].loc, balls[j].loc);
      if(dist <= balls[i].radius + balls[j].radius){
        var b1 = balls[i];
        var b2 = balls[j];

        //eliminate overlap between balls by adjusting each ball's location
        //  by half the overlap between them in the direction opposite of
        //  the vector between their centers (difference of their locations)
        //  Purpose: prevent balls from "sticking" when they overlap too much
        var vec_distance = vector2d.subtract(b1.loc, b2.loc);
        var overlap = b1.radius + b2.radius - vec_distance.magnitude();
        vec_distance.normalize();
        var delta_loc = vector2d.scalarMult(vec_distance, overlap / 2);
        b1.loc.add(delta_loc);
        b2.loc.add(vector2d.scalarMult(delta_loc, -1));

        //Purpose: calculate new velocities of balls after collision
        //  using center of mass frame
        //momentum & velocity of center of mass
        var p_initial = vector2d.add(b1.momentum(), b2.momentum());
        //console.log(p_initial.x, p_initial.y);
        var total_mass = b1.mass + b2.mass;
        var vel_cm = vector2d.scalarDiv(p_initial, total_mass);
        //calculate velocities after collision using v_final = 2*v_cm - v_initial
        //http://courses.ncssm.edu/apb11o/resources/guides/G09-4b.com.htm
        var v1_final = vector2d.scalarMult(vel_cm, 2);
        v1_final.subtract(b1.vel);
        var v2_final = vector2d.scalarMult(vel_cm, 2);
        v2_final.subtract(b2.vel);

        b1.vel = v1_final;
        b2.vel = v2_final;

        //var p_final = vector2d.add(b1.momentum(), b2.momentum());
        //console.log(totalKineticEnergy());
        // console.log(p_final.x, p_final.y);
      }
    }
  }
}



function animate(){
  requestAnimationFrame(animate);
  checkBallBounces();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(var i = 0; i < balls.length; i++){
    balls[i].draw();
  }
}
