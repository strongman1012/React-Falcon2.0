import he from 'he';
import React from 'react';
import { CgEye } from 'react-icons/cg';
import BraftEditor from 'braft-editor';
import styled from 'styled-components';
import { htmlToText } from 'html-to-text';
import { MdSwapVert } from 'react-icons/md';
import { FaRegEdit, FaUserCircle } from 'react-icons/fa';
import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from 'react-sortable-hoc';
import {
  CalendarOutlined,
  CaretDownFilled,
  FileDoneOutlined,
  InfoCircleOutlined,
  LeftCircleOutlined,
  SearchOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import {
  Row,
  Col,
  Spin,
  Button,
  Popover,
  Tooltip,
  Avatar,
  Typography
} from 'antd';

import vars from 'utils/vars';
import Image from 'components/custom/Image';
import PluginTable from './FormBuilder/PluginTable';
import TabElement from 'components/custom/TabElement';
import { getPopupContainer, isEmpty, isScript, truncate } from 'helpers/utils';

export const PrefixListIcon = styled(UnorderedListOutlined)`
  padding: 10px;
  border: 1px solid #d9d9d9;
  border-right: none;
  border-bottom-left-radius: 0.25rem;
  border-top-left-radius: 0.25rem !important;
  background: #fff;
  color: ${vars.PRIMARY_COLOR};
`;

export const PrefixCalendarIcon = styled(CalendarOutlined)`
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-right: none;
  border-bottom-left-radius: 0.25rem;
  border-top-left-radius: 0.25rem !important;
  background: #fff;
  color: ${vars.PRIMARY_COLOR};
  svg {
    opacity: 0.7;
  }
`;

export const PrefixSearchIcon = styled(SearchOutlined)`
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-right: none;
  border-bottom-left-radius: 0.25rem;
  border-top-left-radius: 0.25rem !important;
  background: #fff;
  color: ${vars.PRIMARY_COLOR};
  svg {
    opacity: 0.7;
  }
`;

export const SuffixCaretIcon = styled(CaretDownFilled)`
  padding: 5px;
  padding-top: 7px;
  border: 1px solid #d9d9d9;
  border-left: none;
  border-bottom-right-radius: 0.25rem;
  border-top-right-radius: 0.25rem !important;
  background: #fff;
`;

export const CustomRow = styled(Row)`
  cursor: ${props => (props.isLoading ? 'progress' : 'auto')};
  pointer-events: ${props => (props.isLoading ? 'none' : 'auto')};
  opacity: ${props => (props.isLoading ? 0.5 : 1)};
`;

export const DragHandle = sortableHandle(() => (
  <MdSwapVert
    size={25}
    color="#d9d9d9"
    style={{ cursor: 'pointer' }}
    title="Click and drag to reorder"
  />
));
export const SortableItem = sortableElement(props => <tr {...props} />);
export const SortableContainer = sortableContainer(props => (
  <tbody {...props} />
));

export const loadableOptions = {
  fallback: (
    <Row justify="center" className="w-100 my-5">
      <Col>
        <Row justify="center">
          <Spin className="mb-2" />
        </Row>
        <b>Loading Component...</b>
      </Col>
    </Row>
  )
};

const getDisplayValueForMultiFileType = ({ value, originIsTable }) => {
  return (
    <Row gutter={[10, 0]}>
      {value.map((image, i) => {
        const { uri, thumbnail, type = '', deleted, filename } = image;
        const isImage = type.includes('image');

        const _val = isImage ? (
          <Col key={i}>
            <Image
              width="70px"
              preview={true}
              url={uri || thumbnail}
              style={{ width: 70, height: 40 }}
            />
          </Col>
        ) : (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={uri}
            onClick={e => e.stopPropagation()}
          >
            <FileDoneOutlined
              style={{
                fontSize: originIsTable ? 20 : 30,
                margin: originIsTable ? 0 : 5
              }}
            />
          </a>
        );

        if (deleted) {
          return (
            <Tooltip
              title={filename + ` (Deleted)`}
              getPopupContainer={getPopupContainer}
            >
              <span style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                <span style={{ pointerEvents: 'none' }}>{_val}</span>
              </span>
            </Tooltip>
          );
        } else {
          return _val;
        }
      })}
    </Row>
  );
};

const getDisplayValueForFileType = ({
  value,
  label,
  originIsTable,
  isProfilePage
}) => {
  const { uri, thumbnail, type = '', deleted, filename } = value || {};
  const isImage = type?.includes('image');

  if (isImage) {
    if (isProfilePage) {
      value = (
        <Avatar
          src={uri || thumbnail}
          size={100}
          className="mt-1 app-box-shadow"
        />
      );
    } else if (label === 'Profile Picture') {
      value = (
        <Avatar
          src={uri || thumbnail}
          size={originIsTable ? 35 : 40}
          className={originIsTable ? 'app-box-shadow' : 'mt-1 app-box-shadow'}
        />
      );
    } else {
      value = (
        <Image
          width="70px"
          preview={true}
          url={uri || thumbnail}
          style={{ marginTop: 3, width: 70, height: 40 }}
          placeholderProps={{ width: 70, height: 40 }}
          onClick={e => e.stopPropagation()}
          hoverable={false}
        />
      );
    }
  } else {
    if (!uri) {
      value = null;
    } else {
      value = (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={uri}
          onClick={e => e.stopPropagation()}
        >
          <FileDoneOutlined
            style={{
              fontSize: originIsTable ? 20 : 30,
              margin: originIsTable ? 0 : 5
            }}
          />
        </a>
      );
    }
  }

  if (deleted) {
    value = (
      <Tooltip
        title={filename + ` (Deleted)`}
        getPopupContainer={getPopupContainer}
      >
        <span style={{ opacity: 0.5, cursor: 'not-allowed' }}>
          <span style={{ pointerEvents: 'none' }}>{value}</span>
        </span>
      </Tooltip>
    );
  }

  return value;
};

const noData = <span style={{ color: 'silver' }}>No data</span>;
export const getReadableValue = (
  record,
  column,
  manipulate = false,
  manipulateValue = '',
  others
) => {
  const {
    originIsTable = false,
    refreshView,
    truncateValue = false,
    truncateLength = 35,
    idFieldKey
  } = others || {};
  const _noData = originIsTable ? '' : noData;
  const { field, type, label } = column;
  const fieldName = `${field}_display`;
  let value = record.hasOwnProperty(fieldName)
    ? record[fieldName]
    : record[field];
  // console.log({ label, value })
  const isProfilePage = window.location.pathname.includes('/profile');
  if (type === 'plugin_table') {
    value = (
      <PluginTable
        initValue={value}
        idFieldKey={idFieldKey}
        record={record}
        fieldData={column}
        refreshView={refreshView}
        __othersData={others || {}}
      />
    );
  } else if (type === 'password') {
    return '***************';
  } else if (value === null || value === undefined || value === '') {
    if (manipulate) {
      value = manipulateValue;
    } else if (isProfilePage && field === 'imageFILE') {
      value = <FaUserCircle size={50} color="silver" className="mt-1" />;
    } else {
      value = _noData;
    }
  } else if (type === 'textarea-rich') {
    const HTML = value;
    const containScript = isScript(HTML);

    value =
      isEmpty(HTML) || value === '<p></p>' || value === '<p></p> <p></p>' ? (
        _noData
      ) : (
        <Popover
          title="Preview"
          content={
            containScript ? (
              <p style={{ color: 'tomato', fontWeight: 'bold' }}>
                Quick view is unavailable as it's contain JavaScript.
              </p>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: HTML }} />
            )
          }
          getPopupContainer={getPopupContainer}
        >
          <Button
            type="link"
            className="p-0 m-0"
            style={{
              fontSize: 13,
              border: 0,
              fontWeight: '600',
              height: 'max-content'
            }}
            disabled={containScript}
          >
            Preview
          </Button>
        </Popover>
      );
  } else if (type === 'file') {
    value = getDisplayValueForFileType({
      value,
      label,
      originIsTable,
      isProfilePage
    });
  } else if (type === 'files') {
    value = getDisplayValueForMultiFileType({
      value: isEmpty(value) ? [] : value,
      label,
      originIsTable,
      isProfilePage
    });
  } else if (Array.isArray(value)) {
    // If value is Array
    if (value.every(val => typeof val === 'string')) {
      value = value.join(', ');
    } else {
      value = 'Only can handle array of string type value!';
    }
  } else if (typeof value === 'object') {
    // If value is Object
    value = "Don't know how to handle object!";
  }

  if (typeof value === 'string') {
    value = he.decode(value);
    if (truncateValue) {
      value = truncate(value, truncateLength, true, label);
    }
  }

  return value;
};

