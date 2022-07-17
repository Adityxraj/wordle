import { useState } from "react"

const useWordle = (solution) => {
    const [turn, setTurn] = useState(0) // 6 turns max, then game over
    const [currentGuess, setCurrentGuess] = useState('') // handleKeyup -> 
    const [guesses, setGuesses] = useState([...Array(6)]) // each guess is an array
    const [history, setHistory] = useState([]) // each guess is a string -> to check if user doesn't submit a duplicate guess
    const [isCorrect, setIsCorrect] = useState(false)
    const [usedKeys, setUsedKeys] = useState({}) // {a: 'green', b: 'yellow', c: 'grey'}


    //format a guess into an array of letter objects
    // eg. [{key: 'a', color: 'yellow'}]
    const formatGuess = () => {
        // console.log('formatting the guess - ', currentGuess)

        let solutionArray = [...solution]
        let formattedGuess = [...currentGuess].map((l) => {
            return {key: l, color: 'grey'}
        })

        //find any green letters
        formattedGuess.forEach((l, i) => {
            if (solutionArray[i] === l.key) {
                formattedGuess[i].color = 'green'
                solutionArray[i] = null
            }
        })

        //find any yellow letters
        formattedGuess.forEach((l, i) => {
            if (solutionArray.includes(l.key) && l.color !== 'green') {
                formattedGuess[i].color = 'yellow'
                solutionArray[solutionArray.indexOf(l.key)] = null
            }
        })

        return formattedGuess
    }

    //add a new guess to the guesses state
    //update the isCorrect state if the guess is correct
    // add one to the turn state
    const addNewGuess = (formattedGuess) => {
        if (currentGuess === solution) {
            setIsCorrect(true)
        }

        setGuesses(prevGuesses => {
            let newGuesses = [...prevGuesses]
            newGuesses[turn] = formattedGuess
            return newGuesses
        })

        setHistory(prevHistory => [...prevHistory, currentGuess] )

        setTurn(prevTurn => prevTurn + 1)
        
        setUsedKeys(prevUsedKeys => {
            let newKeys = {...prevUsedKeys}

            formattedGuess.forEach(l => {
                const currentColor = newKeys[l.key]

                if (l.color === 'green') {
                    newKeys[l.key] = 'green'
                    return
                }
                if (l.color === 'yellow' && currentColor !== 'green') {
                    newKeys[l.key] = 'yellow'
                    return
                }
                if (l.color === 'grey' && currentColor !== 'green' && currentColor !== 'yellow') {
                    newKeys[l.key] = 'grey'
                    return
                }
            })

            return newKeys
        })

        setCurrentGuess('')
    }

    //handle keyup event & track current guess
    //if user presses enter, add the new guess
    const handleKeyup = ({ key }) => {
        // console.log(key)

        if (key === 'Enter') {
            //only add if turn is less than 5
            if (turn > 5) {
                console.log("OOPS! You ran out of guesses.")
                return
            }
            //do not allow duplicate values
            if (history.includes(currentGuess)) {
                console.log("You already guessed that word!")
                return
            }
            //check wors is 5chars long
            if (currentGuess.length !== 5) {
                console.log("Please enter a 5 letter Word!")
                return
            }

            //add this guess to formatGuess
            const formatted = formatGuess()
            //console.log(formatted)
            addNewGuess(formatted)
        }

        if (key === 'Backspace') {
            setCurrentGuess(prev => prev.slice(0, -1))
            return
        }

        if (/^[A-Za-z]$/.test(key)) {
            if (currentGuess.length < 5) {
                setCurrentGuess(prev => prev + key)
            }
        }
    }

    return {turn, currentGuess, guesses, isCorrect, usedKeys, handleKeyup}
}

export default useWordle