document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('board');
  const cells = document.querySelectorAll('.cell');
  const resetButton = document.getElementById('reset');
  const form = document.getElementById('form');
  const popup = document.createElement('div');
  const overlay = document.createElement('div');
  const X_CLASS = 'x';
  const O_CLASS = 'o';
  let oTurn;
  let player1Name;
  let player2Name;

  popup.id = 'popup';
  overlay.id = 'overlay';
  document.body.appendChild(popup);
  document.body.appendChild(overlay);

  const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  startGame();

  resetButton.addEventListener('click', startGame);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    player1Name = document.getElementById('player1').value;
    player2Name = document.getElementById('player2').value;
    form.style.display = 'none';
    startGame();
  });

  function startGame() {
    oTurn = false;
    cells.forEach((cell) => {
      cell.classList.remove(X_CLASS);
      cell.classList.remove(O_CLASS);
      cell.textContent = '';
      cell.removeEventListener('click', handleClick);
      cell.addEventListener('click', handleClick, { once: true });
    });
    hidePopup();
  }

  function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
      setTimeout(() => showPopup(`${oTurn ? player2Name : player1Name} Wins!`), 200);
    } else if (isDraw()) {
      setTimeout(() => showPopup('Draw!'), 200);
    } else {
      swapTurns();
    }
  }

  function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.textContent = currentClass.toUpperCase();
  }

  function swapTurns() {
    oTurn = !oTurn;
  }

  function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some((combination) => {
      return combination.every((index) => {
        return cells[index].classList.contains(currentClass);
      });
    });
  }

  function isDraw() {
    return [...cells].every((cell) => {
      return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
  }

  function showPopup(message) {
    popup.innerHTML = `
      <h2>${message}</h2>
      <button onclick="hidePopup()">OK</button>
    `;
    popup.style.display = 'block';
    overlay.style.display = 'block';
  }

  window.hidePopup = function () {
    popup.style.display = 'none';
    overlay.style.display = 'none';
  };
});