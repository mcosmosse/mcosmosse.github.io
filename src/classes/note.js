
  var isPlaying = false;
  var speed = 0;
  var animation = 'moveDown';
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
        noteElement.style.backgroundColor = key.color;
        noteElement.style.animationName = animation;
        noteElement.style.animationTimingFunction = 'linear';
        noteElement.style.animationDuration = note.duration - speed + 's';
        noteElement.style.animationDelay = note.delay + speed + 's';
        noteElement.style.animationPlayState = 'paused';
        trackElement.appendChild(noteElement);
      });
  
      trackContainer.appendChild(trackElement);
      tracks = document.querySelectorAll('.track');
    });
  };
  
  var updateAnimation = function () {
    animation = 'moveDownFade';
    initializeNotes();
  };
  
  var setupStartButton = function () {
    var startButton = document.querySelector('.btn--start');
    startButton.addEventListener('click', function () {
      isPlaying = true;
      startTime = Date.now();
      document.querySelector('.song').play();
      document.querySelectorAll('.note').forEach(function (note) {
        note.style.animationPlayState = 'running';
      });
    });
  };
  
  var setupNoteMiss = function () {
    trackContainer.addEventListener('animationend', function (event) {
      var index = event.target.classList.item(1)[6];
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
    var perfectTime = nextNote.duration + nextNote.delay;
    var accuracy = Math.abs(timeInSecond - perfectTime);
  
    if (accuracy > (nextNote.duration - speed) / 4) {
      return;
    }
  
    showHitEffect(index);
    removeNoteFromTrack(tracks[index], tracks[index].firstChild);
    updateNext(index);
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
  
    initializeNotes();
    setupStartButton();
    setupKeys();
    setupNoteMiss();
  }