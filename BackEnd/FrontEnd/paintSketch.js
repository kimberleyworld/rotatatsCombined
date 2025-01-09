let canvas;
let brush;
let thickness;
let undoStepSize = 5; // Number of strokes to undo in one click
let sketchWidth;
let sketchHeight;
let selectedColor = "";
const dropdownButton = document.getElementById("dropdownButton");
const dropdownOptions = document.getElementById("dropdownOptions");
const dropdownItems = document.querySelectorAll(".dropdown-item");
const message = document.getElementById("message");

// Array to store all the strokes
let strokes = [];
  // Function to handle option selection
  dropdownItems.forEach((item) => {
    item.addEventListener("click", () => {
      selectedColor = item.getAttribute("data-value"); // Get the selected color
      background(selectedColor);
      dropdownOptions.classList.remove("active");
      document.getElementById("toneModal").style.display = "none";
    });
  });

function setup() {
  setCanvasSize(); // Update canvas size based on the new window size
  canvas = createCanvas(sketchWidth, sketchHeight);
  canvas.parent("sketchHere");
  background(255, 255, 255);

  // Initially set the brush color to white
  brush = color("#ffffff");
  thickness = 10;

  // Bind color change buttons
  document.querySelectorAll(".paintTool[data-color]").forEach((button) => {
    button.addEventListener("click", function () {
      const newColor = this.getAttribute("data-color");
      changeBrushColor(newColor);
    });
  });

  // Bind thickness change buttons
  document.querySelectorAll(".paintTool[data-thickness]").forEach((button) => {
    button.addEventListener("click", function () {
      const newThickness = this.getAttribute("data-thickness");
      changeBrushThickness(newThickness);
    });
  });

  // Bind undo button
  document
    .getElementById("undoButton")
    .addEventListener("click", undoLastStroke);

  // Bind erase button
  document.getElementById("eraseButton").addEventListener("click", function () {
    brush = color(selectedColor); // Set brush to white when erasing
    console.log("Erase mode activated");
  });

  // Bind clear canvas button
  const clearButton = document.getElementById("clearCanvas");
  clearButton.addEventListener("click", function () {
    strokes = []; // Clear the strokes array
    background(selectedColor || "#ffffff"); // Clear the canvas (set to selected color or white)
  });

  // Function to toggle the dropdown visibility
  dropdownButton.addEventListener("click", () => {
    dropdownOptions.classList.toggle("active");
  });

}

function draw() {
  // Change the cursor to the paintbrush when mouse is over the canvas
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    cursor(CROSS);
  } else {
    cursor(ARROW); // Reset to default cursor outside the canvas
  }
}
function mouseDragged(event) {
  event.preventDefault();

  // Save the current stroke to the strokes array
  let strokeData = {
    x1: mouseX,
    y1: mouseY,
    x2: pmouseX,
    y2: pmouseY,
    color: brush,
    thickness: thickness,
  };
  strokes.push(strokeData);

  // Draw the stroke on the canvas
  drawStroke(strokeData);
}

function touchMoved(event) {
  // Prevent the page from moving during drawing on mobile
  event.preventDefault();

  // Save the current stroke to the strokes array
  let strokeData = {
    x1: mouseX,
    y1: mouseY,
    x2: pmouseX,
    y2: pmouseY,
    color: brush,
    thickness: thickness,
  };
  strokes.push(strokeData);

  // Draw the stroke on the canvas
  drawStroke(strokeData);

  return false; // This helps to prevent default behavior on mobile
}

// Function to draw a stroke on the canvas
function drawStroke(strokeData) {
  push();
  stroke(strokeData.color);
  strokeWeight(strokeData.thickness);
  line(strokeData.x1, strokeData.y1, strokeData.x2, strokeData.y2);
  pop();
}

// Undo the last strokes in bigger steps
function undoLastStroke() {
  if (strokes.length > 0) {
    // Remove the last `undoStepSize` strokes
    strokes.splice(-undoStepSize);
    redrawCanvas(); // Redraw the canvas without the last strokes
  }
}

// Redraw the entire canvas based on the strokes array
function redrawCanvas() {
  background(selectedColor || "#ffffff"); // Clear the canvas with the selected background color or default white
  for (let i = 0; i < strokes.length; i++) {
    drawStroke(strokes[i]); // Redraw each stroke
  }
}

// Function to change the brush color using hex codes
function changeBrushColor(newColor) {
  brush = color(newColor); // Use the hex color directly
  console.log("Brush color changed to:", newColor);
}

// Function to change the brush thickness
function changeBrushThickness(newThickness) {
  thickness = parseInt(newThickness);
}

// Function to detect screen size and adjust the canvas size accordingly
function setCanvasSize() {
  // Media query for screens larger than 768px (tablet and desktop)
  if (window.matchMedia("(min-width: 768px)").matches) {
    sketchWidth = 600;
    sketchHeight = 300;
  }
  // Media query for screens smaller than 768px (mobile)
  else {
    sketchWidth = 300; // Full width for mobile devices
    sketchHeight = 300; // Half the window height
  }
}

// Call this function on window resize to adjust canvas size dynamically
function windowResized() {
  setCanvasSize(); // Update canvas size based on the new window size
  resizeCanvas(sketchWidth, sketchHeight); // Resize the p5.js canvas
  background(selectedColor || "#ffffff"); // Clear the background or redraw
  redrawCanvas(); // Redraw the strokes after resizing
}
