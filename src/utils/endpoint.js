const devEnv = [
  'localhost',
  'netlify.app',
  'digitalocean.app',
  'blueboxtestsys.com',
  'ngrok.io'
];
const HOST = window.location.origin;
export const API_BASE_URL = devEnv.some(x =>
  HOST.trim().toLocaleLowerCase().includes(x.trim().toLocaleLowerCase())
)
  ? `https://newloyal2.phpbucket.net/`
  : HOST;
console.log({ API_BASE_URL });
export const API_VERSION = `v1`;
export const API_ENDPOINT_PREFIX = `${API_BASE_URL}/api/${API_VERSION}`;

export default {
  settings: `${API_ENDPOINT_PREFIX}/app/settings`,
  login: `${API_ENDPOINT_PREFIX}/users/login/`,
  otp: `${API_ENDPOINT_PREFIX}/users/otp`,
  forgotPassword: `${API_ENDPOINT_PREFIX}/users/forgot-password`,
  resetPassword: `${API_ENDPOINT_PREFIX}/users/reset-password`,
  logout: `${API_ENDPOINT_PREFIX}/users/logout`,
  userProfile: `${API_ENDPOINT_PREFIX}/users/profile`,
  authTokenEndpoint: `${API_ENDPOINT_PREFIX}/oauth/token`,
  authRevokeEndpoint: `${API_ENDPOINT_PREFIX}/oauth/revoke`,
  session: `${API_ENDPOINT_PREFIX}/users/session`,
  // appUsers: `${API_ENDPOINT_PREFIX}/app/users/`,
  appUsers: endpoint => `${API_ENDPOINT_PREFIX}${endpoint}`,
  getEndpointWithSuffix: suffix => `${API_ENDPOINT_PREFIX}${suffix}`,
  getPageSchemaEndpoint: routeKey => `${API_ENDPOINT_PREFIX}/pages/${routeKey}`,
  getDataManagerSchemaEndpoint: routeKey =>
    `${API_ENDPOINT_PREFIX}/datamanager/bb_loyal2_members/${routeKey}`,
  getDataManagerGroupSchemaEndpoint: routeKey =>
    `${API_ENDPOINT_PREFIX}/datamanager/bb_loyal2_groups/${routeKey}`,
  getDataBrancheSchemaEndpoint: routeKey =>
    `${API_ENDPOINT_PREFIX}/datamanager/bb_loyal2_branches/${routeKey}`,
  getDataAllVoucherSchemaEndpoint: routeKey =>
    `${API_ENDPOINT_PREFIX}/datamanager/bb_loyal2_vouchers/${routeKey}`,
  getDataQuickScanReasonSchemaEndpoint: routeKey =>
    `${API_ENDPOINT_PREFIX}/datamanager/bb_loyal2_quickscan_reasons/${routeKey}`,
  getDataIssuedVoucherSchemaEndpoint: routeKey =>
    `${API_ENDPOINT_PREFIX}/datamanager/bb_loyal2_vouchers_issued/${routeKey}`,
  getDataPreloadVoucherSchemaEndpoint: routeKey =>
    `${API_ENDPOINT_PREFIX}/datamanager/bb_loyal2_vouchers_precodes/${routeKey}`,
  getDataTransactionSchemaEndpoint: routeKey =>
    `${API_ENDPOINT_PREFIX}/datamanager/bb_loyal2_transactions/${routeKey}`,
  getDataModuleSchemaEndpoint: (mn, action, id) =>
    `${API_ENDPOINT_PREFIX}/schemas/${mn}/${action}${id ? `?id=${id}` : ''}`,
  getPromotionsDataManagerSchemaEndpoint: routeKey =>
    `${API_ENDPOINT_PREFIX}/datamanager/bb_loyal2_promotions/${routeKey}`,
  getDataManageTemplateSchemaEndpoint: routeKey =>
    `${API_ENDPOINT_PREFIX}/datamanager/bb_loyal2_templates/${routeKey}`,

  getTransactionPromotionsDataManagerSchemaEndpoint: routeKey =>
    `/transactional_promotions/${routeKey}`,

  getPointDataManagerSchemaEndpoint: routeKey =>
    `${API_ENDPOINT_PREFIX}/datamanager/bb_loyal2_points/${routeKey}`,
  getPointDataModuleSchemaEndpoint: (mn, action, id) =>
    `${API_ENDPOINT_PREFIX}/schemas/${mn}/${action}${id ? `?id=${id}` : ''}`,

  getModuleDataEndpoint: mn => `${API_ENDPOINT_PREFIX}/module/${mn}`,
  getDropTableEndpoint: mn => `${API_ENDPOINT_PREFIX}/module/${mn}/table`,
  getDropColumnEndpoint: mn => `${API_ENDPOINT_PREFIX}/module/${mn}/columns`,
  getDataAddEndpoint: mn => `${API_ENDPOINT_PREFIX}/module/${mn}`,
  getDataItemViewEndpoint: (mn, id) =>
    `${API_ENDPOINT_PREFIX}/module/${mn}/${id}`,
  getDataItemEditEndpoint: (mn, id) =>
    `${API_ENDPOINT_PREFIX}/module/${mn}/${id}`,
  getDataItemDeleteEndpoint: (mn, id) =>
    `${API_ENDPOINT_PREFIX}/module/${mn}/${id}`,
  getModuleSettingsEndpoint: mn =>
    `${API_ENDPOINT_PREFIX}/module/${mn}/settings`,
  getModuleSettingUpdateEndpoint: (mn, setting) =>
    `${API_ENDPOINT_PREFIX}/module/${mn}/settings/${setting}`,
  getDefaultDataEndpoint: mn =>
    `${API_ENDPOINT_PREFIX}/module/${mn}/table/default-data`,
  getNotificationClickEndpoint: id =>
    `${API_ENDPOINT_PREFIX}/users/notifications/${id}/read`,
  getMoreNotificationEndpoint: (offset = 5) =>
    `${API_ENDPOINT_PREFIX}/users/notifications?offset=${offset}`,
  fontAwesomeIcons: `${API_ENDPOINT_PREFIX}/fontawesome-icon-list`,
  getLookupEndpoint: suffix => `${API_ENDPOINT_PREFIX}${suffix}`,
  getBatchEndpointForSort: mn => `${API_ENDPOINT_PREFIX}/module/${mn}/batch`,
  getDataItemTabViewEndpoint: (suffix, id) =>
    `${API_ENDPOINT_PREFIX}/${suffix.replace(':id', id)}`
};
