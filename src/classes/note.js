var isHolding = {
    s: false,
    d: false,
    f: false,
    ' ': false,
    j: false,
    k: false,
    l: false
  };
  
  var hits = { perfect: 0, good: 0, bad: 0, miss: 0 };
  var isPlaying = false;
  var combo = 0;
  var maxCombo = 0;
  var startTime;
  var trackContainer;
  var tracks;
  var keypress;
  var comboText;
  
  var initializeNotes = function () {
    var noteElement;
    var trackElement;
  
    while (trackContainer.hasChildNodes()) {
      trackContainer.removeChild(trackContainer.lastChild);
    }
  
    song.sheet.forEach(function (key, index) {
      trackElement = document.createElement('div');
      trackElement.classList.add('track');
  
      key.notes.forEach(function (note) {
        noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.classList.add('note--' + index);
        noteElement.style.backgroundColor = 'white';
        noteElement.style.animationName = 'moveDown';
        noteElement.style.animationTimingFunction = 'linear';
        noteElement.style.animationDuration = 3 + 's';
        noteElement.style.animationDelay = note.delay + 's';
        noteElement.style.animationPlayState = 'paused';
        trackElement.appendChild(noteElement);
      });
  
      trackContainer.appendChild(trackElement);
      tracks = document.querySelectorAll('.track');
    });
  };
  
  var setupStartButton = function () {
    var startButton = document.querySelector('.btn--start');
    startButton.addEventListener('click', function () {
      isPlaying = true;
      startTime = Date.now();
  
    //!   document.querySelector('.song').play();
      document.querySelectorAll('.note').forEach(function (note) {
        note.style.animationPlayState = 'running';
      });
    });
  };
  
  var setupNoteMiss = function () {
    trackContainer.addEventListener('animationend', function (event) {
      var index = event.target.classList.item(1)[6];
  
      displayAccuracy('miss');
      updateHits('miss');
      updateCombo('miss');
      updateMaxCombo();
      removeNoteFromTrack(event.target.parentNode, event.target);
      updateNext(index);
    });
  };
  
  var setupKeys = function () {
    document.addEventListener('keydown', function (event) {
      var keyIndex = getKeyIndex(event.key);
  
      if (Object.keys(isHolding).indexOf(event.key) !== -1
        && !isHolding[event.key]) {
        isHolding[event.key] = true;
        keypress[keyIndex].style.display = 'block';
  
        if (isPlaying && tracks[keyIndex].firstChild) {
          judge(keyIndex);
        }
      }
    });
  
    document.addEventListener('keyup', function (event) {
      if (Object.keys(isHolding).indexOf(event.key) !== -1) {
        var keyIndex = getKeyIndex(event.key);
        isHolding[event.key] = false;
        keypress[keyIndex].style.display = 'none';
      }
    });
  };
  
  var getKeyIndex = function (key) {
    if (key === 's') {
      return 0;
    } else if (key === 'd') {
      return 1;
    } else if (key === 'f') {
      return 2;
    } else if (key === ' ') {
      return 3;
    } else if (key === 'j') {
      return 4;
    } else if (key === 'k') {
      return 5;
    } else if (key === 'l') {
      return 6;
    }
  };
  
  var judge = function (index) {
    var timeInSecond = (Date.now() - startTime) / 1000;
    var nextNoteIndex = song.sheet[index].next;
    var nextNote = song.sheet[index].notes[nextNoteIndex];
    var perfectTime = 3 + nextNote.delay;
    var accuracy = Math.abs(timeInSecond - perfectTime);
    var hitJudgement;

    if (accuracy > .75) {
      return;
    }
  
    hitJudgement = getHitJudgement(accuracy);
    displayAccuracy(hitJudgement);
    showHitEffect(index);
    updateHits(hitJudgement);
    updateCombo(hitJudgement);
    updateMaxCombo();
    removeNoteFromTrack(tracks[index], tracks[index].firstChild);
    updateNext(index);
  };
  
  var getHitJudgement = function (accuracy) {
    if (accuracy < 0.1) {
      return 'perfect';
    } else if (accuracy < 0.2) {
      return 'good';
    } else if (accuracy < 0.3) {
      return 'bad';
    } else {
      return 'miss';
    }
  };
  
  var displayAccuracy = function (accuracy) {
    var accuracyText = document.createElement('div');
    document.querySelector('.hit__accuracy').remove();
    accuracyText.classList.add('hit__accuracy');
    accuracyText.classList.add('hit__accuracy--' + accuracy);
    accuracyText.innerHTML = accuracy;
    document.querySelector('.hit').appendChild(accuracyText);
  };
  
  var showHitEffect = function (index) {
    var key = document.querySelectorAll('.key')[index];
    var hitEffect = document.createElement('div');
    hitEffect.classList.add('key__hit');
    key.appendChild(hitEffect);
  };
  
  var updateHits = function (judgement) {
    hits[judgement]++;
  };
  
  var updateCombo = function (judgement) {
    if (judgement === 'bad' || judgement === 'miss') {
      combo = 0;
      comboText.innerHTML = '';
    } else {
      comboText.innerHTML = ++combo;
    }
  };
  
  var updateMaxCombo = function () {
    maxCombo = maxCombo > combo ? maxCombo : combo;
  };
  
  var removeNoteFromTrack = function (parent, child) {
    parent.removeChild(child);
  };
  
  var updateNext = function (index) {
    song.sheet[index].next++;
  };
  
  window.onload = function () {
    trackContainer = document.querySelector('.track-container');
    keypress = document.querySelectorAll('.keypress');
    comboText = document.querySelector('.hit__combo');
  
    initializeNotes();
    setupStartButton();
    setupKeys();
    setupNoteMiss();
  }

  // 