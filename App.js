/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import ModuleInApp from "./src/Container/ModuleInApp/Index";

export default class App extends Component {
  render() {
    return <ModuleInApp />;
  }
}
