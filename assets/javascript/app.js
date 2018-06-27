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
    var trainFrequency = "";
    var trainName = "";
    var trainDestination =  "";
    var firstTrainTime = "";
    var firstTrainConverted = ""
    var diffTime = "";
    var diffTimeConverted = "";
    var nextTrain = "";
    var nextTrainConverted = "";
    var tRemainder = "";

    trainDB.on("child_added", function(childSnapshot){
        trainInfo = childSnapshot.val();
            trainName = trainInfo.trainName;
            trainDestination = trainInfo.trainDestination;
            firstTrainTime = trainInfo.firstTrainTime;
            trainFrequency = trainInfo.trainFrequency;
            firstTrainConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
            diffTime = moment().diff(moment(firstTrainConverted), "minutes");
            tRemainder = diffTime % trainFrequency;
            difference = trainFrequency - tRemainder;
            nextTrain = moment().add(difference, "minutes");
            nextTrainConverted = moment(nextTrain).format("HH:mm");

            //console.log("first train time: " + firstTrainTime);
            //console.log("next train: " + nextTrainConverted);
            //console.log("minutes till next: " + difference);
        
        //nextTrain
        var train = $("<tr>").addClass("train");
        train.append(
            $("<td>").addClass("trainName").text(trainName),
            $("<td>").addClass("trainDestination").text(trainDestination),
            $("<td>").addClass("trainFrequency").text(trainFrequency),
            $("<td>").addClass("nextTrainConverted").text(nextTrainConverted),
            $("<td>").addClass("difference").text(difference)
        );
        $("#trains-input").append(train);
    });
    
    $("#add-train").click(function(event){
        event.preventDefault();

        trainName = $("#train-name").val().trim();
        trainDestination = $("#train-destination").val().trim();
        firstTrainTime = $("#first-train-time").val().trim();
        trainFrequency = parseInt($("#departure-frequency").val().trim());
    
        if (firstTrainTime < 2400 && firstTrainTime >= 0) {
            if (trainFrequency > 0) {
                trainDB.push({
                    trainName,
                    trainDestination,
                    firstTrainTime,
                    trainFrequency
                });
                $("#first-train-time").val("");
                $("#departure-frequency").val("");
            } else {
                $("#departure-frequency").val("").attr("placeholder", "Value must be greater than 0");
                return;
            }
        } else {
            $("#first-train-time").val("").attr("placeholder", "Enter a value between 0 and 2359");
            return;
        }
        
        $("#train-name").val("");
        $("#train-destination").val("");
        $("#departure-frequency").val("");
    });
});