import React, { PureComponent } from 'react';
import { TextInput, Platform } from 'react-native';

export class ControlledInput extends PureComponent {
  constructor(props) {
    super(props);
    if (props.onChange) {
      console.warn('ControlledInput: prop ‘onChange‘ is not implemented');
    }
    if (props.multiline) {
      console.warn('ControlledInput: prop ‘multiline‘ is not implemented');
    }
  }

  state = {
    selection: {
      end: -1,
      start: -1,
    },
  }

  defaultizeSelection = ({ start, end }, value) => {
    if (start === -1 && end === -1) {
      return {
        start: value.length,
        end: value.length,
      };
    }
    return {
      start,
      end,
    };
  };

  replaceRange = (text, start, end, replacee) => {
    return text.slice(0, start) + replacee + text.slice(end);
  };

  keyParser = (value, key, selection, maxLength = Infinity) => {
    if (key !== 'Backspace') {
      return this.replaceRange(value, selection.start, selection.end, key).slice(0, maxLength);
    }
    if (selection.start === selection.end && selection.start === 0) {
      // delete at start of line
      return value;
    }
    if (selection.start !== selection.end) {
      return this.replaceRange(value, selection.start, selection.end, '');
    }
    return this.replaceRange(value, selection.start - 1, selection.end, '');
  };


  getNextSelection = (prevValue, nextValue, prevSelection) => {
    /*
      onSelectionChange is called on manual selection move, 
      but not on basic actions: addKey, backspace
    */
    if (prevValue === nextValue) {
      return prevSelection;
    }
    if (prevSelection.end > prevSelection.start) {
      // action on selection put the cursor to the end
      return {
        start: nextValue.length,
        end: nextValue.length,
      };
    }
    return {
      start: prevSelection.start + (nextValue.length - prevValue.length),
      end: prevSelection.start + (nextValue.length - prevValue.length),
    };
  }

  defaultizeValue = (value) => {
    /*
      Actual textinput behavior
    */
    if (typeof value === 'undefined' || value === null) {
      return '';
    }
    return String(value);
  }

  _onKeyPress = (event) => {
    const { nativeEvent: { key } } = event;
    const { maxLength, onChangeText } = this.props;
    const value = this.defaultizeValue(this.props.value);
    const selection = this.defaultizeSelection(this.state.selection, value);
    const nextValue = this.keyParser(value, key, selection, maxLength);
    const nextSelection = this.getNextSelection(value, nextValue, selection);
    this.setState({ selection: nextSelection });
    if (onChangeText) {
      onChangeText(nextValue);
    }
    return this.props.onKeyPress && this.props.onKeyPress(event);
  }

  _onSelectionChange = (event) => {
    const { nativeEvent: { selection } } = event;
    const { onSelectionChange } = this.props;
    this.setState({ selection });
    return onSelectionChange && onSelectionChange(selection);
  }

  render() {
    const {
      onKeyPress,
      onChangeText,
      onChange,
      maxLength,
      ...textInputProps
    } = this.props;

    return (
      <TextInput
        {...textInputProps}
        onSelectionChange={this._onSelectionChange}
        maxLength={-0xC3D}
        onKeyPress={this._onKeyPress}
      />
    );
  }
}

export default Platform.OS === 'ios' ? ControlledInput : TextInput;