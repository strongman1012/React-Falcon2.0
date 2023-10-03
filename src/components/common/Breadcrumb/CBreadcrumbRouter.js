import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { Link, useLocation, matchPath } from 'react-router-dom';

import vars from 'utils/vars';
import { CBreadcrumb } from './CBreadcrumb';
import { CBreadcrumbItem } from './CBreadcrumbItem';

//component - CoreUI / CBreadcrumbRouter
const getPaths = pathname => {
  const paths = ['/'];
  if (pathname === '/') return paths;
  pathname.split('/').reduce((prev, curr) => {
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });
  return paths;
};

const getName = (name, currPath) => {
  // console.log({ currPath })
  if (name === 'Profile' && currPath.includes('/profile')) {
    return 'Your Profile';
  } else {
    return name;
  }
};

const CBreadcrumbRouteItem = ({ name, currPath }, fullCurrPath) => {
  return (
    <CBreadcrumbItem key={currPath}>
      <Link
        to={currPath}
        style={
          fullCurrPath.endsWith(currPath)
            ? { fontWeight: 'bold', color: vars.PRIMARY_COLOR }
            : { color: 'gray' }
        }
      >
        {getName(name, currPath)}
      </Link>
    </CBreadcrumbItem>
  );
};

export const CBreadcrumbRouter = props => {
  const currPath = useLocation().pathname;
  const { currentModuleSchemaLoading } = useSelector(
    state => state.currentData
  );
  const { className, innerRef, routes, ...attributes } = props;

  let items = null;
  if (routes) {
    const paths = getPaths(currPath);
    const currRoutes = paths
      .map(currPath => {
        const route = routes.find(route => {
          return matchPath({ path: route.path, exact: route.exact }, currPath);
        });
        return { ...route, currPath };
      })
      .filter(route => route && route.name);

    items = currRoutes.map(route => {
      return CBreadcrumbRouteItem(route, currPath);
    });
  }

  if (items && items.length > 1) {
    items = items.filter(item => item.key !== '/data');
  }

  //render
  const classes = classNames(className);

  return (
    <CBreadcrumb className={classes} {...attributes} ref={innerRef}>
      {currentModuleSchemaLoading ? null : items}
    </CBreadcrumb>
  );
};
