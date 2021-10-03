function babylonWorking() {
    var canvas = document.querySelector('.canvas');
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function () {

        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0.08, 0.08, 0.08, 1);
        var camera = new BABYLON.ArcRotateCamera('camera1', 0, 0, 200, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);

        var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 0, 0), scene);
        light.diffuse = new BABYLON.Color3(0.6, 0.6, 0.6);
        light.specular = new BABYLON.Color3(1, 1, 1);
        light.groundColor = new BABYLON.Color3(0, 0, 0);

        var starMat = new BABYLON.StandardMaterial(scene);
        starMat.diffuseColor = new BABYLON.Color3(1, 1, 1);

        var t = 1.2;  
        function getRandomFloat(neg) {
            if (neg == true) {
                min = -0.05;
                max = -1.09;
            } else if (neg == false) {
                min = 0.05;
                max = 1.09;    
            }
            let ranFloat = Math.random() * (max - min + 1) + min;
            console.log(ranFloat)
            return ranFloat; //The maximum is exclusive and the minimum is inclusive
        };
    
        var numOfStars = 100;

        var stars = [];
        var star;

        function getRanXYZ() {
            min = -200.1;
            max = 200.1;
            let ranXYZ = Math.random() * (max - min + 1) + min;
            return ranXYZ;
        };

        for (let i = 0; i < numOfStars; i++) {
            let vertices = [
                [getRandomFloat(true),  t,  0],        // 0
                [ getRandomFloat(false),  t,  0],        // 1
                [getRandomFloat(true), -t,  0],        // 2
                [ getRandomFloat(false), -t,  0],        // 3
                
                [ 0, getRandomFloat(true),  t],        // 4
                [ 0,  getRandomFloat(false),  t],        // 5
                [ 0, getRandomFloat(true), -t],        // 6
                [ 0,  getRandomFloat(false), -t],        // 7
        
                [ t,  1, getRandomFloat(true)],        // 8
                [ t,  1,  getRandomFloat(false)],        // 9
                [-t,  1, getRandomFloat(true)],        // 10
                [-t,  1,  getRandomFloat(false)]         // 11
            ];
        
            var triangles = [
              [0, 11, 5],
              [0, 5, 1],
              [0, 1, 7],
              [0, 7, 10],
              [0, 10, 11],
        
              [1, 5, 9],
              [5, 11, 4],
              [11, 10, 2],
              [11, 10, 2],
              [10, 7, 6],
              [7, 1, 8],
        
              [3, 9, 4],
              [3, 4, 2],
              [3, 2, 6],
              [3, 6, 8],
              [3, 8, 9],
        
              [4, 9, 5], 
              [2, 4, 11],
              [6, 2, 10],
              [8, 6, 7],
              [9, 8, 1]
            ];
        
            var prismDef = { "name": "Tetrahedron", "category": ["Platonic Solid"], vertex: vertices, face: triangles};

            star = BABYLON.MeshBuilder.CreatePolyhedron("star", {custom: prismDef}, scene);
            star.setPositionWithLocalVector(new BABYLON.Vector3(getRanXYZ(), getRanXYZ(), getRanXYZ()));
            star.material = starMat;

            var gl = new BABYLON.GlowLayer("gl", scene);
            gl.intensity = 0.1;

            gl.customEmissiveColorSelector = function(mesh, subMesh, material, result) {
                if (mesh.name === "star") {
                    result.set(1,1,1,0.1)
                } else result.set(0,0,0,0)
            }

            stars.push(star);
        }
    
        function getRanTick() {
            min = -360.1;
            max = 360.1;
            let ranTick = Math.random() * (max - min + 1) + min;
            return ranTick;
        };

        var totalTicks = [];
        var totalTick;

        for (let i = 0; i < numOfStars; i++) {
            totalTick = getRanTick();
            totalTicks.push(totalTick);
        }

        var tick = 0;
        var angleX = Math.PI/4;
        var angleY = Math.PI/4;
    
        scene.registerBeforeRender(function() {
        if(tick <= 360.1) {
            for (let i = 0; i < numOfStars; i++) {
                stars[i].rotate(BABYLON.Axis.Y, angleY/totalTicks[i], BABYLON.Space.WORLD);
                stars[i].rotate(BABYLON.Axis.X, angleX/totalTicks[i], BABYLON.Space.WORLD);                
            }
        }
        if(tick > 360.1) {      
            tick = -361.1;
        }
        tick++;
       });

        return scene;
    }

    var scene = createScene();
    engine.runRenderLoop(function () {
        scene.render();
    });
}

window.addEventListener('DOMContentLoaded', babylonWorking);