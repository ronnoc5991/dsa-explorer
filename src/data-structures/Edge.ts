import { Vertex } from "./Vertex";

class Edge {
  from: Vertex;
  to: Vertex;
  weight: number;

  constructor(from: Vertex, to: Vertex, weight: number) {
    this.from = from;
    this.to = to;
    this.weight = weight;
  }
}

export default Edge;
