import React from 'react';
import { Card, Row, Spin } from 'antd';

function Iframe(props) {
  const { template, endpoint } = props;
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    window.addEventListener('message', onMessageReceivedFromIframe);
    setTimeout(() => setLoading(false), 3000); // fallback
    return () =>
      window.removeEventListener('message', onMessageReceivedFromIframe);
  }, []);

  const onMessageReceivedFromIframe = e => {
    if (e.data === 'venues-script-loaded') {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingBottom: '1.2rem', height: '100%' }}>
      <Card
        style={{ minHeight: 'calc(100vh - 200px)' }}
        bodyStyle={{ paddingTop: 20, height: '100%' }}
      >
        <Row justify="center">
          {loading && <Spin />}
          <iframe
            src={endpoint}
            width="100%"
            title={template?.name || 'Iframe'}
            style={{ border: 'none', minHeight: 'calc(100vh - 200px)' }}
          />
        </Row>
      </Card>
    </div>
  );
}

export default Iframe;
