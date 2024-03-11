import React from 'react';
import {StyleSheet, View} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import Matter from 'matter-js';
import Ball from './Ball';
import Wall from './Wall';
import {createWall} from './createWall';
import {categories} from './collisionCategories';

/**
 * Physics engine update function. Adjusts sub-steps based on the highest ball velocity.
 */
const Physics = (entities: any, {time}: any) => {
  let engine = entities.physics.engine;
  let {whiteBall, blackBall} = entities;

  // Calculate velocity magnitudes & determine the higher velocity for sub-steps calculation
  const velocityMagnitudeWhite = Math.sqrt(
    whiteBall.body.velocity.x ** 2 + whiteBall.body.velocity.y ** 2,
  );
  const velocityMagnitudeBlack = Math.sqrt(
    blackBall.body.velocity.x ** 2 + blackBall.body.velocity.y ** 2,
  );
  const higherVelocityMagnitude = Math.max(
    velocityMagnitudeWhite,
    velocityMagnitudeBlack,
  );

  // Dynamic sub-steps based on velocity magnitude
  let substeps = 1;
  if (higherVelocityMagnitude > 5 && higherVelocityMagnitude <= 10) {
    substeps = 2;
  } else if (higherVelocityMagnitude > 10) {
    substeps = 4;
  }

  // Perform physics updates in calculated sub-steps
  const delta = time.delta / substeps;
  for (let i = 0; i < substeps; i++) {
    Matter.Engine.update(engine, delta);
  }

  return entities;
};

/**
 * Main game container component.
 */
const SquareContainer: React.FC = () => {
  // Game and physics engine setup
  const engine = Matter.Engine.create({enableSleeping: false});
  const world = engine.world;
  engine.gravity.y = 0; // No gravity in game

  // Game container dimensions
  const containerWidth = 300;
  const containerHeight = 300;
  const wallThickness = 1; // Wall thickness for collision boundaries
  const ballRadius = 7.5; // Ball radius for gameplay

  // Walls setup using the createWall utility function
  const leftWall = createWall(
    wallThickness / 2,
    containerHeight / 2,
    wallThickness,
    containerHeight,
  );
  const rightWall = createWall(
    containerWidth - wallThickness / 2,
    containerHeight / 2,
    wallThickness,
    containerHeight,
  );
  const ceiling = createWall(
    containerWidth / 2,
    wallThickness / 2,
    containerWidth,
    wallThickness,
  );
  const floor = createWall(
    containerWidth / 2,
    containerHeight - wallThickness / 2,
    containerWidth,
    wallThickness,
  );

  // Balls setup with initial velocities
  const whiteBall = Matter.Bodies.circle(
    containerWidth / 2,
    containerHeight - ballRadius - wallThickness,
    ballRadius,
    {
      isStatic: false,
      restitution: 1,
      inertia: Infinity,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      collisionFilter: {
        category: categories.whiteBall,
        mask: categories.wall,
      },
    },
  );

  const blackBall = Matter.Bodies.circle(
    containerWidth / 2,
    ballRadius + wallThickness,
    ballRadius,
    {
      isStatic: false,
      restitution: 1,
      inertia: Infinity,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      collisionFilter: {
        category: categories.blackBall,
        mask: categories.wall,
      },
    },
  );

  const getRandomVelocity = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  Matter.Body.setVelocity(whiteBall, {
    x: getRandomVelocity(-5, 5),
    y: getRandomVelocity(-10, -5),
  });
  Matter.Body.setVelocity(blackBall, {
    x: getRandomVelocity(-5, 5),
    y: getRandomVelocity(5, 10),
  });

  // Add all game objects to the physics world
  Matter.World.add(world, [
    leftWall,
    rightWall,
    ceiling,
    floor,
    whiteBall,
    blackBall,
  ]);

  // Entities definition for GameEngine
  const entities = {
    physics: {engine, world},
    leftWall: {
      body: leftWall,
      size: [wallThickness, containerHeight],
      color: 'black',
      renderer: (
        <Wall
          body={leftWall}
          size={[wallThickness, containerHeight]}
          color="black"
        />
      ),
    },
    rightWall: {
      body: rightWall,
      size: [wallThickness, containerHeight],
      color: 'black',
      renderer: (
        <Wall
          body={rightWall}
          size={[wallThickness, containerHeight]}
          color="black"
        />
      ),
    },
    ceiling: {
      body: ceiling,
      size: [containerWidth, wallThickness],
      color: 'black',
      renderer: (
        <Wall
          body={ceiling}
          size={[containerWidth, wallThickness]}
          color="black"
        />
      ),
    },
    floor: {
      body: floor,
      size: [containerWidth, wallThickness],
      color: 'black',
      renderer: (
        <Wall
          body={floor}
          size={[containerWidth, wallThickness]}
          color="black"
        />
      ),
    },
    whiteBall: {
      body: whiteBall,
      radius: ballRadius,
      color: 'white',
      renderer: <Ball body={whiteBall} radius={ballRadius} color="white" />,
    },
    blackBall: {
      body: blackBall,
      radius: ballRadius,
      color: 'black',
      renderer: <Ball body={blackBall} radius={ballRadius} color="black" />,
    },
  };

  // Component rendering with GameEngine
  return (
    <View style={styles.container}>
      <GameEngine systems={[Physics]} entities={entities} running={true}>
        {/* Placeholder for additional game components */}
      </GameEngine>
    </View>
  );
};

// StyleSheet for game container view
const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
    backgroundColor: 'grey', // Background color for game area
  },
});

export default SquareContainer;
