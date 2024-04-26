/* eslint-disable no-irregular-whitespace */
// src/components/CodeBlock.js
import React, { useEffect, useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import stylesModule from "./codeBlockLive.module.scss";
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview,
  withLive,
} from "react-live";
import Storybook from "../Storybook";
import { DoUse, DoNotUse } from "../DoUse";
//import { MDXProvider } from '@mdx-js/react';
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import ReactDatePicker from "react-datepicker";
import Frame from "react-frame-component";

//import MDX from '@mdx-js/runtime';
//import components from '../';

import * as ReactDOMServer from "react-dom/server";

import * as unComponents from "@wfp/react";
import * as unHumanitarianIcons from "@wfp/humanitarian-icons-react";
import * as unPictograms from "@wfp/pictograms-react";
import * as icons from "@wfp/icons-react";
import { Button, Empty } from "@wfp/react";
import prettier from "prettier/standalone";
import babelParser from "prettier/parser-babel";
import htmlParser from "prettier/parser-html";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faDesktop,
  faLeftLong,
  faMobileAlt,
  faRightLong,
} from "@fortawesome/free-solid-svg-icons";
import useGenerateCodeSandbox from "../../../PropTypes/useGenerateCodeSandbox";
import { faCodepen, faHtml5 } from "@fortawesome/free-brands-svg-icons";
import InnerFrame from "./InnerFrame";

const countLines = (str) => {
  return str.split("\n").length;
};

function LiveHtml({ live }: any /* { live?: Record<string, unknown> } */) {
  // const Result = live.element as React.FunctionComponent | React.ComponentClass;
  //const Result = live.element as React.ElementType;
  //if (!Result) return null;
  // let htmlString = ReactDOMServer.renderToStaticMarkup(<Result />);
  let htmlString = ReactDOMServer.renderToStaticMarkup(<live.element />);

  htmlString = htmlString.replace(
    /<svg.*?>(.*?)<\/svg>/gm,
    "<YOUR SVG IMAGE />"
  ); // $1p

  let formatedHtmlString = htmlString;
  try {
    formatedHtmlString = prettier.format(htmlString, {
      parser: "html",
      plugins: [htmlParser],
    });
  } catch (e) {
    console.log(e);
  }

  return <CodeBlock language="html">{formatedHtmlString}</CodeBlock>;
}
const LiveHtmlHoc = withLive(LiveHtml);

