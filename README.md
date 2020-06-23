# Sidebar Add-on Builder, with AppsScripts & Svelte

This project allows other developers to build a [Google Editor Add-on](https://developers.google.com/gsuite/add-ons/editors/) with a modern "reactive" technology: [Svelte](https://svelte.dev).

## Intro

AppsScript's Editor Add-ons (which we'll call "Sidebar Add-ons" here) are a way for developers to make custom sidebars which accompanies the user's Google Docs, Spreadsheets, Forms, and Slides experience.

There are a variety of options to the developer to help with building the front-end user interface, among them jQuery, Reactjs, and Vuejs. The latter two are full-featured development environments that can build full-scale web applications, and in turn, a more practically-oriented Sidebar Add-on. In particular, these reactive technologies have tools and features that helps make web applications built with it respond automatically to user interfactions (i.e. they are "reactive").

Svelte also has those capabilities too, but its implementation has an approach which gives it some compelling advantages particularly suited for **reusing and sharing code** used to make a Google Editor add-on:

* The code is highly organized in reusable components
* Each component's CSS and business logic is kept all in one file
* These components can talk to each other in a simple, straight-forward way that does not require learning difficult techniques
* Those components can published, shared, and reused easily

There are additional advantages having to do with **ease in making them**:

* You don't need to know too much about the DOM or Browser APIs
* You don't need to learn or implement complicated CSS rules
* It is closer to programming like an AppsScripts project
* Svelte itself has an online REPL which gives a [full tutorial](https://svelte.dev/repl/hello-world?version=3) of its features

One more final point:

* It scales "up", i.e. …
* If you can make a sidebar add-on with this tech, you can apply that directly to building a full-scale web application
 
## Author & License

Written by Adam Morris [email](mailto:classroomtechtools.ctt@gmail.com) [homepage](http://classroomtechtools.com/). Released as Open Source, MIT.


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