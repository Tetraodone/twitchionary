var access_token
var broadcast_id
var shoutout_id
var onlymyclips = false
var foundClips = false
var broadcast_name
var str

var prompts = {
  animals: ["pig", "cat", "mouse", "unicorn", "elephant", "tiger", "dinosaur", "eagle", "clownfish", "pufferfish", "crab", "mouse", "rat", "worm", "monkey", "baby", "whale", "ant"],
  objects: ["door", "pen", "desk", "glass", "phone", "cowbell", "tent", "tower", "keyboard", "car", "bike", "bicycle", "credit card", "bag", "switch", "lamp", "dresser", "mirror"],
  actions: ["running", "writing", "sketching", "driving", "burning", "petting", "building", "looking", "cleaning", "sleeping"]
}


var app = new Vue({
    el: '#app',
    data: {
      username: "",
      word: "",
      connected: false,
      gameReady: false,
      guessed: false,
      guessedUsername: "",
      timeString: "",
      loading: false,
      showWord: "password",
      guesses: [],
      usedPrompts: []
    },
    mounted() {

    },
    methods: {
      connect: function (){
        ComfyJS.Init( this.username );
        app.loading = true
      },
      startGame: function (){
        if(this.word != ""){
          this.gameReady = true
          startTimer()
        } else {
          alert("You must choose a word first!")
        }
        
      },
      nextGame: function (){
        this.gameReady = false
        this.guessed = false
        clearInterval(timer);
      },
      toggleWord: function(){
        if(this.showWord == "password"){
          this.showWord = "text"
        } else {
          this.showWord = "password"
        }
      },
      usePrompt: function (prompt){
        var index = getRandomInt(0, prompts[prompt].length)
        do{
          index = getRandomInt(0, prompts[prompt].length)
        }while(this.usedPrompts.includes(prompts[prompt][index]))
        this.word = prompts[prompt][index]
      }
    },
    computed: {
      guessPos() {
        return {
          'top': getRandomInt(20, 80) + '%',
          'left': getRandomInt(20, 80) + '%'
        }
      }
    }

  })



ComfyJS.onConnected = ( address, port, isFirstConnect ) => {
  app.loading = false
  app.connected = true
}
var startTime;
var elapsedTime;
var timer;

function guessPos() {

  var top = getRandomInt(20, 80)
  var left = getRandomInt(20, 80)
  do{
    top = getRandomInt(20, 80)
    left = getRandomInt(20, 80)
  }while((top > 45 && top < 55) || (left > 45 && left < 55))

  return {
    'top': top + '%',
    'left': left + '%'
  }
}

function startTimer(){
  startTime = Date.now();
  timer = setInterval(function printTime() {
    elapsedTime = Date.now() - startTime;
    app.timeString = timeToString(elapsedTime);
  }, 1);
}

ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
  if( command === "guess" ) {
    
    if(!app.gameReady){
      console.log("But the game is not started")
    } else {

      if((simplify(message) == simplify(app.word)) && (app.guessed == false)){

        console.log( `${user} guessed ${message} correctly!` );
        app.guessed = true;
        app.guessedUsername = user
        clearInterval(timer);

      } else {

        console.log( `${user} guessed ${message}` );

        app.guesses.push({
          text: message, 
          position: guessPos()
        })


        setTimeout(function(){
          app.guesses.shift();
      }, 4000);
      }
    }
  }
}

function simplify(str){
  var newStr = str.toLowerCase()
  newStr = newStr.replace(' ', '')
  return newStr
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function timeToString(time) {
  let diffInHrs = time / 3600000;
  let hh = Math.floor(diffInHrs);

  let diffInMin = (diffInHrs - hh) * 60;
  let mm = Math.floor(diffInMin);

  let diffInSec = (diffInMin - mm) * 60;
  let ss = Math.floor(diffInSec);

  let formattedHH = hh.toString().padStart(2, "0");
  let formattedMM = mm.toString().padStart(2, "0");
  let formattedSS = ss.toString().padStart(2, "0");

  return `${formattedMM}:${formattedSS}`;
}
   