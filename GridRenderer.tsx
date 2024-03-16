import React from 'react';
import {View, ViewStyle} from 'react-native';
import {Body} from 'matter-js';

interface GridRendererProps {
  body: any; // Use a more specific type if available
  color?: string; // Default color if you want to use one
}

const GridRenderer: React.FC<GridRendererProps> = ({
  body,
  color = 'transparent',
}) => {
  const {bodies} = body;

  return (
    <>
      {bodies.map((pixel: Body, index: number) => {
        const {position, angle, render} = pixel;
        const width = pixel.bounds.max.x - pixel.bounds.min.x;
        const height = pixel.bounds.max.y - pixel.bounds.min.y;
        const x = position.x - width / 2;
        const y = position.y - height / 2;

        const style: ViewStyle = {
          position: 'absolute',
          left: x,
          top: y,
          width: width,
          height: height,
          backgroundColor: render.fillStyle || color,
          transform: [{rotate: `${angle}rad`}],
        };

        return <View key={index} style={style} />;
      })}
    </>
  );
};

export default GridRenderer;
