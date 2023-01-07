import React, { Component } from "react";

export default class App extends Component {
  c = "hero";
  render() {
    return <div>This is my first class based component {this.c}</div>;
  }
}
