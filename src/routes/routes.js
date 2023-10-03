import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import keys from 'utils/keys';
const DashboardPage = React.lazy(() => import('../screens/DashboardPage'));
const Data = React.lazy(() => import('../screens/Data'));
const Page = React.lazy(() => import('../screens/Page'));
const ViewAccountPage = React.lazy(() => import('../screens/ViewAccountPage'));
const EditAccountPage = React.lazy(() => import('../screens/EditAccountPage'));
const ChangePasswordPage = React.lazy(() =>
  import('../screens/ChangePasswordPage')
);
const ReferUsAndEarnPage = React.lazy(() =>
  import('../screens/ReferUsAndEarnPage')
);
const TopUpAccountPage = React.lazy(() =>
  import('../screens/TopUpAccountPage')
);
const SubscriptionPage = React.lazy(() =>
  import('../screens/SubscriptionPage')
);
const MembersPage = React.lazy(() => import('../screens/MembersPage'));
const GroupsPage = React.lazy(() => import('../screens/GroupsPage'));
const PointsPage = React.lazy(() => import('../screens/PointsPage'));
const PromotionsPage = React.lazy(() => import('../screens/PromotionsPage'));
const TransactionPromotionsPage = React.lazy(() =>
  import('../screens/TransactionPromotionsPage')
);
const Expiration = React.lazy(() => import('../screens/points/Expiration'));
const ManageUsersPage = React.lazy(() => import('../screens/ManageUsersPage'));
const BranchesPage = React.lazy(() => import('../screens/BranchesPage'));
const QuickScanReasonPage = React.lazy(() =>
  import('../screens/QuickScanReasonPage')
);
const QuickScanSettingPage = React.lazy(() =>
  import('../screens/QuickScanSettingPage')
);
const MemberSubscription = React.lazy(() =>
  import('../screens/MemberSubscription')
);
const MembersDatacleaner = React.lazy(() =>
  import('../screens/MembersDatacleaner')
);
const TransactionPage = React.lazy(() => import('../screens/TransactionPage'));
const VouchersAll = React.lazy(() => import('../screens/VouchersAll'));
const VouchersIssued = React.lazy(() => import('../screens/VouchersIssued'));
const VouchersPreload = React.lazy(() => import('../screens/VouchersPreload'));
const ManageTemplates = React.lazy(() => import('../screens/ManageTemplates'));
const CommunicationLogPage = React.lazy(() =>
  import('../screens/CommunicationLogPage')
);
const EmailAutoRespondersPage = React.lazy(() =>
  import('../screens/EmailAutoRespondersPage')
);
const AutoRespondersPage = React.lazy(() =>
  import('../screens/AutoRespondersPage')
);
const MicroSite = React.lazy(() => import('../screens/MicroSite'));
const Communication_settings = React.lazy(() =>
  import('../screens/Communication_settings')
);
const Communication_scheduled = React.lazy(() =>
  import('../screens/Communication_scheduled')
);

const SalesApproval = React.lazy(() =>
  import('../screens/loyalty/SalesApproval')
);
const VerifyVoucher = React.lazy(() =>
  import('../screens/loyalty/VerifyVoucher')
);
const MobileApp = React.lazy(() => import('../screens/loyalty/MobileApp'));
const PromoteLoyalty = React.lazy(() =>
  import('../screens/loyalty/PromoteLoyalty')
);

const RedirectToViewList = () => {
  let { module_name } = useParams();

  if (module_name) {
    return (
      <Navigate
        to={`/data/${module_name}/${keys.DATA_VIEW_LIST_ACTION}`}
        replace
      />
    );
  } else {
    return <Navigate to="/" replace />;
  }
};

