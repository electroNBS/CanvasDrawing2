var database;

var drawing = [];
var currentPath = [];
var isDrawing = false;

function setup() {
    canvas = createCanvas(1300, 450);

    canvas.mousePressed(startPath);
    canvas.parent("canvascontainer");
    canvas.mouseReleased(endPath);

    var saveButton = select("#saveButton");
    saveButton.mousePressed(saveDrawing);

    var clearButton = select("#clearButton");
    clearButton.mousePressed(clearDrawing);

    var firebaseConfig = {
        apiKey: "AIzaSyBg6fbb6yRaVu5_3mmgJ4bvl57QsWLSMuc",
        authDomain: "universal-paint-app.firebaseapp.com",
        databaseURL: "https://universal-paint-app.firebaseio.com",
        projectId: "universal-paint-app",
        storageBucket: "universal-paint-app.appspot.com",
        messagingSenderId: "853861564201",
        appId: "1:853861564201:web:633b26a42c1bb8626f8138",
    };
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();

    var params = getURLParams();
    console.log(params);
    if (params.id) {
        console.log(params.id);
        showDrawing(params.id);
    }

    var ref = database.ref("drawings");
    ref.on("value", gotData, errData);
}

function startPath() {
    isDrawing = true;
    currentPath = [];
    drawing.push(currentPath);
}

function endPath() {
    isDrawing = false;
}

function draw() {
    background("rgb(236, 255, 168)");
    if (isDrawing) {
        var point = {
            x: mouseX,
            y: mouseY,
        };
        currentPath.push(point);
    }

    stroke("royalblue");
    strokeWeight(4);
    noFill();
    for (var i = 0; i < drawing.length; i++) {
        var path = drawing[i];
        beginShape();
        for (var j = 0; j < path.length; j++) {
            vertex(path[j].x, path[j].y);
        }
        endShape();
    }
}

function saveDrawing() {
    var ref = database.ref("drawings");
    var data = {
        name: "Sreekar",
        drawing: drawing,
    };
    var result = ref.push(data, dataSent);
    console.log(result.key);

    function dataSent(err, status) {
        console.log(status);
    }
}

function gotData(data) {
    // clear the listing
    var elts = selectAll(".listing");
    for (var i = 0; i < elts.length; i++) {
        elts[i].remove();
    }

    var drawings = data.val();
    var keys = Object.keys(drawings);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        //console.log(key);
        var li = createElement("li", "");
        li.class("listing");
        var ahref = createA("#", key);
        ahref.mousePressed(showDrawing);
        ahref.parent(li);

        var perma = createA("?id=" + key, "View or Edit");
        perma.parent(li);
        perma.style("padding", "4px");

        li.parent("drawinglist");
    }
}

function errData(err) {
    console.log(err);
}

function showDrawing(key) {
    //console.log(arguments);
    if (key instanceof MouseEvent) {
        key = this.html();
    }

    var ref = database.ref("drawings/" + key);
    ref.once("value", oneDrawing, errData);

    function oneDrawing(data) {
        var dbdrawing = data.val();
        drawing = dbdrawing.drawing;
        //console.log(drawing);
    }
}

function clearDrawing() {
    drawing = [];
}
