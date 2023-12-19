export default new class extends EventTarget{
    static MY_EVENTS = ["draw", "init"]
    constructor(W = 640, H = 360){
        super()
        this.canvas = document.querySelector("canvas")
        this.resize(W, H)
        this.ctx = this.canvas.getContext("2d")
        this.frame = 0
        this.data = {}
        this.FPS = 30
        this.frameDelta = 1000 / this.FPS
        this.last_rendered = 0
    }
    resize(W, H){
        this.W = this.canvas.width = W
        this.H = this.canvas.height = H
    }
    // addEventListener(type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions
    addEventListener(type, callback, options){
        if(type == "init")
            return requestAnimationFrame(callback.bind(this))
        
        if(this.constructor.MY_EVENTS.includes(type))
            return super.addEventListener(type, callback, options)
        
        let self = this
        return this.canvas.addEventListener(type, function(...ev){
            callback.apply(self, ev)
        }, options)
    }
    defaultDraw(){
        const {ctx, W, H} = this
        ctx.fillStyle = "#222"
        ctx.fillRect(0, 0, W, H)
    }
    trigger(){
        let dn = Date.now()
        if(this.last_rendered == 0 || (dn - this.last_rendered) >= this.frameDelta ){
            this.last_rendered = dn
            
            ++this.frame
            this.defaultDraw()
            this.dispatchEvent(new Event("draw"))
        }
        this.start()
    }
    start(){
        requestAnimationFrame(this.trigger.bind(this))
    }
    drawX(x, y, size=3){
        let {ctx} = this
        ctx.beginPath()
        ctx.moveTo(x-size, y-size)
        ctx.lineTo(x+size, y+size)
    
        ctx.moveTo(x+size, y-size)
        ctx.lineTo(x-size, y+size)
        ctx.stroke()
    }
    drawCircle(x, y, r){
        let {ctx} = this
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 7)
        ctx.stroke()
    }
}