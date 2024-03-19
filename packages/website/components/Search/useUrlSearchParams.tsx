import { useState, useEffect } from "react";

export function useURLSearchParams() {
  const [searchParams, setSearchParams] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search);
    }
    return null;
  });

  useEffect(() => {
    const handlePopState = () => {
      setSearchParams(new URLSearchParams(window.location.search));
    };

    // Listen to changes in the URL
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pushState", handlePopState);
    window.addEventListener("replaceState", handlePopState);

    // Custom event listeners for pushState and replaceState
    ["pushState", "replaceState"].forEach((eventName) => {
      const originalFunction = history[eventName];
      history[eventName] = function () {
        // eslint-disable-next-line prefer-rest-params
        originalFunction.apply(this, arguments);
        window.dispatchEvent(new Event(eventName));
      };
    });

    // Cleanup
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pushState", handlePopState);
      window.removeEventListener("replaceState", handlePopState);
    };
  }, []);

  return searchParams;
}
