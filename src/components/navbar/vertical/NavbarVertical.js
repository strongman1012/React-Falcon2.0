import PropTypes from 'prop-types';
import classNames from 'classnames';
import { navbarBreakPoint } from 'config';
import { Modal, Skeleton, Space } from 'antd';
import { Nav, Navbar } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import React, { useContext, useEffect, Fragment } from 'react';

import vars from 'utils/vars';
import { isEmpty } from 'helpers/utils';
import AppContext from 'context/Context';
import PageComponent from 'screens/Page';
import Flex from 'components/common/Flex';
import Logo from 'components/common/Logo';
import ToggleButton from './ToggleButton';
import NavbarVerticalMenu from './NavbarVerticalMenu';
import { setThemeData } from 'redux/slices/themeSlice';
import bgNavbar from 'assets/img/generic/bg-navbar.png';
import { setCurrentData } from 'redux/slices/currentDataSlice';

export const helpMenuId = 'help_sidebar_menu_item'; // Keep it so that manually can be clicked

const NavbarVertical = () => {
  const dispatch = useDispatch();
  const { pageAsModal } = useSelector(state => state.currentData);
  const pageLayout = useSelector(state => state.theme.pageLayout);
  const menuOptionsSource = pageLayout?.menu?.options || [];
  const setModalData = _data => {
    dispatch(setCurrentData({ pageAsModal: _data }));
  };
  const {
    config: { navbarStyle, isNavbarVerticalCollapsed, showBurgerMenu }
  } = useContext(AppContext);

  const HTMLClassList = document.getElementsByTagName('html')[0].classList;

  useEffect(() => {
    if (isNavbarVerticalCollapsed) {
      HTMLClassList.add('navbar-vertical-collapsed');
    } else {
      HTMLClassList.remove('navbar-vertical-collapsed');
    }
    return () => {
      HTMLClassList.remove('navbar-vertical-collapsed-hover');
    };
  }, [isNavbarVerticalCollapsed, HTMLClassList]);

  //Control mouseEnter event
  let time = null;
  const handleMouseEnter = () => {
    if (isNavbarVerticalCollapsed) {
      time = setTimeout(() => {
        HTMLClassList.add('navbar-vertical-collapsed-hover');
      }, 100);
    }
  };

  const handleMouseLeave = () => {
    clearTimeout(time);
    HTMLClassList.remove('navbar-vertical-collapsed-hover');
  };

  // const NavbarLabel = ({ label }) => (
  //   <Nav.Item as="li">
  //     <Row className="mt-3 mb-2 navbar-vertical-label-wrapper">
  //       <Col xs="auto" className="navbar-vertical-label navbar-vertical-label">
  //         {label}
  //       </Col>
  //       <Col className="ps-0">
  //         <hr className="mb-0 navbar-vertical-divider"></hr>
  //       </Col>
  //     </Row>
  //   </Nav.Item>
  // );

  const generateMenuOptions = options => {
    return options.map(x => {
      const optionData = {
        name: x.name,
        to: x.modal_popupYN ? '' : x.link,
        icon: x.icon_css_class,
        onClick: () => {
          console.log(`"${x.name}" menu clicked!`);
          if (x.modal_popupYN) {
            setModalData(x);
          } else {
            const themeUpdates = {
              currentModule: x.name,
              currentTitle: '',
              currentDataID: ''
            };
            dispatch(setThemeData(themeUpdates));
          }
        }
      };

      if (x.name === 'Help' || x.link === '/help') {
        optionData.id = helpMenuId;
      }

      if (!isEmpty(x.children)) {
        optionData.children = generateMenuOptions(x.children);
      }

      return optionData;
    });
  };

  const menuOptions = generateMenuOptions(menuOptionsSource);
  // console.log(menuOptions,'menu optionsssssssssssss');

  return (
    <>
      <Navbar
        expand={navbarBreakPoint}
        className={classNames('navbar-vertical', {
          [`navbar-${navbarStyle}`]: navbarStyle !== 'transparent'
        })}
        variant="light"
      >
        <Flex alignItems="center">
          <ToggleButton />
          <Logo at="navbar-vertical" width={110} />
        </Flex>
        <Navbar.Collapse
          in={showBurgerMenu}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            backgroundImage:
              navbarStyle === 'vibrant'
                ? `linear-gradient(-45deg, rgba(0, 160, 255, 0.86), #0048a2),url(${bgNavbar})`
                : 'none'
          }}
        >
          <div className="navbar-vertical-content scrollbar">
            {/* Loading indicator */}
            {isEmpty(menuOptions) && (
              <Space direction="vertical" className="w-100 px-1 py-2">
                {Array(14)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton.Button
                      key={i}
                      active={true}
                      className="w-100"
                      style={{
                        height: 16,
                        background: vars.SKELETON_BACKGROUND
                      }}
                    />
                  ))}
              </Space>
            )}
            <Nav className="flex-column" as="ul">
              {menuOptions.map(option => (
                <Fragment key={option.name}>
                  <NavbarVerticalMenu routes={[option]} />
                </Fragment>
              ))}
            </Nav>
          </div>
        </Navbar.Collapse>
      </Navbar>
      <Modal
        destroyOnClose
        title={pageAsModal?.name}
        className="ant-modal-width-full"
        visible={!isEmpty(pageAsModal)}
        onCancel={() => setModalData(null)}
        style={{ top: 40 }}
        bodyStyle={{ height: '85vh', overflow: 'scroll' }}
        footer={null}
      >
        <PageComponent originIsModal={true} modalData={pageAsModal} />
      </Modal>
    </>
  );
};

NavbarVertical.propTypes = {
  label: PropTypes.string
};

export default NavbarVertical;
