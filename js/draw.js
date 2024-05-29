function drawBkgnd() {

    ctx.clearRect(0, 0, c.width, c.height);

    if (mode == 1 || mode == 2) {
        // Larry 3 or open questions background
        setFont(langNum); 
        bkgnd = document.getElementById("background");
        ctx.drawImage(bkgnd, 0, 0);
        // bikini, y between 120 - 200
        ctx.fillStyle = "Black";
        ctx.beginPath();
        ctx.rect(50, 120+score, 125, 125);
        ctx.fill(); 
        // overlay 
        if (lang == "FR") {
            mask = document.getElementById("maskFR");
        } else if (lang == "GR") {
            mask = document.getElementById("maskGR");
        } else {
            mask = document.getElementById("maskEN");
        }
        ctx.drawImage(mask, 0, 0); 
    } else if (mode == 3) {
        // KingsQuestions background
        bkgnd = document.getElementById("kQuestions");
        ctx.drawImage(bkgnd, 0, 0);
        drawKQShip();
        let xp = 100;
        ctx.fillStyle = "Blue";
        printText(ansArray[8],xp-29,qBaseNum-30); // the question string
        for (let i = 0; i < 4; i ++) {
            if (ans == 0) {
                printText(ansArray[i], xp+29, qBaseNum + (qSpacing/2) + (qSpacing*i));
            } else {
                if (ans == i+1) {
                    // players selection
                    if (ans == rightAns) {
                        ctx.fillStyle = "Green"; 
                    } else {
                        ctx.fillStyle = "Red"; 
                    }
                    printText(ansArray[i+4], xp+29, qBaseNum + (qSpacing/2) + (qSpacing*i));
                } else {
                    ctx.fillStyle = "Blue";
                    printText(ansArray[i], xp+29, qBaseNum + (qSpacing/2) + (qSpacing*i));
                }
            }
        }
        let la = ["a.", "b.", "c.","d."];
        ctx.fillStyle = "Blue";
        for (let i = 0; i < 4; i ++) {
            printText(la[i], xp, qBaseNum + (qSpacing/2) + (qSpacing*i));
        }
    } else if (mode == 4) {
        // PoliceQuest Mugshot background
        if (lang == "SP") {
            bkgnd = document.getElementById("pq2bkgrndSP");
        } else if (lang == "FR") {
            bkgnd = document.getElementById("pq2bkgrndFR");
        } else {
            bkgnd = document.getElementById("pq2bkgrnd");
        }
        ctx.drawImage(bkgnd, 0, 0);
        drawPQ2Mug();
        ctx.font = "28px SQ3font";
        ctx.fillStyle = "Black";
        printText(mugStr, 180, 370); //player text:
    } else if (mode == 5) {
        // lsl1vga background
        bkgnd = document.getElementById("lsl1vgabkgrnd");
        ctx.drawImage(bkgnd, 0, 0);
    } else if (mode == 6) {
        // sq3 background
        bkgnd = document.getElementById("sq3bkgrnd");
        ctx.drawImage(bkgnd, 0, 0);
        drawSQ3grind();

        // print the question
        if (questionJson) {
            ctx.fillStyle = "Yellow";
            printText(wrapText(ansArray[0], wrapLen), 30, qBaseNum-30);
            for (let i = 2;i<6;i++) {
                if (i-1 == ans) {
                    if (ans == rightAns) {
                        ctx.fillStyle = "Green";
                    } else {
                        ctx.fillStyle = "Red";
                    }
                    
                } else {
                    ctx.fillStyle = "Yellow";
                }
                printText(wrapText(ansArray[i], wrapLen), 60, qBaseNum + (qSpacing/2) + (qSpacing*(i-2)));
            }
        }
    } else if (mode == 7) {
        // Do Bonus
        ctx.drawImage(bkgnd, 0, 0);
        if (prevMode == 5) {
            bkgnd = document.getElementById("lsl1vgabkgrndBonus");
            drawLSL3VGA();
        } else if (prevMode == 4) {
            drawPQ2chief();
            bkgnd = document.getElementById("pq2bkgrndBonus");
        }
    }
    
    drawCounter();
    ctx.fillStyle = "White";
    printText(getLangStr(1),10,445); //score: 
};

function drawTitle() {

    ctx.clearRect(0, 0, c.width, c.height);
    bkgnd = document.getElementById("title");
    ctx.drawImage(bkgnd, 0, 0);
    
};

