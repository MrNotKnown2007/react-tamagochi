import { useHippo } from '@/context/HippoContext';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const bgImg = require('@/screens/games/DiceGuessGame.png');
const titleImg = require('@/models/icons/games/Guess/guess_number.png');
const scoreBoardImg = require('@/models/icons/games/Guess/score_board.png');
const numberBoardImg = require('@/models/icons/games/Guess/goal_board.png');
const whichNumberImg = require('@/models/icons/games/Guess/which_number.png');
const happyHippoImg = require('@/models/icons/games/Guess/happy_hippo.png');
const buttonBoardImg = require('@/models/icons/games/Guess/number_board.png');
const button1Img = require('@/models/icons/games/Guess/button1.png');
const button2Img = require('@/models/icons/games/Guess/button2.png');
const button3Img = require('@/models/icons/games/Guess/button3.png');
const button4Img = require('@/models/icons/games/Guess/button4.png');
const button5Img = require('@/models/icons/games/Guess/button5.png');
const button6Img = require('@/models/icons/games/Guess/button6.png');
const square1Img = require('@/models/icons/games/Guess/square1.png');
const square2Img = require('@/models/icons/games/Guess/square2.png');
const square3Img = require('@/models/icons/games/Guess/square3.png');
const square4Img = require('@/models/icons/games/Guess/square4.png');
const square5Img = require('@/models/icons/games/Guess/square5.png');
const square6Img = require('@/models/icons/games/Guess/square6.png');
const homeIcon = require('@/models/icons/games/home.png');

interface DiceGuessGameProps {
  onGameEnd: (score: number) => void;
  onClose: () => void;
}

const BUTTON_IMAGES = [button1Img, button2Img, button3Img, button4Img, button5Img, button6Img];
const SQUARE_IMAGES = [square1Img, square2Img, square3Img, square4Img, square5Img, square6Img];

