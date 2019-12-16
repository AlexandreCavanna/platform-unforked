// @flow
import * as React from 'react';

type Props = {
  value?: ?string | ?number,
  tagName?: string,
  className?: string,
};

export const WYSIWYGRender = (props: Props) => {
  const { value, tagName, className, ...rest } = props;

  // sorry for that: https://github.com/quilljs/quill/issues/1235
  if (!value || value === '<p><br /></p>') {
    return null;
  }

  if (tagName) {
    const child = React.createElement(tagName, { dangerouslySetInnerHTML: { __html: value } });

    return <div className={`${className || ''} ql-editor`}>{child}</div>;
  }

  return (
    <div
      {...rest}
      className={`${className || ''} ql-editor`}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};

export default WYSIWYGRender;