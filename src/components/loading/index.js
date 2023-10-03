import React from 'react';
import PropTypes from 'prop-types';
import PulseLoader from 'react-spinners/PulseLoader';

import vars from '../../utils/vars';

export const defaultLoadingComponent = (
  <PulseLoader color={vars.PRIMARY_COLOR} />
);

/* Just a SVG animated image */
export default function Loading(props) {
  const { msg, msgColor, style = {}, simple = false } = props;
  let { component } = props;
  if (simple) {
    component = defaultLoadingComponent;
  }

  return (
    <div style={{ marginTop: '-100px', ...style }}>
      {component ? (
        <div
          className="d-flex justify-content-center"
          style={{ minHeight: 50 }}
        >
          {component}
        </div>
      ) : (
        <svg
          style={{ margin: 'auto', display: 'block' }}
          width="100px"
          height="100px"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
        >
          <circle cx="70" cy="50" fill="#ffffff" r="5.97674">
            <animate
              attributeName="r"
              values="3.5999999999999996;3.5999999999999996;6;3.5999999999999996;3.5999999999999996"
              times="0;0.1;0.2;0.3;1"
              dur="1.25s"
              repeatCount="indefinite"
              begin="-1.125s"
            ></animate>
            <animate
              attributeName="fill"
              values="#ffffff;#ffffff;#536c79;#ffffff;#ffffff"
              repeatCount="indefinite"
              times="0;0.1;0.2;0.3;1"
              dur="1.25s"
              begin="-1.125s"
            ></animate>
          </circle>
          <circle
            cx="66.18033988749895"
            cy="61.75570504584947"
            fill="#ffffff"
            r="5.01674"
          >
            <animate
              attributeName="r"
              values="3.5999999999999996;3.5999999999999996;6;3.5999999999999996;3.5999999999999996"
              times="0;0.1;0.2;0.3;1"
              dur="1.25s"
              repeatCount="indefinite"
              begin="-1s"
            ></animate>
            <animate
              attributeName="fill"
              values="#ffffff;#ffffff;#536c79;#ffffff;#ffffff"
              repeatCount="indefinite"
              times="0;0.1;0.2;0.3;1"
              dur="1.25s"
              begin="-1s"
            ></animate>
          </circle>
          <circle
            cx="56.180339887498945"
            cy="69.02113032590307"
            fill="#ffffff"
            r="4.05674"
          >
            <animate
              attributeName="r"
              values="3.5999999999999996;3.5999999999999996;6;3.5999999999999996;3.5999999999999996"
              times="0;0.1;0.2;0.3;1"
              dur="1.25s"
              repeatCount="indefinite"
              begin="-0.875s"
            ></animate>
            <animate
              attributeName="fill"
              values="#ffffff;#ffffff;#536c79;#ffffff;#ffffff"
              repeatCount="indefinite"
              times="0;0.1;0.2;0.3;1"
              dur="1.25s"
              begin="-0.875s"
            ></animate>
          </circle>
          <circle
            cx="43.819660112501055"
            cy="69.02113032590307"
            fill="#ffffff"
            r="3.6"
          >
            <animate
              attributeName="r"
              values="3.5999999999999996;3.5999999999999996;6;3.5999999999999996;3.5999999999999996"
              times="0;0.1;0.2;0.3;1"
              dur="1.25s"
              repeatCount="indefinite"
              begin="-0.75s"
            ></animate>
            <animate
              attributeName="fill"
              values="#ffffff;#ffffff;#536c79;#ffffff;#ffffff"
              repeatCount="indefinite"
              times="0;0.1;0.2;0.3;1"
              dur="1.25s"
              begin="-0.75s"
            ></animate>
          </circle>
          <circle
            cx="33.819660112501055"
            cy="61.75570504584947"
            fill="#ffffff"
            r="3.6"
          >
            <animate
              attributeName="r"
              values="3.5999999999999996;3.5999999999999996;6;3.5999999999999996;3.5999999999999996"
              times="0;0.1;0.2;0.3;1"
              dur="1.25s"
              repeatCount="indefinite"
              begin="-0.625s"
            ></animate>
            <animate
              attributeName="fill"
              values="#ffffff;#ffffff;#536c79;#ffffff;#ffffff"
              repeatCount="indefinite"
              times="0;0.1;0.2;0.3;1"
              dur="1.25s"
              begin="-0.625s"
            ></animate>
          </circle>
          <circle cx="30" cy="50" fill="#ffffff" r="3.6">
            <animate
              attributeName="r"
              values="3.5999999999999996;3.5999999999999996;6;3.5999999999999996;3.5999999999999996"
              times="0;0.1;0.2;0.3;1"
              dur="1.25s"
              repeatCount="indefinite"
              begin="-0.5s"
            ></animate>
            <animate
              attributeName="fill"
              values="#ffffff;#ffffff;#536c79;#ffffff;#ffffff"
              repeatCount="indefinite"
              times="0;0.1;0.2;0.3;1"
              dur="1.25s"
              begin="-0.5s"
            ></animate>
          </circle>
          <circle
            cx="33.819660112501055"
            cy="38.24429495415054"
            fill="#ffffff"
            r="3.6"
          >
            <animate
              attributeName="r"
              values="3.5999999999999996;3.5999999999999996;6;3.5999999999999996;3.5999999999999996"
              times="0;0.1;0.2;0.3;1"
              dur="1.25s"
              repeatCount="indefinite"
              begin="-0.375s"
            ></animate>
            <animate
              attributeName="fill"
              values="#ffffff;#ffffff;#536c79;#ffffff;#ffffff"
              repeatCount="indefinite"
              times="0;0.1;0.2;0.3;1"
              dur="1.25s"
              begin="-0.375s"
            ></animate>
          </circle>
          <circle
            cx="43.81966011250105"
            cy="30.97886967409693"
            fill="#ffffff"
            r="3.6"
          >
            <animate
              attributeName="r"
              values="3.5999999999999996;3.5999999999999996;6;3.5999999999999996;3.5999999999999996"
              times="0;0.1;0.2;0.3;1"
              dur="1.25s"
              repeatCount="indefinite"
              begin="-0.25s"
            ></animate>
            <animate
              attributeName="fill"
              values="#ffffff;#ffffff;#536c79;#ffffff;#ffffff"
              repeatCount="indefinite"
              times="0;0.1;0.2;0.3;1"
              dur="1.25s"
              begin="-0.25s"
            ></animate>
          </circle>
          <circle
            cx="56.180339887498945"
            cy="30.978869674096927"
            fill="#ffffff"
            r="4.10326"
          >
            <animate
              attributeName="r"
              values="3.5999999999999996;3.5999999999999996;6;3.5999999999999996;3.5999999999999996"
              times="0;0.1;0.2;0.3;1"
              dur="1.25s"
              repeatCount="indefinite"
              begin="-0.125s"
            ></animate>
            <animate
              attributeName="fill"
              values="#ffffff;#ffffff;#536c79;#ffffff;#ffffff"
              repeatCount="indefinite"
              times="0;0.1;0.2;0.3;1"
              dur="1.25s"
              begin="-0.125s"
            ></animate>
          </circle>
          <circle
            cx="66.18033988749895"
            cy="38.24429495415053"
            fill="#ffffff"
            r="5.06326"
          >
            <animate
              attributeName="r"
              values="3.5999999999999996;3.5999999999999996;6;3.5999999999999996;3.5999999999999996"
              times="0;0.1;0.2;0.3;1"
              dur="1.25s"
              repeatCount="indefinite"
              begin="0s"
            ></animate>
            <animate
              attributeName="fill"
              values="#ffffff;#ffffff;#536c79;#ffffff;#ffffff"
              repeatCount="indefinite"
              times="0;0.1;0.2;0.3;1"
              dur="1.25s"
              begin="0s"
            ></animate>
          </circle>
        </svg>
      )}

      <p
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '15px',
          opacity: 0.8,
          margin: '0 10px',
          color: msgColor && msgColor
        }}
      >
        {msg}
      </p>
    </div>
  );
}

Loading.propTypes = {
  component: PropTypes.node,
  msg: PropTypes.string,
  msgColor: PropTypes.string,
  style: PropTypes.object,
  simple: PropTypes.bool
};
