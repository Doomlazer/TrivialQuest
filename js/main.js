function initClick() {
    c.addEventListener("click", getClickPosition, false);

    function getClickPosition(e) {
        xPosition = e.clientX;
        yPosition = e.clientY - 10;

        if (prevSong == -1) {
            prevSong = 0;
            initAudio();
            myAudio.play();
        }

        if (mode == 0) {
            doTitleClick();
        } else if (mode == 1) {
            doTriviaClick();
        }
     
    }
}

function doTitleClick() {
    mode = 1;
    nextQuestion();
    animateIntervalID = setInterval(animate, 100);
}

function doTriviaClick() {
    if (nxt == 1) {
        // 2nd click triggers new question
        nxt = 0;
        nextQuestion();
    } else {
        // player selects answer
        var ans = 0;

        /* testing guidelines
        for (let i=0; i<5; i++) {
            ctx.fillStyle = "Black";
            ctx.rect(290, qBaseNum+(i*qSpacing), 300, 5);
            ctx.fill(); 
        }

        //mouse
        ctx.rect(xPosition, yPosition, 10, 10);
        ctx.fill(); 
        */

        // check if clicked in an answer
        for (let i = 0; i<4; i++) {
            if (yPosition > (qBaseNum + (i*qSpacing)) && yPosition <= (qBaseNum + qSpacing + (i*qSpacing))) {
                ans = i+2;
                console.log("ans: "+ans);
            }
        }

        if (ans > 0) {
            let a = ans-2;
            if (ans-1 == rightAns) {
                score ++;
                ctx.fillStyle = "Green";
                let str;
                if (mode == 1) {
                    str = ansArray[a];
                } else {
                    str = wrapText(questionJson.correct_answer, wrapLen); 
                }
                printText(str, 320, qBaseNum + (qSpacing/2) + (qSpacing*a));
                //console.log("score: " + score);
            } else {
                score --;
                ctx.fillStyle = "Red";
                if (mode == 1) {
                    //let s = wrapText(splitData[(q+ans)], wrapLen);
                    printText(ansArray[a], 320, qBaseNum + (qSpacing/2) + (qSpacing*a));
                } else {
                    let b = a
                    if (b > rightAns) {
                        b --;
                    }
                    let s = wrapText(questionJson.incorrect_answers[b], wrapLen);
                    printText(s, 320, qBaseNum + (qSpacing/2) + (qSpacing*a));
                }
            }

            ctx.fillStyle = "Yellow";
            if (ans > 0 && ans-1 == rightAns) {
                printText(getLangStr(2),400,25); // correct
            } else {
                printText(getLangStr(3),400,25); // wrong
            }
            // wait a click before next question
            nxt ++;
        }
    }
}

function nextQuestion() {
    if (mode == 1) {
        lsl3Question();
    } else if (mode == 2) {
        otQuestion();
    }
}



function otQuestion() {
    drawBkgnd();
    ctx.fillStyle = "Blue";
    printText("Fetching question...",320,120);
    fetch("https://opentdb.com/api.php?amount=1&type=multiple")
    .then(response => { return response.json(); })
    .then((data) => {
        // Work with JSON data here
        questionJson = data.results[0];
        drawBkgnd();
        ctx.fillStyle = "Yellow";
        printText(getLangStr(1),400,50); //score: 
        ctx.fillStyle = "Blue";
        let s1 = wrapText(fjson(questionJson.question), wrapLen);
        printText(s1, 320, 120);
        r = Math.floor(Math.random() * 4);
        let ia = 0;
        for (let i = 0;i<4;i++) {
            if (i == r) {
                let s = wrapText(fjson(questionJson.correct_answer), wrapLen);
                printText(s, 320, qBaseNum + (qSpacing/2) + (qSpacing*i));
                rightAns = i+1;
            } else {
                let s = wrapText(questionJson.incorrect_answers[ia], wrapLen);
                printText(s, 320, qBaseNum + (qSpacing/2) + (qSpacing*i));
                ia ++;
            }
        }
    }).catch(err => {});
}

