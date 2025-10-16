import linkMap from "../linkMap";

export default function Algorithms() {
  return (
    <main>
      <h1>Algorithms</h1>
      <ul>
        {Object.values(linkMap.algorithms).map(({ displayName, href }) => (
          <li key={href}>
            <a href={href}>{displayName}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
