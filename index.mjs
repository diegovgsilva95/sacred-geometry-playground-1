import Coord from "./src/coord.mjs"
import Canvas from "./src/canvas.mjs"
import Circle from "./src/circle.mjs"
import CoordSet from "./src/unique-coords.mjs"

Canvas.resize(1280, 720)
Canvas.addEventListener("init", function(){
    let {ctx, W, H, data} = this
    data.mouse = Coord.empty()
    data.circles = []
    data.range = (Math.min(W,H)/2)*0.1
    data.findRange = 1
    data.circles.push(new Circle(data.range, W/2, H/2))
    data.allIntersections = []
    data.nearIntersections = []
    data._processMM = null
    recalculateIntersection()
})
function recalculateIntersection(){
    let {data} = Canvas
    let {circles} = data
    let intersSet = new CoordSet()
    data.nearIntersections = []
    data.allIntersections = []
    let circleCount = 0
    let computedIntersectionCount = 0

    for(let c of circles){
        if(c.isUnset) continue

        for(let k = 0; k < 4; k++){
            let qb = (((k&1)<<1) - 1)
            let qx = (1 - (k>>1)) * qb
            let qy = ((k>>1)) * qb
            let quadrantPos = c.pos.clone().addDelta(qx * c.r, qy * c.r)
            intersSet.add(quadrantPos)
            computedIntersectionCount++
        }
        circleCount++
    }

    for(let c of circles){
        if(c.isUnset) continue

        for(let oc of circles){
            if(oc == c) continue;
            if(c.isUnset) continue

            let intersections = c.findIntersection(oc)
            for(let inter of intersections){
                intersSet.add(inter)
                computedIntersectionCount++
            }
        }
    }

    let realIntersections = []

    for(let i = 0; i < intersSet.coords.length; i++){
        let inter = intersSet.coords[i]
        let matchCenter = false

        for(let c of circles){
            if(c.isUnset) continue
            if(c.pos.isEqual(inter)){
                matchCenter = true
                break
            }
        }

        if(!matchCenter)
            realIntersections.push(inter)
    }

    console.log(`Found ${realIntersections.length} out of ${computedIntersectionCount} computed intersections, between ${circleCount} circles`)
    data.allIntersections = realIntersections
}
function findNearIntersection(){
    let {data} = Canvas
    data.nearIntersections = []
    let o = []
    for(let inter of data.allIntersections){
        if(inter.distance(data.mouse) < data.range * data.findRange)
            o.push(inter)
    }
    data.nearIntersections = o
}

Canvas.addEventListener("draw", function(ev, ...args){
    /** @type {{ctx: CanvasRenderingContext2D}} */
    let {ctx, W, H, data} = this
    ctx.strokeStyle = "red"
    for(let circle of data.circles){
        circle.draw(ctx)
    }

    ctx.strokeStyle = "cyan"
    for(let inter of data.allIntersections){
        this.drawX(inter.x, inter.y)
    }
    
    for(let inter of data.nearIntersections){
        this.drawX(inter.x, inter.y)
        ctx.strokeStyle = "#F88"
        this.drawCircle(inter.x, inter.y, data.range)
        ctx.strokeStyle = "orange"
        this.drawCircle(inter.x, inter.y, data.range * data.findRange)
    }
    if(!data.mouse.isUnset){
        ctx.strokeStyle = "white"
        this.drawX(data.mouse.x, data.mouse.y, 3 + ((this.frame / (this.FPS/2)) % 2)*2 )
    }
})
Canvas.addEventListener("mousewheel", function(ev){
    let {data} = this
    if(ev.shiftKey){
        console.info(`Extending ${data.range}`)
        data.range = Math.max(0, data.range + (ev.wheelDeltaY/120))
        console.info(`Extended to ${data.range}`)
    }else
        data.findRange = Math.min(1, Math.max(0, data.findRange + (ev.wheelDeltaY/120)*0.01))
    findNearIntersection()
})

Canvas.addEventListener("mousemove", function({offsetX: x, offsetY: y}){
    let {data} = this
    data.mouse.change(x, y)
    findNearIntersection()
})

Canvas.addEventListener("click", function({offsetX: x, offsetY: y}){
    let {data} = this
    if(data.nearIntersections.length == 0)
        return console.warn("No intersection near mouse.")

        
    if(data.nearIntersections.length > 1)
        console.warn("Multiple intersections near mouse, choosing the first.")

    let intersection = data.nearIntersections[0]
    data.circles.push(new Circle(data.range, intersection.x, intersection.y))
    recalculateIntersection()

})

Canvas.addEventListener("mousedown", function({button}){
    if(button == 1){
        let {data, W, H} = Canvas 
        console.info("%c* Reset *", "color: #0c0;font-style: italic;")
        data.circles = []
        data.range = (Math.min(W,H)/2)*0.3
        data.findRange = 1
        data.circles.push(new Circle(data.range, W/2, H/2))
        data.allIntersections = []
        data.nearIntersections = []
        recalculateIntersection()
    }
})

Canvas.start()