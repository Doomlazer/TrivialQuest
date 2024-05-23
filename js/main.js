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
        } else if (mode == 1 || mode == 3 || mode == 5) {
            doTriviaClick();
        } else if (mode == 4) {
            //pqQuestion();
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
                } else {
                    score --;
                    notPerfect = 1; 
                }
                nxt == 1;
                nextQuestion();
                mugStr = "";
            } else if (e.keyCode == 16 || e.keyCode == 20) {
                // r & l shift and capslock disable
            } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90)) {
                mugStr = mugStr + String.fromCharCode(e.keyCode);
                //mugStr = mugStr + e.keyCode;
            }
        }
    }
}

function doTitleClick() {
    mode = 5;
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
        ans = 0;

        /* testing guidelines
        for (let i=0; i<5; i++) {
            ctx.fillStyle = "Black";
            ctx.rect(0, qBaseNum+(i*qSpacing), 600, 5);
            ctx.fill(); 
        }

        //mouse
        ctx.rect(xPosition, yPosition, 10, 10);
        ctx.fill(); 
        */
        

        if (mode == 3) {
            // kingsQuestions works different
            // check if clicked in an answer
            for (let i = 0; i<4; i++) {
                if (yPosition > (qBaseNum + (i*qSpacing)) && yPosition <= (qBaseNum + qSpacing + (i*qSpacing))) {
                    ans = i+1;
                    console.log("ans: "+ans);
                }
            }
            if (ans > 0) {
                if (ans == rightAns) {
                    score ++;
                } else {
                    score --;
                    notPerfect = 1;
                } 
                nxt ++;
            }
        } else {
            // check if clicked in an answer
            for (let i = 0; i<4; i++) {
                if (yPosition > (qBaseNum + (i*qSpacing)) && yPosition <= (qBaseNum + qSpacing + (i*qSpacing))) {
                    ans = i+2;
                    //console.log("ans: "+ans);
                }
            }

            let xp = 331;
            if (mode == 5) {
                xp = 100;
            }
            if (ans > 0) {
                let a = ans-2;
                // five = any asnwer correct
                if (ans-1 == rightAns || rightAns == 5) {
                    score ++;
                    ctx.fillStyle = "Green";
                    let str;
                    if (mode == 1 || mode == 5) {
                        str = ansArray[a];
                    } else if (mode == 2) {
                        str = wrapText(questionJson.correct_answer, wrapLen); 
                    }
                    printText(str, xp, qBaseNum + (qSpacing/2) + (qSpacing*a));
                    //console.log("score: " + score);
                } else {
                    score --;
                    notPerfect = 1;
                    ctx.fillStyle = "Red";
                    if (mode == 1 || mode == 5) {
                        printText(ansArray[a], xp, qBaseNum + (qSpacing/2) + (qSpacing*a));
                    } else {
                        let b = a
                        if (b > rightAns) {
                            b --;
                        }
                        let s = wrapText(questionJson.incorrect_answers[b], wrapLen);
                        printText(s, xp, qBaseNum + (qSpacing/2) + (qSpacing*a));
                    }
                }

                ctx.fillStyle = "Yellow";
                if (ans > 0 && (ans-1 == rightAns || rightAns == 5)) {
                    printText(getLangStr(2),400,25); // correct
                } else {
                    printText(getLangStr(3),400,25); // wrong
                }
                // wait a click before next question
                nxt ++;
            }
        }
    }
}

function nextQuestion() {
    let s = score % 30;
    if ((score%10) == 0 && score != 0 ) {
        // every ten questions do mugshot
        mode = 4; // pq2mug
    } else if (s >= 0 && s < 10) {
        mode = 5; // lsl1vga
    } else if (s > 10 && s < 20) {
        mode = 3; // kingsQuestions
    } else if (s > 20 && s < 30) {
        mode = 1; // lsl3
    }

    if (mode == 1) {
        //textUpperLim = 166;
        //textLowerLim = 141;
        qSpacing = 75;
        qBaseNum = 100; // horribily named question y pos
        wrapLen = 30;
        lsl3Question();
    } else if (mode == 2) {
        otQuestion();
    } else if (mode == 3) {
        //textUpperLim = 0;
        //textLowerLim = 41;
        qSpacing = 60;
        qBaseNum = 75;
        wrapLen = 40;
        kqQuestion();
    } else if (mode == 4) {
        pqQuestion();
    } else if (mode == 5) {
        //textUpperLim = 752;
        //textLowerLim = 721;
        qSpacing = 75;
        qBaseNum = 150;
        wrapLen = 50;
        lsl3Question();
    }
}

function pqQuestion() {
    mugStr = "";
    console.log("next mugshot");
    //mugCel = Math.floor(Math.random()*8);
    mugCel = mode4Arr[mode4I];
    mode4I ++;
    if (mode4I >= mode4Arr.length) {
        mode4I = 0;
        mode4Arr = shuffle(mode4Arr);
        // one time score bonus for seeing all pqmugs
        score = score + modeCompletionBonus[mode];
        modeCompletionBonus[mode] = 0;
    }
}

