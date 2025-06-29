addEventListener('DOMContentLoaded', (event) => {
    //Footer
    const years = document.getElementsByClassName("year");
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < years.length; i++) {
        years[i].textContent = currentYear;
    }

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

menu_item.forEach((item) => {
    item.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobile_menu.classList.toggle('active');
    });
});

document.addEventListener('scroll', () => {
    const REF_SCREEN_WIDTH = 1920;
    const screenWidth = window.innerWidth;
    const scaleFactor = screenWidth / REF_SCREEN_WIDTH;
    var scroll_position = window.scrollY;
    const bgAdjustedValue = 175 * scaleFactor;

    if (scroll_position > bgAdjustedValue) {
        header.style.backgroundColor = '#29323c';
    } else {
        header.style.backgroundColor = 'transparent';
    }

    addActiveClass();
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
    let currentIndex = 0;
    document.querySelector('.song-artist').textContent = "NEFFEX";
    document.querySelector('.song-title').textContent = "Best of Me";
    audio.volume = 0.05;

    function loadTrack(index) {
        audio.src = tracks[index].getAttribute('href');
        songImage.src = tracks[index].dataset.image;
        const trackPath = tracks[index].getAttribute('href');
        const trackName = trackPath.substring(trackPath.lastIndexOf('/') + 1, trackPath.lastIndexOf('.'));
        const [artist, title] = trackName.split(' - ').map(str => str.trim());
        document.querySelector('.song-artist').textContent = artist;
        document.querySelector('.song-title').textContent = title;
        audio.play();
        audio.setAttribute('data-index', index);
        currentIndex = index;
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
        let index = currentIndex - 1;

        if (index < 0) {
            index = tracks.length - 1;
        }

        loadTrack(index);
        updatePlayButton();
    });

    nextBtn.addEventListener("click", function () {
        let index = currentIndex + 1;

        if (index === tracks.length) {
            index = 0;
        }

        loadTrack(index);
        updatePlayButton();
    });

    audio.addEventListener("play", function () {
        updatePlayButton();
    });

    audio.addEventListener("pause", function () {
        updatePlayButton();
    });

    audio.addEventListener("ended", function () {
        let index = currentIndex + 1;

        if (index === tracks.length) {
            index = 0;
        }

        loadTrack(index);
    });

    playBtn.addEventListener("click", function () {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }

        updatePlayButton();
    });

    loadTrack(currentIndex);
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

for (const card of document.querySelectorAll(".project-info, .project-img")) {
    card.onmousemove = e => handleOnMouseMove(e);
}

//Marker
const sections = document.querySelectorAll('.track-section');
const marker = document.querySelector('.marker');
const navLinks = document.querySelectorAll('.stnTte');

function addActiveClass() {
    let scrollY = window.pageYOffset;

    navLinks.forEach(navLink => {
        navLink.classList.remove('active');
    });

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector('.stnTte[href="#' + sectionId + '"]');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink.classList.add('active');
        }
    });

    const activeLinks = document.querySelectorAll('.stnTte.active');
    let activeWidth = 0;
    let activeLeft = 0;

    activeLinks.forEach(activeLink => {
        activeWidth += activeLink.offsetWidth;
        activeLeft = activeLink.offsetLeft;
    });

    marker.style.width = activeWidth + "px";
    marker.style.left = activeLeft + "px";
}

let activeSectionIndex = 0;

function updateActiveSection() {
    let maxSectionIndex = 0;

    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();

        if (rect.top <= window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
            maxSectionIndex = i;
        }
    }

    activeSectionIndex = maxSectionIndex;
}

function updateMarkerPosition() {
    const activeLinks = document.querySelectorAll('.stnTte.active');
    let activeWidth = 0;
    let activeLeft = 0;

    activeLinks.forEach(activeLink => {
        activeWidth += activeLink.offsetWidth;
        activeLeft = activeLink.offsetLeft;
    });

    marker.style.width = activeWidth + "px";
    marker.style.left = activeLeft + "px";
}

window.addEventListener('resize', () => {
    updateActiveSection();
    updateMarkerPosition();
});

window.addEventListener('scroll', () => {
    updateActiveSection();
    updateMarkerPosition();
});

//SmoothTransition
$(document).ready(function () {
    $('.start-btn').click(function () {
        $('.center').hide();
        $('.name, .rights, .stars').fadeOut(1000);
        $('.obj-to-hide').addClass('move-down');
        $('.loading-container').css('display', 'flex').show();
        $('#header, #home, #about, #projects, #contact, #footer').fadeIn(3000);
        $('#footer').css('display', 'flex');
        addActiveClass();
        updateActiveSection();
        updateMarkerPosition();

        setTimeout(function () {
            $('body').css('overflow', 'auto').css('background-color', '#ffffff');
            $('.obj-to-hide').hide();

            //MultiText
            var typed = new Typed(".multiple-text", {
                strings: [
                    "Technical Implementation Specialist",
                    "Unity Developer",
                    "C# Software Engineer"
                ],
                startDelay: 500,
                typeSpeed: 100,
                backSpeed: 100,
                backDelay: 1000,
                loop: true
            });

            const audio = document.getElementById("audioPlayer");
            audio.play();

            $('.loading-container').hide();
        }, 2500);
    });
});