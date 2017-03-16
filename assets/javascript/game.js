$(document).ready(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBtJxnHDsdo7UwMDJgvfUtbW8wt5cnWZUU",
    authDomain: "rps-multiplayer-dc313.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-dc313.firebaseio.com",
    storageBucket: "rps-multiplayer-dc313.appspot.com",
    messagingSenderId: "499712118144"
  };

  firebase.initializeApp(config);

  var dbRef = firebase.database().ref();
  var dbRefPlayers = firebase.database().ref("players");
  var dbRefP1 = firebase.database().ref("players/1");
  var dbRefP2 = firebase.database().ref("players/2");
  var dbRefTurns = firebase.database().ref("turns");
  var dbRefChat = firebase.database().ref("chat");
  var dbRefIsNull = true;

  var name = "";
  var icon = "";
  var wins = 0;
  var losses = 0;
  var move = "";
  var turns = 0;
  var turnIsEven = false;
  var availableMoves = ["ROCK", "PAPER", "SCISSORS"];


  var forFB = {

    getPlayerIcon: function() {
      if ($("#icon-male").hasClass("selected")) {
        icon = $("#icon-male").attr("src");
      }
      else {
        icon = $("#icon-female").attr("src");
      }
    },

    setPlayer: function() {
      if (dbRefIsNull) {
        dbRefP1.set({
          name: name,
          icon: icon,
          wins: wins,
          losses: losses
        });
        sessionStorage.playerNum = "one";
      }
      else {
        dbRefP2.set({
          name: name,
          icon: icon,
          wins: wins,
          losses: losses
        });
        dbRefTurns.set(1);
        sessionStorage.playerNum = "two";
      }
    }
  }

  var loadPlayer = {

    one: function(n, i, w, l) {
      $(".r2-col-left").addClass("filled");
      $(".r2-col-right .player-name").html("Waiting for Player 2...");
      $(".r2-col-left .player-icon").attr("src", i);
      $(".r2-col-left .player-name").text(n);
      $(".r2-col-left .player-wins").text("Wins: " + w);
      $(".r2-col-left .player-losses").text("Losses: " + l);
    },

    two: function(n, i, w, l) {
      alert("loading player 2");
      $("#vs").text("vs");
      $(".r2-col-right .player-icon").attr("src", i);
      $(".r2-col-right .player-name").html(n);
      $(".r2-col-right .player-wins").text("Wins: " + w);
      $(".r2-col-right .player-losses").text("Losses: " + l);
    }
  }

  var loadMovesForPlayer = {

    one: function() {
      alert("loading player 1 moves");

      $(".r3-col-left").html("<ul>");

      for (i = 0; i < availableMoves.length; i++) {
        $(".r3-col-left ul").append("<li>" + availableMoves[i] + "</li>");
      }
    },

    two: function() {
      alert("loading player 2 moves");

      $(".r3-col-right").html("<ul>");

      for (i = 0; i < availableMoves.length; i++) {
        $(".r3-col-right ul").append("<li>" + availableMoves[i] + "</li>");
      }
    }
  }

  function readTurns(t) {
    var r = t % 2;
    if (r === 0) {
      turnIsEven = true;
    }
    else {
      turnIsEven = false;
    }
  }


  // Check if a player exists
  dbRef.on("value", function(snapRef) {
    if (snapRef.val() === null) {
      dbRefIsNull = true;
    }
    else {
      dbRefIsNull = false;
    }
  });

  // Click start to load players and start game----------------------
  $("#start-btn").on("click", function() {


    name = $("#player-name").val().trim();

    if (name === "") {
      alert("Enter a name");
    }
    else {
      forFB.getPlayerIcon();
      forFB.setPlayer();
      $("img[id^='icon'], input").remove();
    }

    dbRefPlayers.on("child_added", function(snapPlayer) {

      name = snapPlayer.val().name;
      icon = snapPlayer.val().icon;
      wins = snapPlayer.val().wins;
      losses = snapPlayer.val().losses;

      if ($(".r2-col-left").hasClass("filled")) { //make sure to remove ".filled" when user leaves
        loadPlayer.two(name, icon, wins, losses);
      }
      else {
        loadPlayer.one(name, icon, wins, losses);
      }
    });

    $(".row-2, .row-5").show();

  });
  //----------------------------------------------------------------


  dbRefTurns.on("value", function(snapTurns) {

    turns = snapTurns.val();

    if (turns !== null) {
      readTurns(turns);
    
      if (turnIsEven) {
        alert("turn is even: " + turns);
        if (sessionStorage.playerNum === "two") {
          $(".r3-col-right ul").css({visibility: "visible"});
          $(".r3-col-left ul").css({visibility: "hidden"});
        }
      }
      else {
        alert("turn is odd: " + turns);
        loadMovesForPlayer.one();
        if (sessionStorage.playerNum === "one") {
          $("#game-progress").html("Your move.");
        }
        else if (sessionStorage.playerNum === "two") {
          $(".r3-col-left ul").css({visibility: "hidden"});
          dbRefP1.on("value", function(snapP1) {
            var p1Name = snapP1.val().name;
            console.log(p1Name);
            $("#game-progress").html("Waiting for " + p1Name + " to choose...");
          })
          
        }
        
      }
    }
  });







  $("img[id^='icon']").on("click", function() {

    $("img").removeClass("selected");

    $(this).addClass("selected");
  });




});