function drawCounter() {
    let x = 500;
    let y = 20;
    if (mode == 3) {
        // kingsQuestions
        x = 570;
        y = 20;
    } else if (mode == 4) {
        // pq2
        x = 95;
        y = 190;
    } else if (mode == 5) {
        // lsl1vga
        x = 560;
        y = 20;
    } else if (mode == 6) {
        // sq3
        x = 12;
        y = 400;
    } else if (mode == 7) {
        // pq bonus
        x = 20;
        y = 380;
    }
    for (let i = 0; i < 3; i++){
        let sx = counterArray[i*2] * 12 // Num's x loc on spritesheet
        let sy = counterArray[i*2+1] * 22 // Num's y loc on spritesheet
        let dx = x + (i * (11*2)); // 11*2 for 2x spacing
        ctx.drawImage(cNumImg, sx,sy, 11, 21, dx, y, 11*2, 21*2);
    } 
}

function drawKQShip() {

    kQShipImg = document.getElementById("rockSide");
    let x = 120;
    let y = 290;
    let celW;
    let celH;
    let sx;
    let sy;
    if (shipMode == 0) {
        // rockSide
        celW = 51;
        celH = 57; 
        sx = shipCel*(celW+1); //Num's x loc on spritesheet
        sy = 0 // one row, so always 0
    }
    //console.log("shipMode: " + shipMode);
    ctx.drawImage(kQShipImg, sx,sy, celW, celH, x, y, celW*1.25, celH*1.25);
    shipCel ++;
    if (shipCel > 7) {
        shipCel = 0;
    }
}

function drawSQ3grind() {
    kQShipImg = document.getElementById("sq3grind");
    let x = 362;
    let y = 376;
    let celW = 45;
    let celH = 15;
    let sx = grindCel*(celW);
    let sy = 0;

    ctx.drawImage(kQShipImg, sx,sy, celW, celH, x, y, celW*2, celH*2);
    grindCel ++;
    if (grindCel > 3) {
        grindCel = 0;
    }
}

function drawPQ2Mug() {

    pqMugImg = document.getElementById("pq2mug"); //39 x 52 x 8 mugs
    let x = 89;
    let y = 66;
    let celW;
    let celH;
    let sx;
    let sy;

    // mugshot
    celW = 38;
    celH = 52; 
    sx = mugCel*(celW+1); //Num's x loc on spritesheet
    sy = 0 // one row, so always 0
    ctx.drawImage(pqMugImg, sx,sy, celW, celH, x, y, celW*2, celH*2.25);

}

function drawPQ2chief() {
    pqMugImg = document.getElementById("pq2bonusSprites"); //39 x 52 x 8 mugs
    let x = 212;
    let y = 240;
    let celW;
    let celH;
    let sx;
    let sy;

    // chief neck x76 y17 83 37
    let cw = 83, ch = 37;
    let cx = 142, cy = 282;
    ctx.drawImage(pqMugImg, 76, 17, cw, ch, cx, cy, cw*2, ch*2);
    
    // chief head
    cw = 76, ch = 88;
    cx = 142, cy = 130;
    ctx.drawImage(pqMugImg, 0, 17, cw, ch, cx, cy, cw*2, ch*2);

    // Sonny head
    cw = 84, ch = 99;
    cx = 343, cy = 158;
    ctx.drawImage(pqMugImg, 159, 17, cw, ch, cx, cy, cw*2, ch*2);

    // chief mouth
    celW = 33;
    celH = 16; 
    sx = (bonusCel%10)*(celW); //Num's x loc on spritesheet
    sy = 0 // one row, so always 0
    ctx.drawImage(pqMugImg, sx, sy, celW, celH, x, y, celW*2, celH*2);
    if (bonusCel<149) {
        bonusCel ++;
    }
    //console.log("chiefCel: " + chiefCel + ", (chiefCel%10):"+(chiefCel%10));
    ctx.fillStyle = "Yellow";
    // print bonus points awarded in current language
    printText(getLangStr(7), 120, 400);
    printText(getLangStr(8), 140, 420);
}

function drawLSL3VGA() {
    const img = document.getElementById("lsl1vgabonusSprites"); //
    let x = 212;
    let y = 240;
    let celW;
    let celH;
    let sx;
    let sy;

    // eyes
    celW = 51;
    celH = 15; 
    sx = (bonusCel%6)*(celW); //Num's x loc on spritesheet
    sy = 0 // one row, so always 0
    ctx.drawImage(img, sx, sy, celW, celH, x, y, celW*2, celH*2);
    

    // woman mouth
    celW = 47;
    celH = 31; 
    x = 212;
    y = 280;
    sx = (bonusCel%10)*(celW); //Num's x loc on spritesheet
    sy = 16
    ctx.drawImage(img, sx, sy, celW, celH, x, y, celW*2, celH*2);
    if (bonusCel<149) {
        bonusCel ++;
    }
    //console.log("bonusCel: " + bonusCel + ", (bonusCelCel%10):"+(bonusCelCel%10));
    ctx.fillStyle = "Yellow";
    // print bonus points awarded in current language
    printText(getLangStr(9), 120, 400);
    printText(getLangStr(10), 140, 420);
}

