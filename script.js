addEventListener('DOMContentLoaded', (event) => {
    //Cursor
    const coords = { x: 0, y: 0 };
    const circles = document.querySelectorAll(".circle");
    const cursor = document.querySelector(".cursor");

    circles.forEach(function (circle, index) {
        circle.x = 0;
        circle.y = 0;
        circle.style.backgroundColor = "white";
    });

    window.addEventListener("mousemove", function (e) {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });

    function animateCircles() {
        let x = coords.x;
        let y = coords.y;

        cursor.style.top = x;
        cursor.style.left = y;

        circles.forEach(function (circle, index) {
            circle.style.left = x - 12 + "px";
            circle.style.top = y - 12 + "px";

            circle.style.scale = (circles.length - index) / circles.length;

            circle.x = x;
            circle.y = y;

            const nextCircle = circles[index + 1] || circles[0];
            x += (nextCircle.x - x) * 0.25;
            y += (nextCircle.y - y) * 0.25;
        });

        requestAnimationFrame(animateCircles);
    }

    animateCircles();
});

//NavBar
const hamburger = document.querySelector('.header .nav-bar .nav-list .hamburger');
const mobile_menu = document.querySelector('.header .nav-bar .nav-list ul');
const menu_item = document.querySelectorAll('.header .nav-bar .nav-list ul li a');
const header = document.querySelector('.header.container');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobile_menu.classList.toggle('active');
});

document.addEventListener('scroll', () => {
    var scroll_position = window.scrollY;
    if (scroll_position > 125) {
        header.style.backgroundColor = '#29323c';
    } else {
        header.style.backgroundColor = 'transparent';
    }
});

menu_item.forEach((item) => {
    item.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobile_menu.classList.toggle('active');
    });
});

//Home
var typed = new Typed(".multiple-text", {
    strings: ["Student", "Coder", "Analyst"],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});

//MusicPlayer
function audioPlayer() {
    const audio = document.getElementById("audioPlayer");
    const playlist = document.getElementById("playlist");
    const tracks = playlist.getElementsByTagName("a");
    const songImage = document.querySelector(".song-image img");
    const prevBtn = document.querySelector(".prev-btn");
    const playBtn = document.querySelector(".play-btn");
    const nextBtn = document.querySelector(".next-btn");

    document.querySelector('.song-artist').textContent = "NEFFEX";
    document.querySelector('.song-title').textContent = "Best of Me";
    audio.volume = 0.2;

    function loadTrack(index) {
        audio.src = tracks[index].getAttribute('href');
        songImage.src = tracks[index].dataset.image;
        const trackName = tracks[index].getAttribute('href').slice(18, -4);
        const [artist, title] = trackName.split('-').map(str => str.trim());
        document.querySelector('.song-artist').textContent = artist;
        document.querySelector('.song-title').textContent = title;
        audio.play();
        audio.setAttribute('data-index', index);
    }

    function updatePlayButton() {
        if (audio.paused) {
            playBtn.querySelector("i").classList.remove("fa-pause");
            playBtn.querySelector("i").classList.add("fa-play");
        } else {
            playBtn.querySelector("i").classList.remove("fa-play");
            playBtn.querySelector("i").classList.add("fa-pause");
        }
    }

    for (let i = 0; i < tracks.length; i++) {
        tracks[i].addEventListener("click", function (e) {
            e.preventDefault();
            const index = parseInt(this.parentElement.getAttribute('data-index'));
            loadTrack(index);
            updatePlayButton();
        });
    }

    prevBtn.addEventListener("click", function () {
        let currentIndex = parseInt(audio.getAttribute('data-index')) - 1;

        if (currentIndex < 0) {
            currentIndex = tracks.length - 1;
        }
        loadTrack(currentIndex);
        updatePlayButton();
    });

    nextBtn.addEventListener("click", function () {
        let currentIndex = parseInt(audio.getAttribute('data-index')) + 1;

        if (currentIndex === tracks.length) {
            currentIndex = 0;
        }
        loadTrack(currentIndex);
        updatePlayButton();
    });

    audio.addEventListener("play", function () {
        updatePlayButton();
    });

    audio.addEventListener("pause", function () {
        updatePlayButton();
    });

    playBtn.addEventListener("click", function () {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
        updatePlayButton();
    });
}

audioPlayer();

//Hover Effect
const handleOnMouseMove = e => {
    const { currentTarget: target } = e;

    const rect = target.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top;

    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
}

for (const card of document.querySelectorAll(".project-info, .project-img, .project-img2")) {
    card.onmousemove = e => handleOnMouseMove(e);
}

//Marker
var marker = document.querySelector('#marker');
var item = document.querySelectorAll('.stnTte');

function indicator(e) {
    marker.style.left = e.offsetLeft + "px";
    marker.style.width = e.offsetWidth + "px";
}

    item.forEach(link => {
        link.addEventListener('click', (e) => {
            indicator(e.target)
        })
    });