import React from 'react';
import {View, ViewStyle} from 'react-native';

interface SquareProps {
  size: number;
  color: string;
  position: {x: number; y: number};
}

const Square: React.FC<SquareProps> = React.memo(({size, color, position}) => {
  const style: ViewStyle = {
    width: size,
    height: size,
    backgroundColor: color,
    position: 'absolute',
    left: position.x,
    top: position.y,
  };

  return <View style={style} />;
});

export default Square;
