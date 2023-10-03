import Axios from 'axios';
import arrayMove from 'array-move';
import { Card } from 'react-bootstrap';
import { AiOutlineDrag } from 'react-icons/ai';
import React, { useState, useRef, useEffect } from 'react';
import {
  Spin,
  Col,
  Empty,
  message,
  Row,
  Tooltip,
  Checkbox,
  Button
} from 'antd';
import {
  sortableContainer,
  sortableElement,
  SortableHandle
} from 'react-sortable-hoc';

import vars from 'utils/vars';
import handleError from 'utils/handleError';
import { getPopupContainer, isEmpty } from 'helpers/utils';
import { SaveOutlined } from '@ant-design/icons';

const sortableContainerId = 'customize-fields-sortable-container';
const SortableContainer = sortableContainer(({ children }) => {
  return <div id={sortableContainerId}>{children}</div>;
});
const SortableItem = sortableElement(props => (
  <div>
    <SingleRow {...props} />
  </div>
));
export const DragHandle = SortableHandle(() => (
  <AiOutlineDrag
    size={24}
    color={vars.PRIMARY_COLOR}
    style={{ cursor: 'grab' }}
  />
));

function CustomizeFieldsUI({ finalEndpoint = '' }) {
  const _isMounted = useRef(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userSchema, setUserSchema] = useState(null);
  const [userSchemaFields, setUserSchemaFields] = useState([]);
  const [loadingUserSchema, setLoadingUserSchema] = useState(false);

  const ep = finalEndpoint.replace('/schemas/', '/user-schemas/');
  const _ep = finalEndpoint.replace('/schemas/', '/user-schemas-fields/');

  const getUserSchemaData = async () => {
    try {
      _isMounted.current && setLoadingUserSchema(true);

      const res = await Axios.get(ep);
      const schema = res.data;
      console.log('Data UserSchema:->', schema);
      _isMounted.current && setUserSchema(schema);

      const _res = await Axios.get(_ep);
      const schemaFieldsData = _res.data;
      console.log('UserData:->', schemaFieldsData);
      _isMounted.current && setUserSchemaFields(schemaFieldsData);
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingUserSchema(false);
    }
  };

  useEffect(() => {
    if (_isMounted.current && finalEndpoint) {
      getUserSchemaData();
    }
  }, [finalEndpoint]);

  useEffect(() => {
    _isMounted.current = true;
    finalEndpoint && getUserSchemaData();
    return () => {
      _isMounted.current = false;
    };
  }, []);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const update = arrayMove(userSchemaFields, oldIndex, newIndex);
    setUserSchemaFields(update);
    setDirty(true);
  };

  const handleSave = async () => {
    try {
      _isMounted.current && setSaving(true);

      const postData = { list: userSchemaFields };
      console.log('UserSchemaFields PostData:->', postData);
      const res = await Axios.patch(_ep, postData);
      const update = res.data;
      console.log('Updated UserSchemaFields Res:->', update);
      message.success('Saved successfully!');

      _isMounted.current && setDirty(false);
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setSaving(false);
    }
  };

  return (
    <>
      {loadingUserSchema && (
        <Row justify="center" className="my-3">
          <Spin />
        </Row>
      )}

      {!loadingUserSchema && !userSchema && isEmpty(userSchemaFields) && (
        <Empty />
      )}

      {!isEmpty(userSchemaFields) && (
        <>
          <SortableContainer
            axis="y"
            useDragHandle
            disabled={saving}
            onSortEnd={onSortEnd}
            helperClass="sortable-virtual-item"
            helperContainer={document.getElementById(sortableContainerId)}
          >
            {userSchemaFields.map((item, index) => {
              return (
                <SortableItem
                  item={item}
                  index={index}
                  sortIndex={index}
                  key={`item-${index}`}
                  order={index + 1}
                  isFirst={index === 0}
                  updateItem={(updates = {}) => {
                    setUserSchemaFields(prevData => {
                      return prevData.map(x => {
                        if (x.field === item.field) return { ...x, ...updates };
                        return x;
                      });
                    });
                    setDirty(true);
                  }}
                />
              );
            })}
          </SortableContainer>
        </>
      )}

      {dirty && (
        <Row justify="end" className="my-3">
          <Button
            type="primary"
            loading={saving}
            onClick={handleSave}
            icon={<SaveOutlined />}
          >
            Save
          </Button>
        </Row>
      )}
    </>
  );
}

export default CustomizeFieldsUI;

const centerClass = 'd-flex justify-content-center align-items-center';
const SingleRow = ({ isFirst, item, updateItem }) => {
  return (
    <Card className={`${isFirst ? '' : 'mt-2'}`}>
      <Card.Body className="py-3">
        <Row gutter={[16, 0]} wrap={false} align="middle">
          <Col className={centerClass}>
            <Tooltip
              title="Click and drag to reorder"
              placement="top"
              getPopupContainer={getPopupContainer}
            >
              <DragHandle />
            </Tooltip>
          </Col>
          <Col flex={1} className="fw-medium">
            {item.field_display}
          </Col>
          <Col className={centerClass}>
            <Checkbox
              checked={item.showYN}
              onChange={e => {
                const showYN = e.target.checked;
                updateItem({ showYN });
              }}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
