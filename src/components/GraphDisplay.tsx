import { VertexName, vertexPositionToName } from "../data-structures/Vertex";
import Node from "./Node";

type GraphDisplayProps = {
  grid: Array<Array<boolean>>;
  onVertexClick: (vertexName: VertexName) => void;
};

export default function GraphDisplay({
  grid,
  onVertexClick,
}: GraphDisplayProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {grid.map((row, rowIndex) => {
        return (
          <div key={`row-${rowIndex}`} style={{ display: "flex", gap: 5 }}>
            {row.map((active, colIndex) => {
              const name = vertexPositionToName({ x: colIndex, y: rowIndex });

              return (
                <Node
                  key={name}
                  state={active ? "active" : "disabled"}
                  onClick={() => onVertexClick(name)}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
