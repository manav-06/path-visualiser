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

    isEmpty() {
        return this.items.length === 0
    }
}

const bfs = (startNode, endNode) => {
    const q = new Queue()
    q.enqueue(startNode)
    const visitedNodes = []
    visitedNodes.push(startNode)
    const path = []

    while (!q.isEmpty()) {

        const node = q.front()
        q.dequeue()
        if (node === endNode) {

            let temp = node
            path.push(temp)
            while (temp.previous) {
                path.push(temp.previous)
                temp = temp.previous
            }
            console.log(path)
            return { path, visitedNodes }
        }
        for (let neighbour of node.neighbours) {
            if (!neighbour.isWall && !visitedNodes.includes(neighbour)) {
                visitedNodes.push(neighbour)
                neighbour.previous = node
                q.enqueue(neighbour)
            }
        }
    }
    return { path, visitedNodes, error: "No path found" }
}

export default bfs