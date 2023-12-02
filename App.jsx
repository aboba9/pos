import Matter from "matter-js";
import React from "react";

import "reset-css";
import "./App.css";

function App() {
  const [count, setCount] = React.useState(0);

  const scene = React.useRef();

  React.useEffect(() => {
    var Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Composites = Matter.Composites,
      Events = Matter.Events,
      Constraint = Matter.Constraint,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      Body = Matter.Body,
      Composite = Matter.Composite,
      Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create(),
      world = engine.world;

    // create renderer
    var render = Render.create({
      element: scene.current,
      engine: engine,
      options: {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        background: "transparent",
        wireframes: false,
      },
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
    var ground = Bodies.rectangle(395, 650, window.screen.width, 100, {
        isStatic: true,
        // render: { fillStyle: "#060a19" },
      }),
      rockOptions = { density: 0.004 },
      rock = Bodies.polygon(170, 450, 8, 20, rockOptions),
      anchor = { x: 170, y: 450 },
      elastic = Constraint.create({
        pointA: anchor,
        bodyB: rock,
        length: 0.01,
        damping: 0.01,
        stiffness: 0.05,
      });

    Composite.add(world, [
      // walls
      Bodies.rectangle(0, -10, window.screen.width, 10, {
        isStatic: true,
      }),
      // Bodies.rectangle(0, window.screen.height, window.screen.width, 0, {
      //   isStatic: true,
      // }),
      Bodies.rectangle(1050, 300, 100, 600, { isStatic: true }),
      Bodies.rectangle(-265, 300, 100, 600, { isStatic: true }),
    ]);

    var ground2 = Bodies.rectangle(610, 250, 82, 38, {
      isStatic: true,
      render: {
        sprite: {
          texture:
            "https://static.tildacdn.com/tild3830-3437-4538-b762-653738393335/Matilda.png",
          xScale: 0.5,
          yScale: 0.5,
        },
      },
    });

    var pyramid2 = Composites.pyramid(550, 0, 5, 10, 0, 0, function (x, y) {
      return Bodies.rectangle(x, y, 25, 40);
    });

    Composite.add(engine.world, [
      ground,
      // pyramid,
      ground2,
      pyramid2,
      rock,
      elastic,
    ]);

    Events.on(engine, "afterUpdate", function () {
      if (
        mouseConstraint.mouse.button === -1 &&
        (rock.position.x > 190 || rock.position.y < 430)
      ) {
        // Limit maximum speed of current rock.
        if (Body.getSpeed(rock) > 45) {
          Body.setSpeed(rock, 45);
        }

        // Release current rock and add a new one.
        rock = Bodies.polygon(170, 450, 7, 20, rockOptions);
        Composite.add(engine.world, rock);
        elastic.bodyB = rock;
      }
    });

    // add mouse control
    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 },
    });

    mouseConstraint.mouse.element.removeEventListener(
      "mousewheel",
      mouseConstraint.mouse.mousewheel
    );
    mouseConstraint.mouse.element.removeEventListener(
      "DOMMouseScroll",
      mouseConstraint.mouse.mousewheel
    );

    // context for MatterTools.Demo
    // return {
    //   engine: engine,
    //   runner: runner,
    //   render: render,
    //   canvas: render.canvas,
    //   stop: function () {
    //     Matter.Render.stop(render);
    //     Matter.Runner.stop(runner);
    //   },
    // };
  }, []);

  return (
    <>
      <div style={{ display: "block", overflow: "hidden" }} ref={scene} />
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
    </>
  );
}

export default App;
