import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Spin as Loading } from 'antd'; 

const Routes = props => {
  return (
    <Switch>
      {props.routes.map(({ component: Component, ...route }, index) => {
        return (
          <Route
            path={route.path}
            key={index} 
            {...route} 
            render={routeProps => {  
              if (route.redirect) {
                return <Redirect to={route.redirect} />;
              } 
              return (
                <Suspense fallback={<Loading />}>
                  <Component {...route} {...routeProps}>
                    <Routes routes={route.routes} />
                  </Component>
                </Suspense>
              );
            }}
          />
        );
      })}
    </Switch>
  );
};
Routes.defaultProps = {
  routes: []
};
export default React.memo(Routes);
