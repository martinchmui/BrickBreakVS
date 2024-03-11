import Matter from 'matter-js';
import {categories} from './collisionCategories';

export const createWall = (
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  return Matter.Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    restitution: 1,
    collisionFilter: {
      category: categories.wall,
      mask: categories.whiteBall | categories.blackBall,
    },
  });
};
