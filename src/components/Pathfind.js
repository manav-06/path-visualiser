import React, { useState, useEffect } from "react";
import Node from "./Node";
import "./Pathfind.css";
import Astar from './AstarAlgorithm/astar'

const rows = 25, cols = 60;

const NODE_START_ROW = 0
const NODE_START_COL = 0
const NODE_END_ROW = rows - 1
const NODE_END_COL = cols - 1

const Pathfind = () => {
    const [Grid, setGrid] = useState([]);
    const [Path, setPath] = useState([])
    const [VisitedNodes, setVisitedNodes] = useState([])
    const [startChange, setStartChange] = useState(false)


    useEffect(() => {
        initializeGrid();
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
        let path = Astar(startNode, endNode)
        setPath(path.path)
        setVisitedNodes(path.visitedNodes)
        if (path.error) {
            console.log("No path found")
            return;
        }
        console.log(`Path length: ${path.path.length}`)
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
    }

    const visualizePath = () => {
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
    }

    console.log(Path)


    const moveStartHandler = () => {

    }


    return (
        <div className="Wrapper">
            <button onClick={visualizePath}>Visualize path</button>
            <button onClick={() => { window.location.reload() }}>Refresh</button>
            <button onClick={moveStartHandler}>Change Start</button>
            <h1>Pathfind component</h1>
            {gridwithNode}
        </div>
    );
};

export default Pathfind;
