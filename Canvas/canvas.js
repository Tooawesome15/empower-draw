var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

var x = "black",
    y = 2;

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    w = canvas.width;
    h = canvas.height;

    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);
}

function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
}

function erase() {
    var m = confirm("Want to clear");
    if (m) {
        ctx.clearRect(0, 0, w, h);
        document.getElementById("canvasimg").style.display = "none";
    }
}

function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            draw();
        }
    }
}

// var touchX,touchY;

// function sketchpad_touchStart() {
//     getTouchPos();
//     ctx.fillRect(ctx,touchX,touchY,12);

//     // Prevents an additional mousedown event being triggered
//     event.preventDefault();
// }

// function sketchpad_touchMove(e) { 
//     // Update the touch co-ordinates
//     getTouchPos(e);

//     // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
//     draw(ctx,touchX,touchY,12); 

//     // Prevent a scrolling action as a result of this touchmove triggering.
//     event.preventDefault();
// }

// // Get the touch position relative to the top-left of the canvas
// // When we get the raw values of pageX and pageY below, they take into account the scrolling on the page
// // but not the position relative to our target div. We'll adjust them using "target.offsetLeft" and
// // "target.offsetTop" to get the correct values in relation to the top left of the canvas.
// function getTouchPos(e) {
//     if (!e)
//         var e = event;

//     if (e.touches) {
//         if (e.touches.length == 1) { // Only deal with one finger
//             var touch = e.touches[0]; // Get the information for finger #1
//             touchX=touch.pageX-touch.target.offsetLeft;
//             touchY=touch.pageY-touch.target.offsetTop;
//         }
//     }
// }