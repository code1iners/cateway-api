import { IntrospectAndCompose } from "@apollo/gateway";
import { readFileSync } from "fs";

/**
 * ### Getting super graph from schema file.
 * @returns SuperGraphSdl
 */
export const getSuperGraphSdlWithFile = async (): Promise<string> => {
  return await readFileSync(
    "./src/graphql/generated/supergraph.graphql"
  ).toString();
};

/**
 * ### Getting super graph by introspect and compose from each server's.
 * @returns SuperGraphSdl
 */
export const getSuperGraphSdlWithIntrospectAndCompose =
  (): IntrospectAndCompose => {
    return new IntrospectAndCompose({
      subgraphs: [
        {
          name: "COVIES",
          url: process.env.COVIES_SERVICE_URL,
        },
        {
          name: "COEATHER",
          url: process.env.COEATHERS_SERVICE_URL,
        },
      ],
    });
  };