const actionColProps = {
  key: 'action',
  align: 'center',
  field: 'action',
  dataIndex: 'action',
  title: 'Action',
  fixed: 'right',
  width: 120,
  editable: false,
  className: 'app-table-action'
};

const nonInlineEditableTypes = ['files'];
const centerAlignFields = [];

export function generateColumnDefs(
  fields = [],
  actionCol = true,
  sortableYN = false,
  isAllEditable = true,
  truncateValue = false,
  truncateLength = 35
) {
  let actionColCount = 0;
  const visibleFields = fields.filter(x => !x.hidden);

  const columns = visibleFields.map(col => {
    const { label = '', label_hidden, field, cols, type } = col;

    if (field === 'action') {
      actionColCount++;
      return actionColProps;
    }

    const column = {
      ...col,
      title: label_hidden ? '' : label,
      dataIndex: field,
      key: field,
      editable: nonInlineEditableTypes.includes(type)
        ? false
        : sortableYN
        ? false
        : isAllEditable, // By default all editable then 'readonly' case handled inside editable cell
      render: (text, record) =>
        getReadableValue(record, col, false, '', {
          originIsTable: true,
          truncateValue,
          truncateLength
        }),
      className: field === 'name' ? 'app-highlight' : ''
    };

    if (type === 'number') {
      column.align = 'right';
      if (label === '#') {
        column.width = 42;
      }
    }

    if (cols) {
      column.colSpan = cols;
    }
    if (centerAlignFields.includes(field)) {
      column.align = 'center';
    }
    return column;
  });
  if (sortableYN) {
    columns.unshift({
      title: <MdSwapVert size={25} color="#d9d9d9" />,
      dataIndex: 'sort',
      width: 30,
      align: 'center',
      className: 'drag-visible',
      render: () => <DragHandle />
    });
  }

  if (actionCol && actionColCount === 0) {
    columns.push(actionColProps);
  }

  // setTimeout(setUpTableHeaderDragToScroll, 1000)

  return columns;
}

