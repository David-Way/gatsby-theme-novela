import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";

const RE = /{([\d,-]+)}/;

function calculateLinesToHighlight(meta) {
  if (RE.test(meta)) {
    const lineNumbers = RE.exec(meta)[1]
      .split(",")
      .map(v => v.split("-").map(y => parseInt(y, 10)));

    return index => {
      const lineNumber = index + 1;
      const inRange = lineNumbers.some(([start, end]) =>
        end ? lineNumber >= start && lineNumber <= end : lineNumber === start,
      );
      return inRange;
    };
  } else {
    return () => false;
  }
}

function CodePrism({ codeString, language, metastring }) {
  const shouldHighlightLine = calculateLinesToHighlight(metastring);

  return (
    <Highlight {...defaultProps} code={codeString} language={language}>
      {({ className, tokens, getLineProps, getTokenProps }) => {
        return (
          <pre className={className}>
            {tokens.map((line, index) => {
              const { className } = getLineProps({
                line,
                key: index,
                className: shouldHighlightLine(index) ? "highlight-line" : "",
              });

              return (
                <div key={index} className={className}>
                  <span className="number-line">{index + 1}</span>
                  {line.map((token, key) => {
                    const { className, children } = getTokenProps({
                      token,
                      key,
                    });

                    return (
                      <span key={key} className={className}>
                        {children}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </pre>
        );
      }}
    </Highlight>
  );
}

export default CodePrism;