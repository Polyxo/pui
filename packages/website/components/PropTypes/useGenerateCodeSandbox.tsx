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
                name: `${componentName} WFP Design System`,
                description: `WFP Digital Design System Component 📦 Playground: ${componentName}`,
                tags: ["wfp", "design", "system", "react", "component"],
                dependencies: {
                  "@wfp/react": "alpha",
                  "@wfp/icons-react": "alpha",
                  "@wfp/styles": "alpha",
                  "@wfp/themes-core": "alpha",
                  "@wfp/pictograms-react": "alpha",
                  react: "latest",
                  "react-dom": "latest",
                },
              },
            },
            "index.js": {
              content: `
import React from "react";
import ReactDOM from "react-dom";
import "@wfp/styles/styles.css";

${formatedCode.replace("() => {", "function App() {")}


const rootElement = document.getElementById("root");

ReactDOM.render(<App />, rootElement);
              `,
            },
          },
        }),
      }
    );

    const json = await response.json();

    const sandboxUrl = `https://codesandbox.io/s/${json.sandbox_id}`;
    window.open(sandboxUrl, "_blank");

    setCodeSandboxResponse(json);
  };
  return { generateCodeSandbox, codeSandboxResponse };
}