export const getCSVData = (tableData, columnDefs) => {
  const columns = columnDefs.filter(x => x.field !== 'action');
  const csvHeader = columns.map(x => x.label);
  const csvBody = tableData.map(dataItem => {
    const array = [];
    columns.forEach(col => {
      const key = col.field;
      const fieldName = `${key}_display`;
      const val = dataItem.hasOwnProperty(fieldName)
        ? dataItem[fieldName]
        : dataItem[key];
      let value = val ?? '';
      if (value) {
        if (col.type === 'text' || col.type === 'textarea') {
          value = he.decode(value);
        }

        if (typeof value === 'string') {
          value = value.split('&pound;').join('');
          value = value.split('&euro;').join('');
        }
        // Same logic is in getDifferentCSVData()
        if (key === 'mobile') {
          value += `\t`; // For Excel to treat as a mobile number
        }

        if (typeof value === 'object') {
          value = JSON.stringify(value);
        }
      }
      array.push(value);
    });
    return array;
  });

  return [csvHeader, ...csvBody];
};

export const getDataSlice = (
  data = [],
  paginationCurrentPage = 1,
  paginationPageSize = 10
) => {
  const start =
    paginationCurrentPage === 1
      ? 0
      : (paginationCurrentPage - 1) * paginationPageSize;
  const end = start + paginationPageSize;
  // console.log(start, end)
  return data.slice(start, end);
};

