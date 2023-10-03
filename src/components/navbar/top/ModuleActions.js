import jsPDF from 'jspdf';
import { message } from 'antd';
import download from 'downloadjs';
import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import ReactToPrint from 'react-to-print';
import * as htmlToImage from 'html-to-image';
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  // faFileCsv,
  faFilePdf,
  faPrint
} from '@fortawesome/free-solid-svg-icons';

import keys from 'utils/keys';
import LoaderOverlay from 'components/loading/Overlay';

const printNotAvailableRoutes = ['/dashboard', '/home', '/null', '/undefined'];

function ModuleActions() {
  const _isMounted = useRef(false);
  const { currentModuleSchema, currentModuleSchemaLoading } = useSelector(
    state => state.currentData
  );
  const { name, content_layout } = currentModuleSchema || {};
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [downloadingImage, setDownloadingImage] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    _isMounted.current = true;
    return () => {
      _isMounted.current = false;
    };
  }, []);

  if (!isAuthenticated || currentModuleSchemaLoading) return null;
  const { show_actions_menuYN } = content_layout || {};
  if (show_actions_menuYN === false) return null; // Avoid null/undefine case

  const {
    screenshot = false,
    print = false,
    pdf = false
    // csv = false
  } = user?.ui_settings?.page || {};

  const handleDownloadImage = () => {
    _isMounted.current && setDownloadingImage(true);
    htmlToImage
      .toPng(document.getElementById(keys.APP_MAIN_BODY_CONTENT_ID), {
        backgroundColor: '#fff'
      })
      .then(dataUrl => {
        download(dataUrl, `${name || 'Image'}.png`);
        setTimeout(() => {
          _isMounted.current && setDownloadingImage(false);
          message.success('Successfully captured & downloaded the screenshot.');
        }, 1000);
      })
      .catch(error => {
        console.log(error);
        _isMounted.current && setDownloadingImage(false);
        message.error('Failed to capture the screenshot.');
      });
  };

  const handleDownloadPdf = () => {
    _isMounted.current && setDownloadingPdf(true);
    htmlToImage
      .toCanvas(document.getElementById(keys.APP_MAIN_BODY_CONTENT_ID), {
        backgroundColor: '#fff'
      })
      .then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        let orientation = 'p'; // orientation Possible values are "portrait" or "landscape" (or shortcuts "p" or "l")
        const limit = 14400; // The maximum width and height of the jspdf.js plugin for a single page is 14400
        // console.log('Before', { contentWidth, contentHeight });
        if (contentHeight > limit) {
          const contentScale = limit / contentHeight;
          contentHeight = limit;
          contentWidth = contentScale * contentWidth;
        }
        // console.log('After', { contentWidth, contentHeight });
        if (contentWidth > contentHeight) {
          orientation = 'l';
        }

        const pdf = new jsPDF(orientation, 'pt', [contentWidth, contentHeight]);
        pdf.addImage(imgData, 'JPEG', 0, 0, contentWidth, contentHeight);
        pdf.save(`${name || 'Document'}.pdf`);

        _isMounted.current && setDownloadingPdf(false);
        message.success('Successfully generated & downloaded the pdf.');
      })
      .catch(error => {
        console.log(error);
        _isMounted.current && setDownloadingPdf(false);
        message.error('Failed to capture the screenshot.');
      });
  };

  const getPrintButton = () => {
    const { pathname } = window.location;
    if (printNotAvailableRoutes.includes(pathname)) return null;

    return (
      <ReactToPrint
        trigger={() => (
          <Nav.Item as={'li'}>
            <Nav.Link className="px-1 theme-control-toggle" onClick={() => {}}>
              <FontAwesomeIcon
                icon={faPrint}
                transform="shrink-6"
                className="fs-4"
              />
            </Nav.Link>
          </Nav.Item>
        )}
        content={() => {
          return document.getElementById(keys.APP_MAIN_BODY_CONTENT_ID);
        }}
      />
    );
  };

  const actionInProgress = downloadingImage || downloadingPdf;

  return (
    <>
      {actionInProgress && <LoaderOverlay msg="Action in progress..." />}

      {screenshot && (
        <Nav.Item as={'li'}>
          <Nav.Link
            className="px-0 theme-control-toggle"
            onClick={handleDownloadImage}
          >
            <FontAwesomeIcon
              icon="image"
              transform="shrink-6"
              className="fs-4"
            />
          </Nav.Link>
        </Nav.Item>
      )}

      {/* {csv && (
        <Nav.Item as={'li'}>
          <Nav.Link className="px-1 theme-control-toggle" onClick={() => {}}>
            <FontAwesomeIcon
              icon={faFileCsv}
              transform="shrink-6"
              className="fs-4"
            />
          </Nav.Link>
        </Nav.Item>
      )} */}

      {pdf && (
        <Nav.Item as={'li'}>
          <Nav.Link
            className="px-1 theme-control-toggle"
            onClick={handleDownloadPdf}
          >
            <FontAwesomeIcon
              icon={faFilePdf}
              transform="shrink-6"
              className="fs-4"
            />
          </Nav.Link>
        </Nav.Item>
      )}

      {print && getPrintButton()}
    </>
  );
}

export default ModuleActions;
