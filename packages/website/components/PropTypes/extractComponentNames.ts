export function extractComponentNames(str: string): string[] {
  // Regular expression to match the component names
  const regex = /\b(\w+)(?=\?: ComponentType)/g;
  let matches;
  const components: string[] = [];

  // Find matches and add them to the components array
  while ((matches = regex.exec(str)) !== null) {
    components.push(matches[1]);
  }

  return components;
}
