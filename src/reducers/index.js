import { combineReducers } from 'redux';
import gameStateReducer from './gameStateReducer';
import gemReducer from './gemReducer';
import scoreReducer from './scoreReducer';
import flippedCardReducer from './flippedCardReducer';
import gameStateMessageReducer from './gameStateMessageReducer';
import timeReducer from './timeReducer';
import revealReducer from './initialRevealReducer';
import matchedCardReducer from './matchedCardReducer';
import selectedCardIdReducer from './selectedCardIdReducer';
import cardDataReducer from './cardDataReducer';
import rankReducer from './rankReducer';
import difficultyReducer from './difficultyReducer';
import gridReducer from './gridReducer';
import profileComponentReducer from './profileComponentReducer';
import passwordReducer from './passwordReducer';
import backgroundReducer from './backgroundReducer';
import replayReducer from './replayReducer';

const rootReducer = combineReducers({
  gameState: gameStateReducer,
  gameStateMessage: gameStateMessageReducer,
  initialReveal: revealReducer,
  matchedCards: matchedCardReducer,
  selectedCardIds: selectedCardIdReducer,
  cardData: cardDataReducer,
  flippedCards: flippedCardReducer,
  rank: rankReducer,
  gems: gemReducer,
  score: scoreReducer,
  time: timeReducer,
  difficulty: difficultyReducer,
  grid: gridReducer,
  profileComponent: profileComponentReducer,
  password: passwordReducer,
  background: backgroundReducer,
  replay: replayReducer,
});

export default rootReducer;
