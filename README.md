# ⚠️DEPRECIATED


### This issue has been fixed in v0.57.1 [(with this commit)](https://github.com/facebook/react-native/commit/2307ea60d03edd234511bfe32474c453f30c1693)



# react-native-controlled-input
Fix controlled input on react-native IOS, broken since version 0.53


[RN issue #18874](https://github.com/facebook/react-native/issues/18874)


@rplankenhorn solution breaks onChange/onChangeText, but allow full controlled input (using onKeyPress)    
I started of @rplankenhorn solution, and then forwarded a "controlled" flag to RCTBaseTextInputView  
which only block textInputShouldChangeTextInRange on controlled input.  
I then created a <ControlledTextInput/> module which recreate onChangeText behavior using onKeyPress and onSelectionChange  


# Installation
### 1)
```
yarn add react-native-controlled-input
```

### 2)
Apply this fix in `Libraries/Text/TextInput/RCTBaseTextInputView.m`, line 303


[See the diff here](http://res.cloudinary.com/wavy/image/upload/v1534894912/Screen_Shot_2018-08-22_at_01.39.51.png)


```
  if (_onTextInput) {
    _onTextInput(@{
      @"text": _predictedText,
      @"previousText": previousText,
      @"range": @{
        @"start": @(range.location),
        @"end": @(range.location + range.length)
      },
      @"eventCount": @(_nativeEventCount),
    });
    if (_maxLength && [_maxLength intValue] == -0xC3D) {
      return NO;
    }
  }
  return YES;
```

# Usage
It handle every TextInput props except `multiline` and `onChange`
```
export default class Container extends Component {
  state = {
    value: '',
  }

  render() {
    return (
      <ControlledInput
       // filter only numberic characters
        onChangeText={(value) => this.setState({ value: value.replace(/\D/g, '') })}
        value={this.state.value}
        style={{ width: 300, height: 70, borderWidth: 1 }}
      />
    );
  }
}
````
# Todo

- [ ] Controlled/Uncontrolled detection adaptation
- [ ] Multiline



*Free Software FTW*