function lsl3Question() {
    ansArray = [];
    drawBkgnd();
    ctx.fillStyle = "Yellow";
    printText(getLangStr(1),400,50); //score: 
    // load questions
    // each text file has five questions
    // files range from 141 to 166. Looks like in the game only 141-161 are used?
    let r = Math.floor(Math.random() * (166 - 141) + 141);
    //r = 155 // testing only!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    let s = "data/" + lang + "/lsl3/text.";
    s = s.concat(r);
    console.log("s: " + s);
    fetch(s)
    //.then(response => response.text())
    .then(response => response.arrayBuffer())
    .then((buffer) => {

            let decoder = new TextDecoder("iso-8859-1");
            let data = decoder.decode(buffer);
            //console.log(data);
            let trunk = data.slice(2);
            if (lang == "FR") {
                trunk = trunk.replaceAll("\u0152","\u00ee"); // Œ -> î
                trunk = trunk.replaceAll("\u0160","\u00e8"); // Š -> è
                trunk = trunk.replaceAll("\u0192","\u00e2"); // ƒ -> â
                trunk = trunk.replaceAll("\u02c6","\u00ea"); // ^ -> ê
                trunk = trunk.replaceAll("\u2013","\u00fb"); // — -> û
                trunk = trunk.replaceAll("\u2014","\u00f9"); // — -> ù
                trunk = trunk.replaceAll("\u201a","\u00e9"); // ‚ -> é
                trunk = trunk.replaceAll("\u201c","\u00f4"); // “ -> ô
                trunk = trunk.replaceAll("\u2021","\u00e7"); // ‡ -> ç
                trunk = trunk.replaceAll("\u2026","\u00e0"); // … -> à
                trunk = trunk.replaceAll("\u2030","\u00eb"); // ‰ -> ë
            } else if (lang == "GR") {
                trunk = trunk.replaceAll("\u0081","\u00fc"); //  -> ü
                trunk = trunk.replaceAll("\u00e1","\u00df"); // á -> ß
                trunk = trunk.replaceAll("\u0161","?2"); // š
                trunk = trunk.replaceAll("\u017d","?3"); // Ž
                trunk = trunk.replaceAll("\u0192","?4"); // ƒ
                trunk = trunk.replaceAll("\u201a","?5"); // ‚
                trunk = trunk.replaceAll("\u201d","\u00f6"); // ” -> ö
                trunk = trunk.replaceAll("\u201e","\u00e4"); // „ -> ä
                trunk = trunk.replaceAll("\u2122","\u00d6"); // ™ -> Ö
            } else if (lang == "SP") {
                trunk = trunk.replaceAll("\u0026","\u00bf"); // & -> ¿
                trunk = trunk.replaceAll("\u002b","\u00e9"); // + -> é
                trunk = trunk.replaceAll("\u007d","\u00f1"); // } -> ñ
                trunk = trunk.replaceAll("\u003e","\u00f3"); // > -> ó
                trunk = trunk.replaceAll("\u007b","\u00fa"); // { -> ú
                trunk = trunk.replaceAll("\u002a","\u00e1"); // * -> á
                trunk = trunk.replaceAll("\u007c","\u00ed"); // | -> í
                trunk = trunk.replaceAll("\u005e","\u00a1"); // ^ -> ¡
            }            
            //console.log(trunk);
            splitData = trunk.split("\x00");
            q = Math.floor(Math.random()*4)*5;
            //q = 10 // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            console.log("q: " + q);
            //console.log(splitData[0]);
            ctx.fillStyle = "Blue";
            let temp = splitData[q].slice(1);
            let temp1 = splitData[q+1];
            let temp2 = splitData[q+2];
            let temp3 = splitData[q+3];
            let temp4 = splitData[q+4];
            // French & German patch files contain english, remove it
            if (lang == "FR") {
                let tempArray = temp.split("%F");
                temp = tempArray[1];
                let tempArray1 = temp1.split("%F");
                temp1 = tempArray1[1];
                let tempArray2 = temp2.split("%F");
                temp2 = tempArray2[1];
                let tempArray3 = temp3.split("%F");
                temp3 = tempArray3[1];
                let tempArray4 = temp4.split("%F");
                temp4 = tempArray4[1];
            } else if (lang == "GR") {
                let tempArray = temp.split("%G");
                temp = tempArray[1];
                let tempArray1 = temp1.split("%G");
                temp1 = tempArray1[1];
                let tempArray2 = temp2.split("%G");
                temp2 = tempArray2[1];
                let tempArray3 = temp3.split("%G");
                temp3 = tempArray3[1];
                let tempArray4 = temp4.split("%G");
                temp4 = tempArray4[1];
            }
            let string = wrapText(temp, wrapLen);
            //console.log(string);
            printText(string,320,120);
            rightAns = splitData[q].slice(0,1);
            ansArray.push(wrapText(temp1, wrapLen));
            ansArray.push(wrapText(temp2, wrapLen));
            ansArray.push(wrapText(temp3, wrapLen));
            ansArray.push(wrapText(temp4, wrapLen));
            let x2 = 0;
            for (let i = 0; i < 4; i ++) {
                printText(ansArray[i], 320, qBaseNum + (qSpacing/2) + (qSpacing*i));
            }
            let la = ["a.", "b.", "c.","d."];
            for (let i = 0; i < 4; i ++) {
                printText(la[i], 300, qBaseNum + (qSpacing/2) + (qSpacing*i));
            }
        }
    )
};

function drawTitle() {

    ctx.clearRect(0, 0, c.width, c.height);
    bkgnd = document.getElementById("title");
    ctx.drawImage(bkgnd, 0, 0);
    
};

function drawBkgnd() {

    ctx.clearRect(0, 0, c.width, c.height);
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
    drawCounter();
};

function printText(text, x ,y) {
    let textArray = text.split("\n");
    ctx.fillText(textArray[0], x, y);
    if (typeof textArray[1] !== 'undefined') {
        if (textArray[0] != textArray[1]) {
            ctx.fillText(textArray[1], x, y+16);
        }
    }
    if (typeof textArray[2] !== 'undefined') {
        if (textArray[0] != textArray[2]) {
            ctx.fillText(textArray[2], x, y+32);
        }
    }
}

function switchLSLorOpenTrivia() { // REDO
    if (langLock == 0) {
        // SWITCH qType to use mode instead
        if (mode == 2) {
            mode = 1;
        } else {
            mode = 2;
        }
    }
    nextQuestion();
    if (langLock == 0) {
        if (mode == 1) {
            if (lang == "SP") {
                printText("Preguntas sobre LSL3",350,400);
            } else if (lang == "EN") {
                printText("LSL3 questions",350,400);
            }
        } else if (mode == 2) {
            printText("Open Trivia questions",350,400);
            printText("English only :(",350,420);
        }
        langLock = 1;
    }
}