export const renderTabElement = ({
  isTabView = true,
  available_templates = [],
  activeTemplate,
  onTemplateSelect
}) => {
  return (
    <>
      <TabElement
        isTabView={isTabView}
        available_templates={available_templates}
        activeTemplate={activeTemplate}
        onSelect={onTemplateSelect}
      />

      {available_templates.map(template => {
        if (isEmpty(template.children)) return null;
        if (
          template.id === activeTemplate.id ||
          template.id === activeTemplate.parentISbb_apps_modules_templatesID
        ) {
          return (
            <TabElement
              key={template.id}
              isChild={true}
              isTabView={template?.tabYN === true}
              available_templates={template.children}
              activeTemplate={activeTemplate}
              onSelect={onTemplateSelect}
            />
          );
        } else return null;
      })}
    </>
  );
};

export const isNewFileSelected = file =>
  file &&
  typeof file === 'object' &&
  (!file.hasOwnProperty('thumbnail') || !file.hasOwnProperty('uri'));

export const getFileObjForAjax = (file, data) => {
  const type = file.type;
  return {
    name: file.name,
    size: file.size,
    type,
    data: data.replace(`data:${type};base64,`, '')
  };
};

export const createBraftEditorState = (htmlString = null) => {
  return BraftEditor.createEditorState(htmlString);
};

export const sanitizeApiVal = val => {
  if (val === '0' || val === 0) return 0;
  return he.decode(htmlToText(val, { wordwrap: 130 }));
};

export function makeRegexFromLiteralNotationString(str) {
  const [, patternContent, flags] = str.match(/^\/(.+)\/([a-zA-Z]*)$/);
  return new RegExp(patternContent, flags);
}

// Provide the parent class name
export const removeAttribute = (
  className = 'ant-form-item-label',
  attr = 'title'
) => {
  const labels = document.getElementsByClassName(className);
  for (var i = 0; i < labels.length; i++) {
    const label = labels[i]?.children?.[0];
    label && label.removeAttribute(attr);
  }
};

export const previewHTML = HTML => {
  if (window.previewWindow) {
    window.previewWindow.close();
  }

  window.previewWindow = window.open();
  if (window.previewWindow?.document) {
    window.previewWindow.document.write(buildPreviewHtml(HTML));
    window.previewWindow.document.close();
  }
};

const buildPreviewHtml = (HTML = '') => {
  // console.log(HTML)
  return `
		<!Doctype html>
		<html>
			<head>
				<title>Preview Content</title>
				<style>
					html,body{
						height: 100%;
						margin: 0;
						padding: 0;
						overflow: auto;
						background-color: #f1f2f3;
					}
					.container{
						box-sizing: border-box;
						width: 1000px;
						max-width: 100%;
						min-height: 100%;
						margin: 0 auto;
						padding: 30px 20px;
						overflow: hidden;
						background-color: #fff;
						border-right: solid 1px #eee;
						border-left: solid 1px #eee;
					}
					.container img,
					.container audio,
					.container video{
						max-width: 100%;
						height: auto;
					}
					.container p{
						white-space: pre-wrap;
						min-height: 1em;
					}
					.container pre{
						padding: 15px;
						background-color: #f1f1f1;
						border-radius: 5px;
					}
					.container blockquote{
						margin: 0;
						padding: 15px;
						background-color: #f1f1f1;
						border-left: 3px solid #d1d1d1;
					}
				</style>
			</head>
			<body>
				<div class="container">${HTML}</div>
			</body>
		</html>
	`;
};

