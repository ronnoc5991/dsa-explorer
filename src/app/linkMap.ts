type LinkDetails = {
  href: string;
  displayName: string;
};

type LinkMap = {
  dataStructures: Record<string, LinkDetails>;
  algorithms: Record<string, LinkDetails>;
};

const DATA_STRUCTURES_PATH = "/data-structures";
const ALGORITHMS_PATH = "/algorithms";

// TODO: include a status alongside each link to illustrate its state to potential visitors

const linkMap: LinkMap = {
  dataStructures: {
    intro: {
      displayName: "What are data structures?",
      href: `${DATA_STRUCTURES_PATH}`,
    },
    graph: {
      displayName: "Graph",
      href: `${DATA_STRUCTURES_PATH}/graph`,
    },
    array: {
      displayName: "Array",
      href: `${DATA_STRUCTURES_PATH}/array`,
    },
    dynamicArray: {
      displayName: "Dynamic Array",
      href: `${DATA_STRUCTURES_PATH}/dynamic-array`,
    },
    linkedList: {
      displayName: "Linked List",
      href: `${DATA_STRUCTURES_PATH}/linked-list`,
    },
  },
  algorithms: {
    intro: {
      displayName: "What are algorithms?",
      href: `${ALGORITHMS_PATH}`,
    },
    shortestPath: {
      displayName: "Shortest Path",
      href: `${ALGORITHMS_PATH}/shortest-path`,
    },
  },
};

export default linkMap;
export { DATA_STRUCTURES_PATH, ALGORITHMS_PATH };
