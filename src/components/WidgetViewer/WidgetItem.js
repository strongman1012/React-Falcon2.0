import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Col,
  Divider,
  Empty,
  notification,
  Row,
  Spin,
  Tooltip,
  Card
} from 'antd';
import {
  Doughnut,
  Pie,
  Line,
  Scatter,
  Bar,
  HorizontalBar,
  Radar,
  Polar,
  Bubble
} from 'react-chartjs-2';

import Image from 'components/custom/Image';
import { isEmpty, isScript } from 'helpers/utils';
import CustomDivider from 'components/common/Divider';
import ImagesCarousel from 'components/custom/ImagesCarousel';

function WidgetItem(props) {
  const navigate = useNavigate();
  const {
    pureOnly = false,
    type_ref,
    title,
    show_titleYN,
    header_htmlISplaintextbox,
    htmlISplaintextbox,
    footer_htmlISplaintextbox,
    data,
    buttons
  } = props.widgetData;

  const getBodyContent = () => {
    switch (type_ref) {
      case 'kpi':
        return (
          <Row justify="center" align="middle" style={{ minHeight: 100 }}>
            <h3
              className="m-0"
              style={{ fontSize: 40, opacity: 0.7 }}
              dangerouslySetInnerHTML={{ __html: data }}
            />
          </Row>
        );

      case 'html':
        return (
          <>
            {htmlISplaintextbox && (
              <div dangerouslySetInnerHTML={{ __html: htmlISplaintextbox }} />
            )}
            {data && (
              <Row justify="center" align="middle">
                <h3 dangerouslySetInnerHTML={{ __html: data }} />
              </Row>
            )}
          </>
        );

      case 'html_list':
        return (
          <>
            {htmlISplaintextbox && (
              <div dangerouslySetInnerHTML={{ __html: htmlISplaintextbox }} />
            )}
            {!isEmpty(data) && (
              <>
                {data.map((item, i) => {
                  return (
                    <React.Fragment key={i}>
                      {isScript(item) ? (
                        <InsertScript key={i} script={item} serial={i} />
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: item }} />
                      )}
                      {i + 1 !== data.length && <Divider />}
                    </React.Fragment>
                  );
                })}
              </>
            )}
          </>
        );

      case 'img_list': {
        const images = isEmpty(data) ? [] : data;
        return (
          <Row gutter={[20, 20]} justify="center">
            {images.map((img, index) => {
              const imageElement = (
                <Image
                  width="100px"
                  preview={false}
                  url={img.uri || img.thumbnail}
                  style={{ height: 100 }}
                  placeholderProps={{ height: 100 }}
                  onClick={e => {
                    e.preventDefault();
                    img.route && navigate(img.route);
                  }}
                />
              );

              // const linkElement = img.route ? (
              // 	<ImageLink onClick={() => navigate(img.route)} />
              // ) : null

              const item = (
                <Col style={{ position: 'relative' }}>
                  {imageElement}
                  {/* {linkElement} */}
                </Col>
              );

              return img.title ? (
                <Tooltip title={img.title} key={index}>
                  {item}
                </Tooltip>
              ) : (
                <Col>{item}</Col>
              );
            })}
          </Row>
        );
      }

      case 'img_carousel':
        return <ImagesCarousel images={data} withText={true} />;

      case 'chart': {
        // console.log(data)
        const { height, width, type, data: chartData, options } = data || {};
        const chartProps = { height, width, data: chartData, options };

        switch (type) {
          case 'line':
            return <Line {...chartProps} />;
          case 'doughnut':
            return <Doughnut {...chartProps} />;
          case 'pie':
            return <Pie {...chartProps} />;
          case 'scatter':
            return <Scatter {...chartProps} />;
          case 'bar':
            return <Bar {...chartProps} />;
          case 'horizontalBar':
            return <HorizontalBar {...chartProps} />;
          case 'radar':
            return <Radar {...chartProps} />;
          case 'polar':
            return <Polar {...chartProps} />;
          case 'bubble':
            return <Bubble {...chartProps} />;
          default:
            return 'Chart type not implemented!';
        }
      }

      case 'table': {
        const tableData = data || [];

        return isEmpty(tableData) ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <div className="table-responsive-md hide-native-scrollbar">
            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  {Object.keys(tableData[0]).map((title, index) => (
                    <th key={index} scope="col">
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i}>
                    {Object.keys(row).map((title, index) => (
                      <td key={title + index}>{row[title]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      default:
        return htmlISplaintextbox ? (
          <div dangerouslySetInnerHTML={{ __html: htmlISplaintextbox }} />
        ) : null;
    }
  };

  const bodyContent = getBodyContent();

  if (pureOnly) return bodyContent;

  return (
    <Card className="m-0" bodyStyle={{ padding: '15px 10px 10px' }}>
      {show_titleYN && (
        <>
          <div>
            <h5 className="m-0 p-0" style={{ textAlign: 'center' }}>
              {title}
            </h5>
            {header_htmlISplaintextbox && (
              <div
                className="mt-1"
                dangerouslySetInnerHTML={{ __html: header_htmlISplaintextbox }}
              />
            )}
          </div>
          <CustomDivider />
        </>
      )}

      <Row style={{ minHeight: 120 }} justify="center" align="middle">
        {bodyContent}
      </Row>

      {(footer_htmlISplaintextbox || !isEmpty(buttons)) && (
        <div>
          {footer_htmlISplaintextbox && (
            <div
              className="mt-1"
              dangerouslySetInnerHTML={{ __html: footer_htmlISplaintextbox }}
            />
          )}
          <Row
            justify="center"
            style={{ marginTop: footer_htmlISplaintextbox ? 10 : 0 }}
            gutter={[10, 10]}
          >
            {buttons.map((btn, index) => {
              return (
                <Col key={index}>
                  <Button
                    onClick={() => {
                      navigate(btn.route);
                    }}
                  >
                    {btn.title}
                  </Button>
                </Col>
              );
            })}
          </Row>
        </div>
      )}
    </Card>
  );
}

export default WidgetItem;

// const ImageLink = styled(FiExternalLink)`
// 	font-size: 18px;
// 	cursor: pointer;
// 	position: absolute;
// 	top: 15px;
// 	right: 15px;
// 	&:hover {
// 		color: blue;
// 	}
// `

function InsertScript(props) {
  const containerRef = React.useRef(null);
  const [loading, setLoading] = React.useState(true);
  const script = props.script?.includes('&lt;script')
    ? htmlDecode(props.script)
    : props.script;
  // console.log('Raw string script....', script)

  React.useEffect(() => {
    if (containerRef.current) {
      try {
        runScripts(containerRef.current);
      } catch {
        notification.error({
          message: 'Failed to load dynamic scripts.',
          description:
            'Please reload! If the error persist, please contact administrator.',
          duration: 6
        });
      }
    }
    setTimeout(() => setLoading(false), 1500);
  }, []);

  return (
    <>
      {loading && (
        <Row style={{ minWidth: '100%' }} justify="center" align="middle">
          <Spin />
        </Row>
      )}
      {/* Put id="hubspotForm" and target: '#hubspotForm' inside hubspot form is the key here. */}
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}

function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent;
}

function runScripts(body_el, tag) {
  // Finds and executes scripts in a newly added element's body.
  // Needed since innerHTML does not run scripts.
  //
  // Argument body_el is an element in the dom.

  function nodeName(elem, name) {
    return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
  }

  function evalScript(elem, id, callback) {
    try {
      const data = elem?.text || elem?.textContent || elem?.innerHTML || '',
        head =
          document.getElementsByTagName('head')[0] || document.documentElement;

      const script = document.createElement('script');
      script.type = 'text/javascript';
      if (id !== '') {
        script.setAttribute('id', id);
      }

      if (elem?.src) {
        script.src = elem.src;
        head.appendChild(script);
        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        script.onreadystatechange = callback;
        script.onload = callback;
      } else {
        try {
          // doesn't work on ie...
          script.appendChild(document.createTextNode(data));
        } catch (e) {
          // IE has funky script nodes
          script.text = data;
        }
        head.appendChild(script);
        callback();
      }
    } catch (error) {
      notification.error({
        message: 'Failed to load dynamic scripts.',
        description:
          'Please reload! If the error persist, please contact administrator.',
        duration: 6
      });
    }
  }

  function walk_children(node) {
    const scripts = [];
    let children_nodes = node.childNodes;
    let child;

    if (children_nodes === undefined) return;

    for (let i = 0; i < children_nodes.length; i++) {
      child = children_nodes[i];
      if (
        nodeName(child, 'script') &&
        (!child.type || child.type.toLowerCase() === 'text/javascript')
      ) {
        scripts.push(child);
      } else {
        var new_scripts = walk_children(child);
        for (let j = 0; j < new_scripts.length; j++) {
          scripts.push(new_scripts[j]);
        }
      }
    }

    return scripts;
  }

  let i = 0;

  function execute_script() {
    let script = scripts[i];

    if (script?.parentNode) {
      script.parentNode.removeChild(script);
    }

    try {
      evalScript(scripts[i], tag + '_' + i, function () {
        if (i < scripts.length - 1) {
          execute_script(++i);
        }
      });
    } catch (error) {
      notification.error({
        message: 'Failed to load dynamic scripts.',
        description:
          'Please reload! If the error persist, please contact administrator.',
        duration: 6
      });
    }
  }

  // main section of function
  if (tag === undefined) tag = 'tmp';

  const scripts = walk_children(body_el);

  // console.log(scripts)

  execute_script();
}
