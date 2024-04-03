import React from "react";

export function componentToString(element) {
  // Check if the element is a simple string or number and return it as is
  if (typeof element === "string" || typeof element === "number") {
    return String(element);
  }

  // Handle React elements
  if (React.isValidElement(element)) {
    const type = element.type;
    const props = element.props;
    const propsString = Object.keys(props)
      // Filter out children from the props
      .filter((key) => key !== "children")
      // Map each prop to a key=value string
      .map((key) => `${key}=${JSON.stringify(props[key])}`)
      // Join all props with spaces
      .join(" ");
    const children = React.Children.toArray(props.children)
      .map((child) => componentToString(child))
      .join("");
    const typeString =
      typeof type === "string" ? type : type.displayName || type.name;
    return `${children}`;
    //return `<${typeString} ${propsString}>${children}</${typeString}>`;
  }

  // Handle arrays of elements or fragments
  if (Array.isArray(element)) {
    return element.map((child) => componentToString(child)).join("");
  }

  // Return empty string for unsupported types (e.g., functions, symbols)
  return "";
}
