
function Astar(startnode, endNode) {
    let openSet = []
    let closedSet = []
    let path = []
    let visitedNodes = []

    openSet.push(startnode)

    while (openSet.length > 0) {
        let leastIndex = 0

        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[leastIndex].f) {
                leastIndex = i
            }
        }

        let current = openSet[leastIndex]
        // console.log(current)
        visitedNodes.push(current)

        if (current === endNode) {
            let temp = current
            path.push(temp)
            while (temp.previous) {
                path.push(temp.previous)
                temp = temp.previous
            }
            console.log(path)
            return { path, visitedNodes }
        }

        openSet = openSet.filter(elt => elt !== current)
        closedSet.push(current)

        let neighbours = current.neighbours

        // console.log(neighbours)

        for (let neighbour of neighbours) {

            if (!neighbour.isWall && !closedSet.includes(neighbour)) {
                let tempG = current.g + 1;
                let newPath = false
                if (openSet.includes(neighbour)) {
                    if (tempG < neighbour.g) {
                        neighbour.g = tempG
                        newPath = true
                    }
                } else {
                    neighbour.g = tempG
                    newPath = true
                    openSet.push(neighbour)
                }
                if (newPath) {
                    neighbour.h = herustic(neighbour, endNode)
                    neighbour.f = neighbour.f + neighbour.g
                    neighbour.previous = current
                }
            }
        }

    }
    return { path, visitedNodes, error: "No path found" }
}


function herustic(a, b) {
    let d = Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
    return d;
}

export default Astar