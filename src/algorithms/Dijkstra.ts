import Vertex from "@/data-structures/Vertex";
import { Graph } from "@/data-structures/Graph";

// TODO: somehow have each algo 'pause' so we can render its state in between operations...
// pass control to something else... then pass control back here for the algorithm to continue

// for dijkstra, what things need to be illustrated?
// the 'current' node?
// the neighbor being evaluated and updated
// the distance to each node
// when the thing is done running, we can highlight the path

// how do we turn a grid into a graph?
// what UI am I imagining?
// A grid of squares
// the squares can be toggled on/off
// a start and end can be chosen
// should we allow for choosing no end? (to show the min distances to each node?)
// representation underneath could be booleans? (on or off)
// process that grid into a graph by creating vertices and edges...

// TODO: why is this a class?  Why wouldn't this be a function?  Is there any interesting state we want to hold onto?
// we could hold onto the 'prev' map and allow users to hover over a vertex and we could highlight the shortest path to that vertex
class Dijkstra {
  private graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  search(source: Vertex, destination: Vertex): Array<Vertex> | null {
    const q = [source];
    const visited = new Set();
    const distances: Map<Vertex, number> = new Map();
    const prev: Map<Vertex, Vertex | null> = new Map();

    this.graph.vertices.forEach((v) => {
      prev.set(v, null);
      distances.set(v, v === source ? 0 : Infinity);
    });

    while (q.length) {
      const current = q.shift() as Vertex;
      if (visited.has(current)) continue;
      visited.add(current);

      if (current === destination) break;

      this.graph.getNeighbors(current).forEach((neighbor) => {
        const currentDistance = distances.get(neighbor) ?? Infinity;
        const newDistance =
          (distances.get(current) ?? Infinity) +
          this.graph.getEdgeWeight(current, neighbor);

        if (newDistance < currentDistance) {
          distances.set(neighbor, newDistance);
          prev.set(neighbor, current);
          if (!visited.has(neighbor)) q.push(neighbor);
        }
      });

      q.sort(
        (a, b) =>
          (distances.get(a) || Infinity) - (distances.get(b) || Infinity)
      );
    }

    const pathInReverse = [];

    let curr: Vertex | null = destination;

    while (curr) {
      pathInReverse.push(curr);
      curr = prev.get(curr) ?? null;
    }

    return pathInReverse.length > 1 ? pathInReverse.reverse() : null;
  }
}

export default Dijkstra;
