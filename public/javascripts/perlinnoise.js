const perlinnoise = function(sketch){
    const scl = 10;
    const inc = 0.1;
    let zoff = 0;
    const particles = [];
    let flowfield;
    let cols, rows;
    const container = document.getElementById('perlin-container');

    sketch.setup = function(){
        const renderer = sketch.createCanvas(sketch.windowWidth, container.offsetHeight);
        renderer.parent("perlin-container");

        let si = -1;
        window.addEventListener("scroll", function(){
            clearTimeout(si);
            si = setTimeout(function(){
                const rect = renderer.canvas.getBoundingClientRect();
                if(rect.bottom >= 0 && rect.top <= window.innerHeight) {
                    sketch.loop();
                } else {
                    sketch.noLoop();
                }
            }, 200);
        })

        sketch.colorMode(sketch.HSB, 255);
        sketch.frameRate(30);
        sketch.stroke(0, 5);
        sketch.strokeWeight(4);
        cols = sketch.floor(sketch.width/scl);
        rows = sketch.floor(sketch.height/scl);
        flowfield = new Array(cols * rows);
        for(let i = 0; i < 700; i++){
            particles.push(new Particle());
        }

    }

    sketch.windowResized = function(){
        console.log("called")
        sketch.resizeCanvas(sketch.windowWidth,container.offsetHeight)
    }

    sketch.draw = function(){

        let yoff = 0;
        for(let y = 0; y < rows; y++){
            let xoff = 0;
            for(let x = 0; x < cols; x++){
                const index = x + y * cols;
                const angle = sketch.noise(xoff, yoff, zoff) * sketch.TWO_PI * 4;
                const v = p5.Vector.fromAngle(angle);
                v.setMag(3);
                flowfield[index] = v;
                xoff += inc;
            }
            yoff += inc;
            zoff += 0.0003;
        }

        sketch.background(0);

        particles.forEach((particle)=>{
            particle.follow(flowfield);
            particle.update();
            particle.edges();
            particle.show();
        });
    }

    class Particle {
        constructor(){
            this.pos = sketch.createVector(sketch.random(sketch.width),sketch.random(sketch.height));
            this.vel = sketch.createVector(0,0);
            this.acc = sketch.createVector(0,0);
            this.maxspeed = 4;
            this.prevPos = this.pos.copy();
            this.h = 0;
        }
        
        update(){
            this.vel.add(this.acc);
            this.vel.limit(this.maxspeed);
            this.pos.add(this.vel);
            this.acc.mult(0);
        }

        updatePrev(){
            this.prevPos.x = this.pos.x;
            this.prevPos.y = this.pos.y;
        }

        applyForce(force){
            this.acc.add(force);
        }

        show(){
            sketch.stroke(this.h, 255, 255, 25);
            this.h = (this.h + 1) % 255;
            sketch.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
            this.updatePrev();
        }

        edges(){
            const requiresUpdate = (this.pos.x > sketch.width || this.pos.x < 0 || this.pos.y > sketch.height || this.pos.y < 0) ? true : false;
            this.pos.x = (this.pos.x + sketch.width) % sketch.width;
            this.pos.y = (this.pos.y + sketch.height) % sketch.height;
            if(requiresUpdate) this.updatePrev();
        }

        follow(vectors){
            const x = sketch.floor(this.pos.x/scl);
            const y = sketch.floor(this.pos.y/scl);
            const index = x + y * cols;
            const force = vectors[index];
            this.applyForce(force);
        }
    }
}