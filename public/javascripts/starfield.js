const starfield = function(sketch){
    let speed = 20;

    document.getElementById('speed-slider').addEventListener('input', function(e){
        speed = parseInt(e.target.value);
    })

    function heightCalculated(){
        return sketch.height * 1.8;
    }

    class Star {
        constructor(){
            this.x = sketch.random(-sketch.width, sketch.width);
            this.y = sketch.random(-heightCalculated(), heightCalculated());
            this.z = this.pz = sketch.random(sketch.width*2);      
        }

        update(){
            this.z = this.z - speed;
            if(this.z < 1){
                this.z = this.pz = sketch.width*2;
                this.x = sketch.random(-sketch.width, sketch.width);
                this.y = sketch.random(-heightCalculated(), heightCalculated());
            }
        }

        show(){
            sketch.fill(255);
            sketch.noStroke();

            //const r = sketch.map(this.z, 0, sketch.width, 16, 0);
            
            const sx = sketch.map(this.x / this.z, 0, 1, 0, sketch.width);
            const sy = sketch.map(this.y / this.z, 0, 1, 0, heightCalculated());
            const px = sketch.map(this.x / this.pz, 0, 1, 0, sketch.width);
            const py = sketch.map(this.y / this.pz, 0, 1, 0, heightCalculated());

            this.pz = this.z; 

            sketch.stroke(255);
            sketch.line(px, py, sx, sy)
        }
    }

    const stars = [];
    const container = document.getElementById('starfield-container');

    sketch.setup = function(){
        sketch.frameRate(30);
        const renderer = sketch.createCanvas(sketch.windowWidth, container.offsetHeight + 10);
        
        let si = -1;
        window.addEventListener("scroll", function(){
            clearTimeout(si);
            si = setTimeout(function(){
                const rect = renderer.canvas.getBoundingClientRect();
                if(rect.bottom >= 0) {
                    sketch.loop();
                } else {
                    sketch.noLoop();
                }
            }, 200);
        })

        renderer.parent('starfield-container')
        renderer.style.position = "absolute";

        for(let i = 0; i < 700; i++){
            stars.push(new Star())
        }
    }

    sketch.draw = function(){
        sketch.background(0);
        sketch.translate(sketch.width/2, sketch.height/2);
        stars.forEach(star=>{star.update();star.show();});
    }

    sketch.windowResized = function(){
        sketch.resizeCanvas(sketch.windowWidth, container.offsetHeight + 10)
    }
}