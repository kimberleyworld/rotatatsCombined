function DraggableWindow(id, title, content, width = 300, height = 200) {
  this.id = id;
  this.title = title;
  this.content = content;
  this.width = width;
  this.height = height;

  this.createWindow = function() {
    const container = document.getElementById('windows-container');
    const existingWindow = document.getElementById(this.id);
    if (existingWindow) {
      container.removeChild(existingWindow);
    }
    
    const windowDiv = document.createElement('div');
    windowDiv.classList.add('window');
    windowDiv.id = this.id;

     // Set width and height based on screen size
    if (window.innerWidth <= 768) {
      windowDiv.style.width = '100%';
      windowDiv.style.height = '100%';
      windowDiv.style.left = '2px';
      windowDiv.style.top = '2px';
    } else {
      windowDiv.style.width = `${this.width}px`;
      windowDiv.style.height = `${this.height}px`;
    }

    const titleBar = document.createElement('div');
    titleBar.classList.add('title-bar');
    titleBar.innerHTML = `<span class="title">${this.title}</span>`;

    const closeButton = document.createElement('button');
    closeButton.classList.add('close-btn');
    closeButton.innerText = 'X';
    closeButton.addEventListener('click', () => {
      windowDiv.style.display = 'none';
    });

    titleBar.appendChild(closeButton);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content');
    contentDiv.innerHTML = this.content;

    windowDiv.appendChild(titleBar);
    windowDiv.appendChild(contentDiv);
    container.appendChild(windowDiv);

    makeDraggable(windowDiv);
  };

    // Method to update the window title
  this.updateTitle = function(newTitle) {
    const windowDiv = document.getElementById(this.id);
    if (windowDiv) {
      const titleSpan = windowDiv.querySelector('.title');
      titleSpan.textContent = newTitle;
    }
  };

  this.createWindow();
}

function makeDraggable(element) {
  let isMouseDown = false;
  let offsetX, offsetY;

  const titleBar = element.querySelector('.title-bar');

  titleBar.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  function onMouseMove(e) {
    if (!isMouseDown) return;
    element.style.left = `${e.clientX - offsetX}px`;
    element.style.top = `${e.clientY - offsetY}px`;
  }

  function onMouseUp() {
    isMouseDown = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const files = [
    { name: 'butterfly', src: 'images/butterfly.png' },
    { name: 'cherub', src: 'images/cherub.png' },
    // Add more file objects as needed
  ];
   const flash = [
    { name: 'butterfly', src: 'images/butterfly.png' },
    { name: 'cherub', src: 'images/phone.png' },
    // Add more file objects as needed
  ];

  document.getElementById('picturesIcon').addEventListener('click', () => {
    openPreviewWindow(files, "Previous Work");
  });
   document.getElementById('flashIcon').addEventListener('click', () => {
    openPreviewWindow(flash, "Flash");
  });

  function openPreviewWindow(files, bannerTitle) {
    let currentIndex = 0;

    const previewWindow = new DraggableWindow('previewWindow', bannerTitle, `
      <div class="preview-window">
        <span class="arrow left" id="prevArrow"><</span>
        <img src="${files[currentIndex].src}" alt="${files[currentIndex].name}" id="previewImage">
        <span class="arrow right" id="nextArrow">></span>
      </div>
    `, 600, 400);

    document.getElementById('previewWindow').style.display = 'block';

      previewWindow.updateTitle(bannerTitle);


    document.getElementById('prevArrow').addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + files.length) % files.length;
      document.getElementById('previewImage').src = files[currentIndex].src;
      document.getElementById('previewImage').alt = files[currentIndex].name;
    });

    document.getElementById('nextArrow').addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % files.length;
      document.getElementById('previewImage').src = files[currentIndex].src;
      document.getElementById('previewImage').alt = files[currentIndex].name;
    });
  }
});

 function populateSongList() {
    fetch('/audio-files')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(audioFiles => {
        const songList = document.getElementById('songList');
        songList.innerHTML = ''; // Clear existing list
        audioFiles.forEach(file => {
          const li = document.createElement('li');
          li.textContent = file.name;
          li.setAttribute('data-src', file.src);
          songList.appendChild(li);
        });
      })
      .catch(error => console.error('Error fetching audio files:', error));
  }

   document.getElementById('musicPlayerIcon').addEventListener('click', () => {
    console.log('Music player icon clicked');
    const musicPlayerWindow = new DraggableWindow('musicPlayerWindow', 'Music Player', `
      <ul id="songList"></ul>
      <audio id="audioPlayer" controls></audio>
    `, 400, 300);

    document.getElementById('musicPlayerWindow').style.display = 'block';
    populateSongList();

    document.getElementById('songList').addEventListener('click', (e) => {
      if (e.target && e.target.nodeName === 'LI') {
        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = e.target.getAttribute('data-src');
        audioPlayer.play();
      }
    });
  });
