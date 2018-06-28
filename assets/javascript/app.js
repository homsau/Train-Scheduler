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
    var train = "";

    // limit the amount of numbers able to be typed in the time area
    $("input#first-train-time").on("keyup", function() {
        limitText(this, 4);
    });
    function limitText(field, maxChar){
        var ref = $(field);
            val = ref.val();
        if (val.length >= maxChar){
            ref.val(function() {
                //console.log(val.substr(0, maxChar))
                return val.substr(0, maxChar);
            });
        }
    }

    // grab and add info to send to firebase.
    trainDB.on("child_added", function(childSnapshot){
        trainInfo = childSnapshot.val();
            trainName = trainInfo.trainName;
            trainDestination = trainInfo.trainDestination;
            firstTrainTime = trainInfo.firstTrainTime;
            trainFrequency = trainInfo.trainFrequency;
            firstTrainConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
            diffTime = moment().diff(moment(firstTrainConverted), "minutes");
            remainder = diffTime % trainFrequency;
            difference = trainFrequency - remainder;
            nextTrain = moment().add(difference, "minutes");
            nextTrainConverted = moment(nextTrain).format("HH:mm");

            //console.log("first train time: " + firstTrainTime);
            //console.log("next train: " + nextTrainConverted);
            //console.log("minutes till next: " + difference);
        
        // nextTrain
        // adding the info from the "td" elements to the table
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
    
    // take info from the input form and push it to firebase
    $("#add-train").click(function(event){
        event.preventDefault();

        trainName = $("#train-name").val().trim();
        trainDestination = $("#train-destination").val().trim();
        firstTrainTime = $("#first-train-time").val().trim();
        trainFrequency = parseInt($("#departure-frequency").val().trim());
        var first2Time = firstTrainTime.substring(0, 2);
        var second2Time = firstTrainTime.substring(2, 4);
        console.log(first2Time);
        //console.log(second2Time);

        // make sure a number 0-2359 is added. not 2299 or 2510 but a valid military time
        if (first2Time >= 0 && first2Time <= 23 && second2Time >= 0 && second2Time <= 59) {
            if (trainFrequency > 0) {
                trainDB.push({
                    trainName,
                    trainDestination,
                    firstTrainTime,
                    trainFrequency
                });
                // making sure the placeholder is correct if a valid answer is given
                $("#first-train-time").val("").attr("placeholder", "HHmm");
                $("#departure-frequency").val("").attr("placeholder", "60");
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