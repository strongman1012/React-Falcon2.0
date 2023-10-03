import React, { Component } from 'react';
import axios from 'axios';
import { clone } from 'ramda';
import FadeIn from 'react-fade-in';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';
import { InfoOutlined } from '@ant-design/icons';
import { Button, Col, message, Popover, Row, Tooltip } from 'antd';

import keys from 'utils/keys';
import endpoint from 'utils/endpoint';
import PluginView from './PluginView';
import handleError from 'utils/handleError';
import GenericViewer from './GenericViewer';
import { withRouter } from 'utils/withRouter';
import DataModuleEditForm from './DataModuleEdit';
import Skeleton from 'components/loading/Skeleton';
import { setThemeData } from 'redux/slices/themeSlice';
import { setCurrentUser } from 'redux/slices/authSlice';
import SomethingWrong from 'components/custom/SomethingWrong';
import { setCurrentData } from 'redux/slices/currentDataSlice';
import TemplateChecker from '../CustomTemplate/TemplateChecker';
import TemplateSelectInput from 'components/custom/TemplateSelect';
import {
  checkHasPermission,
  cleanAndAdjustData,
  findTemplate,
  isEmpty
} from 'helpers/utils';
import {
  CustomRow,
  EditButton,
  FieldTitle,
  FieldValue,
  ListItem,
  renderTabElement
} from '../HelperElements';

const leftViewFields = [
  { key: '_authorid_display', label: 'Author' },
  { key: '_dateadded_display', label: 'Date Added' },
  { key: '_modifierid_display', label: 'Modifier' },
  { key: '_datemodified_display', label: 'Date Modified' }
];

const onFinishGoToViewExcludeModules = [];
const noViewBtnTopModules = [];
const moduleRequiredReloadOnToggle = [];

