function initClick() {
    c.addEventListener('click', getClickPosition, false);

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
        } else if (mode == 4) {
            //pqQuestion();
        } else if (mode == 5) {
            doTriviaClick();
        }
     
    }

    document.addEventListener('keydown', doKD, false);
    //console.log("mugStrinit: " + mugStr);

    function doKD(e) {
        if (mode == 4) {
            if(!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8)) {
                e.preventDefault();
            }
            if (e.keyCode == 8) {
                mugStr = mugStr.slice(0, -1)
            } else if (e.keyCode == 13) {
                // return key
                if (mugStr == mugArray[mugCel]) {
                    score ++;
                    if (score > 5) {
                        mode = 5;
                        drawBkgnd();
                        nxt == 1;
                        nextQuestion();
                    }
                } else {
                    score --;
                    if (score < 5) {
                        mode = 1;
                        drawBkgnd();
                        nxt == 1;
                        nextQuestion();
                    }
                }
                mugStr = "";
                if (mode == 4) {
                    pqQuestion();
                }
            } else if (e.keyCode == 16 || e.keyCode == 20) {
                // r & l shift and capslock disable
            } else {
                mugStr = mugStr + String.fromCharCode(e.keyCode);
                //mugStr = mugStr + e.keyCode;
            }
            //console.log("mugStr: " + mugStr);
        }
    }
}

