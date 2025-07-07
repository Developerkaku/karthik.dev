// Toggle menu for smaller screens
function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("active");
}

//navigation using nav elems
function zoomScroll(scrollTop) {
    main.scrollTo({ top: Number(scrollTop), behavior: 'smooth' });
}

//settings

function toggleSettings(elem) {
    const settingsBg = document.querySelector("#settings-bg");
    const settings = document.querySelector("#settings");
    settingsBg.style.display = (settingsBg.style.display == "none") ? "block" : "none";
    settings.style.display = (settingsBg.style.display == "none") ? "none" : "flex";

    document.getElementsByClassName("settings")[0].classList.toggle("active");
}
document.getElementsByClassName("settings")[0].classList.toggle("active");
toggleSettings() //ensuring that everything is set to none at the start (else it requires calling the function 2 times in order to activate the settings once)

let graphics = document.querySelectorAll(".graphics");
document.querySelectorAll(".graphics").forEach(elem => {
    elem.addEventListener("click", (e) => {

        if (e.target.classList.contains("active")) return
        else {
            document.querySelectorAll(".graphics").forEach(g => g.classList.remove("active"));
            e.target.classList.add("active");

            let res = e.target.getAttribute("for");
            let cards = document.querySelectorAll(".cards");

            cards.forEach(card => {
                if (res === "low") card.classList.add("cards-low-quality");
                else if (res === 'high') card.classList.remove("cards-low-quality");
            });
        }

    });
});


//about_section--> glitch effect
const span = document.querySelector(".glitch");
const words = ["Web", "Full stack", "Backend"];
let index = 0;

function getActualChar() {
    const chars = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    return chars[Math.floor(Math.random() * chars.length)];
}
function getRandomChar() {
    const chars = "`~!@#$%^&()-_=+[{}]\\|;:'\",<.>/?";

    return chars[Math.floor(Math.random() * chars.length)];
}

function glitchText(element, newText, speed = 500) {
    let maxDuration = 3000;
    let startTime = Date.now();

    let oldText = element.textContent;
    let maxLength = Math.max(oldText.length, newText.length);
    let currentText = oldText.padEnd(maxLength, " "); //padding for smooth effect

    let randomPickedCharsIndicies = new Array();
    let numberOfCharsPicked = 0;
    let tempText = currentText.split('');
    let tempText1 = currentText.split('');

    function wipeOut() {

        //picking random indicies to apply the glitch
        let pick = Math.floor(Math.random() * currentText.length);
        if (!randomPickedCharsIndicies.includes(pick) && numberOfCharsPicked < currentText.length) {
            randomPickedCharsIndicies.push(pick);
            numberOfCharsPicked++;
            // console.log(randomPickedCharsIndicies);
        }

        //start changing based on the pciked indicies
        randomPickedCharsIndicies.forEach((i) => {

            if (newText[i] == undefined) {
                tempText.splice(i, i);
                tempText1.splice(i, i);
            }
            element.textContent = tempText.join('');

            if (tempText[i] != newText[i]) {
                tempText[i] = getActualChar();
                tempText1[i] = getRandomChar();
                element.textContent = tempText1.join('');
            }
        });

        //loop for the delay 
        if (tempText.join('') != newText && Date.now() - startTime < maxDuration) {
            setTimeout(() => wipeOut(), speed / 15);
        } else {
            element.textContent = newText;
        }
    }
    wipeOut();
}

function glitchStart() {
    index = (index + 1) % words.length;
    glitchText(span, words[index]);
}

let glitchInterval = setInterval(glitchStart, 5000);

//project section
const projectCards = document.querySelectorAll(".project-cards");
const projectDetails = document.querySelectorAll(".project-details");
const projectDetailsBg = document.querySelector("#project-details-bg");

projectCards.forEach((card) => {
    card.addEventListener("click", () => {
        projectDetailsBg.style.display = "block";
        projectDetails.forEach(elem => {
            if (elem.getAttribute("for") == card.id) elem.style.display = "flex";
            else elem.style.display = "none";
        });
    });
});

//close using the x-mark
document.querySelectorAll(".x-mark").forEach(elem => {
    elem.addEventListener("click", () => {
        elem.parentElement.parentElement.style.display = "none";
    });
})


