"use client";

import {
  Checkbox,
  Select,
  SelectItem,
  Empty,
  NumberInput,
  Tag,
  Table,
  Tooltip,
  Text,
  TextInput,
  useMediaQuery,
} from "@wfp/react";
import React from "react";
import { useForm } from "react-hook-form";
import * as wfpComponents from "@wfp/react";
import ReactDatePicker from "react-datepicker";
import reactElementToJSXString from "react-element-to-jsx-string";
import styles from "./prop-types.module.scss";
import CodeBlockLive from "../Blog/Mdx/CodeBlockLive";
import Markdown from "react-markdown";
import formatTypes from "./formatTypes";
import { transform } from "@babel/standalone";
import { AddCircle, CloseCircle, Settings, StarSolid } from "@wfp/icons-react";
import * as componentsSource from "@../../../demoCode/dist/bundle";
import { extractComponentNames } from "./extractComponentNames";

declare const window: any;

const filterEmptyValues = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});
};

function extractFirstComponent(func) {
  // Convert the function to a string
  const funcString = func.toString();

  // Use a regex to find the first JSX component (assumes component starts with '<' and ends with '>')
  // eslint-disable-next-line no-useless-escape
  const jsxRegex = /<[\w\s\d\.\{\}\(\)\=\>\"\']*\>[^<]*<\/[\w]+>/;
  const match = funcString.match(jsxRegex);

  // Check if a match was found and return it
  return match ? match[0] : null;
}

function extractPropsAsString(componentString) {
  // Define a regex to match properties in the JSX component
  // This pattern will match attributes and their values, considering different value types (variables, strings, etc.)
  const propRegex = /(\w+)\s*=\s*{([^}]+)}/g;
  let propsString = "";
  let match;

  while ((match = propRegex.exec(componentString)) !== null) {
    // match[1] is the property name, match[2] is the value
    // Append the matched property and its value to the result string
    propsString += `${match[1]}={${match[2].trim()}} `;
  }

  // Trim the trailing space and return the result
  return propsString.trim();
}

function extractJSX(code) {
  // Regular expression to match the pattern of the function and extract JSX
  const pattern = /const [\w]+ = \w+ => (.*);/s;
  if (!code) return null;
  const match = code.match(pattern);

  if (match && match[1]) {
    return match[1].trim();
  } else {
    return "Pattern not found";
  }
}

function extractJSXFromRender(code) {
  // Regular expression to match the pattern of the function and extract JSX
  const pattern = /\s*=>\s*(<.*>);?/s;
  if (!code) return null;
  const match = code.match(pattern);

  if (match && match[1]) {
    return match[1].trim();
  } else {
    return "Pattern not found";
  }
}

