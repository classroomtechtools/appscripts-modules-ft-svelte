# Google AppleScripts Modules ft Svelte
<<<<<<< HEAD
<img src="https://brainysmurf.github.io/appscripts_modules_ft_svelte.png" />

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A starter template for building Google AppsScripts [GAS] projects with modules. The technologies included are:
=======
<img src=“https://brainysmurf.github.io/appscripts_modules_ft_svelte.png” />
>>>>>>> unit_testing

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A starter template for building Google AppsScripts [GAS] projects with modular libraries. You can write self-contained modules, and use them in your app anywhere you need them. Since they’re modules, you can reuse them in other projects, publish them, share, and use in your other projects.

Also, you can build your front-end with Svelte as the front-end. (Which is exciting in and of itself … but the really amazing thing is the modular approach!)

## Author & License
Written by Adam Morris [email](mailto:classroomtechtools.ctt@gmail.com) [homepage](http://classroomtechtools.com/). Released as Open Source, MIT.

## Why?
What are modules, and why would we want to use them? This essay [On Modules](https://github.com/classroomtechtools/appscripts-modules-ft-svelte/blob/master/on_modules.md) discusses this. But the upshot is because they are self-contained, and you can reuse them.

AppsScripts needs this sort of stuff, really.

Also, you can test it locally!

## What is it?
This package started out by research into how to incorporate Svelte into an add-on or AppsScripts project. While looking at doing that, I realized that some of the underlying technology Svelte utilizes also could be used to enable modules in AppsScripts.

The technologies included in this starter kit are:

1. [Svelte](https://svelte.dev) for the front-end
2. [Rollupjs](http://rollupjs.org) to bundle internal modules — either internal ones or npm ones(!) — which become properties on `Import` variable
3. [Node](https://nodejs.org) for local development and npm module installation
4. [Ava](https://github.com/avajs/ava) for unit testing

## Quickstart: Frontend with Svelte (optional)
Get the default app running in your local browser:

```bash
npx degit classroomtechtools/appscripts-modules-ft-svelte new-project-name
cd new-project-name
npm install
npm run dev
```

Then point your browser to the displayed location. Then you’ll see the default application in your browser.

The entire frontend  lives inside of `./src/project/index.html` locally, and when deployed will be just `index.html` in your project. All of the required JavaScript and CSS is inlined into that file. That way, to deliver the app with AppsScripts, all we need to do is:

```js
const html = HtmlService.createHtmlOutputFromFile('index');
```

You can edit the Svelte app from the files located at `./src/svelte`. It’s build in exactly the same way as any normal Svelte app.

To see it in action line, deploy it:

```bash
npm run clasp:login
npm run clasp:create
rpm run deploy
npm run clasp:open
```

The `clasp:create` command ensures that clasp uses the `./project` folder as the source form which to push files to the AppsScripts project.

> The project provides these `clasp:xyz` commands for convenience, but it is still using `.clasp.json` and `.clasprc.json` as normal.

## Quickstart: Modules
From above, we see that the developer works inside of one directory, and the build process ensures that all of the frontend application code is bundled up into one file, the `index.html` file. The same sort of pattern applies with writing modules. Whereas with frontend development, the build process is automatic with changes immediately updating in the browser, there are some extra steps to take with modules. (But they’re worth it!)

Anything JavaScript code you write in `./src/modules` is primed to be bundled up into one big file and placed into `./src/project/Bundle.js`.  But you have to be explicit and tell the bundler what variables to export though, and for that we use the `export` statement.

```js
// ./src/modules/exmaple.js
const something = 'inside a module';
export {something};
```

When you’ve made a new file, or edited and existing one, kick off the build process with the command:

```bash
npm run bundle
```

That will run a few commands which will prepare all of the files into `./src/project/`, ready for production use.

From inside the `Bundle.js` file, the exported variables are placed on the `Import` variable as a namespace. You will then be able to access the exported objects, functions, or variables by using the `Import` variable:

```js
// ./src/scripts/Code.js
function MyFunction () {
    const module = Import.module;
    // or
    const {module} = Import;
}
```

Then, you can use that `something` variable from anywhere inside the following from `./src/scripts/`  like so:

```js
function MyFunction () {
    const {something} = Import;
    Logger.log(something);
}
```

### Directory Structure

The directory structure helps to understand how it works under the hood. The following represents the structure after Quickstart:

```
├── .clasp.json
├── README.md
├── build
├── examples
│   ├── default
│   └── helloworld
├── on_modules.md
├── package.json
├── project
│   ├── Bundle.js
│   ├── Code.js
│   ├── appsscript.json
│   └── index.html
├── rollup.config.js
└── src
    ├── modules
    ├── scripts
    ├── static
    └── svelte
```

directory | explanation
--- | ---
README.jd | documentation
examples | sample applications
on_modules.md | Further reading on modules
package.json | npm configuration
project | Target directory for build process, and the source used by clasp to push
src | The area where developer works

Knowing about the project directory contents is useful:
file | explanation
--- | ---
Bundle.js | Any modules written in `./src/modules/` ends up bundled up here
Code.js | Any `./src/appscripts` files end up here (with the name as appropriate)
appsscripts.json | The manifest; this is the source of truth
index.html | If building a front-end svelte application, this can be served with `HtmlService.createHtmlOutputFromFile`

The following directories may need some maintenance from the developer, as appropriate:

directory | explanation
--- | ---
.clasp.json | Created upon `npm run clasp:create`
.clasprc.json | (opt) if developer wants to check logs, run commands remotely

The following directories are used by internal build processes:

directory | explanation
--- | ---
build | target subdirectory for build process
rollup.config.js | Configuration for rollupjs

## ## Frontend Development with Svelte
### Four things special to this context:

#### (1) `google.script.run`
To use `google.script.run` both locally and after deployment as an appscript project, you can use the provided functionality from `./src/svelte/environment.js`. In a nutshell:

```js
import { setup } from './environment';
setup(window);
// or
setup(window, {
    serverSideFunction: () => {
        // do something (only run when in local)
    }
});
```

You can then use `google.script.run` in either local context or as normal for an appscript project. If you want more control on your local development, you can define server-side functionality by passing an object that is a mocked, as indicated above.

#### (2) Manifest (appsscripts.json)
The file in `./project/appsscripts.json` is the source of truth and will be overwritten in any subsequent deploy. If you need to change scopes, do it here (directly from inside this folder)

#### (3) Serving the front-end code

All client-side JavaScript code, CSS, and the HTML are all bundled up into `index.html` as inline. This means you can use `HtmlService.createHtmlOutputFromFile` to serve; no need to evaluate the source, so that other files can be included.

#### (4) External libraries
If you need to change the headers served at the index.html context (for example if you want to add an external library from a CDN), you’ll need to change them in two places:

* The file `static/header.ejs` (for local development)
* The file `project/index.html` (for deployment)

## Unit Testing
Write your tests inside `./tests/`, and execute with `npm run test`. Remember, you’ll have to ensure it’s bundled, so maybe use this instead:

```js
npm run bundle && npm run test
```

Test your bundled code by importing, but use the require syntax and relative path:

```js
const module = require('../scr/modules/module.js');
```

Consult Ava for instructions on how to use that framework.