function doTitleClick() {
    /*if (xPosition < c.width/2) {
        // lsl
        mode = 1;
    } else {
        // kings questions
        mode = 3;
    }*/
        //mode 4 pq2 mugs

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
                if (mode == 1 || mode == 5) {
                    str = ansArray[a];
                } else if (mode == 2) {
                    str = wrapText(questionJson.correct_answer, wrapLen); 
                }
                printText(str, 331, qBaseNum + (qSpacing/2) + (qSpacing*a));
                //console.log("score: " + score);
            } else {
                score --;
                ctx.fillStyle = "Red";
                if (mode == 1 || mode == 5) {
                    printText(ansArray[a], 331, qBaseNum + (qSpacing/2) + (qSpacing*a));
                } else {
                    let b = a
                    if (b > rightAns) {
                        b --;
                    }
                    let s = wrapText(questionJson.incorrect_answers[b], wrapLen);
                    printText(s, 331, qBaseNum + (qSpacing/2) + (qSpacing*a));
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
    if (score > 0 && score < 5) {
        mode = 1;
    } else if (score > 4 && score < 6) {
        mode = 4;
    } else if (score > 5 && score < 20) {
        mode = 5;
    } else {
        mode = 1;
    }

    if (mode == 1) {
        lsl3Question();
    } else if (mode == 2) {
        otQuestion();
    } else if (mode == 3) {
        kqQuestion();
    } else if (mode == 4) {
        pqQuestion();
    } else if (mode == 5) {
        lsl3Question();
    }
}

function pqQuestion() {
    mugStr = "";
    console.log("next mugshot");
    mugCel = Math.floor(Math.random()*8);
}

function kqQuestion() {
    ansArray = [];
    drawBkgnd();
    ctx.fillStyle = "Yellow";
    printText(getLangStr(1),400,50); //score: 
    console.log("mode: " + mode);
}

function otQuestion() {
    drawBkgnd();
    ctx.fillStyle = "Blue";
    printText("Fetching question...",320,120);
    fetch("https://opentdb.com/api.php?amount=10&type=multiple")
    .then(response => { return response.json(); })
    .then((data) => {
        // Work with JSON data here
        questionJson = data.results[0];
        drawBkgnd();
        ctx.fillStyle = "Yellow";
        printText(getLangStr(1),400,50); //score: 
        ctx.fillStyle = "Blue";
        let s1 = wrapText(fjson(questionJson.question), wrapLen);
        printText(s1, 331, 120);
        r = Math.floor(Math.random() * 4);
        let ia = 0;
        for (let i = 0;i<4;i++) {
            if (i == r) {
                let s = wrapText(fjson(questionJson.correct_answer), wrapLen);
                printText(s, 331, qBaseNum + (qSpacing/2) + (qSpacing*i));
                rightAns = i+1;
            } else {
                let s = wrapText(questionJson.incorrect_answers[ia], wrapLen);
                printText(s, 331, qBaseNum + (qSpacing/2) + (qSpacing*i));
                ia ++;
            }
        }
    }).catch(err => {});
}

function lsl3Question() {
    let gm;
    let s;
    ansArray = [];
    drawBkgnd();
    ctx.fillStyle = "Yellow";
    printText(getLangStr(1),400,50); //score: 
    // load questions
    // each text file has five questions
    // files range from 141 to 166. Looks like in the game only 141-161 are used?

    switch (mode) {
        case 1:
            textUpperLim = 166;
            textLowerLim = 141;
            gm = "lsl3"
            break;
        case 5:
            // lsl1vga
            textUpperLim = 752;
            textLowerLim = 721;
            gm = "lsl1vga"
            break;
        default:
    }

    let r = Math.floor(Math.random() * (textUpperLim - textLowerLim) + textLowerLim);
    //r = 148 // testing only!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (mode == 5 && lang != "PL") {
        s = "data/" + lang + "/" + gm + "/" + r + ".tex";
    } else {
        s = "data/" + lang + "/" + gm + "/text."+r;
    }
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
            } else if (lang == "SP" && mode == 1) {
                trunk = trunk.replaceAll("\u0026","\u00bf"); // & -> ¿
                trunk = trunk.replaceAll("\u002b","\u00e9"); // + -> é
                trunk = trunk.replaceAll("\u007d","\u00f1"); // } -> ñ
                trunk = trunk.replaceAll("\u003e","\u00f3"); // > -> ó
                trunk = trunk.replaceAll("\u007b","\u00fa"); // { -> ú
                trunk = trunk.replaceAll("\u002a","\u00e1"); // * -> á
                trunk = trunk.replaceAll("\u007c","\u00ed"); // | -> í
                trunk = trunk.replaceAll("\u005e","\u00a1"); // ^ -> ¡
            } else if (lang == "SP" && mode == 5) {
                // TODO: lsl1vga sp uses different encoding from lsl3 sp
            }
            //console.log(trunk);
            splitData = trunk.split("\x00");
            q = Math.floor(Math.random()*4)*5;
            //q = 5 // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            console.log("q: " + q);
            //console.log(splitData[0]);
            if (mode == 5) {
                switch (q/5) {
                    case 0:
                        ctx.fillStyle = "rgb(223, 223, 71)";
                        break;
                    case 1:
                        ctx.fillStyle = "rgb(135, 235, 135)";
                        break;
                    case 2:
                        ctx.fillStyle = "rgb(135,135, 235)";
                        break;
                    case 3:
                        ctx.fillStyle = "rgb(255, 77, 255)";
                        break;
                    case 4:
                         ctx.fillStyle = "rgb(77, 255, 255)";
                        break;
                    default:
                }
            } else {
                ctx.fillStyle = "Blue";
            }
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
            } else if (lang == "SP" && mode == 5) {
                let tempArray = temp.split("#S");
                temp = tempArray[1];
                let tempArray1 = temp1.split("#S");
                temp1 = tempArray1[1];
                let tempArray2 = temp2.split("#S");
                temp2 = tempArray2[1];
                let tempArray3 = temp3.split("#S");
                temp3 = tempArray3[1];
                let tempArray4 = temp4.split("#S");
                temp4 = tempArray4[1];
            }
            let string = wrapText(temp, wrapLen);
            // console.log(string);
            // print question
            printText(string,302,120);
            rightAns = splitData[q].slice(0,1);
            let adj = 5;
            ansArray.push(wrapText(temp1, wrapLen-adj));
            ansArray.push(wrapText(temp2, wrapLen-adj));
            ansArray.push(wrapText(temp3, wrapLen-adj));
            ansArray.push(wrapText(temp4, wrapLen-adj));
            let x2 = 0;
            for (let i = 0; i < 4; i ++) {
                printText(ansArray[i], 331, qBaseNum + (qSpacing/2) + (qSpacing*i));
            }
            let la = ["a.", "b.", "c.","d."];
            for (let i = 0; i < 4; i ++) {
                printText(la[i], 302, qBaseNum + (qSpacing/2) + (qSpacing*i));
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
    } else if (mode == 4) {
        // PoliceQuest Mugshot background
        bkgnd = document.getElementById("pq2bkgrnd");
        ctx.drawImage(bkgnd, 0, 0);
        drawPQ2Mug();
        ctx.font = "28px SQ3font";
        ctx.fillStyle = "Black";
        printText(mugStr, 180, 370); //player text:
    } else if (mode == 5) {
        // lsl1vga background
        bkgnd = document.getElementById("lsl1vgabkgrnd");
        ctx.drawImage(bkgnd, 0, 0);
    }
    
    drawCounter();
};

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