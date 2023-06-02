const packageJSON = require("./package.json");

const ignorePackages = ["react-charts"];

const configs = [
  {
    action: "remove",
    keys: ["devDependencies", "dependencies"],
  },
  {
    action: "add",
    keys: ["devDependencies"],
    save: "--dev",
  },
  {
    action: "add",
    keys: ["dependencies"],
  },
];

function mapper(config) {
  const packageNames = [];
  for (let key of config.keys)
    if (packageJSON[key])
      for (let packageName of Object.keys(packageJSON[key]))
        if (!ignorePackages.includes(packageName))
          packageNames.push(packageName);
  if (packageNames.length) {
    if (config.save) packageNames.push(config.save);
    return `yarn ${config.action} ${packageNames.join(" ")}`;
  }
}

const commands = configs
  .map(mapper)
  .filter(Boolean)
  .join(" && ");

console.log(`\n${commands}\n`);
