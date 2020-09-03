import React, { useState, useEffect } from 'react'
import '../css/PathfindingVisualizer.css'
import Node from './node.jsx';

import { dijkstra } from '../algorithm/dijkstra'

const START_NODE_ROW = 9;
const START_NODE_COL = 9;
const FINISH_NODE_ROW = 9;
const FINISH_NODE_COL = 39;



function PathfindingVisualizer() {
    // Variables
    const [grid, setGrid] = useState([]);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);


    // Create a grid of nodes
    useEffect(() => {
        setGrid(createGrid());
    }, []);


    function vizualiseDijkstra() {
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        
        animateDijkstra(visitedNodesInOrder);
    }

    function animateDijkstra(visitedNodesInOrder) {
        for(let i = 0; i <= visitedNodesInOrder.length; i++) {
            if(i === visitedNodesInOrder.length) {
                return;
            }
            
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = "node node-visited"
            }, 15 * i);
        
        }
    }


    function handleMouseDown(row, col) {
        setMouseIsPressed(true);
        const newGrid = CreateNewGridWithWalls(grid, row, col);
        setGrid(newGrid);
    }

    function handleMouseEnter(row, col) {
        if(!mouseIsPressed) return;
        const newGrid = CreateNewGridWithWalls(grid, row, col);
        setGrid(newGrid);
    }

    function handleMouseUp() {
        setMouseIsPressed(false);
    }



    // Render
    return (
        <div className="Pathfinding">
            <button onClick={() => vizualiseDijkstra()}>
                Vizualise dijkstra algorithm
            </button>

            {grid.map((row, rowIndex) => {
                return (
                    <div key={rowIndex}>
                        {row.map((node, nodeIndex) => {
                            const {row, col, isStart, isFinish, isVisited, isWall } = node;
                            return (
                                <Node 
                                    key={nodeIndex}
                                    row={row}
                                    col={col}
                                    isStart={isStart}
                                    isFinish={isFinish}
                                    isVisited={isVisited}
                                    isWall={isWall}
                                    mouseIsPressed={mouseIsPressed}
                                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                                    onMouseUp={() => handleMouseUp()}
                                />
                                )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export default PathfindingVisualizer





// Functions
function createGrid() {
    const grid = [];

    for(let row = 0; row < 20; row++) {
        const currentRow = [];

        for(let colum = 0; colum < 50; colum++) {
            currentRow.push(createNode(row, colum));
        }

        grid.push(currentRow);
    }

    return grid;
}


function createNode(row, col) {
    return {
        row,
        col,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        previousNode: null,
        isWall: false,
        onMouseDown: false,
        onMouseEnter: false,
        onMouseUp: false
    }
}

function CreateNewGridWithWalls(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall
    };
    newGrid[row][col] = newNode;
    return newGrid;
}
