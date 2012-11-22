// a super hack way of inlining all imported libs
// into a single exported file
var code
  , all     = ""
  , output  = "bot.js"
  , lib     = "lib"
  , path    = require("path")
  , fs      = require("fs")
  , line, moduleCode, standAloneModule, k;

console.log ("[Building] " + lib);
fs.readdir(lib, function (e, list) {
  list.forEach(function (file) {
    code = fs.readFileSync(path.join(lib, file)).toString();

    // the main code
    if (file === "base.js") {
      all += "// AUTO-GENERATED from module: [ " + file + " ] \n";
      all += code;
    } else {
      console.log ("[reading module] " + file);
      // throw each module at the top, strip out the exports
      moduleCode = code.split("\n");
      standAloneModule = [];
      standAloneModule.push("// AUTO-GENERATED from module: [ " + file + " ]");
      for (k = 0; k < moduleCode.length ; ++k) {
        line = moduleCode[k];

        // ignore imports and exports
        if (!line.match(/module\.exports/) && !line.match(/require\(/)) {
          standAloneModule.push(line);
        }
      }
      code = standAloneModule.join("\n");
      all = code + all;
    }
  });
  if (fs.existsSync(output)) {
    console.log ( "[removing] " + output);
    fs.unlinkSync(output);
  }
  console.log ( "[writing] " + output);
  fs.writeFileSync(output, all);
});
