import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, DatePicker, Input, Row, Col } from 'antd';
import { Button } from 'react-bootstrap';
// import { useParams } from 'react-router-dom';
import endpoint from '../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setPointMenuData } from 'redux/slices/currentDataSlice';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTableFooter from 'components/common/advance-table/AdvanceTableFooter';
const { Title, Text } = Typography;
const inputStyle = {
  borderRadius: '10px',
  width: '100%'
};

function SettingsSearch() {
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const [searchtext, setSearchtext] = useState('');
  const [memberLists, setMemberLists] = useState([]);
  const [columns, setColumns] = useState([]);
  const [resultsPerPage, SetresultsPerPage] = useState(999);
  const initPageModule = async () => {
    try {
      // default part
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getPointDataManagerSchemaEndpoint('search');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(setPointMenuData({ currentPointMenuSchema: schema.menu })); // store current point menu
      _isMounted.current && setLayoutData(layoutSchema);
      // end default part
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
  const row_select = row => {
    console.log('success', row);
    // navigate('/datamanager/bb_loyal2_members/view/' + row._id);
  };
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

      setColumns(tempArray);
    }
  }, [layoutData]);
  async () => {
    console.log('searchtext', searchtext);
    try {
      _isMounted.current && setLoadingSchema(true);

      const searchData = await Axios.get(
        endpoint.appUsers('/module/bb_loyal2_points/search/') +
          `?text_search=${searchtext}`
      );
      console.log(searchData.data, 'ppppp');
      setMemberLists(searchData.data);
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
      <Row className="mx-4 mb-4">
        <Col span={23}>
          <Title level={4} className="mb-3">
            Search points records
          </Title>
        </Col>
      </Row>
      <Row className="mx-4 mb-4">
        <Col span={23}>
          <Input
            placeholder="Free text search"
            style={inputStyle}
            onChange={e => {
              setSearchtext(e.target.value);
            }}
            value={searchtext}
          />
        </Col>
      </Row>
      <Row className="mx-4">
        <Col span={23}>
          <Input placeholder="Member" style={inputStyle} />
        </Col>
      </Row>
      <Row className="mx-4 mt-5" align="middle">
        <Col xs={24} md={24} lg={14} xl={9}>
          <Text className="text-label" strong>
            Transaction Date between
          </Text>
        </Col>
        <Col xs={10} md={7} lg={3} xl={4}>
          <DatePicker placeholder="from" style={inputStyle} />
        </Col>
        <Col xs={4} md={4} lg={2} xl={2} style={{ textAlign: 'center' }}>
          <Text strong className="text-label">
            and
          </Text>
        </Col>
        <Col xs={10} md={7} lg={3} xl={4}>
          <DatePicker placeholder="to" style={inputStyle} />
        </Col>
      </Row>
      <Row className="mx-4 mt-5" align="middle">
        <Col xs={24} md={24} lg={14} xl={9}>
          <Text className="text-label" strong>
            Date Added/Imported between
          </Text>
        </Col>
        <Col xs={10} md={7} lg={3} xl={4}>
          <DatePicker placeholder="from" style={inputStyle} />
        </Col>
        <Col xs={4} md={4} lg={2} xl={2} style={{ textAlign: 'center' }}>
          <Text strong className="text-label">
            and
          </Text>
        </Col>
        <Col xs={10} md={7} lg={3} xl={4}>
          <DatePicker placeholder="to" style={inputStyle} />
        </Col>
        <Col xs={24} md={6} lg={4} xl={4}>
          <Row>
            <Col span={24}>
              <Button
                variant="outline-primary"
                style={{ float: 'right' }}
                className="rounded-pill px-4 py-2"
              >
                Search
              </Button>
            </Col>
          </Row>
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
export default SettingsSearch;
