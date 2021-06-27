import React, { useState, useEffect } from "react";
import Node from "./Node";
import "./PathFind.css";
import Astar from './AstarAlgorithm/astar'
import bfs from './BFS/bfs'
import Dijkstra from './Dijkstra/dijkstra'

const rows = 8, cols = 35;

const NODE_START_ROW = 0
const NODE_START_COL = 0
const NODE_END_ROW = rows - 1
const NODE_END_COL = cols - 1

const PathFind = () => {

    const [disableButton, setDisableButton] = useState(false)
    const [disableRefresh, setDisableRefresh] = useState(false)
    const [Grid, setGrid] = useState([]);
    const [AstarPath, setAstarPath] = useState([])
    const [BFSPath, setBFSPath] = useState([])
    const [DijkstraPath, setDijkstraPath] = useState([])
    const [AstarVisitedNodes, setAstarVisitedNodes] = useState([])
    const [BFSVisitedNodes, setBFSVisitedNodes] = useState([])
    const [DijkstraVisitedNodes, setDijkstraVisitedNodes] = useState([])
    const [pathLen, setPathLen] = useState()
    const [traversed, setTraversed] = useState(false)

    useEffect(() => {
        initializeGrid();
        setTraversed(false)
        setPathLen(null)
    }, []);

    const initializeGrid = () => {
        const grid = new Array(rows);

        for (let i = 0; i < rows; i++) {
            grid[i] = new Array(cols);
        }
        createSpot(grid);
        setGrid(grid);
        addNeighbours(grid)
        const startNode = grid[NODE_START_ROW][NODE_START_COL]
        const endNode = grid[NODE_END_ROW][NODE_END_COL]
        startNode.isWall = false
        endNode.isWall = false
        let astarpath = Astar(startNode, endNode)
        let bfspath = bfs(startNode, endNode)
        let dijkstrapath = Dijkstra(startNode, endNode)
        setTraversed(true)
        setAstarPath(astarpath.path)
        setBFSPath(bfspath.path)
        setDijkstraPath(dijkstrapath.path)
        setBFSVisitedNodes(bfspath.visitedNodes)
        setAstarVisitedNodes(astarpath.visitedNodes)
        setDijkstraVisitedNodes(dijkstrapath.visitedNodes)
        if (astarpath.error) {
            console.log("No path found")
            setPathLen(null)
            return;
        }
        setPathLen(astarpath.path.length)

    };

    const createSpot = (grid) => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j] = new Spot(i, j);
            }
        }
    };


    // Add neighbours
    const addNeighbours = (grid) => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j].addNeighbours(grid)
            }
        }
    }

    // SPOT constructor
    function Spot(i, j) {
        this.x = i;
        this.y = j;
        this.isStart = (this.x === NODE_START_ROW && this.y === NODE_START_COL)
        this.isEnd = (this.x === NODE_END_ROW && this.y === NODE_END_COL)
        this.g = Infinity;
        this.f = Infinity;
        this.h = Infinity;
        this.neighbours = [];
        this.isWall = false
        if (Math.random(1) < 0.2) {
            this.isWall = true;
        }
        this.previous = undefined;
        this.addNeighbours = function (grid) {
            let i = this.x
            let j = this.y
            if (i - 1 >= 0) this.neighbours.push(grid[i - 1][j])
            if (j - 1 >= 0) this.neighbours.push(grid[i][j - 1])
            if (i + 1 < rows) this.neighbours.push(grid[i + 1][j])
            if (j + 1 < cols) this.neighbours.push(grid[i][j + 1])
        }

    }

    // grid with node
    const gridwithNode = (
        <div>
            {Grid.map((row, rowIndex) => {
                return (
                    <div key={rowIndex} className='rowWrapper'>
                        {row.map((col, colIndex) => {
                            const { isStart, isEnd, isWall } = col;
                            return <Node
                                key={colIndex}
                                isStart={isStart}
                                isEnd={isEnd}
                                row={rowIndex}
                                col={colIndex}
                                isWall={isWall}
                            />;
                        })}
                    </div>
                );
            })}
        </div>
    );

    const visualizeShortestPath = (shortestPathNodes) => {
        for (let i = 0; i < shortestPathNodes.length; i++) {
            setTimeout(() => {
                const node = shortestPathNodes[i]
                document.getElementById(`node-${node.x}-${node.y}`).className = 'node node-shortest-path'
            }, 10 * i)

        }
        setPathLen(shortestPathNodes.length)
    }

    const visualizeAlgorithm = (VisitedNodes, Path) => {
        setDisableButton(true)
        setDisableRefresh(true)
        for (let i = 0; i <= VisitedNodes.length; i++) {
            if (i === VisitedNodes.length) {
                setTimeout(() => {
                    visualizeShortestPath(Path)
                }, 20 * i)
            } else {
                setTimeout(() => {
                    const node = VisitedNodes[i]
                    document.getElementById(`node-${node.x}-${node.y}`).className = 'node node-visited'
                }, 20 * i)
            }
        }
        setTraversed(true)
        const time = 25 * VisitedNodes.length
        setTimeout(() => {
            setDisableRefresh(false)
        }, time)
    }

    const visualizeAstar = () => {
        visualizeAlgorithm(AstarVisitedNodes, AstarPath)
    }

    const visualizeDijkstra = () => {
        visualizeAlgorithm(DijkstraVisitedNodes, DijkstraPath)
    }

    const visualizeBFS = () => {
        visualizeAlgorithm(BFSVisitedNodes, BFSPath)
    }


    return (
        <div className="Wrapper" align="center">
            <button disabled={disableRefresh} className='btn btn-outline-primary btn-lg square_btn' onClick={() => { window.location.reload() }}>Refresh</button>
            <button disabled={disableButton} className='btn btn-outline-primary btn-lg square_btn' onClick={visualizeAstar}>Visualize Astar</button>
            <button disabled={disableButton} className='btn btn-outline-primary btn-lg square_btn' onClick={visualizeBFS}>Visualize BFS</button>
            <button disabled={disableButton} className='btn btn-outline-primary btn-lg square_btn' onClick={visualizeDijkstra}>Visualize Dijkstra</button>
            <h1 className="header">Pathfinding Visualiser</h1>
            {gridwithNode}
            {traversed && pathLen && <h1>Path length: {pathLen}</h1>}
            {traversed && !pathLen && <h1>No path found</h1>}
        </div>
    );
};

export default PathFind;
