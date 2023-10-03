import React from 'react';
import styled from 'styled-components';
import { Tooltip, Modal, Row } from 'antd';
import validateColor from 'validate-color';
import { SketchPicker } from 'react-color';

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
      color: validateColor(this.props.color) ? this.props.color : '#000000'
    };
  }

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleChange = color => {
    const { hex } = color;
    this.setState({ color: hex });
    const { onColorSelect } = this.props;
    if (onColorSelect) {
      onColorSelect(hex);
    }
  };

  render() {
    return (
      <>
        <Tooltip title="Pick Color">
          <Swatch onClick={this.handleClick}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '2px',
                background: this.state.color
              }}
            />
          </Swatch>
        </Tooltip>
        <Modal
          visible={this.state.displayColorPicker}
          title="Pick Color"
          onCancel={this.handleClose}
          footer={null}
        >
          <Row style={{ height: '100%' }} align="middle" justify="center">
            <SketchPicker
              className="modal-color-picker"
              disableAlpha={true}
              color={this.state.color}
              onChange={this.handleChange}
            />
          </Row>
        </Modal>
      </>
    );
  }
}

export default ColorPicker;

const Swatch = styled.div`
  padding: 3px;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  display: inline-block;
  cursor: pointer;
`;
