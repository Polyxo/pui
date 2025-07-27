import React from "react";

interface GenerateCodeSandboxProps {
  componentName: string;
  formatedCode: string;
}

export default function useGenerateCodeSandbox({
  componentName,
  formatedCode,
}: GenerateCodeSandboxProps) {
  const [codeSandboxResponse, setCodeSandboxResponse] = React.useState(null);

  const generateCodeSandbox = async () => {
    const response = await fetch(
      "https://codesandbox.io/api/v1/sandboxes/define?json=1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: {
            "package.json": {
              content: {
                name: `${componentName} Progressive Design System`,
                description: `Progressive Digital Design System Component 📦 Playground: ${componentName}`,
                tags: ["design", "system", "react", "component"],
                dependencies: {
                  "@progressiveui/react": "alpha",
                  "@progressiveui/icons-react": "alpha",
                  "@progressiveui/styles": "alpha",
                  "@progressiveui/themes-core": "alpha",
                  react: "latest",
                  "react-dom": "latest",
                },
              },
            },
            "index.js": {
              content: `
import React from "react";
import ReactDOM from "react-dom";
import "@progressiveui/styles/styles.css";

${formatedCode.replace("() => {", "function App() {")}


const rootElement = document.getElementById("root");

ReactDOM.render(<App />, rootElement);
              `,
            },
          },
        }),
      },
    );

    const json = await response.json();

    const sandboxUrl = `https://codesandbox.io/s/${json.sandbox_id}`;
    window.open(sandboxUrl, "_blank");

    setCodeSandboxResponse(json);
  };
  return { generateCodeSandbox, codeSandboxResponse };
}
