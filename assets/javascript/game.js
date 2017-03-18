$(document).ready(function() { // ADD ERROR CATCHERS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  // Initialize Firebase==================================================================
  var config = {
    apiKey: "AIzaSyBtJxnHDsdo7UwMDJgvfUtbW8wt5cnWZUU",
    authDomain: "rps-multiplayer-dc313.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-dc313.firebaseio.com",
    storageBucket: "rps-multiplayer-dc313.appspot.com",
    messagingSenderId: "499712118144"
  };

  firebase.initializeApp(config);

  // Firebase ref() variables===============================================================
  var database = firebase.database();
  var dbRef = database.ref();
  var dbRefPlayers = database.ref("players");
  var dbRefTurns = database.ref("turns");
  var dbRefChat = database.ref("chat");
  var dbRefIsNull = true;

  var dbRefP1 = database.ref("players/1");
  var dbRefP1Wins = database.ref("players/1/wins");
  var dbRefP1Losses = database.ref("players/1/losses");

  var dbRefP2 = database.ref("players/2");
  var dbRefP2Wins = database.ref("players/2/wins");
  var dbRefP2Losses = database.ref("players/2/losses");

  // Javascript variables===================================================================
  var name = "";
  var icon = "";
  var wins = 0;
  var losses = 0;
  var move = "";
  var availableMoves = ["ROCK", "PAPER", "SCISSORS"];

  // FUNCTIONS==============================================================================
  var forFB = {

    getPlayerIcon: function() {
      if ($("#icon-male").hasClass("selected")) {
        icon = "male";
      }
      else {
        icon = "female";
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
        dbRefP1.onDisconnect().remove();
      }
      else {
        dbRefP2.set({
          name: name,
          icon: icon,
          wins: wins,
          losses: losses
        });
        sessionStorage.playerNum = "two";
        dbRefP2.onDisconnect().remove();
      }
    }
  }

  var loadPlayer = {

    one: function(n, i, w, l) {
      $(".row-2 .col-left").addClass("filled"); //make sure to remove "filled"
      $(".row-2 .col-right .player-name").html("Waiting for Player 2...");
      $(".row-2 .col-left .player-icon").attr("src", "assets/images/" + i + ".png");
      $(".row-2 .col-left .player-name").text(n);
      $(".row-2 .col-left .player-wins").text("Wins: " + w);
      $(".row-2 .col-left .player-losses").text("Losses: " + l);
    },

    two: function(n, i, w, l) {
      alert("loading player 2");
      $("#vs").text("vs");
      $(".row-2 .col-right .player-icon").attr("src", "assets/images/" + i + ".png");
      $(".row-2 .col-right .player-name").html(n);
      $(".row-2 .col-right .player-wins").text("Wins: " + w);
      $(".row-2 .col-right .player-losses").text("Losses: " + l);
    }
  }

  var loadChoicesForPlayer = {

    one: function() {

      alert("loading player 1 moves");

      $(".row-3 .col-left").html("<ul>");

      for (i = 0; i < availableMoves.length; i++) {
        $(".row-3 .col-left ul").append("<li class='p1-choices'>" + availableMoves[i] + "</li>");
      }
    },

    two: function() {

      alert("loading player 2 moves");

      $(".row-3 .col-right").html("<ul>");

      for (i = 0; i < availableMoves.length; i++) {
        $(".row-3 .col-right ul").append("<li class='p2-choices'>" + availableMoves[i] + "</li>");
      }
    }
  }

  var loadMoveForPlayer = {

    one: function(m) {
      var newImg = $("<img class='p1-move'>");
      newImg.attr("src", "assets/images/" + m + ".png").css({width: "20vw", height: "auto"});
      $(".row-3 .col-left").html(newImg);
      dbRefP1.update({move: m});
    },

    two: function(m) {
      var newImg = $("<img class='p2-move'>");
      newImg.attr("src", "assets/images/" + m + ".png");
      $(".row-3 .col-right").html(newImg);
      dbRefP2.update({move: m});
    }

  }

  function loadGameLayout() {
    $(".col-mid").css({width: "10%"}).empty();
    $(".row-3").css({height: "23vw"});
    $(".row-2 .col-left, .row-2 .col-right").css({background: "rgba(255,171,53,0.7)", width: "45%"}); 
    $(".row-3 .col-left, .row-3 .col-right").css({background: "#f4f5e7", width: "45%"});
    $(".row-2 .col-left").css({"border-top-right-radius": "50px"});
    $(".row-2 .col-right").css({"border-top-left-radius": "50px"});
    $(".row-3 .col-left").css({"border-bottom-right-radius": "50px"});
    $(".row-3 .col-right").css({"border-bottom-left-radius": "50px"}); 
  }

  var displayMsg = {
    yourTurn: function() {
      $("#game-progress").html("Your turn.");
    },
    waiting: function(n) {
      $("#game-progress").html("Waiting for " + "<span class='nameInMsg'>" + n + "</span> to choose...");
    },
    win: function() {
      $("#game-progress").html("You win!");
    },
    lose: function() {
      $("#game-progress").html("You lose.");
    },
    tie: function() {
      $("#game-progress").html("You tied.");
    }
  }

  var update = {
    turns: function() {
      dbRefTurns.transaction(function(currentTurn) {
        return currentTurn + 1;
      });
    },
    p1Wins: function() {
      dbRefP1Wins.transaction(function(p1Wins) {
        return p1Wins + 1;
      });
    },
    p1Losses: function() {
      dbRefP1Losses.transaction(function(p1Losses) {
        return p1Losses + 1;
      });
    },
    p2Wins: function() {
      dbRefP2Wins.transaction(function(p2Wins) {
        return p2Wins + 1;
      });
    },
    p2Losses: function() {
      dbRefP2Losses.transaction(function(p2Losses) {
        return p2Losses + 1;
      });
    },
    scoresInDOM: function() {
      dbRefP1Wins.on("value", function(p1w) {
        $(".row-2 .col-left .player-wins").text("Wins: " + p1w.val());
      });
      dbRefP1Losses.on("value", function(p1l) {
        $(".row-2 .col-left .player-losses").text("Losses: " + p1l.val());
      })
      dbRefP2Wins.on("value", function(p2w) {
        $(".row-2 .col-right .player-wins").text("Wins: " + p2w.val());
      })
      dbRefP2Losses.on("value", function(p2l) {
        $(".row-2 .col-right .player-losses").text("Losses: " + p2l.val());
      })
    }
  }

  function determineWinner(p1n, p1m, p2n, p2m) {

    if (((p1m === "rock") && (p2m === "scissors")) || ((p1m === "paper") && (p2m === "rock")) || ((p1m === "scissors") && (p2m === "paper"))) {

      if (sessionStorage.playerNum === "one") {
        displayMsg.win();
        update.p1Wins();
      }
      else if (sessionStorage.playerNum === "two") {
        displayMsg.lose();
        update.p2Losses();
      }
    }
    
    if (((p1m === "rock") && (p2m === "paper")) || ((p1m === "paper") && (p2m === "scissors")) || ((p1m === "scissors") && (p2m === "rock"))) {
      if (sessionStorage.playerNum === "one") {
        displayMsg.lose();
        update.p1Losses();
      }
      else if (sessionStorage.playerNum === "two") {
        displayMsg.win();
        update.p2Wins();
      }
    }
    
    if (((p1m === "rock") && (p2m === "rock")) || ((p1m === "paper") && (p2m === "paper")) || ((p1m === "scissors") && (p2m === "scissors"))) {
      displayMsg.tie();
    }
  }

  // Check if a player exists===========================================================================
  dbRef.on("value", function(snapRef) {
    if (snapRef.val() === null) {
      dbRefIsNull = true;
    }
    else {
      dbRefIsNull = false;
    }
  });

  // Click start to load players and start game=========================================================
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

    loadGameLayout();

    dbRefPlayers.on("child_added", function(snapPlayer) {

      name = snapPlayer.val().name;
      icon = snapPlayer.val().icon;
      wins = snapPlayer.val().wins;
      losses = snapPlayer.val().losses;

      if ($(".row-2 .col-left").hasClass("filled")) { //make sure to remove ".filled" when user leaves
        loadPlayer.two(name, icon, wins, losses);
        dbRefTurns.set(1);
      }
      else {
        loadPlayer.one(name, icon, wins, losses);
      }
    });

  });

  // When turns changes=================================================================================
  dbRefTurns.on("value", function(snapTurns) {

    var p1Name = "";
    var p1Move = "";
    var p1Wins;
    var p1Losses;
    var p2Name = "";
    var p2Move = "";
    var p2Wins;
    var p2Losses;
    var turn = snapTurns.val();

    if (!dbRefIsNull) {
      dbRefP2.on("value", function(snapP2) {
        p2Name = snapP2.val().name;
        p2Move = snapP2.val().move;
        p2Wins = snapP2.val().wins;
        p2Losses = snapP2.val().losses;
      })

      dbRefP1.on("value", function(snapP1) {
        p1Name = snapP1.val().name;
        p1Move = snapP1.val().move;
        p1Wins = snapP1.val().wins;
        p1Losses = snapP1.val().losses;
      })
    }

    if (turn !== null) {

      if (turn === 1) {
        if (sessionStorage.playerNum === "one") {
          loadChoicesForPlayer.one();
          $(".row-3 .col-right").empty();
          displayMsg.yourTurn();
        }
        else if (sessionStorage.playerNum === "two") {
          $(".row-3 .col-left, .row-3 .col-right").empty();
          displayMsg.waiting(p1Name);
        }
      }

      if (turn === 2) {
        if (sessionStorage.playerNum === "one") {

          displayMsg.waiting(p2Name);
        }
        else if (sessionStorage.playerNum === "two") {
          loadChoicesForPlayer.two();
          displayMsg.yourTurn();
        }
      } 

      if (turn === 3) {
        loadMoveForPlayer.one(p1Move);
        loadMoveForPlayer.two(p2Move);
        determineWinner(p1Name, p1Move, p2Name, p2Move);
        update.scoresInDOM(p1Wins, p1Losses, p2Wins, p2Losses);
        setTimeout(restart, 3000);
      }     
    
    }
  });


  // When player 1 chooses move==============================================================
  $(document).on("click", ".p1-choices", function() {
    alert("load p1 move");
    var p1Move = $(this).text().toLowerCase();
    loadMoveForPlayer.one(p1Move);
    update.turns();
  });

  // When player 2 chooses moves==============================================================
  $(document).on("click", ".p2-choices", function() {
    alert("load p2 move");
    var p2Move = $(this).text().toLowerCase();
    loadMoveForPlayer.two(p2Move);
    update.turns();
  });

  // When player chooses icon=================================================================
  $("img[id^='icon']").on("click", function() {

    $("img").removeClass("selected");

    $(this).addClass("selected");
  });

function restart() {
  dbRefTurns.transaction(function(snapTurns) {
    return 1;
  });
}

dbRefTurns.onDisconnect().remove();

dbRefPlayers.on("child_removed", function(removedPlayer) {
  var key = removedPlayer.key;
  if (key === "1") {
    $(".row-2 .col-left").html("Waiting for a player...").removeClass("filled");
    $(".row-3 .col-left").empty();
  }
  else if (key === "2") {
    $(".row-2 .col-right").html("Waiting for a player...");
    $(".row-3 .col-right").empty();
  }
});




});