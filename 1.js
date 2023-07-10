class LocalStorage {
  constructor(key) {
    this._key = key;
  }

  add(data) {
    localStorage.setItem(this._key, JSON.stringify(data))
  }

  remove() {
    localStorage.removeItem(this._key);
    console.log('okk')
  }

  getData() {
    let data = JSON.parse(localStorage.getItem(this._key));

    if(!data) {
      data = {wins: 0, losses: 0};
      this.add(data)
    }

    return data
  }

}

class Game {
  constructor() {
    this.firstSelect = document.querySelector('.first').querySelector('.number');
    this.secondSelect = document.querySelector('.second').querySelector('.number');
    this.statisticSelect = document.querySelector('.game-statistics');
    this.winSelect = this.statisticSelect.querySelector('.win-num');
    this.looseSelect = this.statisticSelect.querySelector('.loose-num');
    this.winRateSelect = this.statisticSelect.querySelector('.winrate-num');
    this.operatorSelect = document.querySelector('.operator');
    this.inputSelect = document.querySelector('.user-input-container').querySelector('input');
    this.gameSelect = document.querySelector('.game-container');
    this.operators = ['+', '-', '*', '/'];
    this.LocalStorage = new LocalStorage('game_data');
    this.stats = this.LocalStorage.getData();

  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomOperator() {
    const randomIndex = Math.floor(Math.random() * this.operators.length);
    return this.operators[randomIndex];
  }

  generateAdditionOrSubtractionQuestion(operator) {
    const firstNumber = this.getRandomNumber(1, 99999);
    const secondNumber = this.getRandomNumber(1, 99999);
    let result;

    if (operator === '+') {
      result = firstNumber + secondNumber;
    } else if (operator === '-') {
      result = firstNumber - secondNumber;
    }

    return {
      question: `${firstNumber} ${operator} ${secondNumber}`,
      answer: result.toString(),
      firstValue: firstNumber,
      secondValue: secondNumber,
      operator: operator
    };
  }

  generateMultiplicationQuestion(operator) {
    const firstNumber = this.getRandomNumber(1, 99);
    const secondNumber = this.getRandomNumber(1, 99);
    const result = firstNumber * secondNumber;

    return {
      question: `${firstNumber} ${operator} ${secondNumber}`,
      answer: result.toString(),
      firstValue: firstNumber,
      secondValue: secondNumber,
      operator: operator
    };
  }

  generateDivisionQuestion(operator) {
    const result = this.getRandomNumber(1, 99);
    const secondNumber = this.getRandomNumber(1, 99);
    const firstNumber = secondNumber * result;

    return {
      question: `${firstNumber} ${operator} ${secondNumber}`,
      answer: result.toString(),
      firstValue: firstNumber,
      secondValue: secondNumber,
      operator: operator
    };
  }

  updateStatistics() {
    this.LocalStorage.add(this.stats);

    this.winSelect.innerHTML = this.stats.wins;
    this.looseSelect.innerHTML = this.stats.losses;
    const calcWinRate = ((this.stats.wins / (this.stats.wins + this.stats.losses) || 0) * 100).toFixed(2);
    this.winRateSelect.innerHTML = calcWinRate;
  }

  playGame() {

    this.updateStatistics();

    let question, answer;
    const operator = this.getRandomOperator()
    switch (operator) {
      case '-':
        question = this.generateAdditionOrSubtractionQuestion(operator);
        break;
      case '+':
        question = this.generateAdditionOrSubtractionQuestion(operator)
        break;
      case '*':
        question = this.generateMultiplicationQuestion(operator);
        break;
      case '/':
        question = this.generateDivisionQuestion(operator);
        break;
      default:
        this.playGame();
        return;
    }

    this.firstSelect.textContent = question.firstValue;
    this.secondSelect.textContent = question.secondValue;
    this.operatorSelect.innerHTML = question.operator;
    this.inputSelect.value = '';

    const handleEnterInput = (event) => {

        answer = this.inputSelect.value.trim();

        if(answer === '123456789') {
          this.LocalStorage.remove();
          this.stats = {wins: 0, losses: 0};

          this.updateStatistics();
          this.gameSelect.removeEventListener('click', handleEnterInput);

          this.playGame();

          return
        }

        if (answer === question.answer) {
          alert('Правильно! Вы победили.');
          this.gameSelect.removeEventListener('click', handleEnterInput);
          this.stats.wins++;
        } else {
          alert(`Неправильно! Правильный ответ: ${question.answer}. Вы проиграли.`);
          this.gameSelect.removeEventListener('click', handleEnterInput);
          this.stats.losses++;
        }

        this.playGame();
    }
    this.gameSelect.addEventListener("click", handleEnterInput);
  }
}

const plusRavno = new Game();

plusRavno.playGame();
