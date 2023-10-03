import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { InputNumber, DatePicker, Typography, Row, Col, Input } from 'antd';
// import { useParams, useNavigate } from 'react-router-dom';

import endpoint from '../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { Button, Form } from 'react-bootstrap';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTableFooter from 'components/common/advance-table/AdvanceTableFooter';
// import ActionButton from 'components/common/ActionButton';
// import { ExclamationCircleFilled } from '@ant-design/icons';
// const { confirm } = Modal;

const { Title, Text } = Typography;
const inputStyle = {
  borderRadius: '10px',
  width: '100%'
};
function SearchMember() {
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const [memberLists, setMemeberLists] = useState([]);
  const [columns, setColumns] = useState([]);
  const [resultsPerPage, SetresultsPerPage] = useState(999);
  const [searchtext, setSearchtext] = useState('');
  const [groups, setGroups] = useState([]);
  // const IndeterminateCheckbox = React.forwardRef(
  //   ({ indeterminate, ...rest }, ref) => {
  //     const defaultRef = React.useRef();
  //     const resolvedRef = ref || defaultRef;
  //     React.useEffect(() => {
  //       resolvedRef.current.indeterminate = indeterminate;
  //     }, [resolvedRef, indeterminate]);

  //     return (
  //       <Form.Check
  //         type="checkbox"
  //         className="form-check fs-0 mb-0 d-flex align-items-center"
  //       >
  //         <Form.Check.Input type="checkbox" ref={resolvedRef} {...rest} />
  //       </Form.Check>
  //     );
  //   }
  // );
  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataManagerSchemaEndpoint('search');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(setMemberMenuData({ currentMemberMenuSchema: schema.menu })); // store current member menu
      const groupList = await Axios.get(
        endpoint.getModuleDataEndpoint('bb_loyal2_groups')
      );
      setGroups(groupList.data.list);
      _isMounted.current && setLayoutData(layoutSchema);
      // const memberRes = await Axios.get(
      //   endpoint.appUsers('/app/users/') + `?user_type=3`
      // );
      // setMemeberLists(memberRes.data);
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
    }
  };

  useEffect(() => {
    _isMounted.current = true;
    initPageModule();
    return () => {
      _isMounted.current = false;
    };
  }, []);

  // const editRow = row => {
  //   navigate('/datamanager/bb_loyal2_members/edit/' + row._id);
  // };
  // const deleteRow = () => {
  //   showDeleteConfirm();
  // };
  // const AllChange = row => {
  //   console.log('checkbox_alldddd', row);
  // };

  // const onChange = row => {
  //   console.log('check_box_click', row); // isSelected: true, false
  // };

  const row_select = row => {
    console.log('success', row);
    // navigate('/datamanager/bb_loyal2_members/view/' + row._id);
  };
  // const showDeleteConfirm = () => {
  //   confirm({
  //     title: 'Delete selected items?',
  //     icon: <ExclamationCircleFilled />,
  //     content: '',
  //     okText: 'Yes',
  //     okType: 'danger',
  //     cancelText: 'No',
  //     onOk() {
  //       console.log('OK');
  //     },
  //     onCancel() {
  //       console.log('Cancel');
  //     }
  //   });
  // };
  useEffect(() => {
    console.log(layoutData, 'this is layoutdata------');
    if (layoutData) {
      // console.log(layoutData.options.columns);
      let objectData = layoutData.post_results.options.columns;
      SetresultsPerPage(
        layoutData.post_results.options.pagination.results_per_page
          ? layoutData.post_results.options.pagination.results_per_page
          : 999
      );
      let tempArray = [
        {
          accessor: 'row',
          Header: 'Row',
          Cell: rowData => {
            return <>{rowData.row.index + 1}</>;
          }
        }
      ];
      for (const key in objectData) {
        let tempElement = {};
        tempElement.accessor = key;
        tempElement.Header = objectData[key];
        tempElement.Cell = function (rowData) {
          //  const { code } = rowData.row.original;
          const value = rowData.row.original[key];
          const divTag = (
            <div
              onClick={() => {
                row_select(rowData.row.original);
              }}
              style={{ cursor: 'pointer' }}
            >
              {value}
            </div>
          );
          return divTag;
        };
        tempArray.push(tempElement);
      }
      // let editBtn = {
      //   id: 'Edit',
      //   Header: (
      //     <>
      //       <ActionButton
      //         icon="trash-alt"
      //         onClick={() => deleteRow()}
      //         title="Delete"
      //         variant="action"
      //         className="p-0 me-2"
      //       />
      //     </>
      //   ),
      //   // headerProps: {
      //   //   style: {
      //   //     maxWidth: 10
      //   //   }
      //   // },
      //   // cellProps: {
      //   //   style: {
      //   //     maxWidth: 10
      //   //   }
      //   // },
      //   Cell: rowData => {
      //     return (
      //       <>
      //         <ActionButton
      //           icon="edit"
      //           title="Edit"
      //           onClick={() => editRow(rowData.row.original)}
      //           variant="action"
      //           className="p-0 me-2"
      //         />
      //       </>
      //     );
      //   }
      // };
      // tempArray.push(editBtn);

      // let checkBtn = {
      //   id: 'selection',
      //   Header: ({ getToggleAllRowsSelectedProps }) => (
      //     <IndeterminateCheckbox
      //       {...getToggleAllRowsSelectedProps()}
      //       onClick={getToggleAllRowsSelectedProps =>
      //         AllChange(getToggleAllRowsSelectedProps)
      //       }
      //     />
      //   ),
      //   Cell: ({ row }) => (
      //     <div>
      //       <IndeterminateCheckbox
      //         {...row.getToggleRowSelectedProps()}
      //         onClick={() => onChange(row)}
      //       />
      //     </div>
      //   )
      // };
      // tempArray.push(checkBtn);
      setColumns(tempArray);
    }
  }, [layoutData]);

  const search = async () => {
    console.log('searchtext', searchtext);
    try {
      _isMounted.current && setLoadingSchema(true);

      const searchData = await Axios.get(
        endpoint.appUsers('/app/users/') +
          `?user_type=3&text_search=${searchtext}`
      );
      console.log(searchData.data);
      setMemeberLists(searchData.data);
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
    }
  };

  if (loadingSchema) {
    return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  }
  if (!layoutData) return getErrorAlert({ onRetry: initPageModule });

  return (
    <>
      <Row className="mb-4 mx-4">
        <Col lg={23} xl={23}>
          <Title level={4}>Search Members</Title>
        </Col>
      </Row>
      <Row className="my-5 mx-4">
        <Col lg={24} xl={22}>
          <Input
            placeholder="Free text search"
            onChange={e => {
              setSearchtext(e.target.value);
            }}
            value={searchtext}
            style={inputStyle}
          />
        </Col>
      </Row>
      <Row className="mb-5 mx-4" align="middle">
        <Col lg={13} xl={12}>
          <Row align="middle">
            <Col span={12}>
              <Text strong className="text-label">
                Points balance between
              </Text>
            </Col>
            <Col span={4}>
              <InputNumber
                min={1}
                max={1000}
                defaultValue={1}
                style={inputStyle}
              />
            </Col>
            <Col span={4} style={{ textAlign: 'center' }}>
              <Text className="text-label" strong>
                and
              </Text>
            </Col>
            <Col span={4}>
              <InputNumber
                min={1}
                max={1000}
                defaultValue={1}
                style={inputStyle}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={10} xl={10}>
          <Row align="middle" gutter={[16, 16]}>
            <Col span={12} style={{ textAlign: 'end' }}>
              <Text strong className="text-label">
                Group
              </Text>
            </Col>
            <Col span={12}>
              <Form.Select
                defaultValue="select"
                placeholder="Select"
                style={{ borderRadius: '10px' }}
              >
                <option value={null}></option>
                {groups.map((row, index) => {
                  return (
                    <option key={index} value={row._id}>
                      {row.name}
                    </option>
                  );
                })}
              </Form.Select>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mb-5 mx-4" align="middle">
        <Col lg={13} xl={12}>
          <Row align="middle">
            <Col span={6}>
              <Text strong className="text-label">
                Activity
              </Text>
            </Col>
            <Col span={6}>
              <Form.Select
                defaultValue="select"
                placeholder="Select"
                style={{ borderRadius: '10px' }}
              >
                <option value="1">Activity</option>
                <option value="0">Inactive</option>
              </Form.Select>
            </Col>
            <Col span={6} style={{ textAlign: 'center' }}>
              <Text strong className="text-label">
                Since
              </Text>
            </Col>
            <Col span={6}>
              <DatePicker style={inputStyle} />
            </Col>
          </Row>
        </Col>
        <Col lg={10} xl={10} style={{ textAlign: 'end' }}>
          <Button
            variant="outline-primary"
            className="rounded-pill py-2 px-4"
            // style={{ padding: '8px 22px' }}
            onClick={() => search()}
          >
            Search
          </Button>
        </Col>
      </Row>

      {memberLists.length > 0 && (
        <AdvanceTableWrapper
          columns={columns}
          data={memberLists}
          sortable
          // pagination
          // selection
          perPage={resultsPerPage}
        >
          <AdvanceTable
            table
            headerClassName="bg-200 text-900 text-nowrap align-middle"
            rowClassName="align-middle white-space-nowrap"
            tableProps={{
              bordered: true,
              striped: true,
              className: 'fs--1 mb-0 overflow-hidden'
            }}
          />
          <div className="mt-3">
            <AdvanceTableFooter
              rowCount={memberLists.length}
              table
              rowInfo
              navButtons
              // rowsPerPageSelection
            />
          </div>
        </AdvanceTableWrapper>
      )}
    </>
  );
}
export default SearchMember;
