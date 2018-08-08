const EventEmitter = require("events").EventEmitter;
const globby = require("globby");
const fs = require("fs");
const path = require("path");
class Loader extends EventEmitter {
  /**
   *Creates an instance of Loader.
   * @param {*} path
   * @param {*} condb
   * @memberof Loader
   */
  constructor(options) {
    super();
    this.options = options;
    this.loadModel();
  }
  loadModel() {
    let schema_paths = this.parse(this.options.path);
    for (let item of schema_paths) {
      let model_name = item.properties.join("_");
      this.options.condb.model(model_name, item.exports, model_name);
    }
  }

  parse(directory, match) {
    let files = match || ["**/*.js"];
    const paths = globby.sync(files, {
      cwd: directory
    });
    let items = [];
    for (let file of paths) {
      let obj = this.loadFile(path.resolve(directory, file));
      let properties = this.getExports(file);
      items.push({
        pathName: path.resolve(directory, file),
        properties: properties,
        exports: obj
      });
    }
    return items;
  }
  getExports(filepath) {
    let arr = filepath.substring(0, filepath.lastIndexOf(".")).split("/");
    return arr;
  }
  loadFile(filepath) {
    try {
      const obj = require(filepath);
      if (!obj) return obj;
      if (obj.__esModule) return "default" in obj ? obj.default : obj;
      return obj;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Loader;