const firstSectionTitleList = [];
const noHrAfterTitleList = [];
export const getGridUtils = (
  columnData,
  maxColumns,
  columns,
  itemIndex,
  others = {}
) => {
  const {
    navigate,
    backBtn = false,
    needExtraPadding,
    gridStyles = {}
  } = others;
  // console.log(gridStyles)
  const {
    separatorAfterStyles = {},
    separatorBeforeStyles = {},
    sectionHeaderContainerStyles = {},
    sectionTitleBeforeElClass = '',
    subTitleStyles = {}
  } = gridStyles;

  const {
    field,
    col_position,
    newline_before_field,
    newline_after_field,
    separator_before_field,
    separator_after_field,
    section_title,
    section_sub_title,
    header_title,
    header_tooltip
  } = columnData;
  const isProfilePage = window.location.pathname.includes('/profile');
  const prevColumn = itemIndex === 0 ? null : columns[itemIndex - 1];
  // console.log({ field, col_position, newline_after_field, separator_after_field })
  let BEFORE_ELEMENT = null,
    AFTER_ELEMENT = null,
    SECTION_ELEMENT = null;
  const perSpan = 24 / maxColumns;
  const separatorStyles = { borderTop: '2px solid silver', margin: '10px 0' };

  if (noHrAfterTitleList.includes(section_title)) {
    separatorStyles.borderTop = '';
  }

  if (col_position !== null) {
    if (maxColumns === col_position) {
      AFTER_ELEMENT = null;
      BEFORE_ELEMENT = <Col xs={24} sm={(maxColumns - 1) * perSpan} />;
    } else if (col_position === 1) {
      BEFORE_ELEMENT =
        prevColumn?.col_position === null ? <Col flex={1} /> : null;
      AFTER_ELEMENT = <Col xs={24} sm={(maxColumns - 1) * perSpan} />;
    } else if (col_position === 2) {
      BEFORE_ELEMENT = <Col xs={24} sm={perSpan} />;
      AFTER_ELEMENT = null;
    } else {
      BEFORE_ELEMENT = <Col xs={24} sm={(col_position - 1) * perSpan} />;
      AFTER_ELEMENT = (
        <Col xs={24} sm={(maxColumns - col_position) * perSpan} />
      );
    }
  }

  if (section_title) {
    let className = 'w-100 m-0 mb-1';
    let sectionTitleBeforeEl = (
      <Col span={24} className={sectionTitleBeforeElClass} />
    );
    let sectionTitleAfterEl = <Col span={24} />;

    if (needExtraPadding) {
      className = 'w-100 m-0 mb-1 mt-3';
      sectionTitleBeforeEl =
        firstSectionTitleList.includes(section_title) ||
        field === 'name' ? null : (
          <Col
            span={24}
            style={{ minHeight: 30, background: '#EBEDEF', marginTop: 15 }}
          />
        );
    }

    const getSectionTitleClassName = () => {
      if (isProfilePage) {
        if (section_title === 'Your Details') {
          return 'm-0';
        } else {
          return 'm-0 mt-3';
        }
      } else if (section_sub_title) {
        return '';
      } else {
        return 'm-0';
      }
    };

    const SECTION_TITLE_ELEMENT = (
      <h4
        style={{ padding: '0 12px', color: '#176b74' }}
        className={getSectionTitleClassName()}
        id={
          section_title === 'Raffle'
            ? 'event-raffle-section-title'
            : 'section-title'
        }
      >
        {section_title}
      </h4>
    );

    SECTION_ELEMENT = (
      <>
        {sectionTitleBeforeEl}
        <div className={className} style={{ ...sectionHeaderContainerStyles }}>
          <Row justify="space-between">
            {navigate && backBtn ? (
              <Row align="middle">
                <Button
                  className="app-color"
                  onClick={() => navigate(-1)}
                  icon={<LeftCircleOutlined />}
                  style={{ marginLeft: 12 }}
                >
                  Back
                </Button>

                {SECTION_TITLE_ELEMENT}
              </Row>
            ) : (
              SECTION_TITLE_ELEMENT
            )}
          </Row>
          {section_sub_title && (
            <>
              <Col span={24} />
              <h6
                className="m-0"
                style={{ paddingLeft: 33, ...subTitleStyles }}
                dangerouslySetInnerHTML={{ __html: section_sub_title }}
              />
            </>
          )}
        </div>
        <Col span={24} key={field + '_hr_el'}>
          <div style={{ ...separatorStyles, marginBottom: 15 }} />
        </Col>
        {sectionTitleAfterEl}
      </>
    );
  }

  const SEPARATOR_ELEMENTS_BEFORE = [];
  const SEPARATOR_ELEMENTS_AFTER = [];

  if (newline_before_field === true) {
    SEPARATOR_ELEMENTS_BEFORE.push(<Col span={24} key={field + '_br_el'} />);
  }
  if (newline_after_field === true) {
    SEPARATOR_ELEMENTS_AFTER.push(<Col span={24} key={field + '_br_el'} />);
  }

  if (separator_before_field === true) {
    SEPARATOR_ELEMENTS_BEFORE.push(
      <Col span={24} key={field + '_hr_el'}>
        <div style={{ ...separatorStyles, ...separatorBeforeStyles }} />
      </Col>
    );
  }
  if (separator_after_field === true) {
    SEPARATOR_ELEMENTS_AFTER.push(
      <Col span={24} key={field + '_hr_el'}>
        <div style={{ ...separatorStyles, ...separatorAfterStyles }} />
      </Col>
    );
  }

  if (header_title) {
    let headerTooltip = null;
    if (header_tooltip) {
      headerTooltip = (
        <Tooltip title={header_tooltip} placement="right">
          <InfoCircleOutlined className="ms-1" />
        </Tooltip>
      );
    }

    let headerTitleClassName = 'p-0 mb-1 d-flex align-items-center ';

    const headerTitle = (
      <h6 className={headerTitleClassName}>
        <span>{header_title}</span> {headerTooltip}
      </h6>
    );

    BEFORE_ELEMENT = (
      <>
        {BEFORE_ELEMENT}
        <Col span={24} />
        <Col span={24}>{headerTitle}</Col>
      </>
    );
  }

  return {
    SECTION_ELEMENT,
    SEPARATOR_ELEMENTS_BEFORE,
    SEPARATOR_ELEMENTS_AFTER,
    BEFORE_ELEMENT,
    AFTER_ELEMENT
  };
};

