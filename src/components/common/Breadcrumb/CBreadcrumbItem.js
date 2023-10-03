import React from 'react';
import classNames from 'classnames';

export const CBreadcrumbItem = props => {
  const { className, innerRef, active, ...attributes } = props;

  const classes = classNames(
    className,
    active ? 'active' : false,
    'breadcrumb-item'
  );

  return (
    <li
      className={classes}
      role="presentation"
      aria-current={active ? 'page' : undefined}
      {...attributes}
      ref={innerRef}
    />
  );
};
