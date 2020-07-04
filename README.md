# Google AppleScripts Modules ft Svelte
A starter template for building Google AppsScripts [GAS] projects with modules. The technologies included are:

1. [Svelte](https://svelte.dev) for the front-end
2. AppScripts scripts for the backend, as per the normal runtime, but with additional `Import` global variable
3. [Rollupjs](http://rollupjs.org) to bundle internal modules — either internal ones or npm ones(!) — which become properties on `Import` variable
4. [Node](https://nodejs.org) for local development and npm module installation
5. [Clasp](https://github.com/google/clasp) for deployment

This means AppScripts developers can …

* Write front-end GUIs with a "reactive" technology
* Write AppScripts server-side scripts as normal, with additional ability to import modules, either internal ones to the project, or external ones such as published by npm
* Test locally
* Connect with other JavaScript ecosystems

## Quickstart
Get the default app running in your local browser:

```bash
npx degit classroomtechtools/appscripts-modules-ft-svelte new-project-name
cd new-project-name
npm install
npm run dev
```

Then point your browser to the displayed location.

To deploy:

```bash
npm run clasp:login
npm run clasp:create
rpm run deploy
npm run clasp:open
```

The `clasp:create` command ensures that clasp uses the `./project` folder to push files to the new project.

The `deploy` command builds the project for deployment, and then issues the `clasp deploy` command.

> The project provides these `clasp:xyz` commands for convenience, but it is still using `.clasp.json` and `.clasprc.json` as normal.

## Why
Modules don’t exist in the AppsScripts platform, but they should!

1. This essay [On Modules](https://github.com/classroomtechtools/appscripts-modules-ft-svelte/blob/master/on_modules.md) discusses the why and how behind modules. By the end, hopefully you'll have an understanding of some of the design decisions made for this repo.

This project began when I tried to see how to use Sveltejs as a frontend "framework" with AppsScripts. As I dug deeper, I realized that some of the underlying technology that Svelte used to work ([rollup](http://rollupjs.org)) would allow for the use of npm packages. This is the result.

## Author & License
Written by Adam Morris [email](mailto:classroomtechtools.ctt@gmail.com) [homepage](http://classroomtechtools.com/). Released as Open Source, MIT.

## Development
This starter kit gives you context in which to change the files within `src`, which allows you to see changes immediately in the browser. You can also deploy easily to your AppsScripts project.

For example, you can switch out the contents in order to enable different applications:

```bash
# from inside new-project-name directory
rm -r src
cp -r examples/helloworld/src src
npm run dev
```

You can restore the default application with the following:

```bash
# from inside new-project-name directory
rm -r src
cp -r examples/defaultapp/src src
npm run dev
```

Or alternatively, use symlinks:

```bash
# from inside new-project-name directory
rm -r src  # one time
ln -hfs examples/helloworld/src src  # thereafter
```

The latter hint enables the use of one directory for the deployment, with other directories as the local environment. 

### Directory Structure
The directory structure helps to understand how it works under the hood. The following represents the structure after Quickstart:

```
├── .clasp.json
├── README.md
├── build  
├── examples
│   ├── default
│   └── helloworld
├── on_modules.md
├── package.json
├── project
│   ├── Bundle.js
│   ├── Code.js
│   ├── appsscript.json
│   └── index.html
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

## Writing Modules
The `./src/modules` directory is where regular es modules can be written, with `import` and `export` statement. Anything exported by a module at that directory path, will be available as a property on the `Import` global variable from a regular AppsScripts file.

Regular AppsScripts files are written in `./src/appscripts` directory. The `Import` global variable can only be used meaningfully from within a function declaration, such as an endpoint:

```js
// ./src/modules/module.js
const str = 'hello';
export {str}

// ./src/appscripts/Code.js
function MyFunction () {
	const {str} = Import;
	Logger.log(str);  // 'hello'
}
```

## Writing the Frontend with Svelte
### Develop Frontend with Svelte

```bash
npm run dev
```

Open browser in displayed location. Edit files in `./src/svelte`; upon save the browser will be refreshed. You can build svelte components by editing the files there.

For server-side functionality (resulting from `google.script.run` commands), edit the files in `./src/appscripts/` as normally you would for a project. 

#### Four things special to this context:

##### (1) `google.script.run`
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

##### (2) Manifest (appsscripts.json)
The file in `./project/appsscripts.json` is the source of truth and will be overwritten in any subsequent deploy. If you need to change scopes, do it here (directly from inside this folder)

##### (3) Serving the front-end code

All client-side JavaScript code, CSS, and the HTML are all bundled up into `index.html` as inline. This means you can use `HtmlService.createHtmlOutputFromFile` to serve; no need to evaluate the source, so that other files can be included.

##### (4) External libraries
If you need to change the headers served at the index.html context (for example if you want to add an external library from a CDN), you'll need to change them in two places:

* The file `static/header.ejs` (for local development)
* The file `project/index.html` (for deployment)

### Deployment
First, do this:

```bash
npm run clasp:login
npm run clasp:create
```

The `clasp:create` command is just a regular `clasp create` command with —root-dir passed as `./project`. If you already have a `.clasp.json` file you want to use (and is located in the parent directory), you can alternatively edit your `.clasp.json` file so that the json contains `"rootDir":"./project”`. Subsequent deploy commands will use that as the root directory (source) to push files.

After that, just:

```bash
npm run deploy
```

That will run the necessary build sequence, and then will push to the project.

## TODO
* More details about how why svelte, how to use svelte
* Minification