export const Btn = props => {
  return (
    <Button type={props.type || 'default'} {...props}>
      {props.label || 'Button'}
    </Button>
  );
};

export const EditButton = props => {
  const editIcon = <FaRegEdit style={{ marginRight: 5, marginTop: -3 }} />;
  const viewIcon = <CgEye style={{ marginRight: 5, marginTop: -3 }} />;

  return (
    <Button
      type="default"
      icon={props.editing === 'true' ? viewIcon : editIcon}
      {...props}
    >
      {props.label || 'Edit'}
    </Button>
  );
};
export const ListItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;
export const ItemsList = styled(ListItem)``;
export const FieldTitle = styled.span`
  color: #768192 !important;
`;
export const TheFieldValue = styled.span`
  font-weight: 600;
  color: black;
`;
export const FieldValueWithEllipsis = styled(Typography.Paragraph)`
  font-weight: 600;
  color: black;
  /* white-space: pre-wrap; */
`;
export const FieldValue = ({ children, rows }) => {
  const [expanded, setExpanded] = React.useState(false);
  // console.log(children, rows)
  if (expanded === null) return null;
  return typeof children === 'string' ? (
    <FieldValueWithEllipsis
      ellipsis={{
        rows: rows || 5,
        expandable: true,
        symbol: '(view)',
        onExpand: e => {
          e.stopPropagation();
          setExpanded(!expanded);
        }
      }}
      className="mb-0"
    >
      {he.decode(htmlToText(children || '', { wordwrap: 130 }))}
      {expanded && (
        <span
          className="ant-typography-expand m-0"
          onClick={() => {
            setExpanded(null);
            setTimeout(() => setExpanded(!expanded), 10);
          }}
        >
          (hide)
        </span>
      )}
    </FieldValueWithEllipsis>
  ) : (
    <TheFieldValue>{children}</TheFieldValue>
  );
};
