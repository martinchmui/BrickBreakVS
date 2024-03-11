import React from 'react';
import {View, ViewStyle} from 'react-native';

interface WallProps {
  size: [number, number];
  body: {
    position: {
      x: number;
      y: number;
    };
  };
  color: string;
}

const Wall: React.FC<WallProps> = ({size, body, color}) => {
  const [width, height] = size;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  const style: ViewStyle = {
    position: 'absolute',
    left: x,
    top: y,
    width,
    height,
    backgroundColor: color,
  };

  return <View style={style} />;
};

export default Wall;
