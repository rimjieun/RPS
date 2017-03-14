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

  var database = firebase.database();

  var player = "";
  var name = "";
  var icon = "";
  var wins = 0;
  var losses = 0;
  var move = "";
  var turns = 0;



  // $("img[id^='icon']").on("click", function() {
  //   $(this).addClass("selected");
  // });

  function loadGameFrame() {

    var trNew = $("<tr>");

    var tdLeft = $("<td>");
    tdLeft.addClass("col-left");

    var tdMid = $("<td>");
    tdMid.addClass("col-mid")
         .css({width: "10%"});

    var tdRight = $("<td>");
    tdRight.addClass("col-right");

    trNew.append(tdLeft)
         .append(tdMid)
         .append(tdRight);

    $(".row-2").append(trNew);


    // $(".row-2").css({
    //   background: "yellow",
    //   height: "100px"
    // }).delay(1000).fadeIn(1000);
  }

  function loadPlayerOne() {
    database.ref().on("value", function(snap) {

      var player1 = snap.val();

      console.log(player1);

    })
  }

  $("#start-btn").one("click", function() {
    
    database.ref().set({
      name: "Jieun",
      icon: "female",
      wins: 0,
      losses: 0
    })

    $("img, input").fadeOut(1000);

    loadGameFrame();
    loadPlayerOne();

  });





});