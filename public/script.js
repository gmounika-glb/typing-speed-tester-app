const displayText = document.getElementById('display-text');
const userInput = document.getElementById('user-input');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const speedDisplay = document.getElementById('speed');
const accuracyDisplay = document.getElementById('accuracy');
const timerDisplay = document.getElementById('timer');
const difficultySelect = document.getElementById('difficulty-select');
const historyModal = document.getElementById('history-modal');
const historyClose = document.getElementById('history-close');
const historyList = document.getElementById('history-list');
const hamburgerIcon = document.getElementById('hamburger-icon');
const darkButton = document.getElementById('mode-toggle');
const loginBtn = document.getElementById('login-btn');
const signupClose = document.getElementById('signup-close');
const signupBtn = document.getElementById('signup-btn');
const signupModal = document.getElementById('signup-modal');
const loginModal = document.getElementById('login-modal');
const loginClose = document.getElementById('login-close');
const deleteAccountClose = document.getElementById('delete-account-close');
const deleteAccountBtn = document.getElementById('delete-account-btn');
const deleteAccountModal = document.getElementById('delete-account-modal');
const navbarContent = document.getElementById('nav-menu');
let LEVEL = 'easy';
let L_SELECT = 0;
let testText;
let currentUser = '';
let startTime,
  timerInterval,
  isTestRunning = false;
