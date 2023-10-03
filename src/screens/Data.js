import Axios from 'axios';
import FadeIn from 'react-fade-in';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';

import endpoint from 'utils/endpoint';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import TopMenu from 'views/DataModule/TopMenu';
import DataModuleMainView from 'views/DataModule/Main';
import { setCurrentData } from 'redux/slices/currentDataSlice';
import {
  getErrorAlert,
  isEmpty,
  setReduxCurrentSchemaData
} from 'helpers/utils';

function DataComponent() {
  const location = useLocation();
  let { module_name, action, id } = useParams();
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  const [finalEndpoint, setFinalEndpoint] = useState('');
  const [moduleSchema, setModuleSchema] = useState(null);
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState(null);

  const initDataModule = async t => {
    try {
      _isMounted.current && setLoadingSchema(true);
      dispatch(setCurrentData({ currentModuleSchemaLoading: true }));
      const ep = endpoint.getDataModuleSchemaEndpoint(module_name, action, id);
      let finalEp = ep;
      if (t) {
        if (ep.includes('?')) {
          finalEp = `${ep}&template=${t?.name || ''}`;
        } else {
          finalEp = `${ep}?template=${t?.name || ''}`;
        }
      }
      let queryString = t ? '' : window.location.search;
      if (!isEmpty(queryString)) {
        if (finalEp.includes('?')) {
          finalEp += queryString.replace('?', '&');
        } else {
          finalEp += queryString;
        }
      }

      _isMounted.current && setFinalEndpoint(finalEp);
      const moduleSchemaRes = await Axios.get(finalEp);
      const schema = moduleSchemaRes.data;
      console.log('Data Schema:->', schema);
      setReduxCurrentSchemaData(schema);
      _isMounted.current && setModuleSchema(schema);
      let { template } = schema;
      if (!isEmpty(template.children)) {
        template = template.children[0];
      }
      _isMounted.current && setActiveTemplate(template);
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
    }
  };

  useEffect(() => {
    if (_isMounted.current) {
      initDataModule();
    }
  }, [location.pathname]);

  useEffect(() => {
    _isMounted.current = true;
    initDataModule();
    return () => {
      _isMounted.current = false;
    };
  }, []);

  if (loadingSchema) {
    return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  }
  if (!moduleSchema) return getErrorAlert({ onRetry: initDataModule });

  return (
    <>
      <TopMenu
        schema={moduleSchema}
        finalEndpoint={finalEndpoint}
        refetch={initDataModule}
      />

      <FadeIn>
        <DataModuleMainView
          key={moduleSchema.module}
          {...moduleSchema}
          refetch={initDataModule}
          finalEndpoint={finalEndpoint}
          activeTemplate={activeTemplate}
          setActiveTemplate={(newTemplate, isTemplateChanged = true) => {
            if (newTemplate?.dynamic_tabYN === true || isTemplateChanged) {
              return initDataModule(newTemplate);
            }
            setActiveTemplate(newTemplate);
          }}
        />
      </FadeIn>
    </>
  );
}

export default DataComponent;
