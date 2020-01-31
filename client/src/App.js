import React from "react";
import "./App.css";
import { Layer, Stage, Group } from "react-konva";
import Rect from "./components/RectBox.js";
import Polyline from "./components/Polyline";
import Transform from "./components/Transform";
// import keydown, { Keys } from "react-keydown";

// import { urlencoded } from "body-parser";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shapes: [], // list of dimensions to be rendered as shapes
      isDrawing: false, // in the process of drawing a shape
      isDrawingMode: true, // allow shapes to be drawn
      isPolygon: false, //draw polyline
      endPolygon: false,
      isRect: true, // draw rect by default
      shapeCount: 0,
      selectedShapeName: "",
      imgHeight: 0,
      imgWidth: 0,
      points: [],
      src: "https://homepages.cae.wisc.edu/~ece533/images/watch.png"
    };
  }

  componentDidMount() {
    this.imgLoad();
  }

  handleClick = e => {
    if (!this.state.isDrawingMode) {
      return;
    }

    // if we are drawing a shape, a click finishes the drawing
    if (this.state.isDrawing) {
      if (this.state.isPolygon && !this.state.endPolygon) {
        this.state.points.push(e.evt.layerX);
        this.state.points.push(e.evt.layerY);
      }
      if (!this.state.isPolygon) {
        this.setState({
          isDrawing: !this.state.isDrawing
        });
        return;
      }
    }

    // otherwise, add a new rectangle at the mouse position with 0 width and height,
    // and set isDrawing to true
    const newShapes = this.state.shapes.slice();
    if (!this.state.isPolygon) {
      this.setState({
        shapeCount: this.state.shapeCount + 1
      });
    }
    let shapeName = "shape_" + this.state.shapeCount;
    if (this.state.endPolygon) {
      newShapes.push({
        points: this.state.points,
        name: shapeName
      });
      this.setState({
        points: []
      });
    }
    if (!this.state.isPolygon /*&& !this.state.endPolygon*/) {
      newShapes.push({
        x: e.evt.layerX,
        y: e.evt.layerY,
        name: shapeName,
        width: 0,
        height: 0
      });
    }

    this.setState({
      isDrawing: true,
      shapes: newShapes
    });
  };

  handleMouseMove = e => {
    if (!this.state.isDrawingMode) return;

    const mouseX = e.evt.layerX;
    const mouseY = e.evt.layerY;

    // update the current rectangle's width and height based on the mouse position
    if (this.state.isDrawing && this.state.shapes.length > 0) {
      // get the current shape (the last shape in this.state.shapes)
      const currShapeIndex = this.state.shapes.length - 1;
      const currShape = this.state.shapes[currShapeIndex];
      const newWidth = mouseX - currShape.x;
      const newHeight = mouseY - currShape.y;

      const newShapesList = this.state.shapes.slice();
      if (!this.state.isPolygon) {
        newShapesList[currShapeIndex] = {
          x: currShape.x, // keep starting position the same
          y: currShape.y,
          // points: this.state.points,
          width: newWidth, // new width and height
          height: newHeight,
          name: currShape.name
        };
      } else {
        newShapesList[currShapeIndex] = {
          name: currShape.name,
          points: this.state.point
        };
      }
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

  handleShapeClick = e => {
    this.setState({
      selectedShapeName: e.target.name()
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
        isDrawing: !this.state.isDrawing
      });
    }
  };

  handleJsonSubmit = () => {
    console.log(JSON.stringify(this.state.shapes));
  };

  handleEnter = e => {
    if (this.state.isPolygon)
      if (e.key === "Enter") {
        console.log("enter is pressed");
        this.setState({
          endPolygon: !this.state.endPolygon,
          shapeCount: this.state.shapeCount + 1
        });
        return;
      }
  };

  imgLoad = () => {
    let img = new Image();
    img.src = this.state.src;
    img.onload = () => {
      this.setState({
        imgHeight: img.height,
        imgWidth: img.width
      });
    };
  };

  render() {
    const divStyle = {
      width: this.state.imgWidth,
      height: this.state.imgHeight,
      backgroundImage: `url(${this.state.src})`
    };
    return (
      <div className="App" tabIndex="0" onKeyPress={this.handleEnter}>
        <input
          type="checkbox"
          checked={this.state.isDrawingMode}
          onChange={this.handleCheckboxChange}
        />
        <label>Drawing Mode</label>

        <input type="checkbox" onChange={this.handleShapeCheckboxChange} />
        <label>Polygon</label>

        <input type="submit" onClick={this.handleJsonSubmit} />

        <div className="img-container" style={divStyle}>
          <Stage
            width={this.state.imgWidth}
            height={this.state.imgHeight}
            onContentClick={this.handleClick}
            onClick={this.handleShapeClick}
            onContentMouseMove={this.handleMouseMove}
            visible={true}
          >
            <Layer ref="layer">
              {this.state.shapes.map((shape, i) => {
                return (
                  <Group key={i}>
                    {!this.state.isPolygon ? (
                      <Rect
                        key={i}
                        x={shape.x}
                        y={shape.y}
                        name={shape.name}
                        width={shape.width}
                        height={shape.height}
                        isDrawingMode={this.state.isDrawingMode}
                        isPolygon={this.state.isPolygon}
                        handleStateChange={this.handleStateChange}
                        points={shape.points}
                      />
                    ) : (
                      <Polyline
                        key={i}
                        name={shape.name}
                        isDrawingMode={this.state.isDrawingMode}
                        handleStateChange={this.handleStateChange}
                        points={shape.points}
                      />
                    )}
                  </Group>
                );
              })}
              <Transform selectedShapeName={this.state.selectedShapeName} />
            </Layer>
          </Stage>
        </div>
      </div>
    );
  }
}
