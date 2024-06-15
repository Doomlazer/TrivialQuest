function initClick() {
    c.addEventListener('click', getClickPosition, false);

    function getClickPosition(e) {
        var pos = getMousePos(c, e);
        xPosition = pos.x;
        yPosition = pos.y;

        if (prevSong == -1) {
            prevSong = 0;
            initAudio();
            myAudio.play();
        }

        if (mode == 0) {
        
            if (xPosition > 430 && xPosition < 580 && yPosition > 410 && yPosition < 450) {
                gameplayMode = 1; // openTDB only
                ctx.beginPath();
                ctx.fillStyle = "Green";
                ctx.rect(430, 410, 150, 40);
                ctx.fill();
            }
            if (xPosition > 60 && xPosition < 210 && yPosition > 410 && yPosition < 450) {
                if (gameplayMode == 2) {
                    gameplayMode = 0;
                    drawTitle();
                } else {
                    gameplayMode = 2;
                    printCredits();
                }
            } else {
                if (gameplayMode == 2) {
                    gameplayMode = 0;
                    drawTitle();
                } else {
                    doTitleClick();
                }
            }
        } else if (mode == 1 || mode == 3 || mode == 5 || mode == 6) {
            doTriviaClick();
        } else if (mode == 4) {
            // pq2
            nxt = 1;
        } else if (mode == 7) {
            // bonus modes
            mode = 6; // change to anything but 7 to advance
            //nxt = 1;
            nextQuestion();
        } else if (mode == 8) {
            // ads mode
            mode = 6; // change to anything but 7 to advance
            myVideo.pause();
            if (!musicMuted) {
                myAudio.play();
            }
            nextQuestion();
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
                // delete
                mugStr = mugStr.slice(0, -1)
            } else if (e.keyCode == 13) {
                // return key
                if (mugStr == mugArray[mugCel]) {
                    score ++;
                    pqQuestionsCorrect ++;
                } else {
                    score --;
                    notPerfect = 1; 
                }

                mode4I ++;
                if (mode4I >= mode4Arr.length) {
                    //mode4I = 0;
                    shuffle(mode4Arr);
                    if (modeCompletionBonus[mode] > 0) {
                        // one time score bonus for seeing all pqmugs
                        score = score + (modeCompletionBonus[mode]*pqQuestionsCorrect);
                        modeCompletionBonus[mode] = 0;
                        prevMode = mode;
                        mode = 7;
                    }
                }

                //nxt == 1;
                nextQuestion();
                mugStr = "";
            } else if (e.keyCode == 16 || e.keyCode == 20) {
                // r & l shift and capslock disable
            } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90)) {
                mugStr = mugStr + String.fromCharCode(e.keyCode);
                //mugStr = mugStr + e.keyCode;
            }
        } else if (mode == 0) {
            if (e.keyCode == 68) {
                debug = 1;
                const button = document.createElement('button')
                button.innerText = 'Score up, finish lsl1vga'
                button.id = 'button'
                button.addEventListener('click', () => {
                    scoreUpDown(1);
                    mode5I = mode5Arr.length;
                })
                const button1 = document.createElement('button')
                button1.innerText = 'Score down'
                button1.id = 'button'
                button1.addEventListener('click', () => {
                    scoreUpDown(0); 
                })
                const button2 = document.createElement('button')
                button2.innerText = 'Dump ans[] to console'
                button2.id = 'button'
                button2.addEventListener('click', () => {
                    console.log("ansArray:");
                    console.log(ansArray);
                    for (i=0; i<ansArray.length;i++) {
                        let a = ansArray[i];
                        console.log("a: " + a);
                        console.log("a.length: " + a.length);
                        for (let j=0; j<a.length; j++) {
                            
                            console.log(a.charAt(j) + " charat: " + a.charCodeAt(j));
                        }
                    }
                })
                document.body.appendChild(button);
                document.body.appendChild(button1);
                document.body.appendChild(button2);
            }
        } else if (mode == 7) {
            if (e.keyCode == 13) {
                console.log("mode7 retunkey: ");
                mode = 6; // change to anything but 7 or 0 to advance
                nextQuestion();
            };
        } else if (mode == 8) {
            // ads
            if (e.keyCode == 13) {
                mode = 6; // change to anything but 7 or 0 to advance
                myVideo.pause();
                if (!musicMuted) {
                    myAudio.play();
                }
                nextQuestion();
            };
        }
    }
}

function doTitleClick() {
    mode = 5;
    nextQuestion();
    animateIntervalID = setInterval(animate, animationSpeed);
    counterAnimateIntervalID = setInterval(animateCounter, animationSpeed);
}

