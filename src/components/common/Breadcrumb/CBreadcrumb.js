import React from 'react';
import classNames from 'classnames';

export const CBreadcrumb = props => {
  const { className, innerRef, ...attributes } = props;

  const classes = classNames(className, 'breadcrumb');

  return <ol className={classes} {...attributes} ref={innerRef} />;
};
