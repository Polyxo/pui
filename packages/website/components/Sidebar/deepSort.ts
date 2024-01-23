function deepSortByName(arr, depth = 0) {
  // Sort the array by the name property
  // Helper function to provide a default large value for missing orders
  const getOrder = (item) =>
    item.path && item.path?.order?.[depth] !== undefined
      ? item.path.order[depth]
      : Number.MAX_SAFE_INTEGER;

  // Sort the array by the path.order if available, else by name
  arr.sort((a, b) => {
    const orderA = getOrder(a);
    const orderB = getOrder(b);

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return a.name.localeCompare(b.name);
  });

  // Recursively sort any children arrays
  arr.forEach((item) => {
    if (item.children && item.children.length > 0) {
      deepSortByName(item.children, depth + 1);
    }
  });
}

export default deepSortByName;