function doTriviaClick() {
    if (nxt == 1) {
        // 2nd click triggers new question
        nxt = 0;
        ans = 0;
        nextQuestion();
    } else {
        // player selects answer
        if (mode == 3 || mode == 6) {
            // kingsQuestions works different
            // check if clicked in an answer
            for (let i = 0; i<4; i++) {
                if (yPosition > (qBaseNum + (i*qSpacing)) && yPosition <= (qBaseNum + qSpacing + (i*qSpacing))) {
                    ans = i+1;
                }
            }
            if (ans > 0) {
                if (ans == rightAns) {
                    score ++;
                    if (mode == 3) {
                        kqQuestionsCorrect ++;
                    } else if (mode == 6) {
                        sq3QuestionsCorrect ++;
                    }
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
                    if (mode == 1) {
                        lsl3QuestionsCorrect ++;
                        str = ansArray[a]
                    } else if (mode == 5) {
                        lsl1vgaQuestionsCorrect ++;
                        str = ansArray[a];
                    } else if (mode == 2) {
                        str = wrapText(questionJson.correct_answer, wrapLen); 
                    }
                    //printText(str, xp, qBaseNum + (qSpacing/2) + (qSpacing*a));
                } else {
                    score --;
                    notPerfect = 1;
                }
                nxt ++;

                if (mode5I >= mode5Arr.length) {
                    // reshuffle
                    mode5I = 0;
                    shuffle(mode5Arr);

                    if (modeCompletionBonus[mode] > 0) {
                        // one time score bonus for seeing all lsl1vga questions
                        score = score + (modeCompletionBonus[mode]*lsl1vgaQuestionsCorrect);
                        modeCompletionBonus[mode] = 0;
                        prevMode = mode;
                        mode = 7;
                    }
                }
                if (mode1I >= mode1Arr.length) {
                    // reshuffle
                    mode1I = 0;
                    shuffle(mode1Arr);
                    
                    if (modeCompletionBonus[mode] > 0) {
                        // one time score bonus for seeing all lsl3 questions
                        score = score + (modeCompletionBonus[mode]*lsl3QuestionsCorrect);
                        modeCompletionBonus[mode] = 0;
                        prevMode = mode;
                        mode = 7;
                    }
                }
            }
        }
    }
}

function nextQuestion() {
    if (gameplayMode == 1) {
        if (debug) {
            mode = 8; // ALWAYS video ads
        } else {
            mode = 6; // ALWAYS sq3 open trivia
        }
    } else if (gameplayMode == 0) {
        let s = questionCount % 40;
        if (mode == 7) {
            // do nothing
        } else if (mode != 7 || mode != 8) {
            if ((questionCount % 10) == 0 && questionCount != 0) {
                // every ten questions do mugshot, until all 8 have been seen.
                // to do: add LSL2 copy protection? LB2CP?
                if (mode4I < mode4Arr.length) {
                    let r = Math.floor(Math.random() * 100);
                    if (r < 25) {
                        mode = 8; // doAd()
                    } else {
                        mode = 4; // pq2mug
                    }
                } else {
                    mode = 8; // doAd()
                }
            } else if (s >= 0 && s < 10) {
                mode = 5; // lsl1vga
            } else if (s > 10 && s < 20) {
                mode = 3; // kingsQuestions
            } else if (s > 20 && s < 30) {
                mode = 1; // lsl3
            } else if (s > 30 && s < 40) {
                mode = 6; // sq3 open trivia
            }
        }
    }
    questionCount ++;
    
    if (mode == 1) {
        qSpacing = 75;
        qBaseNum = 100; // horribily named question y pos
        wrapLen = 30;
        lslQuestion();
    } else if (mode == 6) {
        qSpacing = 50;
        qBaseNum = 80;
        wrapLen = 60;
        otQuestion();
    } else if (mode == 3) {
        qSpacing = 60;
        qBaseNum = 75;
        wrapLen = 40;
        kqQuestion();
    } else if (mode == 4) {
        pqQuestion();
    } else if (mode == 5) {
        qSpacing = 75;
        qBaseNum = 150;
        wrapLen = 45;
        lslQuestion();
    } else if (mode == 7) {
        // do noting
    } else if (mode == 8) {
        doAd();
    }
}

