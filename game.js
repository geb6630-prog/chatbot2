const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startMsg = document.getElementById('gameStartMsg');

let currentGame = null;
let gameLoopId = null;

// Game 1 Variables (Cloud Bread)
let basket = { x: 250, y: 350, width: 100, height: 30 };
let breads = [];
let score = 0;
let lives = 5;
let isRightPressed = false;
let isLeftPressed = false;

// Game 2 Variables (Rainbow Fish)
let grayFishList = [];
let rainbowFish = { x: 300, y: 200, radius: 40 };
let fishScore = 0;
let timeLeft = 30;

// Input listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
canvas.addEventListener('click', handleCanvasClick, false);
canvas.addEventListener('mousemove', handleMouseMove, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") { isRightPressed = true; }
    else if(e.key == "Left" || e.key == "ArrowLeft") { isLeftPressed = true; }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") { isRightPressed = false; }
    else if(e.key == "Left" || e.key == "ArrowLeft") { isLeftPressed = false; }
}

function handleMouseMove(e) {
    if (currentGame === 'cloud') {
        const rect = canvas.getBoundingClientRect();
        const root = document.documentElement;
        let mouseX = e.clientX - rect.left - root.scrollLeft;
        basket.x = mouseX - basket.width / 2;
        if(basket.x < 0) basket.x = 0;
        if(basket.x + basket.width > canvas.width) basket.x = canvas.width - basket.width;
    }
}

function handleCanvasClick(e) {
    if (currentGame === 'fish') {
        const rect = canvas.getBoundingClientRect();
        const root = document.documentElement;
        let mouseX = e.clientX - rect.left - root.scrollLeft;
        let mouseY = e.clientY - rect.top - root.scrollTop;

        // Check if clicked on a gray fish
        for (let i = 0; i < grayFishList.length; i++) {
            let f = grayFishList[i];
            let dx = mouseX - f.x;
            let dy = mouseY - f.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < f.radius) {
                fishScore++;
                // Remove this fish and add a new one
                grayFishList.splice(i, 1);
                grayFishList.push({
                    x: Math.random() * 400 + 50,
                    y: Math.random() * 300 + 50,
                    radius: 30,
                    hasScale: false,
                    dx: (Math.random() - 0.5) * 4,
                    dy: (Math.random() - 0.5) * 4
                });
                break; // Only click one at a time
            }
        }
    }
}

function startGame(type) {
    startMsg.style.display = 'none';
    canvas.style.display = 'block';
    currentGame = type;
    
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    
    if (type === 'cloud') {
        initCloudGame();
    } else if (type === 'fish') {
        initFishGame();
    }
}

// ----------------------------------------------------
// Game 1: Cloud Bread Catch
// ----------------------------------------------------
function initCloudGame() {
    score = 0;
    lives = 5;
    breads = [];
    basket.x = 250;
    cloudGameLoop();
}

function drawBasket() {
    ctx.beginPath();
    ctx.rect(basket.x, basket.y, basket.width, basket.height);
    ctx.fillStyle = "#8B4513";
    ctx.fill();
    ctx.closePath();
}

function drawBreads() {
    for(let i=0; i<breads.length; i++) {
        let b = breads[i];
        ctx.fillStyle = "#FFFFFF"; // Cloud color
        
        // Add a slight yellow shadow for the bread crust effect
        ctx.shadowColor = '#FFB347';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2);
        ctx.arc(b.x - b.radius*0.8, b.y + b.radius*0.4, b.radius*0.8, 0, Math.PI*2);
        ctx.arc(b.x + b.radius*0.8, b.y + b.radius*0.4, b.radius*0.8, 0, Math.PI*2);
        ctx.arc(b.x, b.y - b.radius*0.5, b.radius*0.7, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        
        // reset shadow
        ctx.shadowColor = 'transparent';
    }
}

