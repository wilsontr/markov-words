#!/usr/bin/env node

console.log("hello world!");

const fs = require('fs');
const _ = require('lodash');

const args = process.argv;
const inputFileName = args[2];

if ( inputFileName ) {
	console.log('Input file: ', inputFileName);
}

fs.readFile(inputFileName, 'utf8', (err, data) => {
	if ( err ) {
		throw err;
	}

	let words = getWords(data);
	let letterMap = getLetterMap(words);
	
	console.log(getMarkovWord(letterMap, 3));
	console.log(getMarkovWord(letterMap, 4));
	console.log(getMarkovWord(letterMap, 5));
	console.log(getMarkovWord(letterMap, 6));
	console.log(getMarkovWord(letterMap, 7));
});


function getWords(data) {
	let tokens = data.split(/\b/);
	let words = [];
	
	_.each(tokens, (token) => {
		if ( token.match(/^\w+$/) ) {
			words.push(_.lowerCase(token));
		}
	});

	return words;
}

function getLetterMap(words) {
	/* 
		iterate through letters in words
		build a list of transition probabilities, e.g.

		{
			'a': {
				'a': 0.75,
				'b': 0.1,
				'c': 0.3,
				'd': 0.4
			}
		}

		make list of all transitions that exist for a given letter
		group and calculate total proportions for each transition
	*/

	let transitionMap = {};

	_.each(words, (word) => {
		_.each(word, (letter, idx) => {
			if ( letter.match(/[a-z]/) ) {
				if ( !transitionMap[letter] ) {
					transitionMap[letter] = {};
				}
				let nextLetter = word[idx + 1];
				if ( letter && nextLetter && nextLetter.match(/[a-z]/) )   {
					if ( !transitionMap[letter][nextLetter] ) {
						transitionMap[letter][nextLetter] = 1;
					} else {
						transitionMap[letter][nextLetter]++;
					}
				}				
			}
		});
	});

	let transitionProbs = {};

	_.each(transitionMap, (map, letter) => {
		let totalTransitions = 0;
		if ( !transitionProbs[letter] ) {
			transitionProbs[letter] = {};
		}
		_.each(map, (count) => {
			totalTransitions += count;
		});

		_.each(map, (count, nextLetter) => {
			transitionProbs[letter][nextLetter] = count / totalTransitions;
		})
	});

	return transitionProbs;
}

function getMarkovWord(probabilityMap, length) {
	let startLetters = _.keys(probabilityMap);
	let startLetterIndex = Math.round(Math.random() * startLetters.length);
	let startLetter = startLetters[startLetterIndex];
	let markovWord = [startLetter];

	for ( let idx = 0; idx < length; idx++ ) {
		let currentLetter = markovWord[idx];
		let probabilities = probabilityMap[currentLetter];
		let randomNumber = Math.random();
		let cumulativeProbability = 0;
		let eligibleTransitions = [];
		let letterPushed = false;
		_.each(probabilities, (weight, letter) => {
			cumulativeProbability += weight;
			if ( ( randomNumber < cumulativeProbability ) && ( !letterPushed ) )  {
				eligibleTransitions.push[letter];
				markovWord.push(letter);
				letterPushed = true;
			}
		});

		
	}
	return markovWord.join('');
}