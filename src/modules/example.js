/*
  Here, you import, and then export libraries (from npm for example)
  Or you can build modules inside folders in this subdirectory, and then import/export them here as needed.

  All .js files in the subdirectory are bundled together and put into Bundle file in appscripts
  and then available for import
 */

// example from lodash: (requires npm install lodash)
/*
import startCase from 'lodash/startCase';
import camelCase from 'lodash/camelCase';
*/

// example of internal module:
/*
import { MyFunction } from './lib/MyLibrary.js';
*/

// then you export them by name, like this:
/*
export {MyFunction, dottie, lodash};
*/

/*
  In that way, in the scripts directory, any function running in an endpoint scope can import it
  Like this:
  const {MyFunction} = Import;
  (same as)
  const MyFunction = Import.MyFunction;
*/
