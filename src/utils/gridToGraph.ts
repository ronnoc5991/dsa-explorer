import { VertexName, vertexPositionToName } from "../data-structures/Vertex";
import { AdjacencyList, Graph } from "../data-structures/Graph";

function gridToGraph(grid: Array<Array<boolean>>): Graph {
  const vertices: Array<VertexName> = [];

  const vertexGrid: Array<Array<VertexName | null>> = grid.map(
    (row, rowIndex) => {
      return row.map((column, columnIndex) => {
        if (!column) return null;

        const vertexName = vertexPositionToName({
          x: columnIndex,
          y: rowIndex,
        });
        vertices.push(vertexName);
        return vertexName;
      });
    }
  );

  // now go back over the thing and create the edges
  // why do we need to know all of the vertices before we create the edges?
  const graph = new AdjacencyList(vertices);

  vertexGrid.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      if (!column) return;

      const rightNeighbor = vertexGrid[rowIndex]?.[columnIndex + 1] ?? null;
      const downNeighbor = vertexGrid[rowIndex + 1]?.[columnIndex] ?? null;

      if (rightNeighbor) {
        graph.addEdge(column, rightNeighbor, 1);
      }

      if (downNeighbor) {
        graph.addEdge(column, downNeighbor, 1);
      }
    });
  });

  return graph;
}

export default gridToGraph;