// Create instances of DraggableWindow with specified sizes
const confirmationWindow = new DraggableWindow('confirmationWindow', 'Booking', `
  <iframe src="bookingConfirmation.html" style="width: 100%; height: 100%; border: none;"></iframe>
`, 800, 900);

// Create instances of DraggableWindow with specified sizes
const confirmationWindowCustom = new DraggableWindow('confirmationWindowCustom', 'Send me your design', `
  <iframe src="bookingConfirmationCustom.html" style="width: 100%; height: 100%; border: none;"></iframe>
`, 800, 600);

// Create instances of DraggableWindow with specified sizes
const paintWindow = new DraggableWindow('paintWindow', 'Paint', `
  <iframe src="paint.html" style="width: 100%; height: 100%; border: none;"></iframe>
`, 800, 600);

const musicPlayerWindow = new DraggableWindow('musicPlayerWindow', 'Music Player', `<ul id="songList"></ul>
  <audio id="audioPlayer" controls></audio>
`, 400, 300);

const priceListWindow = new DraggableWindow('priceListWindow', 'Price List', `
  <iframe src="price.html" style="width: 100%; height: 100%; border: none;"></iframe>
`, 500, 400);
const bookingWindow = new DraggableWindow('bookingWindow', 'Book', `
  <iframe src="booking.html" style="width: 100%; height: 100%; border: none;"></iframe>
`, 500, 500);

const contactWindow = new DraggableWindow('contactWindow', 'contact', '<p>Content for contact</p>', 500, 400);
const aboutWindow = new DraggableWindow('aboutWindow', 'about Now', '<p>Content for about</p>', 500, 400);


// Add event listeners to icons to open windows
document.getElementById('paintIcon').addEventListener('click', () => {
  document.getElementById('paintWindow').style.display = 'block';
});

document.getElementById('musicPlayerIcon').addEventListener('click', () => {
  document.getElementById('musicPlayerWindow').style.display = 'block';
});

document.getElementById('priceListIcon').addEventListener('click', () => {
  document.getElementById('priceListWindow').style.display = 'block';
});

document.getElementById('bookingIcon').addEventListener('click', () => {
  document.getElementById('bookingWindow').style.display = 'block';
});
document.getElementById('contactIcon').addEventListener('click', () => {
  document.getElementById('contactWindow').style.display = 'block';
});
document.getElementById('instaIcon').addEventListener('click', () => {
  window.open('https://www.instagram.com/rotatats/?hl=en');
});

// Add event listener to play songs
document.getElementById('songList').addEventListener('click', (e) => {
  if (e.target && e.target.nodeName === 'LI') {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = e.target.getAttribute('data-src');
    audioPlayer.play();
  }
});

// Function to show the confirmation window if the hash fragment is present
function showConfirmationWindow() {
  if (window.location.hash === '#success') {
    let confirm = document.getElementById('confirmationWindow')
    confirm.style.display = 'block';
    }
}

// Function to show the confirmation window if the hash fragment is present
function showConfirmationWindowCustom() {
  if (window.location.hash === '#successCustom') {
    let customConfirm = document.getElementById('confirmationWindowCustom')
    customConfirm.style.display = 'block';
    const closeBtns = customConfirm.getElementsByClassName('close-btn');
    if (closeBtns.length > 0) {
      closeBtns[0].style.display = 'none';
    }  }
}

// Combine the functions to be called on page load
window.onload = function() {
  showConfirmationWindow();
  showConfirmationWindowCustom();
};