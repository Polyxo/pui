import { readFileSync, writeFileSync } from "fs";

let json = JSON.parse(readFileSync("./figmaTokenStudio/tokens.json", "utf8"));

export function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

export function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

function removeUnusedKeys(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  // List of keys to remove
  const keysToRemove = [
    "textDecoration",
    "textCase",
    "paragraphSpacing",
    "paragraphIndent",
  ];

  // If the object has any of the keys to be removed, delete them
  for (const key of keysToRemove) {
    if (key in obj) {
      delete obj[key];
    }
  }

  // Iterate over the object's keys and apply the function recursively
  for (let key in obj) {
    obj[key] = removeUnusedKeys(obj[key]);
  }

  return obj;
}

if (!String.prototype.endsWith) {
  Object.defineProperty(String.prototype, "endsWith", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (searchString, position) {
      position = position || this.length;
      position = position - searchString.length;
      var lastIndex = this.lastIndexOf(searchString);
      return lastIndex !== -1 && lastIndex === position;
    },
  });
}

function addCategoryToLeaves(obj, category) {
  let newObj = Array.isArray(obj) ? [] : {};

  Object.keys(obj).forEach((key) => {
    if (key === "value") {
      newObj["category"] = category;
    }
    if (typeof obj[key] === "object" && obj[key] !== null) {
      newObj[key] = addCategoryToLeaves(obj[key], category);
    } else {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}

// TODO: Cleanup duplicate names in tokens
json = mergeDeep(
  mergeDeep(
    addCategoryToLeaves(json.Global, "global"),
    addCategoryToLeaves(json.System, "system")
  ),
  addCategoryToLeaves(json.Component, "component")
);

json = removeUnusedKeys(json);

writeFileSync(
  "./tokens/design-tokens.tokens.new.json",
  JSON.stringify(json, null, 2)
);
