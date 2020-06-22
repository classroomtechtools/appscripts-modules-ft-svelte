*Looking for a shareable component template? Go here --> [sveltejs/component-template](https://github.com/sveltejs/component-template)*

---

# Sveltey Gas Addon Template

This is a project template for a google editor add-on (the kind with sidebars), written from as a [Svelte](https://svelte.dev) app. Written by Adam Morris [email](mailto:classroomtechtools.ctt@gmail.com) [homepage](http://classroomtechtools.com/)

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

### Why

The author believes that [Svelte](https://svelte.dev) is the best environment for google editor add-on development for the following reasons:

* A beginner can learn to use it
* Adds features such as transitions that are a cinch to do now
* Rapid and immediate results
* It's a Modern javascript framwork with room to grow
* The software architecture allows for easy local development


## Get started

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

## Develop

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


## Prepare your addon for Deployment

When you're ready to deploy, first make sure clasp has your credentials by running these commands from `npm run` context:

```bash
npm run clasp:login
```

*Note: By logging in this way, you ensure that when you deploy with the provided command below, that it'll work correctly*

You'll only have to do that once (but then have to re-login after the login expired).

Create a project:

```bash
npm run clasp:create
```

## Deploy!

```bash
npm run deploy
```

Check out the result!

```bash
npm run clasp:open
```

Test as an addon, and you have an easy way to build an addon!

## TODO

* More details about how why svelte 
* Minification