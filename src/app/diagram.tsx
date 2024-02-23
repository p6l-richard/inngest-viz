"use client";

import ReactFlow, {
  Background,
  Controls,
  Position,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "@dagrejs/dagre";

const nodes: Array<Node> = [
  // events
  // {
  //   id: "0",
  //   position: { x: -500, y: -500 },
  //   data: { label: "EVENTS", nodeType: "event" },
  //   type: "input",
  // },
  {
    id: "1",
    position: { x: -500, y: -500 },
    data: { label: "procurato/search.submitted", nodeType: "event" },
    type: "input",
  },
  {
    id: "2",
    position: { x: -500, y: -500 },
    data: { label: "procurato/company.viewed", nodeType: "event" },
    type: "input",
  },
  {
    id: "3",
    position: { x: -500, y: -500 },
    data: { label: "procurato/search.completed", nodeType: "event" },
    type: "input",
  },
  {
    id: "4",
    position: { x: -500, y: -500 },
    data: { label: "trade-register/search.performed", nodeType: "event" },
    type: "input",
  },
  {
    id: "5",
    position: { x: -500, y: -500 },
    data: { label: "trade-register/file.downloaded", nodeType: "event" },
    type: "input",
  },
  {
    id: "6",
    position: { x: -500, y: -500 },
    data: { label: "trade-register/si.downloaded", nodeType: "event" },
    type: "input",
  },
  // functions
  // {
  //   id: "00",
  //   position: { x: 0, y: 0},
  //   data: { label: "FUNCTIONS", nodeType: "event" },
  //   type: "input",
  // },
  {
    id: "7",
    position: { x: -500, y: -500 },
    data: { label: "searchCompany()", nodeType: "function" },
    type: "output",
  },
  {
    id: "8",
    position: { x: -500, y: -500 },
    data: { label: "storeCompanySearch()", nodeType: "function" },
    type: "output",
  },
  {
    id: "9",
    position: { x: -500, y: -500 },
    data: { label: "upsertFile()", nodeType: "function" },
    type: "output",
  },
  {
    id: "10",
    position: { x: -500, y: -500 },
    data: { label: "parseStructuredContent()", nodeType: "function" },
    type: "output",
  },
  {
    id: "11",
    position: { x: -500, y: -500 },
    data: { label: "getFile()", nodeType: "function" },
    type: "output",
  },
];

const edges = [
  // { id: "1-3", source: "1", target: "3" },
  { id: "1-7", source: "1", target: "7" },
  { id: "2-11", source: "2", target: "11" },
  { id: "4-8", source: "4", target: "8" },
  { id: "5-9", source: "5", target: "9" },
  { id: "6-10", source: "6", target: "10" },
];

export const Diagram = () => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 300;
  const nodeHeight = 36;
  const getLayoutedElements = (
    nodes: Node[],
    edges: Edge[],
    direction = "LR",
  ) => {
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    const eventNodes = nodes.filter((node) => node.data.nodeType === "event");
    const functionNodes = nodes.filter(
      (node) => node.data.nodeType === "function",
    );

    eventNodes.forEach((node, index) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
      dagreGraph.setEdge("start", node.id); // Connect event nodes to a dummy start node
      node.position = {
        x: isHorizontal ? 0 : index * 100, // Adjust x position for event nodes
        y: index * 100,
      };
      if (node.id === "3") {
        console.log({ position: node.position, isHorizontal });
      }
    });

    functionNodes.forEach((node, index) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
      dagreGraph.setEdge(node.id, "end"); // Connect function nodes to a dummy end node
      node.position = {
        x: isHorizontal ? 1000 : 500 + index * 100, // Adjust x position for function nodes
        y: index * 100,
      };
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    eventNodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? Position.Left : Position.Top;
      node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
      node.position = {
        // NB: THIS IS HARD-CODED, so that we can align functions to left
        x: 0 - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    });

    functionNodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? Position.Left : Position.Top;
      node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
      node.position = {
        // NB: THIS IS HARD-CODED, so that we can align functions to right
        x: 500 - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    });

    return { nodes: [...functionNodes, ...eventNodes], edges };
  };

  const { nodes: updatedNodes, edges: updatedEdges } = getLayoutedElements(
    nodes,
    edges,
  );

  return (
    <ReactFlow nodes={updatedNodes} edges={updatedEdges}>
      <Background />
      <Controls />
    </ReactFlow>
  );
};
