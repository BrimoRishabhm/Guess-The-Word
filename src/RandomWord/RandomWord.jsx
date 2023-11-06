import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./RandomWord.css"

function RandomWord() {
    const [word, setWord] = useState('');
    const [guessedWord, setGuessedWord] = useState([" "," "," "," "," "," "," "]);
    const [remainingCharacters, setRemainingCharacters] = useState([7]);
    const [attempt, setAttempt] = useState([0]);
    const [attemptCount, setAttemptCount] = useState(1);
    const [remainingCount, setRemainingCount] = useState(7);
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    async function fetchWord() {
      try {
        const response = await axios.get('https://random-word-api.herokuapp.com/word?number=3');
        const data = response.data;
        const sevenLetterWord = data.find(word => word.length === 7);

        if (sevenLetterWord) {
          setWord(sevenLetterWord);
        } else {
          fetchWord();
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    } 

    fetchWord();
  }, []);

  const handleLetterClick = (index) => {
    const clickedLetter = letters[index].toLowerCase();
    const characterIndexes = [];

    for (let i = 0; i < word.length; i++) {
      if (word[i] === clickedLetter) {
        characterIndexes.push(i);
      }
    }
    setRemainingCount((previousRemainingCount) => previousRemainingCount - (characterIndexes.length));
    setRemainingCharacters((previousRemaining) => [...previousRemaining, remainingCount])
    console.log(remainingCharacters)
    setAttemptCount((prevCount) => prevCount + 1)
    setAttempt((previousAttempt) => [...previousAttempt, attemptCount]);
    console.log(attempt)

    if (characterIndexes.length > 0) {
      const updatedGuessedWord = guessedWord.slice(); 
      characterIndexes.forEach((characterIndex) => {
        updatedGuessedWord[characterIndex] = clickedLetter.toUpperCase();
      });
      setGuessedWord(updatedGuessedWord);
    }

    //console.log("Attempt",attempt)
    //console.log("Remaining",remainingCharacters)
  };
  //console.log(attempt)
  

  return (
    <div className='fullContainer'>
    <div className='container'>
      <p className='text'>Guess the following word</p>
      <div className='word'>
      {word && (
        guessedWord.map((character,index) => (
         <div className="guessTheWord">
            {character}
         </div>
        )
      ))}
      </div>
      <div >
        <p className='text'>Choose a letter that could be used in the above word</p>
        <div>
        {letters.split('').map((letter, index) => (
          <button className='keyboard' key={index} onClick={() => handleLetterClick(index)}>
            {letter}
          </button>
        ))}
        </div>
      </div>
      <div>
        {(remainingCount <= 0) &&
        <div>
            <p className='congrats'>Congrats! You guessed {word.toUpperCase()} in {attempt.slice(-1)} attempts</p>
        </div>
        }
      </div>
    </div>
    <div className='attempt'>
      <p className='text'>Score</p>
      <div className='attemptContainer'>
        <div>
        <div className='headerBox'>
            Attempts
        </div>
            {attempt.map((value,index) => (
                <div className='bodyBox'>
                {value}
                </div>
            ))}
        </div>
        <div>
        <div className='headerBox'>
            Remaining Charatcers
        </div>
        {remainingCharacters.map((value,index) => (
        <div className='bodyBox'>
                {value}
        </div>
         ))}
        </div>
      </div>
    </div>
    </div>
  );
}

export default RandomWord;
