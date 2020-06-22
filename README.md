# Sveltey Gas Addon Template

This is a project template for a google editor add-on (the kind with sidebars), written as a [Svelte](https://svelte.dev) app. Written by Adam Morris [email](mailto:classroomtechtools.ctt@gmail.com) [homepage](http://classroomtechtools.com/)

### Why

The author believes that this template has numerous advantages in writing editor add-ons over other solutions:

* Beginner friendly: In some ways learning sveltejs is closer to regular programming than web development with jQuery, Angular, Reactjs, or Vuejs.
* Rapid and immediate results
* Some advanced things like two-way bindings and css transitions are a cinch
* The software architecture allows for easy local development

## Quickstart

### Installation

```bash
npx degit classroomtechtools/svelty-gas-addon-template new-addon-name
cd new-addon-name
npm install
```

### Develop Locally

```bash
npm run dev
```

Open browser in displayed location. Edit files in `local`, which will automatically update. You can build svelte components by editing the files there.

Edit the files in `remote` which will be the server-side code.

### Two things special to this context: 

#### (1) `google.script.run`

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

#### (2) Manifest (appsscripts.json)

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

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit from `local`, save it, and watch as your page automatically reloads to see your changes.

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