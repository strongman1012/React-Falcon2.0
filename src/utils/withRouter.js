import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const withRouter = Component => {
  const Wrapper = props => {
    const navigate = useNavigate();
    const params = useParams();

    return <Component params={params} navigate={navigate} {...props} />;
  };

  return Wrapper;
};