export class DataModuleViewAndEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProfileAction: false, // action = profile
      dataLoading: true,
      editing: false,
      data: null,
      pluginsData: [],
      showAuditPanel: false,
      currentDataEndpoint: '',
      errorOccurred: false,
      resettingPassword: false,
      currentSuffixString: ''
    };
    this.setupThemeData();
  }

  setupThemeData = () => {
    const { params, theme } = this.props;
    const { action, id } = params;
    const { currentTitle } = theme;
    if (currentTitle) {
      this.props.setThemeData({ currentDataID: currentTitle });
    } else {
      this.props.setThemeData({
        currentDataID:
          action[0].toUpperCase() + action.slice(1) + ' - ' + id ?? ''
      });
    }
    this.props.setThemeData({ viewEditContainerClass: '' });
  };

  async componentDidMount() {
    this.mounted = true;
    const { activeTemplate, params, available_templates } = this.props;
    const { id } = params;
    const loadTemplate = findTemplate(
      localStorage.getItem(keys.LOAD_TEMPLATE) || '',
      available_templates
    );
    if (loadTemplate) {
      localStorage.removeItem(keys.LOAD_TEMPLATE);
      return this.props.setActiveTemplate(loadTemplate);
    }
    if (activeTemplate?.data_endpoint) {
      await this.init(
        endpoint.getDataItemTabViewEndpoint(activeTemplate.data_endpoint, id)
      );
    } else {
      await this.init();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  init = async (moduleDataEndpoint, suffixString = '') => {
    this.mounted && this.setState({ errorOccurred: false });
    if (typeof suffixString !== 'string') {
      suffixString = '';
    }
    console.log('Data item view called with: ', {
      moduleDataEndpoint,
      suffixString
    });
    const { module_name, action, id } = this.props.params;

    if (action === keys.DATA_PROFILE_ACTION) {
      this.mounted && this.setState({ isProfileAction: true, editing: true });
      return this.getUserProfile();
    }

    if (action === keys.DATA_EDIT_ACTION) {
      this.mounted && this.setState({ editing: true });
    }

    try {
      this.mounted && this.setState({ dataLoading: true });
      const dataEndpoint = moduleDataEndpoint
        ? moduleDataEndpoint.replace('v1//', 'v1/') + suffixString
        : endpoint.getDataItemViewEndpoint(module_name, id) + suffixString;
      this.mounted && this.setState({ currentDataEndpoint: dataEndpoint });
      console.log('Data item view endpoint:', dataEndpoint);
      const dataItemRes = await axios.get(dataEndpoint);
      const itemData = dataItemRes.data;
      console.log('Data item view response:', itemData);

      const currentItemName = itemData?.name;
      // console.log({ currentItemName })

      if (currentItemName !== undefined) {
        const currentTitle = currentItemName ?? '';
        const currentDataID = currentItemName ? currentItemName : ''; // currentItemName ? truncate(currentItemName, 30) : ''
        this.props.setThemeData({ currentTitle, currentDataID });
      }

      const plugins = this.props.plugins || [];
      const pluginsData = [];
      for (const plugin of plugins) {
        const { module, module_link_field } = plugin;
        const pluginSchemaRes = await axios.get(
          endpoint.getDataModuleSchemaEndpoint(
            module,
            keys.DATA_VIEW_LIST_ACTION
          )
        );
        const pluginDataRes = await axios.get(
          endpoint.getModuleDataEndpoint(module) + `?${module_link_field}=${id}`
        );
        pluginsData.push({
          plugin,
          schema: pluginSchemaRes.data,
          data: pluginDataRes.data
        });
      }
      console.log('Plugins response:', pluginsData);

      const currentData = cleanAndAdjustData({
        data: itemData,
        fields: this.props.fields,
        module_name
      });
      this.mounted &&
        this.setState({ data: currentData, pluginsData, dataLoading: false });
      // If user in view and if it's the main data call
      const { available_templates, activeTemplate, setCurrentData } =
        this.props;
      const first_template = available_templates?.[0] || {};
      if (
        action === keys.DATA_VIEW_ACTION &&
        first_template?.name === activeTemplate?.name
      ) {
        setCurrentData({ viewAndEdit: currentData });
      }
    } catch (error) {
      handleError(error, true);
      this.mounted &&
        this.setState({ dataLoading: false, errorOccurred: true });
    }
  };

  getUserProfile = async () => {
    try {
      this.mounted && this.setState({ dataLoading: true });
      const userProfileRes = await axios.get(endpoint.userProfile);
      console.log('Data item view response(as Profile): ', userProfileRes.data);
      this.props.setCurrentUser(userProfileRes.data);
      this.mounted &&
        this.setState({ data: userProfileRes.data.user, dataLoading: false });
    } catch (error) {
      handleError(error, true);
    }
  };

  handleEdit = (data, msg) => {
    const { isProfileAction } = this.state;
    const currentData = this.state.data;
    console.log('Current: ', currentData);
    console.log('Updates: ', data);

    if (isProfileAction) {
      const currentUserData = this.props.auth?.user || {};
      let updates = data.hasOwnProperty('user')
        ? { ...currentUserData, ...data }
        : { ...currentUserData, user: { ...currentUserData?.user, ...data } };
      this.props.setCurrentUser(updates);
    }

    const updatedData = isProfileAction
      ? { ...currentData, ...data.user }
      : { ...currentData, ...data };

    this.setState({ data: updatedData }, () => {
      message.success(
        msg ?? `${isProfileAction ? 'Profile' : 'Data'} updated successfully!`
      );
    });

    const { action, module_name } = this.props.params;
    if (action === keys.DATA_VIEW_ACTION && !msg) {
      if (!onFinishGoToViewExcludeModules.includes(module_name)) {
        this.setState({ editing: false });
      }
    }
  };

  handlePluginDataItemDelete = (plugin, id, callback) => {
    const copy = clone(this.state.pluginsData);
    const update = copy.map(x => {
      if (x.plugin.module === plugin.module) {
        return {
          ...x,
          data: { ...x.data, list: x.data.list.filter(x => x._id !== id) }
        };
      }
      return x;
    });
    this.setState({ pluginsData: update });
    message.info('Successfully deleted!', 1.5);
    if (callback) {
      callback();
    }
  };

  handleUpdateUI = (row, plugin) => {
    const copy = clone(this.state.pluginsData);
    const update = copy.map(x => {
      if (x.plugin.module === plugin.module) {
        return {
          ...x,
          data: {
            ...x.data,
            list: x.data.list.map(x => {
              if (x._id === row._id) {
                return { ...x, ...row };
              }
              return x;
            })
          }
        };
      }
      return x;
    });
    this.setState({ pluginsData: update });
  };

  addItemsToPlugin = (plugin, data) => {
    const copy = clone(this.state.pluginsData);
    const update = copy.map(x => {
      if (x.plugin.module === plugin.module) {
        return { ...x, data: { ...x.data, list: [...data, ...x.data.list] } };
      }
      return x;
    });
    this.setState({ pluginsData: update });
  };

  setEditing = editing => {
    if (editing === undefined) {
      this.setState(
        prevState => ({ editing: !prevState.editing }),
        () => {
          const { params, navigate } = this.props;
          const { action, module_name, id } = params;
          if (!moduleRequiredReloadOnToggle.includes(module_name)) return null;
          navigate(
            `/data/${module_name}/${
              action === keys.DATA_VIEW_ACTION
                ? keys.DATA_EDIT_ACTION
                : keys.DATA_VIEW_ACTION
            }/${id}`
          );
        }
      );
    } else {
      this.setState({ editing });
    }
  };

  refetchData = suffixString => {
    const { activeTemplate, params } = this.props;
    const { data_endpoint } = activeTemplate;
    this.mounted && this.setState({ currentSuffixString: suffixString || '' });
    if (data_endpoint) {
      const { id } = params;
      const moduleDataEndpoint = endpoint.getDataItemTabViewEndpoint(
        data_endpoint,
        id
      );
      this.init(moduleDataEndpoint, suffixString);
    } else {
      this.init(undefined, suffixString);
    }
  };

  onTemplateSelect = newTemplate => {
    if (!newTemplate) return;
    const { activeTemplate, params, setActiveTemplate } = this.props;
    const isTemplateChanged = activeTemplate?.name !== newTemplate.name;
    if (!isTemplateChanged && activeTemplate?.dynamic_tabYN !== true) {
      const { data_endpoint } = newTemplate;
      if (data_endpoint) {
        const { id } = params;
        const moduleDataEndpoint = endpoint.getDataItemTabViewEndpoint(
          data_endpoint,
          id
        );
        this.init(moduleDataEndpoint);
      }
    }
    setActiveTemplate(newTemplate, isTemplateChanged);
  };

  getAuditPanelContent = () => {
    return (
      <>
        {this.state.data &&
          leftViewFields.map((field, i) => {
            const value = this.state.data[field.key];
            return (
              <ListItem key={i}>
                <FieldTitle>{field.label}</FieldTitle>
                <FieldValue>
                  {value || <span style={{ color: 'silver' }}>No data</span>}
                </FieldValue>
              </ListItem>
            );
          })}
      </>
    );
  };

  checkEditFromSubmitBtnShouldDisable = () => {
    let flag = true;

    const havePluginField = this.props.fields.some(
      x => x.type === 'plugin_table'
    );
    if (havePluginField) {
      flag = false;
    }

    return flag;
  };

  getAuditPanelToggleButton = ({ className = '' } = {}) => {
    return (
      <Button
        size="small"
        shape="circle"
        icon={<InfoOutlined />}
        className={className}
      />
    );
  };

  handlePasswordReset = async () => {
    try {
      const { email } = this.state.data;
      if (!email) return message.error(`Unable to locate team member email.`);
      this.setState({ resettingPassword: true });
      const res = await axios.post(endpoint.forgotPassword, {
        username: email
      });
      console.log(`${endpoint.forgotPassword} response -> `, res.data);
      message.success('Password reset has been successfully sent!');
    } catch (error) {
      handleError(error, true);
    } finally {
      this.setState({ resettingPassword: false });
    }
  };

  render() {
    const {
      dataLoading,
      isProfileAction,
      showAuditPanel,
      currentDataEndpoint,
      errorOccurred,
      currentSuffixString
    } = this.state;

    if (dataLoading) return <Skeleton number={5} />;

    const { fields, activeTemplate, permissions, theme, params } = this.props;
    const { module_name } = params;
    const content_footer = activeTemplate?.content_footer;
    const content_header = activeTemplate?.content_header;
    const { template: templatePropsOverride = {} } =
      this.state.data?._schema || {};
    const hide_meta_dataYN =
      templatePropsOverride.hide_meta_dataYN ??
      activeTemplate?.hide_meta_dataYN;
    const available_templates = this.props.available_templates || [];
    const hasEditPermission = checkHasPermission(
      keys.EDIT_PERMISSIONS_KEY,
      this.state.data?._permissions,
      permissions
    );
    const maxColsNUM = activeTemplate?.colsNUM ?? 3;
    const columns = fields.filter(x => !x.hidden);

    let topSubmitBtnStyles = {};
    let topSubmitBtnLeftElementsContainerStyles = {};

    if (isProfileAction) {
      topSubmitBtnStyles = { top: 0, right: 0 };
    }

    const hideFirstRowRightFor = [];
    const modulesCloseToProfileAction = [];
    const modulesCloneSubmitButtonTop = [];

    let cloneSubmitButtonTop = false;

    if (modulesCloneSubmitButtonTop.includes(module_name)) {
      cloneSubmitButtonTop = true;
    }

    const getAuditPanelPopover = (_props = {}) => (
      <Popover
        content={this.getAuditPanelContent()}
        title="Info"
        trigger="click"
        placement="bottomRight"
        arrowPointAtCenter
        {..._props}
      >
        {this.getAuditPanelToggleButton({ className: 'mr-2' })}
      </Popover>
    );

    let topSubmitBtnLeftElements = [];
    let submitBtnLeftElements = [];

    let onFinishGoToView = true;
    if (onFinishGoToViewExcludeModules.includes(module_name)) {
      onFinishGoToView = false;
    }

    let onDeletedCallback = null;

    const toggleButton = (
      <EditButton
        onClick={() => this.setEditing()}
        editing={this.state.editing.toString()}
        label={this.state.editing ? 'View' : 'Edit'}
      />
    );

    return (
      <>
        {/* <BackBtnAndHeading /> */}

        {renderTabElement({
          isTabView: this.props.isTabView,
          available_templates,
          activeTemplate,
          onTemplateSelect: this.onTemplateSelect
        })}

        {errorOccurred ? (
          <SomethingWrong
            height="max-content"
            title=""
            iconStyles={{ marginTop: 35 }}
            subTitle={
              <>
                <h4>There was a problem loading the content.</h4>
                <h6>
                  Please try again or contact support if the problem persists.
                </h6>
              </>
            }
            onClick={() => this.refetchData()}
          />
        ) : (
          <div
            className={theme.viewEditContainerClass || 'bg-white p-3 min-vh-75'}
            style={{ color: 'inherit' }}
          >
            <TemplateChecker
              {...this.props}
              {...this.state}
              handleEdit={this.handleEdit}
              isProfileAction={isProfileAction}
              onTemplateSelect={this.onTemplateSelect}
              leftViewFields={leftViewFields}
              refetchData={this.refetchData}
              currentSuffixString={currentSuffixString}
              currentDataEndpoint={currentDataEndpoint}
              setThemeData={this.props.setThemeData}
            >
              <Row gutter={[20, 20]}>
                <Col
                  span={24}
                  md={hide_meta_dataYN || !showAuditPanel ? 24 : 18}
                >
                  {!isProfileAction && (
                    <CustomRow justify="space-between">
                      <TemplateSelectInput
                        {...this.props}
                        wrapperClass="mb-3"
                      />
                      {hideFirstRowRightFor.includes(module_name) ? null : (
                        <Row gutter={[10, 10]} align="middle">
                          {!hide_meta_dataYN && (
                            <Col>
                              {showAuditPanel ? (
                                <Tooltip title="Click to hide Info panel">
                                  {this.getAuditPanelToggleButton({
                                    className: 'mr-2 mb-2'
                                  })}
                                </Tooltip>
                              ) : (
                                getAuditPanelPopover()
                              )}
                            </Col>
                          )}
                          <Col>
                            {isEmpty(fields) || !hasEditPermission ? (
                              <div />
                            ) : (
                              <>
                                {noViewBtnTopModules.includes(module_name) ? (
                                  <>{!this.state.editing && toggleButton}</>
                                ) : (
                                  toggleButton
                                )}
                              </>
                            )}
                          </Col>
                        </Row>
                      )}
                    </CustomRow>
                  )}

                  <FadeIn key={this.state.editing.toString()}>
                    <Card style={{ minHeight: 256 }} className="mt-3 mb-0">
                      {content_header && (
                        <Card.Header>
                          <div
                            dangerouslySetInnerHTML={{ __html: content_header }}
                          />
                        </Card.Header>
                      )}
                      <Card.Body>
                        {this.state.editing ? (
                          <DataModuleEditForm
                            {...this.props}
                            data={this.state.data}
                            onEdit={this.handleEdit}
                            isProfileAction={isProfileAction}
                            closeToProfileAction={modulesCloseToProfileAction.includes(
                              module_name
                            )}
                            cloneSubmitButtonTop={cloneSubmitButtonTop}
                            topSubmitBtnStyles={topSubmitBtnStyles}
                            topSubmitBtnLeftElementsContainerStyles={
                              topSubmitBtnLeftElementsContainerStyles
                            }
                            onDeletedCallback={onDeletedCallback}
                            checkSubmitBtnShouldDisable={this.checkEditFromSubmitBtnShouldDisable()}
                            submitBtnLeftElements={submitBtnLeftElements}
                            topSubmitBtnLeftElements={topSubmitBtnLeftElements}
                            onFinishGoToView={onFinishGoToView}
                          />
                        ) : (
                          <GenericViewer
                            columns={columns}
                            maxColsNUM={maxColsNUM}
                            data={this.state.data}
                          />
                        )}
                      </Card.Body>
                      {content_footer && (
                        <Card.Footer>
                          <div
                            dangerouslySetInnerHTML={{ __html: content_footer }}
                          />
                        </Card.Footer>
                      )}
                    </Card>
                  </FadeIn>
                  {this.state.pluginsData.map((pluginData, index) => {
                    // console.log('Plugins Data:', pluginData)
                    return (
                      <FadeIn key={index}>
                        <PluginView
                          {...this.props}
                          pluginData={pluginData}
                          handleUpdateUI={this.handleUpdateUI}
                          handlePluginDataItemDelete={
                            this.handlePluginDataItemDelete
                          }
                          addItemsToPlugin={this.addItemsToPlugin}
                          routeParams={params}
                          parentName={this.state?.data?.name}
                          refetchData={this.refetchData}
                          currentSuffixString={currentSuffixString}
                        />
                      </FadeIn>
                    );
                  })}
                </Col>
                {!hide_meta_dataYN && showAuditPanel && (
                  <Col span={24} md={6}>
                    {/* Right */}
                    <FadeIn>
                      <Card style={{ height: 'fit-content' }} className="mb-0">
                        <Card.Body>{this.getAuditPanelContent()}</Card.Body>
                      </Card>
                    </FadeIn>
                  </Col>
                )}
              </Row>
            </TemplateChecker>
          </div>
        )}
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setThemeData: themeData => dispatch(setThemeData(themeData)),
  setCurrentUser: user => dispatch(setCurrentUser(user)),
  setCurrentData: data => dispatch(setCurrentData(data))
});

const mapStateToProps = state => ({ auth: state.auth, theme: state.theme });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DataModuleViewAndEdit));
