var access_token
var broadcast_id
var shoutout_id
var onlymyclips = false
var foundClips = false
var broadcast_name
var str


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
      guesses: []
    },
    mounted() {

    },
    methods: {
      connect: function (){
        ComfyJS.Init( this.username );
        app.loading = true
      },
      startGame: function (){
        this.gameReady = true
        startTimer()
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

      if((message.toLowerCase() == app.word.toLowerCase()) && (app.guessed == false)){
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
   