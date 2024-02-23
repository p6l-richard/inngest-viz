"use client";

import { ReactFlowProvider } from "reactflow";

export const Providers = (props: React.PropsWithChildren) => {
  return <ReactFlowProvider>{props.children}</ReactFlowProvider>;
};
