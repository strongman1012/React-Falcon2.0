import React from 'react';
import { Empty } from 'antd';
import Slider from 'react-slick';
import styled from 'styled-components';

import Image from './Image';
import vars from 'utils/vars';
import { isEmpty } from 'helpers/utils';

const getSliderSettings = props => ({
  dots: props.withText ? false : true,
  autoplay: props.withText ? true : false,
  swipeToSlide: true,
  lazyLoad: true,
  infinite: true,
  pauseOnHover: true,
  swipe: true
});
const imageStyle = { height: 170, background: '#ebedef' };

function ImagesCarousel(props) {
  const { images, withText = 'false', slideProps = {} } = props;

  return (
    <>
      {isEmpty(images) ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span>No images!</span>}
        />
      ) : (
        <Carousel {...getSliderSettings(props)} {...slideProps}>
          {images.map((image, i) => (
            <div key={i}>
              <Image
                url={image.uri}
                alt={'Image ' + i}
                // fit='contain'
                style={{ ...imageStyle, boxShadow: 'none' }}
                placeholderProps={{ ...imageStyle }}
              />
              {withText && image.title && (
                <TextContent>{image.title}</TextContent>
              )}
            </div>
          ))}
        </Carousel>
      )}
    </>
  );
}

export default React.memo(ImagesCarousel);

const Carousel = styled(Slider)`
  .slick-next:before,
  .slick-prev:before {
    color: ${vars.PRIMARY_COLOR};
  }
  .slick-next {
    right: 10px;
  }
  .slick-prev {
    left: 10px;
    z-index: 1;
  }
  .slick-dots {
    bottom: 15px;
    li {
      height: 5px;
      width: 5px;
      margin: 5px;
    }
  }
`;

const TextContent = styled.div`
  padding: 5px 10px;
  background-color: #38444f9c;
  color: white;
  text-align: center;
`;
