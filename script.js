addEventListener('DOMContentLoaded', (event) => {
    //MusicPlayer
    audioPlayer();

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
    var currentSong = 0;
    $("#audioPlayer")[0].src = $("#playlist li a")[0];
    $("#audioPlayer")[0].volume = 0.2;
    $("#audioPlayer")[0].play();
    $("#playlist li a").click(function (e) {
        e.preventDefault();
        $("#audioPlayer")[0].src = this;
        $("#audioPlayer")[0].volume = 0.2;
        $("#audioPlayer")[0].play();
        $("#playlist li").removeClass("current-song");
        currentSong = $(this).parent().index();
        $(this).parent().addClass("current-song");
    });

    $("#audioPlayer")[0].addEventListener("ended", function () {
        currentSong++;

        if (currentSong == $("#playlist li a").length)
            currentSong = 0;

        $("#playlist li").removeClass("current-song");
        $("#playlist li:eq(" + currentSong + ")").addClass("current-song");
        $("#audioPlayer")[0].src = $("#playlist li a")[currentSong].href;
        $("#audioPlayer")[0].volume = 0.2;
        $("#audioPlayer")[0].play();
    });
}