function doAd() {
    let vs = "video/sneakPeek2/" + ads[adsI] + ".mp4";

    myVideo.setAttribute('src', vs);
    myVideo.setAttribute('type', 'video/mp4');
    drawBkgnd();
    ctx.fillStyle = "rgb(0,255,0)";
    let x = 30;
    let y = 40;
    let s = "";
    switch (ads[adsI]) {
        case "alien320":
            s = "Alien Legacy";
            break;
        case "lsl6320":
            s = "Leisure Suit Larry 6";
            x -= 20;
            break;
        case "gk320":
            s = "Gabriel Knight";
            break;
        case "kq7320":
            s = "King's Quest 7";
            break;
        case "phant320":
            s = "Phantasmagoria";
            break;
        case "pq4320":
            s = "Police Quest 4";
            break;
        case "sq6320":
            s = "Space Quest 6";
            break;
        case "tim2320":
            s = "T.I.M. 2";
            break;
        case "aod320":
            s = "Aces of the Deep";
            break;
        case "aotp320":
            s = "A.O.T.P.";
            break;
        case "earth320":
            s = "Earth Siege";
            break;
        case "outp320":
            s = "Outpost";
            break;
        case "base320":
            s = "F.P.S. Baseball";
            break;
        default:
            s = "Sneak Peek 2";
    }
    printText(s,x,y);
    if (!musicMuted) {
        myAudio.pause();
        myAudio2.pause();
    }
    myVideo.play();
    adsI ++; 
    if (adsI >= ads.length) {
        adsI = 0;
        shuffle(ads);
    }
}

function pqQuestion() {
    mugStr = "";
    mugCel = mode4Arr[mode4I];
}

function kqQuestion() {
    ansArray = [];
    // use next shuffled array question
    let r = mode3Arr[mode3I];
    mode3I ++;
    if (mode3I >= mode3Arr.length) {
        // reshuffle
        mode3I = 0;
        shuffle(mode3Arr);
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
    if (mode6I == 0) {
        questionJson = null;
        fetch("https://opentdb.com/api.php?amount=10&type=multiple")
        .then(response => { return response.json(); })
        .then((data) => {
            // Work with JSON data here
            jsonData = data.results;
            questionJson = data.results[0];
            addOTQuestion();
        }).catch(err => {console.log("Error: " + err)});
    } else {
        questionJson = jsonData[mode6I];
        addOTQuestion();
    }
}

function addOTQuestion() {
    ansArray = [];
    ansArray.push(fjson(questionJson.question), wrapLen);
    r = Math.floor(Math.random() * 4);
    let ia = 0;
    for (let i = 0;i<4;i++) {
        if (i == r) {
            ansArray.push(fjson(questionJson.correct_answer));
            rightAns = i+1;
        } else {
            ansArray.push(fjson(questionJson.incorrect_answers[ia]));
            ia ++;
        }
    }
    for (let i=0; i<ansArray.length; i++) {
        console.log(ansArray[i]);
    }
    //console.log("rightAns): " + rightAns);

    mode6I ++;
    if (mode6I >= jsonData.length) {
        mode6I = 0;
    }
}

function lslQuestion() {
    let gm;
    let s;
    ansArray = [];
    //drawBkgnd();
    
    // load questions
    // each lsl3 and lsl1vga text file has five questions
    // first get the next randomized file
    let p;
    switch (mode) {
        case 1:
            gm = "lsl3"
            lsl1vgaQuestionsAsked ++;
            if (mode1J >= 5) {
                shuffle(mode1JArr);
                mode1J = 0;
                mode1I ++;
            }
            p = mode1Arr[mode1I];
            break;
        case 5:
            gm = "lsl1vga"
            lsl3QuestionsAsked ++;
            if (mode5J >= 5) {
                shuffle(mode5JArr);
                mode5J = 0;
                mode5I ++;
            }
            p = mode5Arr[mode5I];
            break;
        default:
    }

    if (mode == 5 && lang != "PL") {
        s = "data/" + lang + "/" + gm + "/" + p + ".tex";
    } else {
        s = "data/" + lang + "/" + gm + "/text." + p;
    }
    if (typeof p !== "undefined") {
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
                    trunk = trunk.replaceAll("\u0161","\u00dc"); // š -> Ü
                    trunk = trunk.replaceAll("\u017d","\u00c4"); // Ž -> Ä
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
                let string = wrapText(temp, wrapLen);
                //printText(string,xp-29,qBaseNum-30);
                rightAns = splitData[q].slice(0,1);
                let adj = 5;
                ansArray.push(wrapText(temp1, wrapLen-adj));
                ansArray.push(wrapText(temp2, wrapLen-adj));
                ansArray.push(wrapText(temp3, wrapLen-adj));
                ansArray.push(wrapText(temp4, wrapLen-adj));
                ansArray.push(string);
                /*for (let i = 0; i < 4; i ++) {
                    printText(ansArray[i], xp, qBaseNum + (qSpacing/2) + (qSpacing*i));
                }
                let la = ["a.", "b.", "c.","d."];
                for (let i = 0; i < 4; i ++) {
                    printText(la[i], xp-29, qBaseNum + (qSpacing/2) + (qSpacing*i));
                }*/
            }
        )
    } else {
        return nextQuestion();
    }
};

