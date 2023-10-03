import Axios from 'axios';
import moment from 'moment';
import shortid from 'shortid';
import { Col, Row } from 'antd';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Dropdown, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FalconCardHeader from 'components/common/FalconCardHeader';

import endpoint from 'utils/endpoint';
import handleError from 'utils/handleError';
import { parseFAClass } from 'helpers/utils';
import { setCurrentUser } from 'redux/slices/authSlice';

const NotificationDropdown = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth?.user) || {};
  const notifications = user?.notifications || {};
  const {
    list = [],
    total_notifications = 0,
    total_unread = 0
  } = notifications || {};
  const [loading, setLoading] = React.useState(false);
  const [key, setKey] = React.useState(shortid.generate());
  const notificationContainer = React.useRef();
  const notificationContainerEnd = React.useRef();
  const [isOpen, setIsOpen] = useState(false);

  const handleShowMoreNotification = async () => {
    try {
      setLoading(true);
      const res = await Axios.get(
        endpoint.getMoreNotificationEndpoint(list.length)
      );
      console.log('More notification response: ', res.data);
      const newData = res.data;
      const update = {
        ...notifications,
        ...newData,
        list: [...list, ...newData.list]
      };
      dispatch(setCurrentUser({ ...user, notifications: update }));
      if (notificationContainer && notificationContainer.current) {
        const top = notificationContainerEnd?.current?.offsetTop || 400;
        notificationContainer.current.scrollTo({ top, behavior: 'smooth' });
      }
    } catch (error) {
      handleError(error, true);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = id => {
    const update = {
      ...notifications,
      total_unread: total_unread - 1,
      list: list.map(x => {
        if (x.id === id) return { ...x, read: true };
        return x;
      })
    };
    dispatch(setCurrentUser({ ...user, notifications: update }));
  };

  const getHeading = () => {
    const prefix =
      total_notifications === 0
        ? ''
        : `Total ${total_notifications} notification${
            total_notifications > 1 ? 's' : ''
          }. `;
    if (total_unread === 0) return `${prefix}No new notifications.`;
    return `${prefix}${total_unread} unread notification${
      total_unread > 1 ? 's' : ''
    }.`;
  };

  const haveMoreNotification = total_notifications > list.length;

  // Handler
  const handleToggle = () => {
    setIsOpen(!isOpen);
    setKey(shortid.generate());
  };

  useEffect(() => {
    window.addEventListener('scroll', () => {
      window.innerWidth < 1200 && setIsOpen(false);
    });
  }, []);

  return (
    <Dropdown navbar={true} as="li" show={isOpen} onToggle={handleToggle}>
      <Dropdown.Toggle
        bsPrefix="toggle"
        as={Link}
        to="#!"
        className={classNames('px-0 nav-link', {
          'notification-indicator notification-indicator-primary':
            total_unread > 0
        })}
      >
        <FontAwesomeIcon icon="bell" transform="shrink-6" className="fs-4" />
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-menu-card dropdown-menu-end dropdown-caret dropdown-caret-bg">
        <Card
          className="dropdown-menu-notification dropdown-menu-end shadow-none"
          style={{ maxWidth: '20rem' }}
        >
          <FalconCardHeader
            className="card-header"
            title="Notifications"
            titleTag="h6"
            light={false}
          />
          <ListGroup
            variant="flush"
            className="fw-normal fs--1"
            style={{ maxHeight: '19rem' }}
          >
            <div
              className={classNames('list-group-title', {
                'text-center py-3': total_unread === 0
              })}
            >
              {getHeading()}
            </div>{' '}
            <div
              style={{ maxHeight: 400, overflowY: 'scroll' }}
              ref={notificationContainer}
            >
              {list.map((item, index) => (
                <NotificationItem
                  key={`notification_${index}_${key}`}
                  item={item}
                  markAsRead={handleMarkAsRead}
                />
              ))}
              <div ref={notificationContainerEnd} />
            </div>
            {haveMoreNotification && (
              <div
                className="text-center border-top dropdown-item"
                onClick={handleShowMoreNotification}
                style={{
                  pointerEvents: loading && 'none',
                  opacity: loading && 0.6,
                  cursor: 'pointer'
                }}
              >
                <strong>
                  {loading ? 'Loading...' : 'Show More Notifications'}
                </strong>
              </div>
            )}
          </ListGroup>
        </Card>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationDropdown;

const NotificationItem = props => {
  const { item } = props;
  const { id, type, icon_css_class, subject, message, date, read } = item;
  const { iconClassName, extraClassName } = parseFAClass(icon_css_class);
  const [clicked, setClicked] = React.useState(false);

  const handleClick = async () => {
    setClicked(!clicked);
    if (read) return; // Already seen/read
    try {
      props.markAsRead(id);
      const res = await Axios.get(endpoint.getNotificationClickEndpoint(id));
      console.log('Notification click response: ', res.data);
    } catch (error) {
      handleError(error, true);
    }
  };

  const lessThanOneMinuteAgo = date =>
    moment(date).isAfter(moment().subtract(1, 'minutes'));
  const lessThanOneDayAgo = date =>
    moment(date).isAfter(moment().subtract(1, 'days'));
  // const isSameDay = (date) => moment(date).isSame(moment(), 'day')

  const parseDate = UTC_Date => {
    if (!UTC_Date) return '';
    const date = moment.utc(UTC_Date).local().format();

    if (lessThanOneMinuteAgo(date)) {
      return 'now';
    } else if (lessThanOneDayAgo(date)) {
      return moment(date).fromNow();
    } else {
      return moment(date).format('DD-MM-YYYY');
    }
  };

  return (
    <div
      className="dropdown-item"
      role="menuitem"
      onClick={handleClick}
      style={{ background: !read && 'lightcyan' }}
    >
      <Row wrap={false} className="w-100">
        <Col style={{ minWidth: 40 }}>
          <div className={`h-100 d-flex align-items-center ${extraClassName}`}>
            <FontAwesomeIcon icon={iconClassName} size="2xl" />
          </div>
        </Col>
        <Col flex={1}>
          <Row justify="space-between">
            <small className="text-muted">{type ? `${type} ` : ''}</small>
            <small className="text-muted">{parseDate(date)}</small>
          </Row>
          <div className="text-truncate font-weight-bold">{subject}</div>
          <div
            className="small text-muted text-truncate"
            style={{ whiteSpace: clicked && 'break-spaces' }}
            dangerouslySetInnerHTML={{ __html: message }}
          />
        </Col>
      </Row>
    </div>
  );
};
