///
// Scene and IPC handler
//
// To Use:
//
// Require it in your <scene>.html
// Set up your event listeners in the scene InitializeScene() function
// You're all set


var SceneHandler = function() {
  console.log("Fukkuruu");
  // Stuff goes here, yay

  this.initialize = function() {
    try {
      console.log("Trying to initialize scene");
      window.InitializeScene();
    } 
    catch(e) {
      console.error("Unable to initialize scene: " + e.message);
    }
  }
}