const textOptions = {
  easy: [
    'The quick brown fox jumps over the lazy dog.',
    'A journey of a thousand miles begins with a single step.',
  ],
  medium: [
    'Sphinx of black quartz, judge my vow.',
    'Pack my box with five dozen liquor jugs.',
  ],
  hard: [
    'Waltz, nymph, for quick jigs vex Bud.',
    'Crazy Fredrick bought many very exquisite opal jewels.',
  ],
};
const API_BASE_URL = 'http://localhost:5678/api';
const SIGNUP_URL = `${API_BASE_URL}/auth/signup`;
const LOGIN_URL = `${API_BASE_URL}/auth/login`;
const LOGOUT_URL = `${API_BASE_URL}/auth/logout`;
const HISTORY_URL = `${API_BASE_URL}/history`;
const DELETE_ACCOUNT_URL = `${API_BASE_URL}/auth/deleteAccount`;
difficultySelect.addEventListener('change', event => {
  LEVEL = event.target.value;
  L_SELECT = 1;
  completeReset();
});
function getRandomText(level) {
  const options = textOptions[level];
  return options ? options[Math.floor(Math.random() * options.length)] : '';
}
function startTest() {
  resetResults();
  if (!L_SELECT) {
    alert('Please select a difficulty level first!');
    return;
  }
  testText = getRandomText(LEVEL);
  displayText.textContent = testText;
  userInput.disabled = false;
  userInput.value = '';
  userInput.focus();
  startTime = new Date().getTime();
  isTestRunning = true;
  timerInterval = setInterval(updateTimer, 1000);
}
function updateTimer() {
  const elapsedTime = Math.floor((new Date().getTime() - startTime) / 1000);
  timerDisplay.textContent = elapsedTime;
}
function calculateResults() {
  clearInterval(timerInterval);
  isTestRunning = false;
  const elapsedTime = (new Date().getTime() - startTime) / 1000;
  const wordsTyped = userInput.value.trim().split(/\s+/).length;
  const wpm = Math.round((wordsTyped / elapsedTime) * 60);
  const typedText = userInput.value;
  let correctChars = 0;
  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === testText[i]) {
      correctChars++;
    }
  }
  const accuracy = Math.round((correctChars / testText.length) * 100);
  speedDisplay.textContent = wpm;
  accuracyDisplay.textContent = accuracy;
  addHistoryEntry(wpm, accuracy);
}
startBtn.addEventListener('click', () => {
  if (!isTestRunning) {
    startTest();
  }
});
userInput.addEventListener('input', () => {
  if (isTestRunning) {
    const typedText = userInput.value;
    let correctChars = 0;
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] === testText[i]) {
        correctChars++;
      }
    }
    const accuracy = Math.round((correctChars / testText.length) * 100) || 0;
    const elapsedTime = (new Date().getTime() - startTime) / 1000;
    const wordsTyped = typedText.trim().split(/\s+/).length;
    const wpm = Math.round((wordsTyped / elapsedTime) * 60) || 0;
    speedDisplay.textContent = wpm;
    accuracyDisplay.textContent = accuracy;
    highlightText(typedText);
    if (typedText === testText) {
      userInput.disabled = true;
      calculateResults();
    }
  }
});
function highlightText(typedText) {
  let highlightedText = '';
  for (let i = 0; i < testText.length; i++) {
    if (typedText[i] === testText[i]) {
      highlightedText += `<span class="correct">${testText[i]}</span>`;
    } else {
      highlightedText += `<span class="incorrect">${testText[i]}</span>`;
    }
  }
  displayText.innerHTML = highlightedText;
}
function completeReset() {
  resetResults();
  clearInterval(timerInterval);
  displayText.textContent = `Click "Start" to begin the test!`;
  userInput.disabled = true;
  isTestRunning = false;
}
resetBtn.addEventListener('click', () => {
  completeReset();
});
function resetResults() {
  userInput.value = '';
  speedDisplay.textContent = 0;
  accuracyDisplay.textContent = 0;
  timerDisplay.textContent = 0;
}
function addHistoryEntry(wpm, accuracy) {
  const token = localStorage.getItem('authToken');

  if (!token) {
    console.error('Authorization token is missing');
    return;
  }
  const elapsedTime = (new Date().getTime() - startTime) / 1000;
  const time = new Date().toISOString();
  const entry = {
    speed: wpm,
    accuracy: accuracy,
    date: time,
    elapsedTime: elapsedTime,
    time: time,
  };
  fetch(HISTORY_URL, {
    method: 'POST',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  })
    .then(response => response.json())
    .then(data => {
      console.log('API Response:', data);

      if (data.message && data.message === 'History entry added successfully') {
        alert('History entry added successfully!');
        updateHistoryDisplay();
      } else {
        alert(
          'Failed to add history entry: ' + (data.message || 'Unknown error')
        );
      }
    })
    .catch(error => {
      console.error('Error adding history:', error.message);
      alert('Failed to add history entry. Please try again.');
    });
}
function updateHistoryDisplay() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error('Authorization token not found.');
    alert('Please log in to view your history.');
    return;
  }
  fetch(HISTORY_URL, {
    method: 'GET',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert(`Error: ${data.error}`);
        return;
      }
      if (Array.isArray(data)) {
        historyList.innerHTML = '';
        data.forEach(entry => {
          const li = document.createElement('li');
          const formattedDate = new Date(entry.time).toLocaleString();
          li.innerHTML = `
            <span class="history-span">${formattedDate} - Speed: ${entry.speed} WPM, Accuracy: ${entry.accuracy}%</span>
            <button class="delete-btn" data-id="${entry._id}"><i class="fa-solid fa-trash fa-bounce"></i></button>
          `;
          historyList.appendChild(li);
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
          button.addEventListener('click', () =>
            deleteHistoryEntry(button.dataset.id)
          );
        });
      } else {
        console.error('Received data is not an array:', data);
        alert('Error fetching history.');
      }
    })
    .catch(error => {
      console.error('Error fetching history:', error);
      alert('Failed to fetch history.');
    });
}
function deleteHistoryEntry(historyId) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error('Authorization token not found.');
    alert('Please log in to delete an entry.');
    return;
  }
  fetch(`${HISTORY_URL}/${historyId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `${token}`,
      'Content-type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(() => {
      alert('History entry deleted!');
      updateHistoryDisplay();
    })
    .catch(error => {
      console.error('Error deleting history:', error);
      alert('Failed to delete history.');
    });
}
document
  .querySelector(".nav-item[title='History']")
  .addEventListener('click', () => {
    historyModal.style.display = 'flex';
    updateHistoryDisplay();
  });

historyClose.addEventListener('click', () => {
  historyModal.style.display = 'none';
});
document.getElementById('signup-form').addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById(
    'signup-confirm-password'
  ).value;
  fetch(SIGNUP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({username, email, password, confirmPassword}),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      response.json();
    })
    .then(data => {
      alert('Sign-up successful! You can now log in.', data);
      signupModal.style.display = 'none';
    })
    .catch(error => console.error('Sign-up error:', error));
});
signupBtn.addEventListener('click', () => {
  signupModal.style.display = 'flex';
});
loginBtn.addEventListener('click', () => {
  loginModal.style.display = 'flex';
});
deleteAccountBtn.addEventListener('click', () => {
  deleteAccountModal.style.display = 'flex';
});

signupClose.addEventListener('click', () => {
  signupModal.style.display = 'none';
});
loginClose.addEventListener('click', () => {
  loginModal.style.display = 'none';
});
deleteAccountClose.addEventListener('click', () => {
  deleteAccountModal.style.display = 'none';
});
window.addEventListener('click', event => {
  if (
    event.target !== signupClose &&
    event.target !== loginClose &&
    event.target !== historyClose
  ) {
    return;
  }
});
darkButton.addEventListener(
  'click',
  (toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
      darkButton.innerHTML =
        "<i class='fas fa-regular fas fa-sun'></i><span>Light Mode</span>";
    } else {
      darkButton.innerHTML =
        "<i class='fas fa-regular fas fa-moon'></i><span>Dark Mode</span>";
    }
  })
);
hamburgerIcon.addEventListener('click', () => {
  navbarContent.classList.toggle('collapsed');
  navbarContent.classList.toggle('expanded');
});
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.shiftKey) {
    switch (e.key.toLowerCase()) {
      case 'l':
        loginModal.style.display = 'flex';
        break;
      case 's':
        signupModal.style.display = 'flex';
        break;
      case 'h':
        historyModal.style.display = 'flex';
        break;
      case 'r':
        resetBtn.click();
        break;
      case 'a':
        startBtn.click();
        break;
      case 'm':
        toggleDarkMode();
        break;
      case 'd':
        const deleteButton = document.querySelector('.delete-btn');
        if (deleteButton) deleteButton.click();
        break;
      case 'x':
        const openModal = document.querySelector(
          '.modal[style*="display: flex"]'
        );
        if (openModal) {
          openModal.querySelector('.close-btn').click();
        }
        break;
    }
  }
});
document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({username, password}),
  })
    .then(response => response.json())
    .then(data => {
      if (data.token && data.userId) {
        const currentUser = data.username;
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.userId);
        console.log(localStorage.getItem('authToken'));
        console.log(localStorage.getItem('userId'));
        alert(`Login successful! Welcome, ${currentUser}`);
        loginModal.style.display = 'none';
      } else {
        alert('Invalid login credentials');
      }
    })
    .catch(error => console.error('Login error:', error));
});
document.getElementById('logoutButton').addEventListener('click', async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error('Authorization token not found.');
    alert('Please log in to logout account.');
    return;
  }

  const response = await fetch(LOGOUT_URL, {
    method: 'POST',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  const result = await response.json();
  if (response.ok) {
    localStorage.removeItem('token');
    alert('logout successfully');
  } else {
    alert('Error: ' + result.message);
  }
});
document.getElementById('delete-account-form').addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('delete-account-username').value;
  const email = document.getElementById('delete-account-email').value;
  const password = document.getElementById('delete-account-password').value;
  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');
  if (!token) {
    console.error('Authorization token not found.');
    alert('Please log in to delete your account.');
    return;
  }
  if (!userId) {
    console.error('User ID not found.');
    alert('Unable to retrieve your user ID.');
    return;
  }
  fetch(`${DELETE_ACCOUNT_URL}/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
      userId: `${userId}`,
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Account deleted successfully') {
        alert('Your account has been deleted successfully.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error during account deletion:', error);
      alert('An error occurred. Please try again later.');
    });
});
