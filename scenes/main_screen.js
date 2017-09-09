		
      var SCREEN_WIDTH = window.innerWidth;
			var SCREEN_HEIGHT = window.innerHeight;
			var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

			var container;
			var camera, scene, renderer;
      var logo, logoGeometry, ogoMaterial;
			var cameraRig, activeCamera;
			var cameraPerspectiver;
			var frustumSize = 600;
      var cameraTarget;
			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				scene = new THREE.Scene();

        cameraTarget = new THREE.Vector3();
				//

				camera = new THREE.PerspectiveCamera( 50, 0.5 * aspect, 1, 10000 );
				camera.position.z = 2500;

				cameraPerspective = new THREE.PerspectiveCamera( 50, aspect, 150, 1000 );

				activeCamera = cameraPerspective;

				cameraPerspective.rotation.y = Math.PI;

				cameraRig = new THREE.Group();

				cameraRig.add( cameraPerspective );

				scene.add( cameraRig );



				var geometry = new THREE.Geometry();

				for ( var i = 0; i < 50000; i ++ ) {

					var vertex = new THREE.Vector3();
					vertex.x = THREE.Math.randFloatSpread( 1000 );
					vertex.y = THREE.Math.randFloatSpread( 1000 );
					vertex.z = THREE.Math.randFloatSpread( 1000 );

					geometry.vertices.push( vertex );

				}

				var particles = new THREE.Points( geometry, new THREE.PointsMaterial( { color: 0x888888 } ) );
				scene.add( particles );

				//


				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
				renderer.domElement.style.position = "relative";
				container.appendChild( renderer.domElement );

				renderer.autoClear = false;

				//


				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			//


			//

			function onWindowResize( event ) {

				SCREEN_WIDTH = window.innerWidth;
				SCREEN_HEIGHT = window.innerHeight;
				aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

				renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

				camera.aspect = 0.5 * aspect;
				camera.updateProjectionMatrix();

				cameraPerspective.aspect = 0.5 * aspect;
				cameraPerspective.updateProjectionMatrix();

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();

			}


			function render() {

				var r = Date.now() * 0.0001;

				cameraTarget.x = 700 * Math.cos( r );
				cameraTarget.z = 700 * Math.sin( r );
				cameraTarget.y = 700 * Math.sin( r );


				if ( activeCamera === cameraPerspective ) {

					cameraPerspective.fov = 35 + 30 * Math.sin( 0.5 * r );
					cameraPerspective.updateProjectionMatrix();

				} 


				cameraRig.lookAt( cameraTarget );
				renderer.clear();


				renderer.setViewport( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
				renderer.render( scene, activeCamera );

			}


