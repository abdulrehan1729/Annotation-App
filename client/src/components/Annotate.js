import Konva from "konva";
import { Rect, Group } from "react-konva";
import React, { Component } from "react";

export default class Annotate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "#00FF00"
    };
    // so we can access props and state in handleClick
    this.handleClick = this.handleClick.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
  }

  handleClick() {
    // change color if not drawing mode
    if (!this.props.isDrawingMode) {
      this.setState({
        color: Konva.Util.getRandomColor()
      });
    }
  }

  handleDragEnd = e => {
    let x = e.evt.offsetX;
    let y = e.evt.offsetY;
    let name = e.target.attrs.name;

    this.props.handleStateChange(x, y, name);
  };
  render() {
    return (
      <Group>
        <Rect
          name={this.props.name}
          x={this.props.x}
          y={this.props.y}
          width={this.props.width}
          height={this.props.height}
          stroke={this.state.color}
          strokeWidth={4}
          onClick={this.handleClick}
          draggable={true}
          onDragEnd={this.handleDragEnd}
        />
      </Group>
    );
  }
}
