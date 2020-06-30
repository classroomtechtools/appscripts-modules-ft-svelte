# Google AppleScripts Modules ft Svelte

A starter template for building an Google Apps Scripts project (an editor add-on, web app, etc) using additional technologies:

1) [Svelte](https://svelte.dev) to build a front-end interface
2) [Node](https://nodejs.org), npm packages, and unit testing (coming soon) for local development and remote deployment
2) Modules, using `import` and `export` syntax for modular, reusable code, thanks to [Rollupjs](http://rollupjs.org) which handles the requisite code bundling automatically

[![Video](https://img.youtube.com/vi/9dBoLTsDnCw/0.jpg)](https://www.youtube.com/watch?v=9dBoLTsDnCw)

This means AppScripts developers can …

* Write front-end GUIs with a "reactive" technology (and be able to apply their learned knowledge outside of appscripts)
* Take advantage of npm's code sharing features (and get connected to that vast ecosystem)
* Learn modern practices (and reap the benefits)

## Motivation

This project began when I tried to see how to use Sveltejs as a frontend "framework" with AppsScripts. As I dug deeper, I realized that some of the underlying technology that Svelte used to work ([rollup](http://rollupjs.org)) would allow for the use of npm packages. This is the result.

As someone working in education, it is exciting to be able to use Google's GSuite infrastructure to help teachers and administrators complete their tasks. However, the platform by default does not include the above technologies.
 
## Author & License

Written by Adam Morris [email](mailto:classroomtechtools.ctt@gmail.com) [homepage](http://classroomtechtools.com/). Released as Open Source, MIT.


## Quickstart

### Installation and toolchain

```bash
npx degit classroomtechtools/appscripts-modules-ft-svelte new-addon-name
cd new-addon-name
npm install
npm run clasp:login
npm run clasp:create
```

You'll now be able to edit files, and use the following command to deploy to appscripts:

```bash
npm run deploy
```

That will execute the node script needed for the toolchain to build the appropriate files into `./project` and then uses `clasp push` to push the contents of that folder to the appscripts server.

Test as an add-on, by default a spreadsheet add-on.

## Development & The Toolchain

All of the code in `./src` ends up in `./project`, but bundled as appropriate. The idea is that the dev only writes stuff in `./src/` and server-side code is available as appropriate, while client-side code is bundled up into one file `./projects/index.html` (where the client-side javascript is inlined).

### Npm modules

To include an npm module, you just `npm install <name of package>`. It will then be available for import.

Due to limitations of the appscripts context, you cannot use `import` in just any file, you have to use it within a file in the `./src/bundles` parent directory. For server-side code (the most common), it must be from inside `./src/bundles/server`, and for the browser (less common, but possible) use `./src/buildles/client`.

From the `./src/bundles/server` location, you can write a file that imports the npm packages, and then exports objects or functions that you want to bring to the appscripts server execution environment.

For example:

```js
// ./src/bundles/server/bridge.js
import camelCase from 'lodash/camelCase';
export const lodash = {camelCase};
```

Then, from within a file in `./src/server/`, you can use those exported properites on the `Import` variable to get those named exports.

```js
// ./src/server/ServerSide.js
function myFunction () {
    const {lodash} = Import;  // Import variable bundles named exports
    return lodash.camelCase('turn string into camel case');
}
```

That's how to get npm modules. But wait there's more! 

### Organize your own modules within app

Make a folder inside `./src/bundles/server` call it `lib` and a file in there called `MyLibrary`:

```js
// ./src/bundles/server/lib/MyLibrary
import camelCase from 'lodash/camelCase';

export function MyFunction (value) {
    return camelCase(value)
}
```

And then, from within `./src/server/ServerSide.js`, you can do:

```js
// ./src/server/ServerSide.js
function myFunction () {
    const {MyFunction} = Import;
    return MyFunction('turn this into camel case');
}
```

## Svelte

### Develop Frontend with Svelte

```bash
npm run dev
```

Open browser in displayed location. Edit files in `./src/svelte`; upon save the browswer will be refreshed. You can build svelte components by editing the files there.

For server-side functionality (resulting from `google.script.run` commands), edit the files in `./src/sever/` which will be the server-side code.

#### Two things special to this context: 

##### (1) `google.script.run`

To use `google.script.run` both locally and after deployment as an appscript project, follow the code examples given in `local/Component.svelte`. In a nutshell:

```js
import { production, runner } from './environment';
if (!production) {
    window.google = {
        {
            script: {
                run: runner({})
            }
    }
}
```

You can then use `google.script.run` in either local context or as normal an an appscript project.

##### (2) Manifest (appsscripts.json)

The file in `remote/appsscripts.json` is the source of truth and will be overwritten in any subsequent deploy.

### Define headers inside of root index.html file

If you need to change the headers served at the index.html context (for example if you want to add something from a CDN), you'll need to change them in two places:

* The file `staging/header.ejs` (for local development)
* The file `public/index.html` (for deployment)

### Deploy as an appscripts project

First, do this:

```bash
npm run clasp:login
npm run clasp:create
```

After that, just:

```bash
npm run deploy
```


## Less Quick of a Start

### Installation

First, let's ensure `degit` is installed:

```bash
which degit  # if not installed, outputs nothing
```

If not installed, then:

```bash
npm install -g degit  # if not already installed
```

After that, all you need to do is:

```bash
npx degit classroomtechtools/svelty-gas-addon-template new-addon-name
cd new-addon-name
npm install
```

You will now have a copy (not a clone) of the git repo, which you can modify to your heart's content.

Install the dependencies...

```bash
cd new-addon-name
npm install
```

...then start the local webserver [Rollup](https://rollupjs.org) which we'll use for rapid development:

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit from `./src/svelte`, save it, and watch as your page automatically reloads to see your changes.

Server-side functions can be declared in `remote`, and you can define your manifest there too.

### Develop

You develop the app as you would any Svelte project, with the following differences given our context:

### Local development

#### Use `environment.js` for wiring up `google.script.run` locally

The environment variable `google` is not available in a local environment as it is on the server, but it's pretty easy to get a simple working version of it.

First, from within a component, you import:

```js
import {production, runner} from './environment.js';
```

Then you can use the following boilerplate code:

```js
if (!production) {
    window.google = {
        script: {
            run: runner({ /* optionally define mock server-side functions */})
        }
    }
}
```

This will allow you to then use `google.script.app` in your code, and it'll work locally.

```js
<script>
    const success = () => { console.log('handled!'); };
</script>

google.script.run
    .withSuccessHandler(success)
    .exampleServerSideFunction();
```

### Remote development

You can define your server-side functions by changing (or adding files) to `remote`. Note that, as normal, the programmer has to ensure that the names (for example `exampleServerSideFunction`) called match those available on the server.


### Deployment

We'll use clasp to keep our project up-to-date. The `clasp` project is changing constantly, be sure to have the latest version.

```bash
clasp -v  # 2.3.0
```

When you're ready to deploy, first make sure clasp has your credentials by running these commands from `npm run` context:

```bash
npm run clasp:login
```

*Note: This is the same as `clasp login`*

You'll only have to do that once (but then have to re-login after the login expired).

Create a project:

```bash
npm run clasp:create
```

*Note: This is the same as `clasp create --rootDir ./postprocess`. However, by running with `npm run` guarantees it'll run correctly.*

Once the above is done, just do this:

```bash
npm run deploy
```

Check out the result!

```bash
npm run clasp:open
```

Test as an addon, and you have an easy way to build an addon!

## TODO

* More details about how why svelte, how to use svelte
* Minification
