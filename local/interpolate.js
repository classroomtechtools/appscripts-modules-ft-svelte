
const interpolate = (baseString, params) => {
  /**
   * Like js template literal, replace '${here}' with {here: 'there'}  // "there"
   * Usage: interpolate("${greet}, ${noun}", {greet: 'hello', noun: 'world'})  // "Hello, World"
   * @param {String} baseString - A string with ${x} placeholders
   * @param {Object} params - key/value for substitution
   * @return {String}
   */
   const names = Object.keys(params);
    const vals = Object.values(params);
    try {
      return new Function(...names, `return \`${baseString}\`;`)(...vals);
    } catch (e) {
      throw new Error(`insufficient parameters. Has ${Object.keys(params)} but ${e.message}`);
    }
}

export default interpolate;
