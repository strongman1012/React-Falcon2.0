import React from 'react';
import Axios from 'axios';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import confirm from 'antd/lib/modal/confirm';
import Avatar from 'components/common/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LockTwoTone, QuestionCircleTwoTone } from '@ant-design/icons';

import endpoint from 'utils/endpoint';
import handleError from 'utils/handleError';
import { logoutUser } from 'redux/slices/authSlice';
import DefaultAvatar from 'assets/img/avatar.png';

const ProfileDropdown = () => {
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings);
  const profile = useSelector(state => state.auth?.user);
  const { imageFILE } = profile?.user || {};
  const { logout_redirect_url } = settings || {};

  const handleLogout = async () => {
    const hide = message.loading('Logging off...', 0);
    try {
      const logoutRes = await Axios.get(endpoint.logout);
      console.log('Logout response:', logoutRes.data);
      dispatch(logoutUser());
      if (logout_redirect_url) {
        window.location.replace(logout_redirect_url);
      } else {
        setTimeout(() => window.location.reload(), 500);
      }
    } catch (error) {
      handleError(error, true);
    } finally {
      hide();
    }
  };

  const showConfirm = (
    callback,
    title = 'Are you sure about this action?',
    desc,
    icon = <QuestionCircleTwoTone />
  ) => {
    confirm({
      title,
      icon,
      content: desc,
      onOk: () => callback(),
      onCancel() {
        console.log('Action cancelled.');
      },
      okText: 'Yes',
      okType: 'primary'
    });
  };

  const handleForgotPassword = async () => {
    try {
      const response = await Axios.get(endpoint.forgotPassword);
      console.log('Forgot password response:', response.data);
      message.success(
        'A password reset link has been successfully sent to your email address.'
      );
    } catch (error) {
      handleError(error, true);
    }
  };

  return (
    <Dropdown navbar={true} as="li">
      <Dropdown.Toggle
        bsPrefix="toggle"
        as={Link}
        to="#!"
        className="pe-0 ps-2 nav-link"
      >
        <Avatar src={imageFILE?.thumbnail || DefaultAvatar} />
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-caret dropdown-menu-card  dropdown-menu-end">
        <div className="bg-white rounded-2 py-2 dark__bg-1000">
          <Dropdown.Item
            as={Link}
            to="/view_account"
            className="fw-bold text-warning"
          >
            <FontAwesomeIcon icon="user" className="me-2" />
            Account
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item as={Link} to="/data/bb_users/profile">
            Profile
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() =>
              showConfirm(
                handleForgotPassword,
                'Please confirm you would like to send a password reset link to your email?',
                '',
                <LockTwoTone />
              )
            }
          >
            Reset Password
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileDropdown;