function cloudGameLoop() {
    if (currentGame !== 'cloud') return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (lives <= 0) {
        ctx.font = "40px 'Jua', sans-serif";
        ctx.fillStyle = "#FF0000";
        ctx.textAlign = "center";
        ctx.fillText("게임 오버! 😢", canvas.width / 2, 180);
        ctx.font = "24px 'Jua', sans-serif";
        ctx.fillStyle = "#333";
        ctx.fillText("최종 점수: " + score + "점", canvas.width / 2, 230);
        ctx.textAlign = "left"; // reset
        return; // Stop the loop
    }

    drawBasket();
    drawBreads();
    
    // Draw Score & Lives
    ctx.font = "24px 'Jua', sans-serif";
    ctx.fillStyle = "#333";
    ctx.fillText("점수: " + score, 10, 30);
    ctx.fillStyle = "#FF0000";
    ctx.fillText("목숨: " + "❤️".repeat(lives), 10, 60);
    
    // Add new bread occasionally
    if(Math.random() < 0.02) {
        breads.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: 0,
            radius: 15,
            speed: 2 + Math.random() * 2
        });
    }

    // Move breads and check collision
    for(let i=0; i<breads.length; i++) {
        breads[i].y += breads[i].speed;
        
        // Check collision with basket (use slightly larger hitbox for cloud)
        if(breads[i].y + breads[i].radius > basket.y && breads[i].y < basket.y + basket.height) {
            if(breads[i].x > basket.x - breads[i].radius && breads[i].x < basket.x + basket.width + breads[i].radius) {
                score += 10;
                breads.splice(i, 1);
                i--;
                continue;
            }
        }
        
        // Remove if off screen and lose life
        if(breads[i].y > canvas.height) {
            breads.splice(i, 1);
            lives--;
            i--;
        }
    }

    // Move basket with keyboard fallback
    if(isRightPressed && basket.x < canvas.width - basket.width) {
        basket.x += 7;
    }
    else if(isLeftPressed && basket.x > 0) {
        basket.x -= 7;
    }

    gameLoopId = requestAnimationFrame(cloudGameLoop);
}

// ----------------------------------------------------
// Game 2: Rainbow Fish Share
// ----------------------------------------------------
function initFishGame() {
    fishScore = 0;
    timeLeft = 30;
    grayFishList = [];
    // Create 5 gray fish
    for(let i=0; i<5; i++) {
        grayFishList.push({
            x: Math.random() * 400 + 50,
            y: Math.random() * 300 + 50,
            radius: 30,
            hasScale: false,
            dx: (Math.random() - 0.5) * 4,
            dy: (Math.random() - 0.5) * 4
        });
    }
    
    // Timer interval
    if(window.fishTimerId) clearInterval(window.fishTimerId);
    window.fishTimerId = setInterval(() => {
        if(currentGame === 'fish' && timeLeft > 0) {
            timeLeft--;
        }
    }, 1000);

    fishGameLoop();
}

function drawFish(x, y, radius, isRainbow, hasScale) {
    ctx.beginPath();
    // Body
    ctx.ellipse(x, y, radius, radius/1.5, 0, 0, Math.PI*2);
    ctx.fillStyle = isRainbow ? "#00BFFF" : (hasScale ? "#90EE90" : "#A9A9A9");
    ctx.fill();
    ctx.closePath();

    // Tail
    ctx.beginPath();
    ctx.moveTo(x - radius, y);
    ctx.lineTo(x - radius - 20, y - 15);
    ctx.lineTo(x - radius - 20, y + 15);
    ctx.fillStyle = isRainbow ? "#FF69B4" : (hasScale ? "#FFD700" : "#808080");
    ctx.fill();
    ctx.closePath();

    // Eye
    ctx.beginPath();
    ctx.arc(x + radius/2, y - radius/4, 4, 0, Math.PI*2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.arc(x + radius/2 + 1, y - radius/4, 2, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();

    // Shiny scale if it has one
    if (isRainbow || hasScale) {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI*2);
        ctx.fillStyle = "#FFD700"; // Gold scale
        ctx.fill();
        ctx.closePath();
    }
}

function fishGameLoop() {
    if (currentGame !== 'fish') return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background (water)
    ctx.fillStyle = "#20B2AA";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (timeLeft <= 0) {
        ctx.font = "40px 'Jua', sans-serif";
        ctx.fillStyle = "#FFD700";
        ctx.textAlign = "center";
        ctx.fillText("시간 종료! ⏱️", canvas.width / 2, 180);
        ctx.font = "24px 'Jua', sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText("총 나눈 비늘(점수): " + fishScore + "개", canvas.width / 2, 230);
        ctx.textAlign = "left"; // reset
        return; // stop game
    }

    // Instruction & Score
    ctx.font = "20px 'Jua', sans-serif";
    ctx.fillStyle = "#fff";
    ctx.fillText("회색 물고기를 클릭해서 비늘을 나누어주세요!", 10, 30);
    ctx.fillText("점수: " + fishScore + "점", 10, 60);
    ctx.fillStyle = "#FFC0CB";
    ctx.fillText("남은 시간: " + timeLeft + "초", 450, 30);

    // Move and draw gray fish
    for(let i=0; i<grayFishList.length; i++) {
        let f = grayFishList[i];
        f.x += f.dx;
        f.y += f.dy;
        
        // Bounce off walls
        if (f.x - f.radius < 0 || f.x + f.radius > canvas.width) f.dx *= -1;
        if (f.y - f.radius < 0 || f.y + f.radius > canvas.height) f.dy *= -1;

        drawFish(f.x, f.y, f.radius, false, f.hasScale);
    }

    // Draw main rainbow fish in center
    drawFish(rainbowFish.x, rainbowFish.y, rainbowFish.radius, true, true);
    
    gameLoopId = requestAnimationFrame(fishGameLoop);
}
