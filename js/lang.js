function setFont(l) {
    langNum = l;
    switch (l) {
        case 1:
            lang = "EN";
            //wrapLen = 35;
            //ctx.font = "23px SQ3font";
            ctx.font = "26px SQ3font";
            break;
        case 2:
            lang = "SP";
            //wrapLen = 35;
            //ctx.font = "16px arial";
            ctx.font = "26px SQ3font";
            break;
        case 3:
            lang = "FR";
            //wrapLen = 35;
            //ctx.font = "16px arial";
            ctx.font = "26px SQ3font";
            break;
        case 4:
            lang = "GR";
            //wrapLen = 35;
            //ctx.font = "16px arial";
            ctx.font = "26px SQ3font";
            break;
        case 5:
            lang = "PL";
            wrapLen = 35;
            //ctx.font = "16px arial";
            ctx.font = "26px SQ3font";
            break;
        default:
    }
}

function langSel(l) {
    //ctx.fillStyle = "Green";
    setFont(l);
    if (mode != 0) {
        nextQuestion();
    } else {
        if (gameplayMode == 2) {
            printCredits();
        }
    }

    /*/ indicate langague has changed
    ctx.fillStyle = "Black";
    let str;
    switch (l) {
        case 1:
            str = "English";
            break;
        case 2:
            str = "Espa\u00f1ol";
            break;
        case 3:
            str = "Fran\u00e7ais";
            break;
        case 4:
            str = "Deutsch";
            break;
        case 5:
            str = "Polski";
            break;
        default:
    }
    printText(str,350,450);*/
}

function getLangStr(n) {
    let str;
    if (n == 1) { //score
        if (lang == "EN") {
            str = "Score: ".concat(score);
            return str
        } else if (lang == "FR") {
            str = "Score : ".concat(score);
            return str
        } else if (lang == "SP") {
            str = "Puntuaci\u00f3n: ".concat(score);
            return str
        } else if (lang == "GR") {
            str = "Punktzahl: ".concat(score);
            return str
        } else if (lang == "PL") {
            str = "Wynik: ".concat(score);
            return str
        }
    }
    if (n == 2) { // Correct
        if (lang == "EN") {
            str = "Correct";
            return str
        } else if (lang == "FR") {
            str = "Correct";
            return str
        } else if (lang == "SP") {
            str = "Correcto:";
            return str
        } else if (lang == "GR") {
            str = "Stimmt";
            return str
        } else if (lang == "PL") {
            str = "Poprawnie";
            return str
        }

    }
    if (n == 3) { // "Wrong "
        if (lang == "EN") {
            str = "Wrong";
            return str
        } else if (lang == "FR") {
            str = "Faux";
            return str
        } else if (lang == "SP") {
            str = "Incorrecto";
            return str
        } else if (lang == "GR") {
            str = "Falsch";
            return str
        } else if (lang == "PL") {
            str = "\u0179le"; // Źle
            return str
        }
    }
    if (n == 7) { // Police quest bonus string 1
        if (lang == "EN") {
            str = "\"For answering " + pqQuestionsCorrect + 
                    " of " + mode4Arr.length + " mugshot questions correctly";
            return str
        } else if (lang == "FR") {
            str = "\"Pour avoir répondu correctement à " + pqQuestionsCorrect + 
                    " questions sur les photos d'identité judiciaire " + mode4Arr.length;
            return str
        } else if (lang == "SP") {
            str = "\"Por responder correctamente " + pqQuestionsCorrect + 
                    " de " + mode4Arr.length + " preguntas sobre la foto policial";
            return str
        } else if (lang == "GR") {
            str = "\"Für die richtige Beantwortung von " + pqQuestionsCorrect + 
                    " von " + mode4Arr.length + " fragen zu Fahndungsfotos";
            return str
        } else if (lang == "PL") {
            str = "\"Za poprawną odpowiedź na " + pqQuestionsCorrect + 
                    " z " + mode4Arr.length + " pytania dotyczące zdjęć";
            return str
        }
    }
    if (n == 8) { // Police quest bonus string 2
        if (lang == "EN") {
            str = "here is a bonus of " + 
                    (5*pqQuestionsCorrect) + " points.\"";
            return str
        } else if (lang == "FR") {
            str = "voici un bonus de " + 
                    (5*pqQuestionsCorrect) + " points.\"";
            return str
        } else if (lang == "SP") {
            str = "aquí hay una bonificación de " + 
                    (5*pqQuestionsCorrect) + " puntos.\"";
            return str
        } else if (lang == "GR") {
            str = "hier gibt es einen Bonus von " + 
                    (5*pqQuestionsCorrect) + " Punkten.\"";
            return str
        } else if (lang == "PL") {
            str = "oto bonus w wysokości " + 
                    (5*pqQuestionsCorrect) + " punktów.\"";
            return str
        }
    }
    if (n == 9) { // lsl1vga bonus string 1
        if (lang == "EN") {
            str = "\"For answering " + lsl1vgaQuestionsCorrect + 
                    " of " + lsl3QuestionsAsked + " LSL1VGA questions correctly";
            return str
        } else if (lang == "FR") {
            str = "\"Pour avoir répondu correctement à " + lsl1vgaQuestionsCorrect + 
                    " questions sur les photos d'identité judiciaire " + lsl3QuestionsAsked;
            return str
        } else if (lang == "SP") {
            str = "\"Por responder correctamente " + lsl1vgaQuestionsCorrect + 
                    " de " + lsl3QuestionsAsked + " preguntas sobre la foto policial";
            return str
        } else if (lang == "GR") {
            str = "\"Für die richtige Beantwortung von " + lsl1vgaQuestionsCorrect + 
                    " von " + lsl3QuestionsAsked + " fragen zu Fahndungsfotos";
            return str
        } else if (lang == "PL") {
            str = "\"Za poprawną odpowiedź na " + lsl1vgaQuestionsCorrect + 
                    " z " + lsl3QuestionsAsked + " pytania dotyczące zdjęć";
            return str
        }
    }
    if (n == 10) { // lsl1vga bonus string 2
        if (lang == "EN") {
            str = "here is a bonus of " + 
                    (5*lsl1vgaQuestionsCorrect) + " points.\"";
            return str
        } else if (lang == "FR") {
            str = "voici un bonus de " + 
                    (5*lsl1vgaQuestionsCorrect) + " points.\"";
            return str
        } else if (lang == "SP") {
            str = "aquí hay una bonificación de " + 
                    (5*lsl1vgaQuestionsCorrect) + " puntos.\"";
            return str
        } else if (lang == "GR") {
            str = "hier gibt es einen Bonus von " + 
                    (5*lsl1vgaQuestionsCorrect) + " Punkten.\"";
            return str
        } else if (lang == "PL") {
            str = "oto bonus w wysokości " + 
                    (5*lsl1vgaQuestionsCorrect) + " punktów.\"";
            return str
        }
    }
}