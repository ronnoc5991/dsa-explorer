"use client";

// TODO: break this thing out into components...
// continue to setup the state that we need, selecting start and end points?
// should the mouse have modes? (selectStart, selectFinish, blockNode, see node stats?)
// the nodes should have states that determine their states, could receive an onClick callback... the mode will determine what that callback does...

import { useEffect, useState } from "react";
import Counter from "@/components/Counter";
import Node from "@/components/Node";
import gridToGraph from "@/utils/gridToGraph";
import { Dijkstra } from "@/algorithms/ShortestPath";
import { VertexName, vertexPositionToName } from "@/data-structures/Vertex";

type BooleanGrid = Array<Array<boolean>>;

function generateGrid(size: number, prev?: BooleanGrid | null) {
  return Array.from({ length: size }).map((_, rIndex) =>
    Array.from({ length: size }).map(
      (_, cIndex) => prev?.[rIndex]?.[cIndex] ?? true
    )
  );
}

// TODO: allow users to select the algorithm to run...
// we should 'step' through the algorithm at some rate...

type MouseMode = "default" | "select-start" | "select-end";

export default function Home() {
  const [size, setSize] = useState(10);

  const [grid, setGrid] = useState<Array<Array<boolean>>>(generateGrid(size));

  const [graph, setGraph] = useState(gridToGraph(grid));

  const [shortestPath, setShortestPath] = useState<Array<string> | null>(null);

  const [mouseMode, setMouseMode] = useState<MouseMode>("default");

  const [startNode, setStartNode] = useState<VertexName | null>(null);
  const [endNode, setEndNode] = useState<VertexName | null>(null);

  const selectStartNode = (name: VertexName) => {
    setStartNode(name);
  };

  const selectEndNode = (name: VertexName) => {
    setEndNode(name);
  };

  const adjustGridSize = (s: number) => {
    setGrid((prev) => generateGrid(s, prev));
  };

  useEffect(() => {
    adjustGridSize(size);
  }, [size]);

  useEffect(() => {
    setGraph(gridToGraph(grid));
  }, [grid]);

  const findShortestPath = () => {
    if (!startNode || !endNode) return;
    const algo = new Dijkstra(graph);
    setShortestPath(algo.findShortestPath(startNode, endNode));
  };

  useEffect(() => {
    if (shortestPath !== null) setShortestPath(null);
    setStartNode(null);
    setEndNode(null);
  }, [graph]);

  const toggleIsNodeActive = (rowIndex: number, colIndex: number) => {
    setGrid((g) =>
      g.map((row, rIndex) =>
        row.map((isActive, cIndex) =>
          rowIndex === rIndex && colIndex === cIndex ? !isActive : isActive
        )
      )
    );
  };

  return (
    <div>
      <Counter
        value={size}
        onDecrement={(v) => v > 1 && setSize(v)}
        onIncrement={(v) => v <= 20 && setSize(v)}
      />
      <button onClick={findShortestPath}>Find Shortest Path</button>
      <div>
        <button onClick={() => setMouseMode("default")}>Default</button>
        <button onClick={() => setMouseMode("select-start")}>
          Select Start
        </button>
        <button onClick={() => setMouseMode("select-end")}>Select End</button>
      </div>
      <div>Mode is: {mouseMode}</div>
      <div>Start is: {startNode}</div>
      <div>End is: {endNode}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {grid.map((row, rowIndex) => {
          return (
            <div style={{ display: "flex", gap: 5 }}>
              {row.map((active, colIndex) => {
                return (
                  <Node
                    state={
                      !active
                        ? "disabled"
                        : shortestPath === null
                        ? "active"
                        : "in-path"
                    }
                    onClick={() => {
                      switch (mouseMode) {
                        case "default":
                          toggleIsNodeActive(rowIndex, colIndex);
                          break;
                        case "select-start":
                          selectStartNode(
                            vertexPositionToName({ y: rowIndex, x: colIndex })
                          );
                          break;
                        case "select-end":
                          selectEndNode(
                            vertexPositionToName({ y: rowIndex, x: colIndex })
                          );
                          break;
                        default:
                          break;
                      }
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
