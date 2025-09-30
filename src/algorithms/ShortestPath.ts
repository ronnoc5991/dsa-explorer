import { Vertex } from "@/data-structures/Vertex";
import { Graph } from "@/data-structures/Graph";

interface ShortestPathAlgorithm {
  findShortestPath(start: Vertex, end: Vertex): Array<Vertex> | null;
  // reconstructPath(end: Vertex): Array<Vertex> | null;
  // getMinDistanceToVertex(u: Vertex): number; // the min distance at this point in time?
}

// TODO: think about how to visualize this... one step at a time
function search({
  graph,
  start,
  end,
  h,
  cameFrom,
}: {
  graph: Graph;
  start: Vertex;
  end: Vertex;
  h: (u: Vertex, end: Vertex) => number;
  cameFrom: Map<Vertex, Vertex | null>;
}): boolean {
  const q = [start];
  const visited = new Set();
  const fScore: Map<Vertex, number> = new Map();
  const gScore: Map<Vertex, number> = new Map();

  // could have the algo class do this? and pass the stateful parts in?
  graph.getVertices().forEach((v) => {
    cameFrom.set(v, null);
    gScore.set(v, v === start ? 0 : Infinity);
    fScore.set(v, v === start ? h(v, end) : Infinity);
  });

  while (q.length) {
    const current = q.shift() as Vertex;

    if (current === end) return true; // we have updated all of the state... it can be reconstructed now...

    if (visited.has(current)) continue;
    visited.add(current);

    graph.getNeighbors(current).forEach((neighbor) => {
      // get the existing gScore for this one
      const g = gScore.get(neighbor) ?? Infinity;
      // get the newGScore for this one
      const potentialG =
        (gScore.get(current) ?? Infinity) +
        graph.getEdgeWeight(current, neighbor);

      if (potentialG < g) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, potentialG);
        fScore.set(neighbor, potentialG + h(neighbor, end));
        if (!visited.has(neighbor)) q.push(neighbor);
      }
    });

    q.sort((a, b) => (fScore.get(a) || Infinity) - (fScore.get(b) || Infinity));
  }

  return false; // no path found
}

function reconstructPath(end: Vertex, cameFrom: Map<Vertex, Vertex | null>) {
  const pathInReverse = [];

  let curr: Vertex | null = end;

  while (curr) {
    pathInReverse.push(curr);
    curr = cameFrom.get(curr) ?? null;
  }

  return pathInReverse.length > 1 ? pathInReverse.reverse() : null;
}

export class Dijkstra implements ShortestPathAlgorithm {
  private graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  findShortestPath(start: Vertex, end: Vertex): Array<Vertex> | null {
    const cameFrom: Map<Vertex, Vertex | null> = new Map();
    const pathExists = search({
      graph: this.graph,
      end,
      start,
      h: () => 0,
      cameFrom,
    });

    if (pathExists) {
      return reconstructPath(end, cameFrom);
    } else {
      return null;
    }
  }
}

export class AStar {
  private graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  findShortestPath(start: Vertex, end: Vertex): Array<Vertex> | null {
    const cameFrom: Map<Vertex, Vertex | null> = new Map();
    const pathExists = search({
      graph: this.graph,
      end,
      start,
      h: (v, end) =>
        Math.sqrt(
          Math.pow(Math.abs(v[0] - end[0]), 2) +
            Math.pow(Math.abs(v[1] - end[1]), 2)
        ), // the hypotenuse
      cameFrom,
    });

    if (pathExists) {
      return reconstructPath(end, cameFrom);
    } else {
      return null;
    }
  }
}
