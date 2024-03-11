import React from 'react';
import {View, ViewStyle} from 'react-native';

interface BallProps {
  body: Matter.Body;
  radius: number;
  color: string;
}

const Ball: React.FC<BallProps> = ({body, radius, color}) => {
  const {x, y} = body.position;

  const ballStyle: ViewStyle = {
    position: 'absolute',
    left: x - radius,
    top: y - radius,
    width: radius * 2,
    height: radius * 2,
    borderRadius: radius,
    backgroundColor: color,
  };

  return <View style={ballStyle} />;
};

export default Ball;
