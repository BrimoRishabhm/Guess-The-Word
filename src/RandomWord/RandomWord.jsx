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
        setRemainingCharacters((previousRemaining) => [...previousRemaining, remainingCount])
        setRemainingCount((previousRemainingCount) => previousRemainingCount - 1)
      }
    }

    setAttempt((previousAttempt) => [...previousAttempt, attemptCount]);
      setAttemptCount((prevCount) => prevCount + 1)

    if (characterIndexes.length > 0) {
      const updatedGuessedWord = guessedWord.slice(); 
      characterIndexes.forEach((characterIndex) => {
        updatedGuessedWord[characterIndex] = clickedLetter.toUpperCase();
      });
      setGuessedWord(updatedGuessedWord);
    }

    console.log("Attempt",attempt)
    console.log("Remaining",remainingCharacters)
  };
  //console.log(attempt)
  console.log(remainingCharacters)

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
        {(remainingCharacters === 0) &&
        <div>
            <p className='congrats'>Congrats! You guessed {word.toUpperCase()} in {attempt} attempts</p>
        </div>
        }
      </div>
      {word ? (
        <p>7-letter word: {word}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    <div className='attempt'>
      <p className='text'>Score</p>
      <div className='attemptContainer'>
        <div>
        <div className='headerBox'>
            Attempts
        </div>
        <div className='bodyBox'>
            {attempt.map((value,index) => {
                <div>
                {value}
                </div>
            })}
        </div>
        </div>
        <div>
        <div className='headerBox'>
            Remaining Charatcers
        </div>
        <div className='bodyBox'>
            {remainingCharacters.map((value,index) => {
                <div>
                {value}
                </div>
            })}
        </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default RandomWord;
