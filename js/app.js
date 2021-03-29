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
      timeString: ""
    },
    mounted() {

    },
    methods: {
      connect: function (){
        ComfyJS.Init( this.username );
        this.connected = true
      },
      startGame: function (){
        this.gameReady = true
        startTimer()
      },
      nextGame: function (){
        this.gameReady = false
        this.guessed = false
        clearInterval(timer);
      }
    }

  })

// ComfyJS.onConnected = ( address, port, isFirstConnect ) => {
//   app.chatboxContent.push("Connected to Chatbox!")
// }
var startTime;
var elapsedTime;
var timer;

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
      if((message.toLowerCase() == app.word.toLowerCase()) && (guessed = false)){
        console.log( `${user} guessed ${message} correctly!` );
        app.guessed = true;
        app.guessedUsername = user
        clearInterval(timer);
      } else {
        console.log( `${user} guessed ${message}` );
      }
    }
  }
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
   