export const getRoutes = (
  currentModule = 'Data',
  currentDataID = '',
  currentPage = ''
) => {
  return [
    { path: '/home', exact: true, name: 'Home' }, // Just for breadcrumb & Home feel
    {
      path: `/data/:module_name`,
      exact: true,
      name:
        window.location.pathname.split('/').pop() === 'add' ? currentModule : ''
    }, // Just for breadcrumb
    {
      path: `/data/:module_name/${keys.DATA_ADD_ACTION}`,
      exact: true,
      name: 'Create'
    }, // Just for breadcrumb
    {
      path: '/data/:module_name/:action/:id',
      name: `${currentDataID}`,
      component: Data
    },
    {
      // If user put the module_name without specifying action then redirect to /viewlist
      path: `/data/:module_name`,
      exact: true,
      name: currentModule,
      component: RedirectToViewList
    },
    {
      // If user go to /view without 'id' then redirect to /viewlist
      path: `/data/:module_name/${keys.DATA_VIEW_ACTION}`,
      name: currentModule,
      component: RedirectToViewList
    },
    {
      // If user go to /edit without 'id' then redirect to /viewlist
      path: `/data/:module_name/${keys.DATA_EDIT_ACTION}`,
      name: currentModule,
      component: RedirectToViewList
    },
    {
      path: '/data/:module_name/:action',
      name: currentModule,
      component: Data
    },
    { path: '/:routeKey', name: currentPage, component: Page },
    { path: '/dashboard', name: currentPage, component: DashboardPage },
    { path: '/view_account', name: currentPage, component: ViewAccountPage },
    { path: '/edit_account', name: currentPage, component: EditAccountPage },
    { path: '/subscription', name: currentPage, component: SubscriptionPage },
    { path: '/top_up_account', name: currentPage, component: TopUpAccountPage },
    {
      path: '/refer_us_and_earn',
      name: currentPage,
      component: ReferUsAndEarnPage
    },
    {
      path: '/change_password',
      name: currentPage,
      component: ChangePasswordPage
    },
    {
      path: '/datamanager/bb_loyal2_members',
      exact: true,
      name: currentPage,
      component: MembersPage
    },
    {
      path: '/datamanager/bb_loyal2_members/:routeKey/:id',
      exact: true,
      name: currentPage,
      component: MembersPage
    },
    {
      path: '/datamanager/bb_loyal2_members/:routeKey',
      exact: true,
      name: currentPage,
      component: MembersPage
    },
    {
      path: '/members_subscription',
      exact: true,
      name: currentPage,
      component: MemberSubscription
    },
    {
      path: '/members_datacleaner',
      exact: true,
      name: currentPage,
      component: MembersDatacleaner
    },
    {
      path: '/points_expiration',
      exact: true,
      name: currentPage,
      component: Expiration
    },
    {
      path: '/datamanager/bb_loyal2_promotions',
      exact: true,
      name: currentPage,
      component: PromotionsPage
    },
    {
      path: '/datamanager/bb_loyal2_promotions/:routeKey/:id',
      exact: true,
      name: currentPage,
      component: PromotionsPage
    },
    {
      path: '/datamanager/bb_loyal2_promotions/:routeKey',
      exact: true,
      name: currentPage,
      component: PromotionsPage
    },
    {
      path: '/transactional_promotions',
      exact: true,
      name: currentPage,
      component: TransactionPromotionsPage
    },
    {
      path: '/transactional_promotions/:routeKey/:id',
      exact: true,
      name: currentPage,
      component: TransactionPromotionsPage
    },
    {
      path: '/transactional_promotions/:routeKey',
      exact: true,
      name: currentPage,
      component: TransactionPromotionsPage
    },
    {
      path: '/datamanager/bb_loyal2_transactions',
      exact: true,
      name: currentPage,
      component: TransactionPage
    },

    {
      path: '/datamanager/bb_loyal2_transactions/:routeKey',
      exact: true,
      name: currentPage,
      component: TransactionPage
    },
    {
      path: '/datamanager/bb_loyal2_transactions/:routeKey/:id',
      exact: true,
      name: currentPage,
      component: TransactionPage
    },
    {
      path: '/datamanager/bb_loyal2_groups',
      exact: true,
      name: currentPage,
      component: GroupsPage
    },
    {
      path: '/datamanager/bb_loyal2_groups/:routeKey/:id',
      exact: true,
      name: currentPage,
      component: GroupsPage
    },
    {
      path: '/datamanager/bb_loyal2_groups/:routeKey',
      exact: true,
      name: currentPage,
      component: GroupsPage
    },
    {
      path: '/datamanager/bb_loyal2_quickscan_reasons',
      exact: true,
      name: currentPage,
      component: QuickScanReasonPage
    },
    {
      path: '/QuickScan_settings',
      exact: true,
      name: currentPage,
      component: QuickScanSettingPage
    },

    {
      path: '/datamanager/bb_loyal2_quickscan_reasons/:routeKey',
      exact: true,
      name: currentPage,
      component: QuickScanReasonPage
    },
    {
      path: '/datamanager/bb_loyal2_quickscan_reasons/:routeKey/:id',
      exact: true,
      name: currentPage,
      component: QuickScanReasonPage
    },
    {
      path: '/datamanager/bb_loyal2_points',
      exact: true,
      name: currentPage,
      component: PointsPage
    },
    {
      path: '/datamanager/bb_loyal2_points/:routeKey/:id',
      exact: true,
      name: currentPage,
      component: PointsPage
    },
    {
      path: '/datamanager/bb_loyal2_points/:routeKey',
      exact: true,
      name: currentPage,
      component: PointsPage
    },
    {
      path: '/manage_users',
      exact: true,
      name: currentPage,
      component: ManageUsersPage
    },
    {
      path: '/manage_users/:routeKey/:id',
      exact: true,
      name: currentPage,
      component: ManageUsersPage
    },
    {
      path: '/manage_users/:routeKey',
      exact: true,
      name: currentPage,
      component: ManageUsersPage
    },
    {
      path: '/datamanager/bb_loyal2_vouchers',
      exact: true,
      name: currentPage,
      component: VouchersAll
    },
    {
      path: '/datamanager/bb_loyal2_vouchers/:routeKey/:id',
      exact: true,
      name: currentPage,
      component: VouchersAll
    },
    {
      path: '/datamanager/bb_loyal2_vouchers/:routeKey',
      exact: true,
      name: currentPage,
      component: VouchersAll
    },
    {
      path: '/datamanager/bb_loyal2_vouchers_issued',
      exact: true,
      name: currentPage,
      component: VouchersIssued
    },
    {
      path: '/datamanager/bb_loyal2_vouchers_issued/:routeKey',
      exact: true,
      name: currentPage,
      component: VouchersIssued
    },
    {
      path: '/datamanager/bb_loyal2_vouchers_issued/:routeKey/:id',
      exact: true,
      name: currentPage,
      component: VouchersIssued
    },
    {
      path: '/datamanager/bb_loyal2_vouchers_precodes',
      exact: true,
      name: currentPage,
      component: VouchersPreload
    },
    {
      path: '/datamanager/bb_loyal2_vouchers_precodes/:routeKey/:id',
      exact: true,
      name: currentPage,
      component: VouchersPreload
    },
    {
      path: '/datamanager/bb_loyal2_vouchers_precodes/:routeKey',
      exact: true,
      name: currentPage,
      component: VouchersPreload
    },
    {
      path: '/datamanager/bb_loyal2_branches',
      exact: true,
      name: currentPage,
      component: BranchesPage
    },
    {
      path: '/datamanager/bb_loyal2_branches/:routeKey/:id',
      exact: true,
      name: currentPage,
      component: BranchesPage
    },
    {
      path: '/datamanager/bb_loyal2_branches/:routeKey',
      exact: true,
      name: currentPage,
      component: BranchesPage
    },
    {
      path: '/datamanager/bb_loyal2_templates',
      exact: true,
      name: currentPage,
      component: ManageTemplates
    },
    {
      path: '/datamanager/bb_loyal2_templates/:routeKey/:id',
      exact: true,
      name: currentPage,
      component: ManageTemplates
    },
    {
      path: '/datamanager/bb_loyal2_templates/:routeKey',
      exact: true,
      name: currentPage,
      component: ManageTemplates
    },
    {
      path: '/email_autoresponders',
      exact: true,
      name: currentPage,
      component: EmailAutoRespondersPage
    },
    {
      path: '/autoresponders',
      exact: true,
      name: currentPage,
      component: AutoRespondersPage
    },
    {
      path: '/communication_log',
      exact: true,
      name: currentPage,
      component: CommunicationLogPage
    },
    {
      path: '/your_micro-site',
      exact: true,
      name: currentPage,
      component: MicroSite
    },
    {
      path: '/communication_zone_settings',
      exact: true,
      name: currentPage,
      component: Communication_settings
    },
    {
      path: '/scheduled_communication',
      exact: true,
      name: currentPage,
      component: Communication_scheduled
    },
    {
      path: '/sales_approval',
      exact: true,
      name: currentPage,
      component: SalesApproval
    },
    {
      path: '/verify_voucher_code',
      exact: true,
      name: currentPage,
      component: VerifyVoucher
    },
    {
      path: '/promote_your_loyalty_program',
      exact: true,
      name: currentPage,
      component: PromoteLoyalty
    },
    {
      path: '/mobile_app',
      exact: true,
      name: currentPage,
      component: MobileApp
    }
  ];
};
