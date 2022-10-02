import { useEffect, useState } from 'react';
import './App.css';


// get random hex color
const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

enum Status {
  WIN,
  LOSE
}

const App = () => {

    // score
    const [win, setWin] = useState<number>(0);
    const [lose, setLose] = useState<number>(0);

    
    const saveScoreToStorage = () => {
      localStorage.setItem('win', win.toString());
      localStorage.setItem('lose', lose.toString());
      localStorage.setItem('expire', new Date().getTime().toString());
    }

    // game
    const [color, setColor] = useState<string>("");
    const [answers, setAnswers] = useState<string[]>([]);
    const [status, setStatus] = useState<Status | undefined>(undefined);

    const startGame = () => {
      const randomColor = getRandomColor();
      setColor(randomColor);

      const answers = [];
      for (let i = 0; i < 3; i++) answers.push(getRandomColor());
      answers.push(randomColor);

      setAnswers(answers.sort(() => Math.random() - 0.5));
    };

    const checkAnswer = (answer: string) => {
      new Promise<void>((resolve) => {
        if (answer === color) {
          setStatus(Status.WIN);
          setWin(win + 1);
          startGame();
          resolve();
        } else {
          setStatus(Status.LOSE);
          setLose(lose + 1);
          resolve();
        }
      }).then(() => {
        saveScoreToStorage();
      });
      
    }

    useEffect(() => {
      const win = localStorage.getItem('win');
      const lose = localStorage.getItem('lose');
      const expire = localStorage.getItem('expire');
      const expireTime = (expire ? parseInt(expire) : new Date().getTime()) + (1000 * 60 * 45);

      if (win && lose && expireTime > new Date().getTime()) {
        setWin(parseInt(win));
        setLose(parseInt(lose));
      } else {
        localStorage.clear();
        localStorage.setItem('expire', new Date().getTime().toString());
        localStorage.setItem('win', '0');
        localStorage.setItem('lose', '0');
      }

      startGame();
    }, []);
  
    return (<div className="app">
        <h1 className="heading">Color Guessing Game</h1>
        <p className="heading">Check how well you know your <strong>HEX</strong> colors!</p>
        <div className="score">
          <p>Win: <strong>{win}</strong></p>
          <p>Lose: <strong>{lose}</strong></p>
        </div>

        <div className="colorBox" style={{backgroundColor: color}}></div>

        <div className="answers">
            {answers.map(color => <button className="button" onClick={() => checkAnswer(color)} key={color}>{color}</button>)}
        </div>

        <div className="review">
          {status == Status.WIN && <h3 className="correct">Thats correct!</h3>}
          {status == Status.LOSE && <h3 className="fail">Thats a fail, try again!</h3>}
        </div>
    </div>)
};

export default App;
