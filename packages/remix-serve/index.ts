import express from "express";
import compression from "compression";
import morgan from "morgan";
import { createRequestHandler } from "@remix-run/express";

import { getBuildInfo } from "./cli";

export function createApp(
  buildPath: string,
  mode = "production",
  publicPath = "/build/",
  assetsBuildDirectory = "public/build/"
) {
  let app = express();

  app.disable("x-powered-by");

  app.use(compression());

  app.use(
    publicPath,
    express.static(assetsBuildDirectory, { immutable: true, maxAge: "1y" })
  );

  app.use(express.static("public", { maxAge: "1h" }));

  app.use(morgan("tiny"));
  app.all(
    "*",
    mode === "production"
      ? async (req, res, next) => {
          let { build } = await getBuildInfo(buildPath);
          createRequestHandler({ build, mode })(req, res, next);
        }
      : async (req, res, next) => {
          let { build } = await getBuildInfo(buildPath);
          // require cache is purged in @remix-run/dev where the file watcher is
          return createRequestHandler({ build, mode })(req, res, next);
        }
  );

  return app;
}
