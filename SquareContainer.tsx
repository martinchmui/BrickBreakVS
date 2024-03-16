import React from 'react';
import {StyleSheet, View} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import Matter from 'matter-js';
import Ball from './Ball'; // Custom component for rendering balls
import Wall from './Wall'; // Custom component for rendering walls
import {createWall} from './createWall'; // Utility function to simplify wall creation
import {categories} from './collisionCategories'; // Collision categories for filtering collisions
import GridRenderer from './GridRenderer'; // Custom renderer for the grid
import {map} from './map'; // Map layout indicating where blocks should be placed

/**
 * Custom physics engine update function for the game.
 * It adjusts physics updates based on a fixed number of sub-steps to ensure stability.
 */
const Physics = (entities: any, {time}: any) => {
  let engine = entities.physics.engine;
  const substeps = 50; // Fixed number of sub-steps for consistent physics simulation

  // Calculate the delta time for each sub-step
  const delta = time.delta / substeps;

  // Perform physics updates in sub-steps for smoother simulation
  for (let i = 0; i < substeps; i++) {
    Matter.Engine.update(engine, delta);
  }

  return entities; // Return updated entities for the next frame
};

/**
 * The main React component representing the game container.
 * It initializes the game environment and physics engine.
 */
const SquareContainer: React.FC = () => {
  // Setup for the game and physics engine
  const engine = Matter.Engine.create({enableSleeping: false});
  const world = engine.world;
  engine.gravity.y = 0; // Disable gravity for this game

  // Define the dimensions for the game container and game elements
  const containerWidth = 320;
  const containerHeight = 320;
  const wallThickness = 1; // Thickness of walls around the game area
  const ballRadius = 7.5; // Radius of the balls used in the game

  // Create walls around the game area using the utility function
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

  // Initialize balls with specific properties for game mechanics
  const whiteBall = Matter.Bodies.circle(
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
        category: categories.whiteBall,
        mask: categories.wall | categories.whiteBlock,
      },
      label: 'ball',
      render: {fillStyle: 'white'},
    },
  );

  const blackBall = Matter.Bodies.circle(
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
        category: categories.blackBall,
        mask: categories.wall | categories.blackBlock,
      },
      label: 'ball',
      render: {fillStyle: 'black'},
    },
  );
  // Helper function to create wall entities more concisely
  const createWallEntity = (
    body: Matter.Body,
    width: number,
    height: number,
  ) => ({
    body,
    size: [width, height],
    color: 'black',
    renderer: <Wall body={body} size={[width, height]} color="black" />,
  });

  // Helper function to create ball entities more concisely
  const createBallEntity = (
    body: Matter.Body,
    radius: number,
    color: string,
  ) => ({
    body,
    radius,
    color,
    renderer: <Ball body={body} radius={radius} color={color} />,
  });

  // Set initial velocities for the balls
  Matter.Body.setVelocity(whiteBall, {x: -5, y: -5});
  Matter.Body.setVelocity(blackBall, {x: -5, y: -5});

  // Define the grid size and layout based on the game design
  const pixelSize = 80; // Size of each block in the grid
  const gridRows = 4;
  const gridCols = 4;

  // Generate the grid of blocks based on the predefined map layout
  const grid = Matter.Composites.stack(
    0,
    0,
    gridCols,
    gridRows,
    0,
    0,
    (x: number, y: number) => {
      const mapValue = map[y / pixelSize][x / pixelSize]; // Determine the block type based on the map
      const isBlack = mapValue === 'b';
      return Matter.Bodies.rectangle(x, y, pixelSize, pixelSize, {
        isStatic: true,
        render: {fillStyle: isBlack ? 'black' : 'white'},
        collisionFilter: {
          category: isBlack ? categories.blackBlock : categories.whiteBlock,
          mask: isBlack ? categories.blackBall : categories.whiteBall,
        },
        restitution: 1,
        label: 'block',
      });
    },
  );

  // Add all game elements to the physics world
  Matter.World.add(world, [
    leftWall,
    rightWall,
    ceiling,
    floor,
    grid,
    whiteBall,
    blackBall,
  ]);

  // Listen for collisions to apply game-specific logic
  Matter.Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach(pair => {
      let ball, block;
      if (pair.bodyA.label === 'ball' && pair.bodyB.label === 'block') {
        ball = pair.bodyA;
        block = pair.bodyB;
      } else if (pair.bodyB.label === 'ball' && pair.bodyA.label === 'block') {
        ball = pair.bodyB;
        block = pair.bodyA;
      }

      if (ball && block) {
        // Logic for changing block colors and collision categories upon collision
        const ballColor = ball.render.fillStyle;
        block.render.fillStyle = ballColor === 'black' ? 'white' : 'black';

        if (ballColor === 'black') {
          block.collisionFilter.category = categories.whiteBlock;
          block.collisionFilter.mask = categories.whiteBall;
        } else {
          block.collisionFilter.category = categories.blackBlock;
          block.collisionFilter.mask = categories.blackBall;
        }
      }
    });
  });

  // Define the entities for the GameEngine component
  const entities = {
    physics: {engine, world},
    leftWall: createWallEntity(leftWall, wallThickness, containerHeight),
    rightWall: createWallEntity(rightWall, wallThickness, containerHeight),
    ceiling: createWallEntity(ceiling, containerWidth, wallThickness),
    floor: createWallEntity(floor, containerWidth, wallThickness),
    grid: {
      body: grid,
      renderer: <GridRenderer body={grid} />,
    },
    whiteBall: createBallEntity(whiteBall, ballRadius, 'white'),
    blackBall: createBallEntity(blackBall, ballRadius, 'black'),
  };
  // Render the game container with the GameEngine and all entities
  return (
    <View style={styles.container}>
      <GameEngine systems={[Physics]} entities={entities} running={true}>
        {/* Additional game components could be placed here */}
      </GameEngine>
    </View>
  );
};

// Styles for the game container view
const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 320,
    backgroundColor: 'grey', // Set the background color for the game area
  },
});

export default SquareContainer;
