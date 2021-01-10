import React from 'react';
import {
  RouteProps as ReactDOMRouteProps,
  Route as ReactDOMRoute,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  const returnRender = ({ location }: any) => {
    if (isPrivate === !!user) {
      return <Component />;
    }

    return (
      <Redirect
        to={{
          pathname: isPrivate ? '/' : '/dashboard',
          state: { from: location },
        }}
      />
    );
  };

  return <ReactDOMRoute {...rest} render={returnRender} />;
};

export default Route;
