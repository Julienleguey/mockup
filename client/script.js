// si la variable "screens" ne fonctionne plus, il faut la copier-coller ici depuis le fichier screens.js (rien à changer)
// même chose pour la variable "mockups"
// même chose pour la variable "deviceSize"
// même chose pour la variable "screenshotSettings"

// import of "screens" variable
const screensImported = document.createElement('script');
screensImported.src = './screens.js';
document.head.appendChild(screensImported);

// import of "mockups" variable
const mockupsImported = document.createElement('script');
mockupsImported.src = './mockups.js';
document.head.appendChild(mockupsImported);

// import of "deviceSize" variable
const deviceSizeImported = document.createElement('script');
deviceSizeImported.src = './deviceSize.js';
document.head.appendChild(deviceSizeImported);

// import of "screenshotSettings" variable
const screenshotSettingsImported = document.createElement('script');
screenshotSettingsImported.src = './screenshotSettings.js';
document.head.appendChild(screenshotSettingsImported);


// global scope (for filters)
let languageValue = "";
let phoneValue = "";
let screenshotValue = "";
let canvasWidth = 0;
let canvasHeight = 0;
let mockupWidth = 0;
let mockupHeight = 0;

/****************
CREATING AN IMAGE TO CONTAIN THE MOCKUP (without the src yet)
****************/

var img = new Image();
img.crossOrigin = "Anonymous";


/************************
Hiding the canvas-section
*************************/

// In case no language or no phone is selected
function showCanvas() {
  destroyCanvas();
  if (languageValue === "" || phoneValue === "") {
    console.log("naaaaah, les filtres sont pas remplis!")
  } else {
    console.log("way to go, bro! On crée les canvas!")
    createCanvas();
  }
}


/*********************
Destruction des canvas
*********************/
function destroyCanvas() {
  const canvasToDestroy = document.querySelector('#canvas-section');
  canvasToDestroy.innerHTML = "";
}


/*******************
Création des canvas
*******************/

function createEmptyCanvas(i, parentCanvas) {
  // creating a div for the canvas and the button
  const childDiv = document.createElement('div');

  // creating a canvas
  const childCanvas = document.createElement('canvas');
  childCanvas.classList.add('canvas');
  childCanvas.classList.add(screenshotValue);
  childCanvas.id = `canvas-${i}`;
  childCanvas.width = canvasWidth;
  childCanvas.height = canvasHeight;

  // creating a link for the button
  const childA = document.createElement('a');
  childA.className = 'button';
  childA.download = `${languageValue}_${phoneValue}_${i}.jpg`;
  childA.id = `a-${i}`;

  // creating the button for the canvas
  const childButton = document.createElement('button');
  childButton.textContent = "Download";
  // childButton.id = `button-${i}`;

  // appending the canvas to the parent
  childDiv.appendChild(childCanvas);

  // appending the button to the link
  childA.appendChild(childButton);

  // appending the link to the div
  childDiv.appendChild(childA);

  // appending the div to the parent
  parentCanvas.appendChild(childDiv);

  // event listeners for the download buttons
  const downloadButtons = document.querySelectorAll('.button');
  for (let i = 0; i < downloadButtons.length; i++) {
    downloadButtons[i].addEventListener("click", function(){downloadIt(i)}, false);
  }
}


function addCanvasBackground(ctx) {
  // creating the background
  ctx.fillStyle = 'rgb(15, 98, 194)';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}


function createCanvas() {

  // sélection du parent
  const parentCanvas = document.querySelector('#canvas-section');

  // boucle pour créer les canvas nécessaires
  for (let i = 0; i < 7; i++) {

    createEmptyCanvas(i, parentCanvas);

    // selecting the canvas for drawing
    const canvas = document.querySelector(`#canvas-${i}`);
    const ctx = canvas.getContext('2d');

    addCanvasBackground(ctx);

    drawOnCanevas(i, ctx);
  }
}