export default function DiceGuessGame({ onGameEnd, onClose }: DiceGuessGameProps) {
  const { updateGameStats } = useHippo();
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [correctNumber, setCorrectNumber] = useState(1);
  const [topSquareNumber, setTopSquareNumber] = useState(1);
  const [gameActive, setGameActive] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultWin, setResultWin] = useState(false);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showBottomSquare, setShowBottomSquare] = useState(false);
  const [guessedCount, setGuessedCount] = useState(0);
  const [showEmoji, setShowEmoji] = useState(false);
  const [emojiType, setEmojiType] = useState<'happy' | 'sad'>('happy');

  useEffect(() => {
    startNewRound();
  }, []);

  useEffect(() => {
    if (roundsPlayed >= 10 && gameActive && !gameCompleted) {
      setGameActive(false);
      setGameCompleted(true);
    }
  }, [roundsPlayed, gameActive, gameCompleted]);

  const rollDice = () => Math.floor(Math.random() * 6) + 1;

  const startNewRound = () => {
    setCorrectNumber(rollDice());
    setSelectedNumber(null);
    setShowResult(false);
    setTopSquareNumber(1);
    setShowBottomSquare(false);
  };

  const handleButtonPress = (number: number) => {
    if (isRolling || !gameActive || selectedNumber !== null) return;
    setSelectedNumber(number);
    setShowBottomSquare(true);
    setIsRolling(true);

    let rollCount = 0;
    const finalResult = rollDice();

    const interval = setInterval(() => {
      setTopSquareNumber(prev => (prev >= 6 ? 1 : prev + 1));
      rollCount++;

      if (rollCount >= 12) {
        clearInterval(interval);
        setTopSquareNumber(finalResult);
        setTimeout(() => checkResult(number, finalResult), 1000);
      }
    }, 100);
  };

  const checkResult = (guess: number, finalNumber: number) => {
    setIsRolling(false);
    const win = guess === finalNumber;
    if (win) {
      setScore(prev => prev + 15);
      setGuessedCount(prev => prev + 1);
    }
    setEmojiType(win ? 'happy' : 'sad');
    setShowEmoji(true);
    
    // Автоматически переходим к следующему раунду через 1.5 секунды
    setTimeout(() => {
      setShowEmoji(false);
      handleContinue();
    }, 1500);
  };

  const handleContinue = () => {
    setShowResult(false);
    setRoundsPlayed(prev => prev + 1);

    if (roundsPlayed + 1 < 10) {
      setRound(prev => prev + 1);
      setTimeout(() => startNewRound(), 500);
    } else {
      setGameActive(false);
      setGameCompleted(true);
    }
  };

  const handleHome = () => {
    updateGameStats('third', score);
    onGameEnd(score);
    router.push('/(tabs)');
  };

  return (
    <ImageBackground source={bgImg} style={styles.container} resizeMode="cover">
      <View style={styles.headerContainer}>
        <Image source={titleImg} style={styles.titleImage} />
        <View style={styles.boardsRow}>
          <View style={styles.scoreBoardWrapper}>
            <Image source={scoreBoardImg} style={styles.scoreBoardImage} />
            <Text style={styles.scoreBoardText}>Очки: {score}</Text>
          </View>
          <View style={styles.numberBoardWrapper}>
            <Image source={numberBoardImg} style={styles.numberBoardImage} />
            <Text style={styles.numberBoardText}>Раунд: {round}/10</Text>
          </View>
        </View>
      </View>

      {gameActive && !gameCompleted && (
        <View style={styles.mainContent}>
          <TouchableOpacity style={styles.homeButton} onPress={handleHome}>
            <Image source={homeIcon} style={styles.homeIcon} />
          </TouchableOpacity>

          <View style={styles.topSquareContainer}>
            <Image source={SQUARE_IMAGES[topSquareNumber - 1]} style={[styles.topSquareContent, isRolling && styles.topSquareRolling]} />
          </View>

          <Image source={whichNumberImg} style={styles.whichNumberImage} />

          {showBottomSquare && selectedNumber && (
            <View style={[styles.bottomSquareContainer, styles.bottomSquareContainerActive]}>
              <Image source={SQUARE_IMAGES[selectedNumber - 1]} style={styles.bottomSquareImage} />
            </View>
          )}

          <View style={styles.buttonBoardContainer}>
            <Image source={buttonBoardImg} style={styles.buttonBoardImage} />
            <View style={styles.buttonsGrid}>
              {[1, 2, 3, 4, 5, 6].map(number => {
                const getButtonStyle = () => {
                  const baseStyle: any[] = [styles.buttonWrapper];
                  if (number === 1) baseStyle.push(styles.buttonWrapper1);
                  if (number === 2) baseStyle.push(styles.buttonWrapper2);
                  if (number === 3) baseStyle.push(styles.buttonWrapper3);
                  if (number === 4) baseStyle.push(styles.buttonWrapper4);
                  if (number === 5) baseStyle.push(styles.buttonWrapper5);
                  if (number === 6) baseStyle.push(styles.buttonWrapper6);
                  if (selectedNumber === number) baseStyle.push(styles.buttonWrapperSelected);
                  if (isRolling || selectedNumber !== null) baseStyle.push(styles.buttonWrapperDisabled);
                  return baseStyle;
                };
                return (
                  <TouchableOpacity
                    key={number}
                    style={getButtonStyle()}
                    onPress={() => handleButtonPress(number)}
                    disabled={isRolling || selectedNumber !== null || !gameActive}
                  >
                    <Image source={BUTTON_IMAGES[number - 1]} style={styles.buttonImage} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <Image source={happyHippoImg} style={styles.happyHippoImage} />
          {showEmoji && (
            <Text style={[styles.emojiDisplay, emojiType === 'happy' ? styles.emojiHappy : styles.emojiSad]}>
              {emojiType === 'happy' ? '😊' : '😢'}
            </Text>
          )}
        </View>
      )}

      {showResult && !gameCompleted && (
        <View style={styles.resultModal}>
          <View style={[styles.resultContent, resultWin ? styles.resultWin : styles.resultLose]}>
            <Text style={styles.resultTitle}>{resultWin ? '🎉 ПОБЕДА!' : '😢 ПОРАЖЕНИЕ'}</Text>
            <Text style={styles.resultMessage}>{resultWin ? `Вы выбрали ${selectedNumber}, выпало ${correctNumber}!` : `Вы выбрали ${selectedNumber}, выпало ${correctNumber}`}</Text>
            <Text style={styles.resultScore}>{resultWin ? '+15 очков' : '+0 очков'}</Text>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>{roundsPlayed + 1 < 10 ? 'Следующий раунд' : 'Завершить'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {gameCompleted && (
        <View style={styles.gameOverModal}>
          <View style={styles.gameOverContent}>
            <Text style={styles.gameOverTitle}>Игра завершена!</Text>
            <Text style={styles.gameOverScore}>Итоговый счет: {score}</Text>
            <Text style={styles.gameOverGuessed}>Угадано: {guessedCount}/10</Text>
            <TouchableOpacity style={styles.finishButton} onPress={handleHome}>
              <Image source={homeIcon} style={styles.finishButtonIcon} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,  width: '100%', height: '100%',},
  headerContainer: { flexDirection: 'column', alignItems: 'center', paddingHorizontal: '5%', paddingTop: '2%', paddingBottom: '2%' },
  boardsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '2%' },
  scoreBoardWrapper: { width: '28%', aspectRatio: 1.2, justifyContent: 'center', alignItems: 'center' },
  scoreBoardImage: { width: '100%', height: '100%', resizeMode: 'contain', position: 'absolute', marginBottom: '30%'},
  scoreBoardText: { fontSize: 11, fontWeight: 'bold', color: '#FFE4A1', textAlign: 'center', zIndex: 1 , marginLeft: '12%',marginBottom: '30%'},
  titleImage: { width: '90%', height: '60%', resizeMode: 'contain', marginTop: -15 },
  numberBoardWrapper: { width: '28%', aspectRatio: 1.2, justifyContent: 'center', alignItems: 'center', },
  numberBoardImage: { width: '100%', height: '100%', resizeMode: 'contain', position: 'absolute', marginBottom: '30%'},
  numberBoardText: { fontSize: 11, fontWeight: 'bold', color: '#FFE4A1', textAlign: 'center', zIndex: 1, marginBottom: '30%'},
  mainContent: { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '5%', paddingVertical: '2%' },
  topSquareContainer: { width: '45%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginTop: '-15%' },
  topSquareContent: { width: '100%', height: '100%', resizeMode: 'contain', zIndex: 1 },
  topSquareRolling: { opacity: 0.8 },
  whichNumberImage: { width: '100%', height: '100%', resizeMode: 'contain', marginVertical: '1%', marginTop: '-65%' },
  bottomSquareContainer: { width: '30%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginVertical: '2%', marginTop: '-10%', position: 'absolute', bottom: '35%' },
  bottomSquareContainerActive: { bottom: '45%' },
  bottomSquareImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  buttonBoardContainer: { width: '100%', height: '18%', justifyContent: 'center', alignItems: 'center', marginBottom: '10%',  },
  buttonBoardImage: { width: '100%', height: '100%', resizeMode: 'contain', position: 'absolute', marginTop: '-52%' },
  buttonsGrid: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '1.5%', width: '82%', height: '85%', marginTop: '-52%', zIndex: 10 },
  buttonWrapper: { flex: 1, aspectRatio: 1, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  buttonWrapper1: { flex: 1, aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginTop: '-4%', zIndex: 10 },
  buttonWrapper2: { flex: 1, aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginTop: '-5%', zIndex: 10 },
  buttonWrapper3: { flex: 1, aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginTop: '-5%' },
  buttonWrapper4: { flex: 1, aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginTop: '-7%' },
  buttonWrapper5: { flex: 1, aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginTop: '-6%' },
  buttonWrapper6: { flex: 1, aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginTop: '-5%', transform: [{ scale: 1.15 }] },
  buttonWrapperSelected: { transform: [{ scale: 1.15 }] },
  buttonWrapperDisabled: { opacity: 0.6 },
  buttonImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  happyHippoImage: { position: 'absolute', height: '40%', bottom: '70%', left: '1%', width: '28%', aspectRatio: 1, resizeMode: 'contain', zIndex: 1 },
  homeButton: { position: 'absolute', height: '10%', bottom: '5%', left: '35%', width: '40%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', zIndex: 20 },
  homeIcon: { width: '100%', height: '100%', resizeMode: 'contain', marginLeft: '-22%', marginTop: '20%'},
  resultModal: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  resultContent: { width: '80%', paddingHorizontal: '5%', paddingVertical: '8%', borderRadius: 20, alignItems: 'center' },
  resultWin: { backgroundColor: '#E8F5E9', borderWidth: 3, borderColor: '#4CAF50' },
  resultLose: { backgroundColor: '#FFEBEE', borderWidth: 3, borderColor: '#F44336' },
  resultTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: '3%' },
  resultMessage: { fontSize: 16, textAlign: 'center', marginBottom: '3%', color: '#424242' },
  resultScore: { fontSize: 20, fontWeight: 'bold', color: '#FF9800', marginBottom: '5%' },
  continueButton: { backgroundColor: '#6D4C41', paddingHorizontal: '10%', paddingVertical: '3%', borderRadius: 15 },
  continueButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  gameOverModal: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  gameOverContent: { width: '80%', backgroundColor: '#F5DEB3', paddingHorizontal: '5%', paddingVertical: '8%', borderRadius: 20, alignItems: 'center', borderWidth: 3, borderColor: '#8B7355' },
  gameOverTitle: { fontSize: 28, fontWeight: 'bold', color: '#7A4A1F', marginBottom: '5%' },
  gameOverScore: { fontSize: 24, fontWeight: 'bold', color: '#FF9800', marginBottom: '8%' },
  finishButton: { justifyContent: 'center', alignItems: 'center', borderRadius: 15, width: 120, height: 120, marginTop: '5%' },
  finishButtonIcon: { width: 120, height: 120, resizeMode: 'contain' },
  emojiDisplay: { position: 'absolute', fontSize: 60, top: '25%', zIndex: 50 },
  emojiHappy: { color: '#4CAF50' },
  emojiSad: { color: '#F44336' },
  gameOverGuessed: { fontSize: 20, fontWeight: 'bold', color: '#FF9800', marginBottom: '5%' },
});
