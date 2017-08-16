import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  View
} from 'react-native';

class AnimatedChildRoute extends Component {

  static propTypes = {
    children: PropTypes.node,
    anim: PropTypes.object,
    atParent: PropTypes.bool,
    animating: PropTypes.bool
  }

  state = {
    // we're going to save the old children so we can render
    // it when it doesnt' actually match the location anymore
    previousChildren: null
  }

  componentWillReceiveProps(nextProps) {
    // figure out what to do with the children
    const navigatingToParent = nextProps.atParent && !this.props.atParent
    const animationEnded = this.props.animating && !nextProps.animating

    if (navigatingToParent) {
      // we were rendering, but now we're heading back up to the parent,
      // so we need to save the children (har har) so we can render them
      // while the animation is playing
      this.setState({
        previousChildren: this.props.children
      })
    } else if (animationEnded) {
      // When we're done animating, we can get rid of the old children.
      this.setState({
        previousChildren: null
      })
    }
  }

  render() {
    const { anim, children } = this.props
    const { previousChildren } = this.state
    return (
      <Animated.View style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: anim.interpolate({
          inputRange: [ 0, 1 ],
          outputRange: [ 20, 0 ]
        }),
        opacity: anim.interpolate({
          inputRange: [ 0, 0.75 ],
          outputRange: [ 0, 1 ]
        })
      }}>
        {/* render the old ones if we have them */}
        {previousChildren || children}
      </Animated.View>
    )
  }
}
