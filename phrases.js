#!/usr/bin/env node

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

	let text = getText(data);
	let wordMap = getWordMap(text);

	console.log(getMarkovPhrase(wordMap, 8));
	console.log(getMarkovPhrase(wordMap, 8));
	console.log(getMarkovPhrase(wordMap, 8));
	console.log(getMarkovPhrase(wordMap, 8));
	console.log(getMarkovPhrase(wordMap, 8));
	console.log(getMarkovPhrase(wordMap, 8));
	
	/*
	console.log(getMarkovWord(letterMap, 3));
	console.log(getMarkovWord(letterMap, 4));
	console.log(getMarkovWord(letterMap, 5));
	console.log(getMarkovWord(letterMap, 6));
	console.log(getMarkovWord(letterMap, 7));
	console.log(getMarkovWord(letterMap, 8));
	console.log(getMarkovWord(letterMap, 9));
	console.log(getMarkovWord(letterMap, 10));
	*/
});


function getText(data) {
	let tokens = data.split(/\b/);
	let words = [];
	
	_.each(tokens, (token) => {
		if ( token.match(/^\w+$/) ) {
			words.push(_.lowerCase(token));
		}
	});

	return words;
}

function getWordMap(words) {
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
	let prevWord = null;

	_.each(words, (word) => {
		if ( !transitionMap[word] ) {
			transitionMap[word] = {};
		}
		if ( word && prevWord ) {
			if ( !transitionMap[prevWord][word] ) {
				transitionMap[prevWord][word] = 1;
			} else {
				transitionMap[prevWord][word]++;
			}
		}
		prevWord = word;
	});
	
	let transitionProbs = {};

	_.each(transitionMap, (map, word) => {
		let totalTransitions = 0;
		if ( !transitionProbs[word] ) {
			transitionProbs[word] = {};
		}
		_.each(map, (count) => {
			totalTransitions += count;
		});

		_.each(map, (count, nextWord) => {
			transitionProbs[word][nextWord] = count / totalTransitions;
		})
	});

	return transitionProbs;
}

function getMarkovPhrase(probabilityMap, length) {
	let startWords = _.keys(probabilityMap);
	let startWordIndex = Math.round(Math.random() * startWords.length);
	let startWord = startWords[startWordIndex];
	let markovPhrase = [startWord];

	for ( let idx = 0; idx < length; idx++ ) {
		let currentWord = markovPhrase[idx];
		let probabilities = probabilityMap[currentWord];
		let randomNumber = Math.random();
		let cumulativeProbability = 0;
		let eligibleTransitions = [];
		let wordPushed = false;
		_.each(probabilities, (weight, word) => {
			cumulativeProbability += weight;
			if ( ( randomNumber < cumulativeProbability ) && ( !wordPushed ) )  {
				eligibleTransitions.push[word];
				markovPhrase.push(word);
				wordPushed = true;
			}
		});

		
	}
	return markovPhrase.join(' ');
}