//contact_section --> submitting the form
document.getElementById("contact-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    console.log(data);

    fetch("https://script.google.com/macros/s/AKfycbyJJq22SEKYUW2KwFmKAgkbdF0-kAVQ5i9NW0x0eS8LhT_Y5CRMjT1Ra4P-Q3GhlOVHIw/exec", {
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data)
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            console.error("Error:", error);
            alert('Failed to submit the form');
        })
        .finally(() => {
            event.target.reset()
        })
    // .then(response => response.json())
    // .then(result => {
    //     console.log(result);
    //     if (result.status === "success") {
    //         alert(result.message);
    //         document.getElementById("contact-form").reset();
    //     } else {
    //         alert("Error: " + result.message);
    //     }
    // })
    // .catch(error => {
    //     alert("There was an error submitting the message.\nIt might be your Internet connection or the server is down. Please try again later.");
    //     console.error("Error:", error);
    // });

});

// document.getElementById("contact-form").addEventListener("submit", async (event) => {
//     event.preventDefault();
//     console.log("came in");

//     const name = document.getElementById("name").value;
//     const email = document.getElementById("email").value;
//     const message = document.getElementById("message").value;

//     try {
//         const response = await fetch("https://script.google.com/macros/s/AKfycbyJJq22SEKYUW2KwFmKAgkbdF0-kAVQ5i9NW0x0eS8LhT_Y5CRMjT1Ra4P-Q3GhlOVHIw/exec", {
//             method: "POST",
//             mode: "cors",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ name, email, message })
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const result = await response.json(); // Parse JSON response
//         console.log("Server response:", result);

//         if (result.status === "success") {
//             alert(result.message);
//             document.getElementById("contact-form").reset();
//         } else {
//             alert("Error: " + result.message);
//         }

//     } catch (error) {
//         alert("There was an error submitting the message.\nIt might be your Internet connection or the server is down. Please try again later.");
//         console.error("Error:", error);
//     }
// });

//Redirects
function redirect(destination) {
    switch (destination) {
        case "mail":
            window.open("mailto:karthikprofessional204@gmail.com", "_blank");
            break;
        case "linkedin":
            window.open("https://www.linkedin.com/in/karthik-shatagopam", "_blank");
            break;
        case "github":
            window.open("https://github.com/Developerkaku", "_blank");
            break;
    }
}

//cards tilt effect
let cardsToBeTilted = document.querySelectorAll(".tilt-card");

cardsToBeTilted.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
        let rect = card.getBoundingClientRect();

        // Calculate cursor position relative to the card
        let cursorX = e.clientX - rect.left - rect.width / 2;
        let cursorY = rect.height / 2 - (e.clientY - rect.top);

        // Get tilt angle
        let tiltAngle = card.getAttribute("data-tilt-angle") || 15;

        // Apply transform based on the calculated position
        let rotateX = (cursorY * (2 * tiltAngle)) / rect.height;
        let rotateY = (cursorX * (2 * tiltAngle)) / rect.width;

        card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
});


// Scrolling on ZOOM
let main = document.getElementById("main");
const cardsList = document.querySelectorAll(".cards");
let navElems = document.querySelectorAll("#navLinks > li > button");
const cardCount = cardsList.length;

let elemsOutOfViewUnit = 1410;
let cardOffset = 100;

let ticking = false;

main.addEventListener("scroll", () => {
    // if (!ticking) {
    //     requestAnimationFrame(() => {
    //         handleSCroll();
    //         ticking = false;
    //     });
    //     ticking = true;
    // }
    handleSCroll();
});

let previousST = 0;
function handleSCroll() {
    let scrollTop = Math.round(main.scrollTop);
    let scrollLimit = (cardCount - 1) * elemsOutOfViewUnit;

    if (scrollTop >= scrollLimit) {
        main.scrollTop = scrollLimit;
    }

    for (let i = 0; i < cardCount; i++) {
        // if(scrollTop <= 500) {
        //     k = 1;
        //     return;
        // }
        // else if(1910 <= scrollTop && scrollTop <= 2410) {
        //     k = 2;
        //     return;
        // }
        if (scrollTop >= i * elemsOutOfViewUnit && scrollTop <= (i + 1) * (elemsOutOfViewUnit - cardOffset)) {
            navElems[i].classList.add("active");
        } else navElems[i].classList.remove("active");


        cardsList[i].style.transform = `translateZ(${scrollTop - (i * elemsOutOfViewUnit)}vw)`;
    }
}