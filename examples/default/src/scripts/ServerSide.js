/*
You can place any google.script.run entry points here
*/
function exampleServerSideFunction (value) {
    const {startCase, camelCase} = Import.lodash;
    return startCase(camelCase(value));
}

function testServerSideFunction() {
  return exampleServerSideFunction('tolower case my friend');
}

function UseMyFunction () {
    const {MyFunction} = Import;
    MyFunction();
}

function UseDottie () {
    const { dottie } = Import;

    const jsons = [{
        'path.to.value': 100
    }, {
        'path.to.value': 400
    }];
    return dottie.jsonsToRows({jsons});
}