export default function PropTypes({
  defaultProps = {},
  mainComponent,
  //components = [],
  //sampleCode: sampleCodeInput,
  //smallPreview,
  componentsNew,
  showEditor,
  previewScale,
  propTypes,
  hideWrapper,
  view,
}: any) {
  const currentComponentsSettings = componentsNew?.[propTypes?.displayName];

  const isDesktop = useMediaQuery("(min-width: 768px)", true);

  const componentsSourceText =
    componentsSource[
      currentComponentsSettings?.demo
        ? currentComponentsSettings.demo
        : mainComponent
    ]?.default[`${propTypes?.displayName}Default`];

  const componentsSourceProps = componentsSourceText?.args
    ? componentsSourceText.args
    : componentsSource[mainComponent]?.default[
        `${propTypes?.displayName}DefaultArgs`
      ];

  const { register, watch, handleSubmit } = useForm({
    defaultValues: componentsSourceProps /* defaultProps */,
  });

  const isWrapped = componentsSourceText?.render?.startsWith("args => {");
  const sampleCode = isWrapped
    ? componentsSourceText?.render
    : componentsSourceText?.render
    ? extractJSXFromRender(componentsSourceText.render)
    : extractJSX(componentsSourceText);

  /*     children?.props?.children?.props?.children || sampleCodeInput */ //if (!propTypes?.[0]) return null;
  const propList = propTypes?.props;

  /*Object.entries(propList).forEach((prop) => {
    componentProps[prop.name] =
      propValues[prop.name] || prop.defaultValue?.value;
  });*/

  const propValues = watch();

  const onSubmit = (data) => {
    console.log(data);
  };

  const iconsList = {
    none: { value: "", icon: "No Icon" },
    AddCircle: { value: "AddCircle", icon: <AddCircle /> },
    CloseCircle: { value: "CloseCircle", icon: <CloseCircle /> },
    Settings: { value: "Settings", icon: <Settings /> },
    StarSolid: { value: "StarSolid", icon: <StarSolid /> },
  };

  // TODO: Add auto detection of options based on prop types
  const options = "primary | secondary | tertiary".replaceAll(" ", "");

  const renderInput = (prop) => {
    if (prop.type.raw === "boolean") {
      return (
        <Checkbox
          {...register(prop.name)}
          labelText={prop.name}
          type="checkbox"
          defaultChecked={prop.defaultValue && prop.defaultValue.value}
        />
      );
    }
    // Imported interfaces like buttonKind
    if (prop.type.name === "enum" && prop.type.raw !== "ReactNode") {
      return (
        <Select
          {...register(prop.name, { required: prop.required })}
          defaultValue={prop.defaultValue && prop.defaultValue.value}
        >
          {prop.required === false && (
            <SelectItem key="none" value="" text="None" />
          )}
          )
          {prop.type.value.map((kind: { value: string }, i) => (
            <SelectItem
              key={i}
              value={kind.value.replaceAll('"', "").replaceAll(" ", "")}
              text={kind.value.replaceAll('"', "").replaceAll(" ", "")}
            />
          ))}
        </Select>
      );
    }

    if (
      /*( prop.name === "kind" ||
        prop.name === "type" ||
        prop.name === "size" ||
        prop.name === "pageWidth" ||
        prop.name === "margin") && */
      prop.type.name.includes("|")
    ) {
      //const propOptionsList = inputString.split(" | ").map(s => s.replace(/"/g, ''));

      return (
        <Select
          {...register(prop.name, { required: prop.required })}
          defaultValue={prop.defaultValue && prop.defaultValue.value}
        >
          {prop.required === false && (
            <SelectItem key="none" value="" text="None" />
          )}
          )
          {Object.values(prop.type.name.split("|")).map((kind: string, i) => (
            <SelectItem
              key={i}
              value={kind.replaceAll('"', "").replaceAll(" ", "")}
              text={kind.replaceAll('"', "").replaceAll(" ", "")}
            />
          ))}
        </Select>
      );
    }

    if (prop.type.name === "ButtonKind") {
      return (
        <Select
          {...register(prop.name, { required: prop.required })}
          defaultValue={prop.defaultValue && prop.defaultValue.value}
        >
          {Object.values(options.split("|")).map((kind, i) => (
            <SelectItem key={i} value={kind} text={kind} />
          ))}
        </Select>
      );
    }

    if (prop.type.name === "ButtonKind") {
      return (
        <Select
          {...register(prop.name, { required: prop.required })}
          defaultValue={prop.defaultValue && prop.defaultValue.value}
        >
          {Object.values(options.split("|")).map((kind, i) => (
            <SelectItem key={i} value={kind} text={kind} />
          ))}
        </Select>
      );
    }
    if (prop.name === "icon") {
      return (
        <Select
          {...register(prop.name, { required: prop.required })}
          defaultValue={prop.defaultValue && prop.defaultValue.value}
        >
          {Object.entries(iconsList).map(([i, icon]) => (
            <SelectItem key={i} value={icon.value} text={icon.value} />
          ))}
        </Select>
      );
    }

    if (
      prop.type.raw === "ReactNode" ||
      prop.type.raw === "string" ||
      prop.type.name === "string"
    ) {
      return (
        <TextInput
          {...register(prop.name, { required: prop.required })}
          type={prop.type.name === "number" ? "number" : "text"}
          defaultValue={prop.defaultValue && prop.defaultValue.value}
        />
      );
    } else if (prop.type.raw === "number" || prop.type.name === "number") {
      return (
        <NumberInput
          {...register(prop.name, { required: prop.required })}
          defaultValue={prop.defaultValue && prop.defaultValue.value}
        />
      );
    }
    // Add more input types based on prop types if needed
  };

  const componentProps: any = {};

  if (propList) {
    Object.values(propList).forEach(({ name, defaultValue }: any) => {
      if (name === "icon") {
        componentProps.icon = iconsList[propValues[name]]?.icon;
      } else {
        componentProps[name] =
          propValues[name] !== undefined
            ? propValues[name]
            : defaultValue?.value;
      }
    });
  }

  const MyComponent = wfpComponents[propTypes?.displayName || mainComponent];
  if (!MyComponent) return null;

  let propsAsList: any = [];

  if (propList) {
    propsAsList = Object.values(propList);
  }

  const filteredPropsList = {
    ...filterEmptyValues(defaultProps),
    ...filterEmptyValues(componentProps),
    ...(isWrapped ? { additional: "props" } : {}),
  };

  // Filter if default value is same as component value
  const filteredPropsWithoutDefaultValuesAsObject = Object.fromEntries(
    Object.entries(filteredPropsList).filter(
      ([key, value]) => value !== propList?.[key]?.defaultValue?.value
    )
  );

  let code = reactElementToJSXString(
    <MyComponent {...filteredPropsWithoutDefaultValuesAsObject} />,
    {
      filterProps: (val) => (val === undefined ? false : true),
    }
  );

  if (sampleCode) {
    try {
      const sampleCodeWithoutWrapper = isWrapped
        ? extractFirstComponent(sampleCode)
        : sampleCode;
      // Transpile JSX to JavaScript
      const transformedCode = transform(
        sampleCodeWithoutWrapper.replace("{...args}", ""),
        {
          presets: ["react"],
        }
      );

      // Evaluate the transpiled code to get a React element

      if (typeof window !== "undefined") {
        window.React = React;
        window.react = React;
        window.ReactDatePicker = ReactDatePicker;
        (window as any).action = (action) => {
          console.log("action triggered", action);
        };
        Object.entries(wfpComponents).forEach((entry) => {
          window[entry[0]] = entry[1];
        });
      }
      const codeNew: any = eval(transformedCode.code);
      const enhancedElement = React.cloneElement(
        codeNew,
        filteredPropsWithoutDefaultValuesAsObject
      );

      code = reactElementToJSXString(enhancedElement, {
        showFunctions: true,
        functionValue: () => {
          return "ReactDatePicker";
          //fn().length > 1000 ? "ReactDatePicker" : fn;
        }, // TODO: Replace with better universal solution
      });
    } catch (error) {
      console.log("Transform failed", error);
    }
  }

  if (isWrapped) {
    code = sampleCode
      .replace(extractFirstComponent(sampleCode), code)
      .replace(
        `additional="props"`,
        extractPropsAsString(extractFirstComponent(sampleCode))
      );
  }

  const componentsUsedInCode: any = [];
  Object.entries(wfpComponents).forEach(([index]) => {
    if (code.includes("<" + index)) {
      componentsUsedInCode.push(index);
    }
  });

  const componentList = componentsUsedInCode.join(", ");

  console.log("code", componentsSourceText?.render);

  const codeWithWrapper = isWrapped
    ? code
    : `() => { 
    ${
      code.search("action") !== -1 ? "const action = () => {};" : ""
    } return (${code})}`;

  code = `import { ${componentList} } from "@wfp/react";
  
${codeWithWrapper}
`;

  if (view === "smallPreview") {
    return (
      <div
        className={styles.smallPreviewWrapper}
        style={{
          width: `${(1 / previewScale) * 100}%`,
          left: `-${(1 / previewScale) * 50 - 50}%`,
          transform: ` scale(${previewScale})`,
        }}
      >
        <CodeBlockLive
          source={code}
          // live
          width={componentsNew?.[propTypes?.displayName]?.width}
          hideWrapper={hideWrapper}
          center
          // smallPreview
          live
          view={view}
          showEditor={showEditor}
          // showEditor={!showAllProps}
        />
      </div>
    );
  }

  return (
    <div
      className={`${styles.preview} ${
        view === "smallPreview" ? styles.smallPreview : styles.normalPreview
      }`}
    >
      <CodeBlockLive
        source={code}
        className={styles.codeBlock}
        live
        width={componentsNew?.[propTypes?.displayName]?.width}
        // hideWrapper
        center
        view={view}
        componentName={propTypes?.displayName}
        // showEditor={!showAllProps}
      />
      {/*
        <div className={styles.previewWrapper}>
          <MyComponent {...defaultProps} {...componentProps} />
        </div>
  )}*/}
      {view === "propsTable" && (
        <form onSubmit={handleSubmit(onSubmit)}>
          {view === "propsTable" && propsAsList.length > 0 ? (
            <Table className={styles.propTable}>
              <thead>
                <tr>
                  <th>Prop</th>

                  <th className={styles.default}>Default</th>
                  {isDesktop && (
                    <th className={styles.description}>Description</th>
                  )}
                  <th className={styles.propValue}>Value</th>
                </tr>
              </thead>
              <tbody>
                {propsAsList.map((prop: any) => {
                  const description = (
                    <>
                      {prop.description.includes("@deprecated") && (
                        <Tag type="warning" className={styles.deprecated}>
                          Deprecated
                        </Tag>
                      )}

                      <Markdown>
                        {prop.description
                          .replace("@design", "")
                          .replace("@deprecated", "")
                          .replaceAll("\\", "")}
                      </Markdown>

                      {prop.defaultValue && (
                        <div>default: {prop.defaultValue.value}</div>
                      )}
                    </>
                  );

                  return (
                    <tr key={prop.name}>
                      <td>
                        <h3 className={styles.propName}>{prop.name}</h3>

                        {!isDesktop && description}
                        <div className={styles.typesWrapper}>
                          <Tooltip
                            className={styles.tooltip}
                            content={
                              <div>
                                {prop.type.raw ? prop.type.raw : prop.type.name}
                              </div>
                            }
                          >
                            <div>
                              <Text kind="code" className={styles.types}>
                                {prop.name === "components" ? (
                                  <>
                                    {extractComponentNames(prop.type.name).map(
                                      (component, i) => (
                                        <span key={i}>{component}</span>
                                      )
                                    )}
                                  </>
                                ) : (
                                  formatTypes(
                                    prop.type.raw
                                      ? prop.type.raw
                                      : prop.type.name
                                  ).map((line, lineIndex) => (
                                    <span key={lineIndex}>{line}</span>
                                  ))
                                )}
                              </Text>
                            </div>
                          </Tooltip>
                        </div>
                      </td>

                      <td>
                        {prop.defaultValue ? prop.defaultValue.value : "–"}
                      </td>

                      {isDesktop && <td>{description}</td>}
                      <td className={styles.propValue}>{renderInput(prop)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : view === "propsTable" ? (
            <Empty kind="large">
              This component does not have any custom props.
            </Empty>
          ) : null}
        </form>
      )}
    </div>
  );
}
