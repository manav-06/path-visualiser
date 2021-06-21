
class Queue {
    constructor() {
        this.items = []
    }
    enqueue(ele) {
        this.items.push(ele)
    }
    dequeue() {
        if (this.items.length === 0) {
            return "Underflow"
        }
        else
            return this.items.shift()
    }
    front() {
        if (this.items.length === 0) {
            return "Underflow"
        }
        else
            return this.items[0]
    }

    printQueue() {
        
        for (const item of this.items) {
            console.log(item)
        }
    }
}

export default Queue


