import Coord from "./coord.mjs"
import { cmpNum } from "./utils.mjs"

export default class Circle {
    /** @param {Circle} circle @param {CanvasRenderingContext2D} ctx */
    static draw(circle, ctx){
        if(circle.pos.isUnset) return
        ctx.beginPath()
        ctx.arc(circle.pos.x, circle.pos.y, circle.r, 0, 7)
        ctx.stroke()
    }

    static findIntersection(a, b){
        if(!(a instanceof Circle) || !(b instanceof Circle))
            return []
        
        let points = []
        let dx = b.pos.x - a.pos.x
        let dy = b.pos.y - a.pos.y
        let dist = Math.hypot(dy, dx)

        if(dist > a.r + b.r || dist < Math.abs(a.r - b.r) || (cmpNum(a.pos.x, b.pos.x) && cmpNum(a.pos.y, b.pos.y) && cmpNum(a.r, b.r)))
            return []

        let centroid = (a.r ** 2 - b.r ** 2 + dist ** 2) / (2 * dist)
        let base = a.pos.clone().addDelta((dx * centroid) / dist, (dy * centroid) / dist)
        let h = Math.sqrt(a.r * a.r - centroid * centroid)
        let r = Coord.coord(-dy * (h / dist), dx * (h / dist))
        points.push(Coord.coord(base.x + r.x, base.y + r.y))        
        
        if(!cmpNum(base.x + r.x, base.x - r.x) || !cmpNum(base.y + r.y, base.y - r.y))
            points.push(Coord.coord(base.x - r.x, base.y - r.y))

        return points

    }



    /** @param {number} r @param {import("./coord.mjs").Coord} a @param {number} b */
    constructor(r = 1, a, b){
        if(typeof a === "number")
            a = Coord.coord(a, b)
        
        if(!(a instanceof Coord))
            throw new TypeError("Circle has no valid position")
        
        this.pos = a
        this.r = r
    }

    draw(ctx){
        this.constructor.draw(this, ctx)
    }
    findIntersection(otherCircle){
        return this.constructor.findIntersection(this, otherCircle)
    }
}