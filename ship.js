/* 
 * FILE   : ship.js
 * Brief  : Ship data model
 */


var Vector3d = require('./vector.js');


module.export = function() {
  this.position = new Vector3D();
  this.velocity = new Vector3D();
}
