import React, { Component } from "react";
import Konva from "konva";
import { Rect, Group, Line } from "react-konva";

class Polyline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "#00FF00",
      strokeWidth: 4
    };
    // so we can access props and state in handleClick
    // this.handleClick = this.handleClick.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
  }

  handleDragEnd = e => {
    let x = e.evt.offsetX;
    let y = e.evt.offsetY;
    let name = e.target.attrs.name;

    // console.log(e.evt);
    this.props.handleStateChange(x, y, name);
  };

  render() {
    return (
      <Group>
        <Line
          points={this.props.points}
          stroke={this.state.color}
          strokeWidth={this.state.strokeWidth}
          draggable={true}
          closed={false}
        />
      </Group>
    );
  }
}

export default Polyline;