function drawOnCanevas(i, ctx) {

  let heightToDrawText = 0;
  let heightToDrawImg = 0;
  let textHeight = 0;

  const startTop = mockups[phoneValue].startTop;
  const subtitleToMockup = mockups[phoneValue].subtitleToMockup;
  const titleToMockup = mockups[phoneValue].titleToMockup;

  const startBottom = mockups[phoneValue].startBottom;
  const mockupToSubtitle = mockups[phoneValue].mockupToSubtitle;
  const mockupToTitle = mockups[phoneValue].mockupToTitle;

  const titleToTitle = mockups[phoneValue].titleToTitle;
  const titleToSubtitle = mockups[phoneValue].titleToSubtitle;
  const subtitleToSubtitle = mockups[phoneValue].subtitleToSubtitle;
  const widthStart = mockups[phoneValue].widthStart;
  const heightStart = mockups[phoneValue].heightStart;
  const widthEnd = mockups[phoneValue].widthEnd;
  const heightEnd = mockups[phoneValue].heightEnd;


  // defining title et subtitle parts
  const title = screens[languageValue].images[i].title;
  const titleParts = title.split("\n");
  const subtitle = screens[languageValue].images[i].subtitle;
  const subtitleParts = subtitle.split("\n");

  // counting title et subtitle lines
  const countTitle = titleParts.length;
  let countSubtitle = 0;
  if (subtitle === "") {
    countSubtitle = 0;
  } else {
    countSubtitle = subtitleParts.length;
  }

  // calculating textHeight in order to know where to draw the mockup
  textHeight = countTitle*(titleToTitle) + countSubtitle*(subtitleToSubtitle);


  if (i%2 === 0) {
    if (countSubtitle > 0) {
      // complément pour l'écart subtitle/mockup
      textHeight += subtitleToMockup;
    } else {
      // complément pour l'écart title/mockup
      textHeight += titleToMockup;
    }
    // starting at the top of the canvas
    heightToDrawText = startTop;
    heightToDrawImg = heightToDrawText + textHeight;

  } else {
    if (countSubtitle > 0) {
      // complément pour l'écart subtitle/mockup
      textHeight += mockupToSubtitle;
    } else {
      // complément pour l'écart title/mockup
      textHeight += mockupToTitle;
    }
    // starting at the bottom of the canvas
    heightToDrawText = canvasHeight - textHeight;
    heightToDrawImg = heightToDrawText - mockupHeight - startBottom;
  }

  // loading the screenshot
  const screenshot = new Image();
  screenshot.crossOrigin = "Anonymous";

  screenshot.src = `http://localhost:5000/${screenshotSettings[screenshotValue].os}/${screenshotValue}/${languageValue}/${languageValue}_${i}`
  if (screens[languageValue].images[i].phoneImage[screenshotValue] === "") {
    screenshot.src += '.PNG';
  } else {
    screenshot.src += screens[languageValue].images[i].phoneImage[screenshotValue];
  }


  // waiting for the screenshot to be loaded before starting to draw it
  // then, drawing the mockup
  screenshot.onload = function() {
    // adding the screenshot to the canvas
    heightToDrawImg += heightStart;
    ctx.drawImage(screenshot, widthStart, heightToDrawImg, widthEnd, heightEnd); // iphone 8 plus haut

    // adding the mockup to the canvas
    heightToDrawImg += -heightStart;
    ctx.drawImage(img, 0, heightToDrawImg, mockupWidth, mockupHeight);
  }

  // adding title
  ctx.fillStyle = 'white';
  ctx.font = '80px Arial';
  ctx.textAlign = 'center';


  for (let j = 0; j < titleParts.length; j++) {
    ctx.fillText(titleParts[j], canvasWidth/2, heightToDrawText, canvasWidth);
    // ajout d'un interligne title/title
    heightToDrawText += titleToTitle;
  }

  // defining subtitle
  ctx.font = '65px Arial';


  if (subtitle !== "") {
    // complément pour l'interligne title/subtitle
    heightToDrawText += titleToSubtitle;

    // adding subtitle
    for (let k = 0; k < subtitleParts.length; k++) {
      ctx.fillText(subtitleParts[k], canvasWidth/2, heightToDrawText, canvasWidth);
      // ajout d'un interligne subtitle/subtitle NON VERIFIE - IL FAUT LE VERIFIER
      heightToDrawText += subtitleToSubtitle;
    }

    if (i%2 === 0) {
      heightToDrawText += subtitleToMockup;
    } else {
      heightToDrawText += mockupToSubtitle;
    }

  } else {
    if (i%2 === 0) {
      heightToDrawText += titleToMockup;
    } else {
      heightToDrawText += mockupToTitle;
    }
  }
}


function downloadIt(bla) {
  console.log("fiiiiiire");

  const download = document.querySelector(`#a-${bla}`);
  const image = document.querySelector(`#canvas-${bla}`).toDataURL('image/jpeg', 0.7).replace("image/jpg", "image/octet-stream");
  download.setAttribute("href", image);

  console.log("the end");
}


function filterLanguage() {
  const value = document.querySelector('#language').value;
  languageValue = value;

  showCanvas();
}

function filterPhone() {
  const value = document.querySelector('#phone').value;
  phoneValue = value;

  img.src = mockups[value].imageUrl;


  // defining the screenshot size according to the kind of device selected
  for (let i = 0; i < deviceSize.length; i++) {
    if (deviceSize[i].devices.includes(phoneValue)) {
      screenshotValue = deviceSize[i].name;
      canvasWidth = screenshotSettings[screenshotValue].canvasWidth;
      canvasHeight = screenshotSettings[screenshotValue].canvasHeight;
      mockupWidth = mockups[phoneValue].width;
      mockupHeight = mockups[phoneValue].height;
      break;
    }
  }

  // J'ai été obligé de mettre un timeout ici, sinon l'img n'a pas le temps d'être chargée
  setTimeout(function(){ showCanvas(); }, 1000);

  // showCanvas();
}


window.onload = function() {
  //event listener for the language filter
  const languageFilter = document.querySelector('#language');
  languageFilter.addEventListener("change", filterLanguage, false);

  //event listener for the phone filter
  const phoneFilter = document.querySelector('#phone');
  phoneFilter.addEventListener("change", filterPhone, false);
}
