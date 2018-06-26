$(document).ready(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBQSRmUx-uhHOuvaT6qMaOpYFb1bfQxeik",
        authDomain: "train-schedule-12ae8.firebaseapp.com",
        databaseURL: "https://train-schedule-12ae8.firebaseio.com",
        projectId: "train-schedule-12ae8",
        storageBucket: "",
        messagingSenderId: "938652251912"
    };
    firebase.initializeApp(config);
    
    // declare variables
    var database = firebase.database();
    var trainDB = database.ref("/trains");
    var trainInfo = "";
    var presentTime = moment();
    var difference = "";
    var nextTrain = "";
    var trainName = "";
    var trainDestination =  "";
    var firstTrainTime = "";
    var firstTimeConverted = ""
    var diffTime = "";
    var diffTimeFormatted = "";
    var trainFrequency = "";
    var nextTrain = "";
    var nextTrainFormatted = "";
    var minutes = "";
    var tRemainder = "";
    var train = "";
    
    trainDB.on("child_added", function(childSnapshot){
        trainInfo = childSnapshot.val();
            trainName = trainInfo.trainName;
            trainDestination = trainInfo.trainDestination;
            firstTrainTime = trainInfo.firstTrainTime;
            trainFrequency = trainInfo.trainFrequency;
            firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
            diffTime = moment().diff(moment(firstTimeConverted), "minutes");
            //diffTimeFormatted = moment(diffTime).format("hh:mm");
            tRemainder = diffTime % trainFrequency;
            minutes = trainFrequency - tRemainder;
            nextTrain = moment().add(minutes, "minutes");
            nextTrainFormatted = moment(nextTrain).format("hh:mm");
            
            console.log(tRemainder);
            console.log(firstTrainTime);
            console.log(nextTrainFormatted);
            console.log(minutes);
        
        //nextTrain
        train = $("<tr>");
        train.append(
            $("<td>").text(trainName),
            $("<td>").text(trainDestination),
            $("<td>").text(trainFrequency),
            $("<td>").text(nextTrainFormatted),
            $("<td>").text(minutes)
        );
        
        $("#trains-input").append(train);
        //console.log("first Time Converted " + firstTimeConverted);
        //console.log("diffTime " + diffTime);
        //console.log("diffTimeFormatted " + diffTimeFormatted);
    });
    
    $("#add-train").click(function(event){
        event.preventDefault();

        trainName = $("#train-name").val().trim();
        trainDestination = $("#train-destination").val().trim();
        firstTrainTime = $("#first-train-time").val().trim();
        trainFrequency = parseInt($("#departure-frequency").val().trim());
    
        trainDB.push({
            trainName,
            trainDestination,
            firstTrainTime,
            trainFrequency
        });

        $("#train-name").val("");
        $("#train-destination").val("");
        $("#departure-frequency").val("");
    });
        

    
    //console.log(moment().format("DD/MM/YY hh:mm A"));
});