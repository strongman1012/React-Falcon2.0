import React from 'react';
import { Row, Image } from 'antd';
import styled from 'styled-components';

import FallbackImage from 'assets/img/fallback.png';
import DownloadingImage from 'assets/img/downloading.svg';

const getPlaceholderImage = ({
  background = '#fff',
  width = '100%',
  height = '150px',
  ...rest
}) => (
  <Row
    style={{ background, width, height, ...rest }}
    justify="center"
    align="middle"
  >
    <img alt="loading..." src={DownloadingImage} width={40} height={40} />
  </Row>
);

function AppImage(props) {
  const {
    url,
    preview = false,
    hoverable = false,
    pointer = true,
    width = '100%',
    onClick,
    fit,
    alt = '',
    style = {},
    fallback = true,
    placeholderProps = {}
  } = props;
  return (
    <Container
      onClick={onClick}
      fit={fit}
      hoverable={hoverable}
      pointer={pointer}
      style={{ ...style }}
    >
      <Image
        alt={alt}
        preview={preview}
        width={width}
        src={url}
        fallback={fallback ? FallbackImage : alt}
        placeholder={getPlaceholderImage(placeholderProps)}
      />
    </Container>
  );
}

export default React.memo(AppImage);

const Container = styled.div`
  border-radius: 3px;
  height: auto;
  width: 100%;
  position: relative;
  cursor: ${props => (props.pointer === true ? 'pointer' : '')};
  &:hover {
    box-shadow: ${props =>
      props.hoverable === true
        ? `0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),
			0 9px 28px 8px rgba(0, 0, 0, 0.05)`
        : ''};
  }
  .ant-image {
    height: 100%;
    .ant-image-img {
      height: 100%;
      object-fit: ${props => (props.fit ? props.fit : 'cover')};
    }
  }
`;
