// Toggle menu for smaller screens
function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("active");
}

//navigation using nav elems
async function zoomScroll(scrollTop) {
    const cards = document.querySelectorAll(".cards-low-quality");
    cards.forEach((card) => {
        card.classList.remove("cards-low-quality")
    });
    try {
        await new Promise(resolve => {
            main.scrollTo({ top: Number(scrollTop), behavior: 'smooth' });
            // setTimeout(resolve, 1000);
            setTimeout(() => {
                resolve();
            }, 1000);
        });
        cards.forEach((card) => {
            card.classList.add("cards-low-quality")
        });

    } catch (error) {
        console.error("scroll failed:", error);
    }
}

//settings
function changeResolution() {
    let cards = document.querySelectorAll(".cards");
    cards.forEach(card => {
        card.classList.toggle("cards-low-quality");
    });
}


//about_section--> glitch effect
const span = document.querySelector(".glitch");
const words = ["Web", "Fullstack", "Backened"];
let index = 0;

function getActualChar() {
    const chars = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    return chars[Math.floor(Math.random() * chars.length)];
}
function getRandomChar() {
    const chars = "€£¥©²é§°℃℉№‖⁜⁑⁂※⁞¿﷼₣₿₼௹૱₥₨`~!@#$%^&()-_=+[{}]\\|;:'\",<.>/?";

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
let freezePoint = 150;

let ticking = false;

main.addEventListener("scroll", () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            handleSCroll();
            ticking = false;
        });
        ticking = true;
    }
});

function handleSCroll() {
    let scrollTop = Math.round(main.scrollTop);

    //starting n pausing the glitch effect
    // if (scrollTop >= 200) { clearInterval(glitchInterval) }
    // else { glitchInterval = setInterval(glitchStart, 4000) }

    let cardIndex, elemList, elemOffset, navElemIndex = -1;

    { // snapping all the cards and elems back to their start pos;
        if (main.scrollTop < cardOffset) {
            for (let index = 0; index < cardCount; index++) {
                const element = cardsList[index];
                element.style.transform = `translateZ(0vw)`;

                const elemList = element.children;
                for (let index = 0; index < elemList.length; index++) {
                    const element = elemList[index];
                    element.style.transform = `translateZ(0vw)`;
                }
            }
        }
    }

    for (let i = 0; i < cardCount; i++) {
        const cardStart = (i * (elemsOutOfViewUnit + cardOffset)) + cardOffset;
        const elemEnd = (i * (elemsOutOfViewUnit + cardOffset)) + elemsOutOfViewUnit;
        const cardEnd = (i * (elemsOutOfViewUnit + cardOffset)) + elemsOutOfViewUnit + cardOffset;

        if (scrollTop < cardStart) {
            cardsList[i].style.transform = `translateZ(0vw)`;
            navElemIndex = i;
            cardIndex = undefined;
            elemList = cardsList[i].children;
            elemOffset = i * (elemsOutOfViewUnit + cardOffset);
            break;
        } else if (scrollTop < elemEnd) {
            cardIndex = i;
            navElemIndex = i;
            elemList = cardsList[i].children;
            elemOffset = i * (elemsOutOfViewUnit + cardOffset);
            break;
        } else if (scrollTop < cardEnd) {
            navElemIndex = i + 1;
            elemOffset = i * (elemsOutOfViewUnit + cardOffset);
            elemList = undefined;
            cardIndex = i;
            break;
        }
    }

    //handling navELems
    navElems.forEach((elem, index) => {
        if (index == navElemIndex) elem.classList.add("active");
        else elem.classList.remove("active");
    })

    if (cardIndex != undefined) {
        for (let index = 0; index < cardIndex; index++) {
            const card = cardsList[index];
            card.style.transform = `translateZ(${elemsOutOfViewUnit}vw)`;

            for (let index = 0; index < card.children.length; index++) {
                const element = card.children[index];
                element.style.transform = `translateZ(${elemsOutOfViewUnit}vw)`;
            }
        }


        cardsList[cardIndex].style.transform = (cardIndex == cardCount - 1) ? `translateZ(0vw)` : `translateZ(${scrollTop - elemOffset - cardOffset}vw)`;

        for (let index = cardIndex + 1; index < cardsList.length; index++) {
            const element = cardsList[index];
            element.style.transform = `translateZ(0vw)`;
        }
    }

    if (elemList && cardIndex != cardCount - 1) {
        for (let index = 0; index < elemList.length; index++) {
            const element = elemList[index];
            element.style.transform = `translateZ(${scrollTop - elemOffset}vw)`;
        }
    }
}

//contact_section --> submitting the form
document.getElementById("contact-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("came in");

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbyJJq22SEKYUW2KwFmKAgkbdF0-kAVQ5i9NW0x0eS8LhT_Y5CRMjT1Ra4P-Q3GhlOVHIw/exec", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, message })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json(); // Parse JSON response
        console.log("Server response:", result);

        if (result.status === "success") {
            alert(result.message);
            document.getElementById("contact-form").reset();
        } else {
            alert("Error: " + result.message);
        }

    } catch (error) {
        alert("There was an error submitting the message.\nIt might be your Internet connection or the server is down. Please try again later.");
        console.error("Error:", error);
    }
});

//Redirects
function redirect(destination) {
    switch (destination) {
        case "mail":
            window.open("mailto:karthikprofessional204@gmail.com", "_blank");
            break;
        case "linkedin":
            window.open("https:www.linkedin.com/in/karthik-s-4b6987297", "_blank");
            break;
        case "github":
            window.open("https://github.com/Developerkaku", "_blank");
            break;
    }
}
