import Coord from "./coord.mjs"

export default class CoordSet {
    constructor(){
        this.reset()
    }
    add(coord){
        if(!(coord instanceof Coord))
            return null

        for(let other of this.coords){
            if(other.isEqual(coord)){
                return null
            }
        }
        this.coords.push(coord)
    }
    reset(){
        this.coords = []
    }
}