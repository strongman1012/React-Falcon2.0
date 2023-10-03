import Axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { Checkbox, Col, Empty, message, Modal, Row } from 'antd';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

import endpoint from 'utils/endpoint';
import handleError from 'utils/handleError';
import ModuleSettingsUI from './ModuleSettingsUI';
import LoaderOverlay from 'components/loading/Overlay';
import { getIcon, isEmpty, isProfileView, showConfirm } from 'helpers/utils';

function TopMenu({ schema, refetch }) {
  const location = useLocation();
  const navigate = useNavigate();
  const _isMounted = useRef(false);
  let { module_name } = useParams();
  const [columnsToDrop, setColumnsToDrop] = useState([]);
  const [dropColumnModal, setDropColumnModal] = useState(false);
  const [operationRunning, setOperationRunning] = useState(false);
  const [moduleSettingsList, setModuleSettingsList] = useState([]);
  const [moduleSettingsModal, setModuleSettingsModal] = useState(false);

  useEffect(() => {
    _isMounted.current = true;
    return () => {
      _isMounted.current = false;
    };
  }, []);

  if (!schema) return null;

  const fields = schema?.fields.filter(x => !x.hidden) || [];

  const getColumnDropWarning = fields => {
    const list = columnsToDrop;

    const labels = list
      .map(x => fields.find(y => y.field === x).label)
      .map(z => `'${z}'`);

    return `Are you sure? Column${list.length > 1 ? 's' : ''}: ${labels.join(
      ', '
    )} will be dropped.`;
  };

  const reload = (locally = false) => {
    if (locally) {
      refetch();
    } else {
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const handleDeleteAll = async () => {
    try {
      _isMounted.current && setOperationRunning(true);
      const postData = { data: { ids: ['all'] } };
      const ep = endpoint.getModuleDataEndpoint(module_name);
      const response = await Axios.delete(ep, postData);
      console.log('Delete All response:', response.data);
      message.success('Action successful!');
      reload();
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setOperationRunning(false);
    }
  };

  const handleDropColumn = async () => {
    if (isEmpty(columnsToDrop)) {
      return message.warning('Please select column.');
    }
    try {
      _isMounted.current && setOperationRunning(true);
      const ep = endpoint.getDropColumnEndpoint(module_name);
      const postData = { data: { columns: columnsToDrop } };
      const response = await Axios.delete(ep, postData);
      console.log('Drop Column response:', response.data);
      message.success('Action successful!');
      reload();
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setColumnsToDrop([]);
      _isMounted.current && setOperationRunning(false);
      _isMounted.current && setDropColumnModal(false);
    }
  };

  const handleDropTable = async () => {
    try {
      _isMounted.current && setOperationRunning(true);
      const ep = endpoint.getDropTableEndpoint(module_name);
      const response = await Axios.delete(ep);
      console.log('Drop Table response:', response.data);
      message.success('Action successful!');
      reload();
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setOperationRunning(false);
    }
  };

  const applyDefaultData = async () => {
    try {
      _isMounted.current && setOperationRunning(true);
      const ep = endpoint.getDefaultDataEndpoint(module_name);
      const response = await Axios.get(ep);
      console.log('Default data response:', response.data);
      message.success('Action successful!');
      reload();
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setOperationRunning(false);
    }
  };

  const getModuleSettings = async () => {
    try {
      _isMounted.current && setOperationRunning(true);
      const ep = endpoint.getModuleSettingsEndpoint(module_name);
      const response = await Axios.get(ep);
      console.log('Module settings response:', response.data);
      _isMounted.current && setModuleSettingsList(response.data?.list || []);
      _isMounted.current && setOperationRunning(false);
      _isMounted.current && setModuleSettingsModal(true);
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setOperationRunning(false);
    }
  };

  const { content_layout } = schema || {};
  const { show_menuYN, show_admin_menuYN, menu } = content_layout || {};

  const menuOptions = menu?.options || [];
  const isProfile = isProfileView();

  return (
    <>
      {operationRunning && <LoaderOverlay msg="Action in progress..." />}
      <Row justify="end" className="mb-3">
        <Col>
          <Row gutter={[12, 10]}>
            {show_menuYN ? (
              <>
                {menuOptions.map((x, index) => {
                  const {
                    button_css_class,
                    link,
                    name,
                    hide_if_link_matches_routeYN
                  } = x;
                  if (
                    hide_if_link_matches_routeYN &&
                    location.pathname.includes(link)
                  ) {
                    return null;
                  }
                  return (
                    <Col key={index}>
                      <Button
                        className={button_css_class || ''}
                        variant="falcon-default"
                        size="sm"
                        transform="shrink-3"
                        onClick={e => {
                          e.preventDefault();
                          navigate(link);
                        }}
                      >
                        {getIcon(x, '#000')}
                        {name}
                      </Button>
                    </Col>
                  );
                })}
              </>
            ) : null}

            {!isProfile && show_admin_menuYN && schema.module_admin === true && (
              <Col>
                <DropdownButton as={ButtonGroup} size="sm" title="Module Admin">
                  <Dropdown.Item
                    onClick={() =>
                      showConfirm(
                        handleDeleteAll,
                        'Are you sure you want to Delete All?'
                      )
                    }
                  >
                    Delete All
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setDropColumnModal(true)}>
                    Drop Column
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      showConfirm(
                        handleDropTable,
                        'Are you sure about "Drop Table"?'
                      )
                    }
                  >
                    Drop Table
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => applyDefaultData()}>
                    Apply Default Data
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => getModuleSettings()}>
                    Module Settings
                  </Dropdown.Item>
                </DropdownButton>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
      <Modal
        destroyOnClose
        title="Select columns to drop"
        visible={dropColumnModal}
        onOk={() => showConfirm(handleDropColumn, getColumnDropWarning(fields))}
        onCancel={() => {
          setDropColumnModal(false);
          setColumnsToDrop([]);
        }}
        okButtonProps={{
          disabled: isEmpty(columnsToDrop),
          loading: operationRunning
        }}
        okText="Drop selected"
      >
        <Checkbox.Group
          style={{ width: '100%' }}
          value={columnsToDrop}
          onChange={columnsToDrop => setColumnsToDrop(columnsToDrop)}
        >
          <Row gutter={[10, 10]}>
            {fields.map(x => (
              <Col span={12} key={x.field}>
                <Checkbox value={x.field}>{x.label}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Modal>

      <Modal
        destroyOnClose
        title="Module Settings"
        visible={moduleSettingsModal}
        cancelText="Close"
        onCancel={() => setModuleSettingsModal(false)}
        okButtonProps={{ style: { display: 'none' } }}
        style={{ top: 40 }}
        bodyStyle={{ height: '80vh', overflow: 'scroll' }}
      >
        {isEmpty(moduleSettingsList) ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>No module settings found!</span>}
          />
        ) : (
          <ModuleSettingsUI
            data={moduleSettingsList}
            module_name={module_name}
            onModuleSettingItemUpdate={update => {
              setModuleSettingsList(prevData => {
                return prevData.map(x => {
                  if (x.name === update.name) {
                    return { ...x, ...update };
                  }
                  return x;
                });
              });
            }}
          />
        )}
      </Modal>
    </>
  );
}

export default TopMenu;
