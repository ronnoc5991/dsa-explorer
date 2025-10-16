import linkMap from "./linkMap";

export default function Home() {
  return (
    <main>
      <h1>DSA Explorer</h1>
      <p>Hello and welcome to DSA Explorer!</p>
      Mission: Make data structures and algorithms easy to understand and
      visualize for myself and others.
      <p>WHO, WHAT, WHEN, WHERE, WHY, HOW</p>
      <h1>Data Structures</h1>
      <ul>
        {Object.values(linkMap.dataStructures).map(({ displayName, href }) => (
          <li key={href}>
            <a href={href}>{displayName}</a>
          </li>
        ))}
      </ul>
      <h1>Algos</h1>
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
