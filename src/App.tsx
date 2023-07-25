import { FC, useEffect, useRef } from 'react';
import './App.css';

interface ICell {
  readonly width: number;
  readonly height: number;
};

interface ICoordinate {
  readonly x: number;
  readonly y: number;
};

function findMinCell(x: number, y: number, arrayOfCell: ICoordinate[]): ICoordinate {
  let mxX = 0;
  let mxY = 0;
  for (let cord of arrayOfCell) {
    if (cord.x <= x) mxX = Math.max(mxX, cord.x);
  };
  for (let cord of arrayOfCell) {
    if (mxX == cord.x && cord.y <= y) mxY = Math.max(mxY, cord.y);
  };
  return { x: mxX, y: mxY };
}

const App: FC = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvas) return;
    const context = canvas.current;
    if (!context) return;
    context.width = window.innerWidth;
    context.height = window.innerHeight;
    const ctx = context.getContext('2d');
    const cellSize: ICell = {
      width: 10,
      height: 10
    };
    const arrayOfCell: ICoordinate[] = [];
    for (let y = 0; y < context.width; y += cellSize.height) {
      for (let x = 0; x < context.width; x += cellSize.width) {
        ctx?.strokeRect(x, y, cellSize.width, cellSize.height);
        arrayOfCell.push({ x, y });
      };
    };
    let fillCoordinates: ICoordinate[] = [];
    context.onmousedown = event => {
      const { x, y } = event;
      const currentCell = findMinCell(x, y, arrayOfCell);
      ctx?.fillRect(currentCell.x, currentCell.y, cellSize.width, cellSize.height);
      fillCoordinates.push(currentCell);
    };

    context.onmousemove = event => {
      const { x, y } = event;
      if (fillCoordinates.length) {
        const currentCell = findMinCell(x, y, arrayOfCell);
        ctx?.fillRect(currentCell.x, currentCell.y, cellSize.width, cellSize.height);
        fillCoordinates.push(currentCell)
      }
    };

    context.onmouseup = event => {
      fillCoordinates = [];
    }
  }, [])
  return (
    <div className="App">
      <canvas ref={canvas} style={{ 'display': 'block' }}></canvas>
    </div>
  );
}

export default App;
