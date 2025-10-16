import linkMap from "../linkMap";

export default function DataStructures() {
  return (
    <main>
      <h1>Data Structures</h1>
      <h2>Data?</h2>
      <blockquote>
        Data - facts and statistics collected together for reference or
        analysis.
      </blockquote>
      <p>
        This definition is what we might expect. Within the context of
        computing, the definition is a bit different. Data refers to the pieces
        of information in the computer. That data could be the balance of a bank
        account, a user's name or an image.
      </p>
      <p>
        When working with data, we have to make decisions about how to structure
        that data in the computer's memory. Based on our decision, our programs
        may run faster (or sometimes slower).
      </p>
      <p>Explore the links below to learn about data structures!</p>
      <ul>
        {Object.values(linkMap.dataStructures).map(({ displayName, href }) => (
          <li key={href}>
            <a href={href}>{displayName}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
