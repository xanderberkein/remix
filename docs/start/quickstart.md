---
title: Quick Start (5m)
order: 2
---

# Quick Start

This guide will get you familiar with the basic plumbing required to run a Remix app as quickly as possible. While there are many starter templates with different runtimes, deploy targets, and databases, we're going to create a bare-bones project from scratch.

When you're ready to get serious about your Remix project, you might consider starting with a community template. They often include databases, testing infrastructure, authentication, and more. You can find a list of community templates on the [Remix Guide Templates][templates] page.

## Installation

```shellscript nonumber
$ mkdir my-remix-app
$ cd my-remix-app

# install runtime dependencies
$ npm i @remix-run/node @remix-run/serve @remix-run/react react react-dom

# install dev dependencies
$ npm i -D @remix-run/dev
```

## The Root Route

```shellscript nonumber
$ mkdir app
$ touch app/root.jsx
```

`app/root.jsx` is what we call the "Root Route". It's the root layout of your entire app. Here's the basic set of elements you'll need for any project:

```jsx
import { Meta, Links, Scripts, Outlet } from "@remix-run/react";

export default function Root() {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Hello world!</h1>
        <Outlet />

        <Scripts />
      </body>
    </html>
  );
}
```

## Build and Run

First build the app for production:

```shellscript nonumber
$ remix build
```

You should now see a `build/` folder (the server version of your app) and `public/build` folder (the browser version) with some build artifacts in them. (This is all [configurable][remixconfig].)

👉 **Run the app with `remix-serve`**

```shellscript nonumber
# note the dash!
$ remix-serve build
```

You should be able to open up [http://localhost:3000](http://localhost:3000) and see the "hello world" page.

Aside from the unholy amount of code in node_modules, our Remix app is just one file:

```
├── app
│   └── root.jsx
└── package.json
```

## Bring Your Own Server

The `build/` directory created by `remix build` is just a module that you run inside of a server like Express, Cloudflare Workers, Netlify, Vercel, Fastly, AWS, Deno, Azure, Fastify, Firebase ... anywhere.

If you don't care to set up your own server, you can use `remix-serve`. It's a simple express-based server maintained by the Remix team. However, Remix is specifically designed to run in _any_ JavaScript environment so that you own your stack. It is expected many—if not most—production apps will have their own server. You can read more about this in [Runtimes, Adapters, and Stacks][runtimes].

Just for kicks, let's stop using `remix-serve` and use express instead.

👉 **Install Express and the Remix Express adapter**

```shellscript nonumberellscript nonumber
$ npm i express @remix-run/express

# not going to use this anymore
$ npm uninstall @remix-run/serve
```

👉 **Create an Express server**

```shellscript nonumberellscript nonumber
$ touch server.mjs
```

```js filename=server.mjs
import express from "express";
import { createRequestHandler } from "@remix-run/express";

// notice that the result of `remix build` is "just a module"
import build from "./build/index.js";

const app = express();
app.use(express.static("public"));

// and your app is "just a request handler"
app.all("*", createRequestHandler({ build }));

app.listen(3000, () => {
  console.log("App listening on http://localhost:3000");
});
```

👉 **Run your app with express**

```shellscript nonumber
$ node server.mjs
```

Now that you own your server, you can debug your app with whatever tooling your server has. For example, you can inspect your app with chrome devtools with the [Node.js inspect flag][inspect]:

```shellscript nonumber
$ node --inspect server.mjs
```

## Development Workflow

Instead of building for production every time you want to run the app, you can run Remix in development mode which enables instant feedback to changes in your app with React Refresh (Hot Module Replacement) and Remix Hot Data Revalidation.

Because you own your server, you also get to (have to?) own some of your development tooling as well. Let's add some package.json scripts to make it easier to run both the express server and the remix compiler in development mode in a single process:

👉 **Add a "scripts" entry to package.json**

```json lines=[3-7]
{
  "name": "my-remix-app",
  "scripts": {
    "dev": "run-p dev:*",
    "dev:remix": "NODE_ENV=development remix dev",
    "dev:express": "NODE_ENV=development node --watch server.mjs"
  }
}
```

You'll need node 19+ for `node --watch` to work, otherwise you can use `nodemon`.

`run-p` from the `npm-run-all` package is a common node tool to run two package.json scripts with one command. Let's install it first.

👉 **Install npm-run-all**

```shellscript nonumber
npm i -D npm-run-all
```

We should be ready to go now:

👉 **Start the Remix compiler and express server development**

```shellscript nonumber
npm run dev
```

Now when a file changes, `remix dev` will rebuild the client bundles and update the code in the browser live with React Refresh. It will also rebuild the server handler which will trigger `node --watch server.mjs` to restart. If server code changed (like data loaders and actions) then Remix will revalidate the data to get bring your UI in sync with the code. This gives you nearly instant feedback in development and ensures both the client and server are running the same app.

Give it a shot, change the text in `root.jsx` and watch!

## Summary

Congrats, you can add Remix to your resume! Summing things up, we've learned:

- Remix compiles your app to a server module and a pile of static assets in your public directory.
- You can bring your own server with adapters to deploy anywhere.
- You can set up a development workflow with HMR built-in.

What's next?

- [Tutorial][tutorial]
- [Remix Book][book]

[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[runtimes]: ../book/01-runtimes
[inspect]: https://nodejs.org/en/docs/guides/debugging-getting-started/
[tutorial]: ./tutorial
[book]: ../book/00-introduction
[remixconfig]: ../file-conventions/remix-config
[templates]: https://remix.guide/templates