function kqQuestion() {
    console.log("new kings question");
    ans = 0;
    ansArray = [];
    //let r = Math.floor(Math.random() * (textUpperLim - textLowerLim) + textLowerLim);
    // use next shuffled array question
    let r = mode3Arr[mode3I];
    mode3I ++;
    if (mode3I >= mode3Arr.length) {
        // reshuffle
        mode3I = 0;
        mode3Arr = shuffle(mode3Arr);
        // one time score bonus for seeing all kings questions
        score = score + modeCompletionBonus[mode];
        modeCompletionBonus[mode] = 0;
    } 
    let s = "data/" + lang + "/kq/" + r + ".tex";
    fetch(s)
    .then(response => response.arrayBuffer())
    .then((buffer) => {

            let decoder = new TextDecoder("iso-8859-1");
            let data = decoder.decode(buffer);
            console.log("data: "+data);
            let trunk = data.slice(2);
            splitData = trunk.split("\x00");
            ctx.fillStyle = "Blue";
            let q = 0; // q is always 0 in KQuestions, because only 1 question per file.
            let temp = splitData[q].slice(1);
            let temp1 = splitData[q+1];
            let temp2 = splitData[q+2];
            let temp3 = splitData[q+3];
            let temp4 = splitData[q+4];
            let temp5 = splitData[q+5]; // start of post answer responses
            let temp6 = splitData[q+6];
            let temp7 = splitData[q+7];
            let temp8 = splitData[q+8];

            rightAns = splitData[q].slice(0,1);
            let adj = 5;
            ansArray.push(wrapText(temp1, wrapLen-adj));
            ansArray.push(wrapText(temp2, wrapLen-adj));
            ansArray.push(wrapText(temp3, wrapLen-adj));
            ansArray.push(wrapText(temp4, wrapLen-adj));
            ansArray.push(wrapText(temp5, wrapLen-adj));
            ansArray.push(wrapText(temp6, wrapLen-adj));
            ansArray.push(wrapText(temp7, wrapLen-adj));
            ansArray.push(wrapText(temp8, wrapLen-adj));
            // pack the question string at the end for this mode
            ansArray.push(wrapText(temp, wrapLen));
        }
    )
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
    // each lsl3 and lsl1vga text file has five questions
    // first get the next randomized file
    let r;
    switch (mode) {
        case 1:
            gm = "lsl3"
            if (mode1J >= 5) {
                mode1JArr = shuffle(mode1JArr);
                mode1J = 0;
                mode1I ++;
                if (mode1I >= mode1Arr.length) {
                    // reshuffle
                    mode1I = 0;
                    mode1Arr = shuffle(mode1Arr);
                    // one time score bonus for seeing all lsl1vga
                    score = score + modeCompletionBonus[mode];
                    modeCompletionBonus[mode] = 0;
                } 
            }
            r = mode1Arr[mode1I];
            break;
        case 5:
            gm = "lsl1vga"
            if (mode5J >= 5) {
                mode5JArr = shuffle(mode5JArr);
                mode5J = 0;
                mode5I ++;
                if (mode5I >= mode5Arr.length) {
                    // reshuffle
                    mode5I = 0;
                    mode5Arr = shuffle(mode5Arr);
                    // one time score bonus for seeing all lsl3
                    score = score + modeCompletionBonus[mode];
                    modeCompletionBonus[mode] = 0;
                } 
            }
            r = mode5Arr[mode5I];
            break;
        default:
    }

    if (mode == 5 && lang != "PL") {
        s = "data/" + lang + "/" + gm + "/" + r + ".tex";
    } else {
        s = "data/" + lang + "/" + gm + "/text."+r;
    }
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
                // TODO: lsl1vga Spanish uses different encoding from lsl3 SP
            }
            splitData = trunk.split("\x00");

            // get next randomized question

            switch (mode) {
                case 1:
                    q = mode1JArr[mode1J]*5;
                    mode1J ++;
                    break;
                case 5:
                    q = mode5JArr[mode5J]*5;
                    mode5J ++;
                    break;
                default:
            }
        
            // change color for lsl1vga mode 5
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
            // French, German, etc. patch files contain english, remove it
            if (lang == "FR" && mode == 1) {
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
            } else if (lang == "GR" && mode == 1) {
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

            // print question
            let xp;
            let string = wrapText(temp, wrapLen);
            // reposition questions for mode 1 or 5
            if (mode == 5) {
                xp = 100;
                qBaseNum = 100;
                wrapLen = 50;
            } else {
                xp = 331;
                qBaseNum = 150;
                wrapLen = 30;
            }
            printText(string,xp-29,qBaseNum-30);
            rightAns = splitData[q].slice(0,1);
            let adj = 5;
            ansArray.push(wrapText(temp1, wrapLen-adj));
            ansArray.push(wrapText(temp2, wrapLen-adj));
            ansArray.push(wrapText(temp3, wrapLen-adj));
            ansArray.push(wrapText(temp4, wrapLen-adj));
            for (let i = 0; i < 4; i ++) {
                printText(ansArray[i], xp, qBaseNum + (qSpacing/2) + (qSpacing*i));
            }
            let la = ["a.", "b.", "c.","d."];
            for (let i = 0; i < 4; i ++) {
                printText(la[i], xp-29, qBaseNum + (qSpacing/2) + (qSpacing*i));
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