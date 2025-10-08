"use client";

// TODO: break this thing out into components...
// TODO: get rid of many useEffects with a library like zustand (some sort of state management)
// TODO: POC out how to play the algorithm through step by step so we have time to visualize it

import { useEffect, useState } from "react";
import Counter from "@/components/Counter";
import Node from "@/components/Node";
import gridToGraph from "@/utils/gridToGraph";
import {
  AStar,
  Dijkstra,
  ShortestPathAlgorithm,
} from "@/algorithms/ShortestPath";
import { VertexName, vertexPositionToName } from "@/data-structures/Vertex";
import { Graph } from "@/data-structures/Graph";

type BooleanGrid = Array<Array<boolean>>;

function generateGrid(size: number, prev?: BooleanGrid | null) {
  return Array.from({ length: size }).map((_, rIndex) =>
    Array.from({ length: size }).map(
      (_, cIndex) => prev?.[rIndex]?.[cIndex] ?? true
    )
  );
}

type ShortestPathAlgorithmName = "Dijkstra's" | "A-Star";

const shortestPathAlgorithms: Record<
  ShortestPathAlgorithmName,
  (graph: Graph, start: VertexName, end: VertexName) => ShortestPathAlgorithm
> = {
  "Dijkstra's": (graph: Graph, start: VertexName, end: VertexName) =>
    new Dijkstra(graph, start, end),
  "A-Star": (graph: Graph, start: VertexName, end: VertexName) =>
    new AStar(graph),
} as const;

type MouseMode = "default" | "select-start" | "select-end";

export default function Home() {
  const [size, setSize] = useState(10);

  const [grid, setGrid] = useState<Array<Array<boolean>>>(generateGrid(size));

  const [graph, setGraph] = useState(gridToGraph(grid));

  const [algorithm, setAlgorithm] =
    useState<ShortestPathAlgorithmName>("Dijkstra's");

  const [shortestPath, setShortestPath] = useState<Array<string> | null>(null);

  const [mouseMode, setMouseMode] = useState<MouseMode>("default");

  const [startNode, setStartNode] = useState<VertexName | null>(null);
  const [endNode, setEndNode] = useState<VertexName | null>(null);

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
    const algo = shortestPathAlgorithms[algorithm](graph, startNode, endNode);
    setShortestPath(algo.findShortestPath(startNode, endNode));
  };

  useEffect(() => {
    if (shortestPath !== null) setShortestPath(null);
    setStartNode(null);
    setEndNode(null);
  }, [graph]);

  useEffect(() => {
    if (shortestPath !== null) setShortestPath(null);
  }, [startNode, endNode]);

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
      <select
        value={algorithm}
        onChange={(e) =>
          setAlgorithm(e.target.value as ShortestPathAlgorithmName)
        }
      >
        {Object.keys(shortestPathAlgorithms).map((name) => {
          return <option value={name}>{name}</option>;
        })}
      </select>
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
                          setStartNode(
                            vertexPositionToName({ y: rowIndex, x: colIndex })
                          );
                          break;
                        case "select-end":
                          setEndNode(
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
