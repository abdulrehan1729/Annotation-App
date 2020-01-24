import React from "react";
import "./App.css";
import { Layer, Stage } from "react-konva";

import Annotate from "./components/Annotate.js";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shapes: [], // list of dimensions to be rendered as shapes
      isDrawing: false, // in the process of drawing a shape
      isDrawingMode: true, // allow shapes to be drawn
      isPolygon: false, //draw polyline
      isRect: true, // draw rect by default
      shapeCount: 0
    };
  }

  handleClick = e => {
    if (!this.state.isDrawingMode) {
      return;
    }
    // if we are drawing a shape, a click finishes the drawing
    if (this.state.isDrawing) {
      this.setState({
        isDrawing: !this.state.isDrawing
      });
      return;
    }

    // otherwise, add a new rectangle at the mouse position with 0 width and height,
    // and set isDrawing to true
    const newShapes = this.state.shapes.slice();
    this.setState({
      shapeCount: this.state.shapeCount + 1
    });
    let shapeName = "shape_" + this.state.shapeCount;
    newShapes.push({
      x: e.evt.layerX,
      y: e.evt.layerY,
      name: shapeName,
      width: 0,
      height: 0
    });

    this.setState({
      isDrawing: true,
      shapes: newShapes
    });
    // console.log(this.state.shapes);
  };

  handleMouseMove = e => {
    if (!this.state.isDrawingMode) return;

    const mouseX = e.evt.layerX;
    const mouseY = e.evt.layerY;

    // update the current rectangle's width and height based on the mouse position
    if (this.state.isDrawing) {
      // get the current shape (the last shape in this.state.shapes)
      const currShapeIndex = this.state.shapes.length - 1;
      const currShape = this.state.shapes[currShapeIndex];
      const newWidth = mouseX - currShape.x;
      const newHeight = mouseY - currShape.y;

      const newShapesList = this.state.shapes.slice();
      newShapesList[currShapeIndex] = {
        x: currShape.x, // keep starting position the same
        y: currShape.y,
        width: newWidth, // new width and height
        height: newHeight,
        name: currShape.name
      };

      this.setState({
        shapes: newShapesList
      });
    }
  };

  handleStateChange = (corX, corY, name) => {
    this.state.shapes.map(shape => {
      if (name === shape.name) {
        shape.x = corX;
        shape.y = corY;
      }
    });
  };
  handleCheckboxChange = () => {
    // toggle drawing mode
    this.setState({
      isDrawingMode: !this.state.isDrawingMode
    });
  };
  handleShapeCheckboxChange = () => {
    if (this.state.isDrawingMode) {
      this.setState({
        isPolygon: !this.state.isPolygon,
        isRect: !this.state.isRect
      });
    }
  };

  handleJsonSubmit = () => {
    console.log(JSON.stringify(this.state.shapes));
  };

  handleStageClick = e => {};
  render() {
    return (
      <div className="App">
        <input
          type="checkbox"
          checked={this.state.isDrawingMode}
          onChange={this.handleCheckboxChange}
        />
        <label>Drawing Mode</label>

        <input type="checkbox" onChange={this.handleShapeCheckboxChange} />
        <label>Polygon</label>
        <input type="checkbox" onChange={this.handleShapeCheckboxChange} />
        <label>Rect</label>
        <input type="submit" onClick={this.handleJsonSubmit} />

        <div className="img-container">
          <Stage
            width={1080}
            height={720}
            onContentClick={this.handleClick}
            onClick={this.handleStageClick}
            onContentMouseMove={this.handleMouseMove}
            visible={true}
          >
            <Layer ref="layer">
              {/* 
              render the shapes array - each element in 'shapes' renders a ColoredRect component 
              with that element's dimensions. Any time these dimensions change (in the handle 
              functions), the ColoredRect rerenders to reflect those changes.
            */}
              {this.state.shapes.map(shape => {
                return (
                  <Annotate
                    x={shape.x}
                    y={shape.y}
                    name={shape.name}
                    width={shape.width}
                    height={shape.height}
                    isDrawingMode={this.state.isDrawingMode}
                    handleStateChange={this.handleStateChange}
                    // pass isDrawingMode so we know when we can click on a shape
                  />
                );
              })}
            </Layer>
          </Stage>
        </div>
      </div>
    );
  }
}