const CodeBlockLive = (props: any) => {
  const {
    children,
    className = "",
    live,
    center,
    componentName,
    forceFullWidth,
    noCode,
    hideWrapper,
    noInline,
    showEditor = true,
    view,
    source,
    width,
    size: sizeProp = "desktop",
    expandCode,
    reactHookForm,
  } = props;

  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [size, setSize] = useState(sizeProp);
  const [showHtml, setShowHtml] = useState(false);
  const [showCode, setShowCode] = useState(
    noCode !== undefined ? !noCode : showEditor
  );
  const [showAllCode, setShowAllCode] = useState(expandCode);
  // const [showExpandButton, setShowExpandButtons] = useState(true);
  const [rtl, setRtl] = useState(false);
  let code = source ? source : children ? children.trim() : "";

  if (reactHookForm)
    code = `
  const FormExample = () => {

    const [defaultValues, setDefaultValues] = useState({});
    const { control, register, handleSubmit, watch, reset } = useForm({defaultValues});
    const [data, setData] = useState({});

    const setDefaultValuesFunc = (e) => {
      console.log(e.target.value);
      try {
        const values = JSON.parse(e.target.value);
        setDefaultValues(values);
      } catch (e) {
        console.log(e);
      }
    }

    const resetInputs = () => {
      reset(defaultValues);
    }
    const currentValues = watch();
  
    return (
      <>
      
      <form onSubmit={handleSubmit((data) => setData(data))}>

        ${code}
  
        <Button type="submit">Submit</Button>{" "}
        <Button onClick={resetInputs} kind="secondary">Reset</Button>
        
        <div className="debug">
          <h4>Submitted form data</h4>
          <pre>{JSON.stringify(data, null, 2)}</pre>

          <h4>Current values</h4>
          <pre>{JSON.stringify(currentValues, null, 2)}</pre>

          <TextInput labelText="Default values (editable)" defaultValue={JSON.stringify(defaultValues)} onChange={setDefaultValuesFunc} /> 
        </div>
      </form>
      </>
    );
  }
  
  render(<FormExample />)`;

  //     <Result defaultValues={defaultValues} currentValues={currentValues} data={data} setDefaultValuesFunc={setDefaultValuesFunc}/>

  const language =
    props.language || className.replace(/language-/, "") || "jsx";

  const [copiedCode, setCopiedCode] = useState("Copy code");

  const cleanCode = (code) => {
    return `${code}` // don't modify the original value
      .replaceAll(/^import \{[^{]+\} from .+$\n/gm, "") // import { x, y } from "z"
      .replaceAll(/^import \* as \S+ from .+$\n/gm, "") // import * as abc from "z"
      .replaceAll(/: \S+ = /g, " = "); // let a: string = "something"
  };

  let formatedCode = code;

  const { generateCodeSandbox } = useGenerateCodeSandbox({
    componentName,
    formatedCode,
  });

  try {
    formatedCode =
      language === "jsx" || 1 === 1
        ? prettier.format(code, {
            parser: "babel",
            plugins: [babelParser],
            printWidth: 55,
          })
        : code;
  } catch (error) {
    //console.log("prettier not working");
  }

  const handleCopyCode = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy);

    setCopiedCode("Copied!");

    setTimeout(() => {
      setCopiedCode("Copy code");
    }, 2000);
  };

  if (live) {
    const scope = {
      ...unHumanitarianIcons,
      ...unPictograms,
      ...icons,
      ...unComponents,
      ReactDatePicker,
      useForm,
      useState,
      Storybook,
      Controller,
      Empty,
      DoUse,
      DoNotUse,
    };

    const showExpandButton = countLines(formatedCode) > 12;

    const codeBlockClasses = classNames(stylesModule.editor, {
      btn: true,
      [stylesModule.hideWrapper]: hideWrapper,
      [stylesModule.showWrapper]: !hideWrapper,
      [stylesModule.center]: center,
      [stylesModule.notCenter]: !center,
      [stylesModule.fullWidth]:
        (forceFullWidth || width >= 800) && size === "desktop",
      [stylesModule.normalWidth]: !forceFullWidth && (width < 800 || !width),
      [stylesModule.expandCode]: showAllCode,
      [stylesModule.collapseCode]: !showAllCode,
      [stylesModule.showExpandButton]: showExpandButton,
      [stylesModule.reactHookForm]: reactHookForm,
      [stylesModule.rtl]: rtl,
      [`${stylesModule[size]}`]: size,
      [`${stylesModule[view]}`]: view,
    });

    const livePreview = (
      <LivePreview
        className={`${stylesModule.preview}`} // ${width ? styles.scrollable : ""}
        dir={rtl ? "rtl" : "ltr"}
        style={{ width: width ? width + "px" : undefined }}
      />
    );

    return (
      <div className={codeBlockClasses}>
        {view !== "smallPreview" && (
          <div className={stylesModule.buttons}>
            <Button
              className={stylesModule.showAllPropsButton}
              kind="ghost"
              iconReverse
              icon={
                <FontAwesomeIcon
                  icon={size === "desktop" ? faDesktop : faMobileAlt}
                />
              }
              onClick={() => setSize(size === "desktop" ? "mobile" : "desktop")}
            >
              Size
            </Button>

            <Button
              className={stylesModule.showAllPropsButton}
              kind="ghost"
              iconReverse
              icon={<FontAwesomeIcon icon={rtl ? faRightLong : faLeftLong} />}
              onClick={() => setRtl(!rtl)}
            >
              RTL
            </Button>
            <Button
              className={stylesModule.showAllPropsButton}
              onClick={() => setShowCode(!showCode)}
              kind="ghost"
              iconReverse
              icon={<FontAwesomeIcon icon={faCode} />}
            >
              code
            </Button>
            <Button
              className={stylesModule.showAllPropsButton}
              onClick={() => setShowHtml(!showHtml)}
              kind="ghost"
              iconReverse
              icon={<FontAwesomeIcon icon={faHtml5} />}
            >
              html
            </Button>

            <Button
              kind="ghost"
              iconReverse
              className={stylesModule.showAllPropsButton}
              onClick={generateCodeSandbox}
              icon={<FontAwesomeIcon icon={faCodepen} />}
            >
              Codesandbox
            </Button>
          </div>
        )}
        <LiveProvider
          code={formatedCode}
          scope={scope}
          theme={themes.vsDark}
          noInline={noInline || reactHookForm}
          transformCode={cleanCode}
        >
          {language === "mdx" || language === "md" ? (
            <div className={stylesModule.preview}></div>
          ) : (
            <div className={stylesModule.previewWrapper}>
              <div className={stylesModule.previewInside}>
                {size !== "desktop" ? (
                  <>
                    {isMounted && (
                      <div className={stylesModule.mobileFrame}>
                        <div
                          className={stylesModule.mobileFrameButtonVolumeUp}
                        />
                        <div
                          className={stylesModule.mobileFrameButtonVolumeDown}
                        />
                        <div className={stylesModule.powerButton} />
                        <Frame>
                          <InnerFrame />
                        </Frame>
                      </div>
                    )}
                  </>
                ) : (
                  livePreview
                )}
              </div>
            </div>
          )}

          {showCode && (
            <>
              <div className={stylesModule.liveEditor}>
                {showExpandButton && (
                  <div
                    className={stylesModule.showAllCodeWrapper}
                    onClick={() => setShowAllCode(!showAllCode)}
                  >
                    {showAllCode ? "Collapse code" : "Expand code"}
                  </div>
                )}
                <h3 className={stylesModule.exampleHeading}>
                  Editable Example
                </h3>
                <LiveEditor theme={themes.vsDark} />
              </div>
              {language === "jsx" && showHtml && (
                <>
                  <h3 className={stylesModule.exampleHeading}>HTML</h3>
                  <LiveHtmlHoc />
                </>
              )}
            </>
          )}
          <LiveError />
        </LiveProvider>
      </div>
    );
  }

  return (
    <div
      className={`${stylesModule.code} wfp--code-block ${
        source ? stylesModule.previewWithSource : ""
      }`}
    >
      {source && <div className={stylesModule.preview}>{children}</div>}
      {view !== "smallPreview" && (
        <Highlight
          code={code}
          language="tsx" //{language}
          theme={themes.vsDark}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={{ ...style, padding: "20px" }}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      )}
      <Button
        className={stylesModule.copyButton}
        small
        onClick={() => handleCopyCode(code)}
      >
        {copiedCode}
      </Button>
    </div>
  );
};
export default CodeBlockLive;

interface PreProps {
  live?: boolean;
  noInline?: boolean;
  reactHookForm?: boolean;
  forceFullWidth?: boolean;
  noCode?: boolean;
  size?: string;
  width?: number;
  children?: /*| React.ReactElement<any, any>
    | JSX.Element
    | React.ReactFragment*/
  JSX.Element | { type: { name: string }; props: any };
  [x: string]: any;
}

export function Pre({
  live,
  noInline,
  reactHookForm,
  forceFullWidth,
  noCode,
  width,
  children,
  size,
  ...props
}: PreProps) {
  if (React.isValidElement(children) /*&& children?.type?.name === 'code'*/) {
    const childProps: any = children.props;

    return (
      <div {...props}>
        <CodeBlockLive
          live={live}
          noInline={noInline}
          reactHookForm={reactHookForm}
          noCode={noCode}
          size={size}
          width={width}
          forceFullWidth={forceFullWidth}
          {...childProps}
        />
      </div>
    );
  }
  // wfp--story__code
  const childObject: any = children;

  return <pre {...props}>{childObject}</pre>;
}

export function CodeBlock(params) {
  return <CodeBlockLive {...params} />;
}
