require("dotenv").config();

import http from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloGateway } from "@apollo/gateway";
import logger from "morgan";
import {
  getSuperGraphSdlWithFile,
  getSuperGraphSdlWithIntrospectAndCompose,
} from "./utils/graphUtils";
import { initEnvironment } from "./utils/envUtils";

(async () => {
  try {
    initEnvironment();

    const app = express();

    const httpServer = http.createServer(app);

    const gateway = new ApolloGateway();

    const apolloServer = new ApolloServer({
      gateway,
    });

    await apolloServer.start();

    // Append middlewares.
    app.use(
      process.env.NODE_ENV !== "production" ? logger("dev") : logger("common")
    );

    // Apply middleware into express server.
    apolloServer.applyMiddleware({
      app,
      path: "/graphql",
    });

    // Start server.
    await httpServer.listen({ port: process.env.PORT || 4000 });

    // Write start log.
    if (process.env.NODE_ENV === "production") {
      console.info(
        `Server running at PORT ${process.env.PORT || 4000}${
          apolloServer.graphqlPath
        }`
      );
    } else {
      console.info(
        `Server running at http://localhost:${process.env.PORT || 4000}${
          apolloServer.graphqlPath
        }`
      );
    }
  } catch (e) {
    console.error("[runServer]", e);
  }
})();
