/* 
 * FILE   : vector.js
 * BRIEF  : A simple vector class
 */

const VectorRegexp = /\[\s*(\-?\d+\.\d*(?:e\-\d*)?)\s*(\-?\d+\.\d*(?:e\-\d*)?)\s*(\-?\d+\.\d*(?:e\-\d*)?)\s*\]/;


Vector3D = function(x = 0, y = 0, z = 0) {
  this.x = x;
  this.y = y;
  this.z = z;
}


module.exports.Vector3D = Vector3D;

module.exports.parseVector = function(line) {
  var v = line.match(VectorRegexp);
  try {
    return new Vector3D(parseFloat(v[1]), parseFloat(v[2]), parseFloat(v[3]));
  } 
  catch(e) {
    console.log("Error while parsing a vector: " + e.message);
    return new Vector3D(); 
  }
}
