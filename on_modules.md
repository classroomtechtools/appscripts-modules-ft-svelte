# On Modules, in Google AppsScripts
A discussion about modules, a concept embedded in the JavaScript ecosystem and where Google AppsScripts [GAS] fits in. Specifically, we’ll be working towards figuring out a way to bring es modules to AppsScripts, with a view to being able to include libraries such as those from npm.

By the end of the article, for the AppsScripts platform specifically, we’ll learn …

* … how modules work in general, and why
* … about the evolution of modules in JavaScript
* … how to write our own modules
* … how to import npm modules such as lodash
* … why certain design decisions were made for the parent repo

## Where are we?
The [new V8 engine](https://developers.google.com/apps-script/guides/v8-runtime) is a welcome addition to the GAS stack. It entices developers anew and veterans alike to use modern syntax and programming concepts to implement solutions with GSuite. Bravo!

Meanwhile, the non-GAS JavaScript community (Node and browsers) are steadily also making headway in some important ways, and there’s still a disparity between these ecosystems. In particular, they have a module system, whereas GAS does not.

We shall explore the current disparity, but in the end we’ll see a way forward.

### Hold up

We need to come to a common understanding of modules before proceeding. What the heck is a module? For our purposes:

> A module is self-contained, reusable piece of code that declares its dependencies, and provides functionality. 

For this article, let’s wrap the following JavaScript code into a module, so we have some sort of concrete thing in our head to work with:

```js
const [prefix, suffix] = [‘https://’, ‘.com’];
function normalize (value) {
    return prefix + value.toUpperCase() + suffix;
}
```

The first line of code defines the `prefix` and `suffix` variables as strings with values. The function uses those values to return the value passed to it in all-caps.

Two concepts in the code above, if you’re not familiar can be researched independently. The first is _destructuring_, and the second is _closure_. Both are important to understand when it comes to modular programming in JavaScript. Both of them are routinely used and many tutorials on programming concepts assume the programmer is fluent in them.

(I don’t assume fluency, but I assume you can become so.)

## Our first module
We’re going to try and make a module based on that piece of code. How do we do it? Let’s use a function:

```js
const module = function () {
    const [prefix, suffix] = [‘https://’, ‘.com’];
    function normalize (value) {
        return prefix + value.toUpperCase() + suffix;
    }
    return normalize;
};
```

Think about it, this meets our working definition of a module. It declares that its functionality depends on having a `prefix` and `suffix` ready. It also declares that it provides the ability to “normalize” a value. Let’s use it:

```js
const functionality = module();
const result = functionality(‘example’);
result === ‘https://EXAMPLE.com’;  // true
```

And if you think about it, the first line `functionality = module()` is like “importing” the function `normalize`, for your own use. In this case, the variable `functionality` points to the same function block as `normalize`. And the module itself returning `normalize` is like exporting a piece of code.

We’ll generalize the above pattern later, but first we need to take a pause, climb 3,000 meters up, and tackle his “module” declaration in a GAS context.

### Our module and the global scope

We need to talk about using multiple files and the AppScripts context in order to have a thorough discussion of this module concept. Let’s suppose we have two files `main.gs` and `utilities.gs`, where the first one is where we run the function `MyFunction` from:

```js
// main.gs
const globalScope = module();  // “global scope”
function MyFunction () {
    const endpointScope = module();  // “endpoint scope”
}

// utilities.gs
const module = function () {
    ...  // global or local? determined by where it is called
}
```

Given the names and comments I decided to use, I’m hopefully making it clear that we do need to understand that there is something important about understanding the global scope. While there is nothing different about the runtime environment or the expected syntax, in GAS there is a snag which we need to have keen awareness of, and which does not apply in other JavaScript contexts.

In GAS, variables that are declared _in the global scope_ in any file, for example in `main.gs` _may or may not be_ available in other files, for example `utilities.gs`. For this reason, it is a mistake to try and use `module()` in the global scope in `main.gs`. It might work, but it might not. It’s not guaranteed, and in programming let’s work with things we can depend on.

> Sidebar: You can check out [what Google says about the parsing process](https://github.com/classroomtechtools/appscripts-modules-ft-svelte/blob/master/on_modules.md) on your own for more information on this, but for our purposes let’s assume that if it might not work sometimes, let’s assume it doesn’t ever work. It's worth noting that the parsing process was — quite sensibly — meant to simulate the behaviour in browsers in how it parses `<script>` tags, rather executing individuals files as on node.

Despite the caveat about implementation details above, what is guaranteed, however, is that _we can depend on_ variables such as `module` being available in the _endpoint scope_. 

The way I visualize what happens when you click on play on a function in the online editor, for example, is that all the code in all files which are in the global scope level gets concatenated into one invisible file in some sort of preflight operation, and executed as a single file first. Only after that is the endpoint scope (the function you chose to have executed) invoked and executed.

The implication though, that affects our understanding of using modules, is that when you want to _use them in GAS_, you have to bring them in at the _endpoint scope_, and not the top-level global scope.

### Back to life … back to modularity

So let’s get on with our understanding of module-building and try to generalize the pattern. We’ll also be discussing different standards that have arisen that have made module-building has evolved (and gotten better) over time.

The first module standard that appeared has a name that is a mouth-full: Immediately-Invoked Function Expression. It’s abbreviated to “IIFE” for short, and for me, I pronounce it as “iffy.”

It is the same concept as before, just a bit fancier, and it has effects which make it more reliable for module-usage. We use the module in the endpoint context for reasons which are clear above, while the IIFE is defined in `utilities.gs` in the global scope:

```js
// main.gs
function MyFunction () {
    const functionality = module();
}

// utilities.gs
const module = (function () {
    const [prefix, suffix] = [‘https://‘, ‘.com’];
    function normalize () {
        return prefix + value.toUpperCase() + suffix;
    }
    return normalize;
})();
```

The above fanciness does much the same as above. Both of them wraps a module body inside of a function. But what that fanciness brings to the table is that the module doesn’t “pollute” the global scope (as it doesn’t have a name), and is guaranteed to executed in the global context, giving us a chance to prepare to make the module ready for usage later. 

To understand why this IIFE is a better idea, let’s climb to 3,000 meters again and think about early web development with JavaScript. As developers wrote more JavaScript, they needed to ensure that variable names didn’t collide when being used in the global scope. One developer might write a JavaScript file that does a bunch of stuff in one file, while another developer writes another file that shares the same name. For example, maybe:

```js
// developer A
function handleEvent () {
    ...
}

// developer B
function handleEvent () {
    // uh oh
}
```

In a browser context, what happens here is that there is no syntax error, and handleEvent is defined as the second function, and developer A has lost his function. This is problematic. It’s worth bearing in mind that while this example only has developer A and B writing a function, as the web grew there was need to write more JavaScript, and thus use more variables in the global scope to do stuff. Yikes!

So instead they started using IIFEs to disambiguate things:

```js
(function () {
    function handleEvent () {
    }
    // do stuff
})();

(function () {
    function handleEvent () {
    }
    // do stuff
})();
```

This is a vast improvement on the situation, as now both modules will have their pieces hidden from view inside the respective functions. When they do stuff they won’t interfere with each other.

Let us now introduce “bundling.” This is where software that orchestrates code, takes the code and wraps (or modifies) the code before executing it, to give it some advantage when it runs in the target environment. 

The browsers could take the code written by developers, which weren’t in these IIFEs, and guarantee it was self-contained by wrapping it in a IIFE. The pattern was easy to replicate, just take the code provided by developer, and add a suffix and prefix. We can imagine that the browsers used a module that had a bundler function, and just applied that on all the JavaScript files it downloaded before executing:

```js
(function () {
    const [prefix, suffix] = [‘(function () {‘, ‘})();’];
    function makeBundle(code) {
        return prefix + code + suffix;
    }
    return makeBundle;
});
```

Boom, instant modularity for `code`.

Except, this still less than ideal. What if a module needed to use another module? The only way to do that would be to share variables between modules, but then that would be an anti-pattern.

We could define one global variable and add to that, instead. Not ideal, but better to have some convention rather than a free-for-all. Consider the following code, which illustrates how we can visualize an even better module system, using one global variable and IIFEs.

```js
var modules = {};
modules.devA = (function () {
    function doSomething () {}
    return doSomething;
})();

modules.devB = (function () {
    function doSomething () {}
    return doSomething;
})();
```

This illustrates a concept known as “namespacing.” We are using the container `modules` and putting names on it, such as `devA` and `devB`. If we could all just get a way to “enforce” the use of `modules` everywhere.

This is kinda like what node.js does, at least in illustrative terms:

```js
var modules = {moduleA: {}, moduleB: {}};

// developer A
(function (exports) {
    function doSomething () {};
    exports.doSomething = doSomething;
})(modules.moduleA);

// developer B
(function (exports) {
    var module = exports.moduleA;  // depends on modA
    module.doSomething();
})(modules.moduleB);
```

The above is for visualization only; in fact node is much more sophisticated than even that, but that’s the general idea. Node doesn’t actually make a `modules` global at all, but it’s sorta like that. The main thing is that we are able to discern about the pattern above is something powerful about modules, is that it provides a mechanism for one module to use the other modules.

If you are the browser or node, and you see a file from a developer and inspect the top of the file and see something like `var devA = exports.devA` you could ensure that developer A’s code is downloaded and ready for developer B for when it executes. There’s a pattern developing which will allow for modules to declare their dependencies, and for a some piece of to orchestrate it all. In other words, a package manager, like Node Package Manager (NPM).

Thus, we have the concepts we need to understand the latest incarnation, es modules.

## ES Modules, FTW
All that fanciness is great, but let’s make things even more explicit and clear. What if we changed the language itself so we could just do this:

```js
import {normalize} from ‘moduleA’;

function doSomething (value) {
    return normalize(value);
}

export {turnDomainIntoHttpAddress};
```

Using `import` and `export` in this kind of pattern, which the latest JavaScript syntax accepts as normal. You can define modules, and then use them elsewhere, declaring your dependencies, and exporting functionality, all while not polluting the global scope. It’s orchestrated all for you.

First of all, the `import {normalize} from ‘moduleA’;` syntax is the same as destructuring. It’s saying “give me the variable called `normalize` which is exported by `moduleA`. It’s sort of like assuming `normalize` is a property on the module. If there were other things exported by the module, we would be ignoring it. In that way, we’re declaring only the things we need.

Another syntax variant to know about, is that you can rename variables, even if you do have to use the `{}` syntax, using the `as` keyword:

```js
import {doSomething as anotherName} from ‘devA’;
```

Both syntax variants does assume that developer importing knows the sequence of characters exactly cooresponding to  what names are actually exported, which is a fair assumption to make. But, there is a way to export something that doesn’t have a name that must be used, and the syntax uses `default` keyword:

```js
// utilties.gs
export default function doSomething () {
    ...
}
```

and the way to import it is to not use the `{}` syntax:

```js
import anyName from ‘moduleA’;  // no {}
```

> These variants are important to keep in mind because importing them incorrectly can lead to frustrating runtime errors.  

Welp, this stuff is great! ES modules seems to be really clever. Is solves modularity! How come I haven’t seen this syntax in AppScripts. Because wow! There’s not another shoe to drop, is there?

## AppsScripts doesn’t support ES Modules (womp womp)
All that effort to understand modules, and it turns out the coolest part isn’t available in our target platform. 

However, let’s see if we can’t use these concepts to see how we could possibly bring es modules to GAS. First and foremost, however, is that there is no way we can get the `import` and `export` keywords to work in the runtime. Only Google and its implementation it offers can do that.

But remember the bundling technology referred to above? A bundler is software that takes some code and wraps it so that it is modular. What if we littered `import` statements in a different JavaScript context like Node which would know how to execute those import statement, and trained our bundlers to instead reverse the process? Turne those imports into IIFEs. So we could write them locally and then deploy to AppsScripts in a way it can execute.

Turns out, there is a whole industry of software doing exactly that! Hmmm....

### A Detour: Reactive Frameworks

Modularity wasn’t the only march of progress that JavaScript was making as the language specification developed. It was also making headway on the client, too. To implement a graphical user interface from a website, you’d used to have to use the DOM and other technologies native to HTMLCSSBrowser APIs to get it working.

Frameworks started appearing that made this simpler, jQuery being one of them. This was a module that allowed developers to work with the DOM in a more convenient manner. A downside, though, is that a lot more code was being executed from inside the browser, although modern CPUs and memory management techniques has not made this a show-stopper.

The advancement that JavaScript frameworks made, moreover, was an abstraction from the underlying HTMLCSSBrowser technologies. Instead of doing operations directly on the DOM, these frameworks created a _virtual DOM_ which would redirect developers to targeting it for manipulations instead. The framework then knew how to sync these operations to the real DOM, giving a performance benefit, and making it easier for the developer to make an interactive website.

While GAS has now gotten a modern JavaScript flavor, it is possible to incorporate these reactive frameworks into the stack. What makes it interesting is that these technologies also incorporate a bundler.

## Let’s use bundlers to give AppScripts full modules!
This is where the article lands. We have the theory in place, now let’s look at some of the details that would be involved with having a module bundled and deployed on an AppScripts environment.

Let’s write our normalize function as an es module. We’ll make it more useful than the original, though, by accepting optional parameters as the second argument:

```js
// utilities.gs
export function normalize (value, {
    prefix=“”,
    suffix=“”,
  transformation=String.prototype.toUpperCase
}) {
    return prefix + transformation.call(value) + suffix;
}
```

Question is, how do we use it?

> If you have additional questions, like “What the heck is going on there?” … all you need to know is that it provides much greater functionality by defining default values to variables `prefix`, `suffix`, and `transformation`. Since transformation is defined with default value of `String.prototype.toUpperCase` (note: no parentheses there) and invoked with `.call`, it is the equivalent of `value.toUpperCase()` (with parentheses).  

Well the normal way to use it would be to do this at the top of the file:

```js
import { normalize } from ‘./utilties’;
```

and then invoke it like in these two examples:

```js
normalize(‘example’);  // ‘EXAMPLE’
// or
normalize(‘EXAMPLE’, {
  suffix=“!”
  transformation=String.prototype.toLowerCase
});  // example!
```

But this won’t work on AppsScripts as the `import` keyword is not defined. But what if we could convert that import statement to something like so:

```js
// main.gs
const normalize = (function () {
  ...  // copy of utilities, here
})();

function MyFunction () {
  // normalize is available here, or any other endpoint scope
    Logger.log(normalize(‘example’));
}
```

We would be able to use it if a bundler could do that work for us. It’s just that that we couldn’t put it at the top of the file, for reasons already given: For GAS, we’d have to do our “imports” from within one of the endpoint scopes.

The other issue with the above is that it pollutes the global scope, which is an anti-pattern. So what’s a programmer to do?

> The above discussion illustrates one of the key differences between AppsScripts and Node and other JavaScript environments. In our environment, every file in the project is parsed, and the global scope is executed before the main body is executed. But on other platforms, one specific target is given to start things off, which allows the import process to proceed smoothly. In other words, the extensive preflight involved with GAS makes a big difference, and this difference is perhaps why es modules aren’t supported!  

## Let’s get creative
I figured out a way, but presenting it without the essay above would be quite esoteric. In any case. Presented here is how we can incorporate es modules to AppsScripts:

On our local environment with node, let’s define a directory whereby all JavsScript files there will be written as es modules. Our bundler can then convert all those files into a single file, wrapped as a module. For example:

```js
// modules/moduleA.js
export function incrementor(value) { return value + 1; }

// modules/mobuldeB.js
export function decrementor() { return value - 1; }
```

Our bundler produces the file:

```js
(function (exports) {
    exports.incrementor = function (value) { return value + 1; }
    exports.decrementor= function (value) { return value - 1; }
})( /* what do we pass in here? */ );
```

In this way, we just have to pass something into the IIFE so that endpoint scopes have access to it. It appears that we have no choice but to use a global variable somehow as a namespace. Let’s call it `Modules` with a capital M.

```js
const Modules = {};
(function () {
    export.incrementor = ...
    export.decrementor = ...
})( Modules );
```

So now we can use it:

```js
function MyFunction () {
    const incrementor = Modules.incrementor;
    const result = incrementor(1);  // 2
}
```

If we change the name of `Modules` to `Import`, we can make it look more like an actual quote-unquote "import statement":

```js
function MyFunction () {
    const { incrementor } = Import;
    const result = incrementor(1);  // 2
}
```

This makes me chuckle a little. Maybe too cute by half. In any case, this is a doable solution.

## NPM Modules? We can do this!
What I haven’t mentioned yet, is that since we are able to support es modules, we are able to start importing from the vast npm ecosystem into our AppsScripts projects. Let’s use the lodash library as an example library to bring in, as it is quite popular and also quite useful.

Since we’re using a bundler which understands the `import` and `export` statement, we need to write it within our directory context so our bundler can convert it into a single file. 

```js
// first do npm lodash install
import { lodash } from ‘lodash’;
export { lodash };
```

This is a funny way to do it, but it works! The bundler can read in the lodash library, the entire library in fact, and put it all into a file 17,000 lines of code long! Then we can use it:

```js
function MyFunction () {
    const { lodash } = Import;
  const json = {};
    lodash.set(json, ‘path.to.value’, 100);
  Logger.log(json);  // {path: {to: {value: 100} } }
}
```

Such as useful thing, to be able to use that `.set` function to set values like that! So glad it’s so easy. Except … we don’t want to bring in 17,000 lines of code just to use one function.

Fortunately, bundlers also know how to bring in only the code that is needed for the application. It knows how to do this really well, too, since on the web there are performance and monetary implications to having to download heaps of lines of code that aren’t ever used.

The only issue we have to keep in mind is that the bundler will only see the file inside the `modules` folder, which means we have to explicitly export only the routines we need for our application. 

```js
import { set } from ‘lodash/lodash’;
export { set };
```
 
Now the bundler goes through its algorithm known as tree-shaking that removes unnecessary code from the lodash library that is never used. The result is just under 1000 lines of code! Waaaay better. And look how useful that `set` method is!

## A repo that implements es modules (and also Svelte)
This essay was written because when I made [AppsScripts Modules ft Svelte](https://github.com/classroomtechtools/appscripts-modules-ft-svelte), I realized I needed to explain the background to some of the design decisions. Please refer to that repo for more details about how to use it.
