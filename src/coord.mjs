import { cmpNum } from "./utils.mjs"

export default class Coord {
    static empty(){
        return new Coord(null, null)
    }
    static coord(x = 0, y = 0){
        return new Coord(x, y)
    }
    constructor(x, y){
        this.change(x, y)
    }
    unset(){
        this.isUnset = true
        this.x = this.y = null
    }
    clone(){
        return new Coord(this.x, this.y)
    }
    change(x, y){
        this.isUnset = (typeof x !== "number" || typeof y !== "number")
        if(this.isUnset)
            this.x = this.y = null
        else{
            this.x = x
            this.y = y
        }
    }
    distance(other){
        if(!(other instanceof Coord) || other.isUnset)
            return null
        
        return Math.sqrt((other.x - this.x) ** 2 + (other.y - this.y) ** 2)
    }
    isEqual(other){
        return cmpNum(this.x, other.x) && cmpNum(this.y, other.y)
    }
    add(other){
        if(!(other instanceof Coord) || other.isUnset)
            return null
        this.x += other.x
        this.y += other.y
        return this
    }
    addDelta(dx, dy){
        this.x += dx
        this.y += dy
        return this
    }
}