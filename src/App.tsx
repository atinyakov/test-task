import React, { useEffect, useReducer, useRef, WheelEvent } from "react";
import "./App.css";

const ListItem = React.memo(({ content }: { content: number | string }) => {
  return <li className="list-item">{content}</li>;
});

const data = [...Array(10000)].map(() => {
  return Math.floor(Math.random() * 10000);
});

function App() {
  const reducer = (
    [start, end]: [number, number],
    action: {
      type: "UP" | "DOWN" | "SET_END";
      payload?: number;
    }
  ): [number, number] => {
    switch (action.type) {
      case "UP":
        return start - 5 >= 0 ? [start - 5, end - 5] : [start, end];
      case "DOWN":
        return [start + 5, end + 5];
      case "SET_END":
        return [start, action.payload ? action.payload : end];
      default:
        return [start, end];
    }
  };
  const [[start, end], dispatch] = useReducer(reducer, [0, 0]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const containerHeight =
        containerRef.current.getBoundingClientRect().height;
      dispatch({
        type: "SET_END",
        payload: Math.floor(containerHeight / 25) - 1,
      });
    }
  }, []);

  const scrollDown = () => {
    if (end + 5 <= data.length - 1) {
      dispatch({ type: "DOWN" });
    }
  };

  const scrollUp = () => dispatch({ type: "UP" });

  const onWheel = (e: WheelEvent) => {
    if (e.deltaY < 0) {
      scrollUp();
    } else {
      scrollDown();
    }
  };

  return (
    <div className="App" ref={containerRef}>
      <button disabled={start - 5 < 0} onClick={scrollUp}>
        Scroll up ({start} items)
      </button>
      <ul className="container" onWheel={onWheel}>
        {[...data].slice(start, end).map((el, index) => (
          <ListItem key={`${el}${index}`} content={el} />
        ))}
      </ul>
      <button disabled={end + 5 > data.length - 1} onClick={scrollDown}>
        Scroll Down ({data.length - 1 - end} items)
      </button>
    </div>
  );
}

export default App;
