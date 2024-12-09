document.addEventListener("DOMContentLoaded", init);

let ww = 0;
let wh = 0;
let snowflakes = ["\u2744", "\u2745", "\u2746"]; // Snowflake characters
let flakeCount = 0;
const maxFlakes = 200;

function init() {
    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);

    // Add initial snowflakes
    for (let i = 0; i < 50; i++) {
        createSnowflake(true);
    }

    // Move snowflakes at regular intervals
    setInterval(moveSnowflakes, 50);
}

function updateViewportSize() {
    ww = window.innerWidth;
    wh = window.innerHeight;
}

function createSnowflake(initial) {
    if (flakeCount >= maxFlakes) return;

    const snowflake = document.createElement("span");
    snowflake.className = "snowflake";
    snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];

    // Set random properties for each snowflake
    const size = Math.random() * 20 + 10; // Random size between 10px and 30px
    const startX = Math.random() * ww; // Random horizontal position
    const startY = initial ? Math.random() * wh : -size; // Start at top or random position if initial
    const speed = Math.random() * 3 + 2; // Random fall speed
    const sway = Math.random() * 2 - 1; // Random horizontal movement

    Object.assign(snowflake.style, {
        position: "fixed",
        top: `${startY}px`,
        left: `${startX}px`,
        fontSize: `${size}px`,
        color: "#fff",
        pointerEvents: "none",
        zIndex: 9999,
        opacity: Math.random() * 0.8 + 0.2, // Slight transparency
    });

    // Attach data attributes for movement
    snowflake.dataset.speed = speed;
    snowflake.dataset.sway = sway;
    snowflake.dataset.x = startX;
    snowflake.dataset.y = startY;

    document.body.appendChild(snowflake);
    flakeCount++;
}

function moveSnowflakes() {
    const snowflakes = document.querySelectorAll(".snowflake");

    snowflakes.forEach((flake) => {
        let x = parseFloat(flake.dataset.x);
        let y = parseFloat(flake.dataset.y);
        const speed = parseFloat(flake.dataset.speed);
        const sway = parseFloat(flake.dataset.sway);

        // Update position
        y += speed; // Move down
        x += sway * 2; // Slight sway

        // Reappear at the top if the snowflake moves off the bottom
        if (y > wh) {
            y = -20;
            x = Math.random() * ww; // Randomize horizontal position
        }

        // Update flake position
        flake.dataset.x = x;
        flake.dataset.y = y;
        flake.style.top = `${y}px`;
        flake.style.left = `${x}px`;
    });

    // Add new snowflakes if under the max count
    if (flakeCount < maxFlakes) {
        createSnowflake(false);
    }
}

// Optional: Add basic CSS for smoother animation
const style = document.createElement("style");
style.textContent = `
    @keyframes sway {
        0% { transform: translateX(-2px); }
        50% { transform: translateX(2px); }
        100% { transform: translateX(-2px); }
    }
        
    .snowflake {
        animation: sway 2s infinite ease-in-out;
    }
`;
document.head.appendChild(style);