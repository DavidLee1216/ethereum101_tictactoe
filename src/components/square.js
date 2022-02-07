import React from "react";

export default class Square extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 0,
    };
  }
  handleClick = () => {
    this.props.squareClick(this.props.row, this.props.col, this.props.status);
  };
  render() {
    return (
      <div
        className="square d-flex flex-column justify-content-center"
        onClick={this.handleClick}
      >
        <h1>{this.props.val}</h1>
      </div>
    );
  }
}
