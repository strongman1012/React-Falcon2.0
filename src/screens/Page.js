import Axios from 'axios';
import FadeIn from 'react-fade-in';
import { useDispatch } from 'react-redux';
import loadable from '@loadable/component';
import { useParams, useLocation } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';

import endpoint from 'utils/endpoint';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import PageBodyContent from 'views/PageBodyContent';
import { setCurrentData } from 'redux/slices/currentDataSlice';
import { loadableOptions } from 'views/DataModule/HelperElements';
import { getErrorAlert, setReduxCurrentSchemaData } from 'helpers/utils';

const WidgetViewer = loadable(
  () => import('components/WidgetViewer/WidgetViewer'),
  loadableOptions
);

function PageComponent() {
  let { routeKey } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const _isMounted = useRef(false);
  const [moduleSchema, setModuleSchema] = useState(null);
  const [loadingSchema, setLoadingSchema] = useState(true);

  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      dispatch(setCurrentData({ currentModuleSchemaLoading: true }));
      console.log(routeKey, 'routekey');
      const ep = endpoint.getPageSchemaEndpoint(routeKey.replace('/', ''));
      const moduleSchemaRes = await Axios.get(ep);
      const schema = moduleSchemaRes.data;
      console.log('Page Schema:->', schema);
      setReduxCurrentSchemaData(schema);
      _isMounted.current && setModuleSchema(schema);
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
    }
  };

  useEffect(() => {
    if (_isMounted.current) {
      initPageModule();
    }
  }, [location.pathname]);

  useEffect(() => {
    _isMounted.current = true;
    initPageModule();
    return () => {
      _isMounted.current = false;
    };
  }, []);

  if (loadingSchema) {
    return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  }
  if (!moduleSchema) return getErrorAlert({ onRetry: initPageModule });

  const { content_layout, html } = moduleSchema;

  if (content_layout?.type === 'standard' && html) {
    return (
      <FadeIn>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <WidgetViewer {...moduleSchema} />
      <PageBodyContent {...moduleSchema} />
    </FadeIn>
  );
}

export default PageComponent;

PageComponent.propTypes = {};
