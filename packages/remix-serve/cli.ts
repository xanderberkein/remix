import "./env";
import { pathToFileURL } from "node:url";
import os from "node:os";
import path from "node:path";

import { createApp } from "./index";

let port = process.env.PORT ? Number(process.env.PORT) : 3000;
if (Number.isNaN(port)) port = 3000;

let buildPathArg = process.argv[2];

if (!buildPathArg) {
  console.error(`
  Usage: remix-serve <build-dir>`);
  process.exit(1);
}

let buildPath = path.resolve(process.cwd(), buildPathArg);

let onListen = () => {
  let address =
    process.env.HOST ||
    Object.values(os.networkInterfaces())
      .flat()
      .find((ip) => String(ip?.family).includes("4") && !ip?.internal)?.address;

  if (!address) {
    console.log(`Remix App Server started at http://localhost:${port}`);
  } else {
    console.log(
      `Remix App Server started at http://localhost:${port} (http://${address}:${port})`
    );
  }
};

export async function getBuildInfo(buildPath: string) {
  let resolvedBuildPath = require.resolve(buildPath);
  try {
    let buildModule = await import(pathToFileURL(resolvedBuildPath).href);
    return {
      build: buildModule?.default || buildModule,
      buildPath: resolvedBuildPath,
    };
  } catch (error: unknown) {
    throw new Error(
      `Error loading Remix config at ${buildPath}\n${String(error)}`
    );
  }
}

(async () => {
  let buildInfo = await getBuildInfo(buildPath);
  let app = createApp(
    buildInfo.buildPath,
    process.env.NODE_ENV,
    buildInfo.build.publicPath,
    buildInfo.build.assetsBuildDirectory
  );
  let server = process.env.HOST
    ? app.listen(port, process.env.HOST, onListen)
    : app.listen(port, onListen);

  ["SIGTERM", "SIGINT"].forEach((signal) => {
    process.once(signal, () => server?.close(console.error));
  });
})();
