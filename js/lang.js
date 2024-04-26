function langSel(l) {
    ctx.fillStyle = "Green";
    switch (l) {
        case 1:
            lang = "EN";
            wrapLen = 28;
            ctx.font = "30px SQ3font";
            break;
        case 2:
            lang = "SP";
            wrapLen = 35;
            ctx.font = "16px arial";
            break;
        case 3:
            lang = "FR";
            wrapLen = 35;
            ctx.font = "16px arial";
            break;
        case 4:
            lang = "GR";
            wrapLen = 35;
            ctx.font = "16px arial";
            break;
        case 5:
            lang = "PL";
            wrapLen = 35;
            ctx.font = "16px arial";
            break;
        default:
    }

    nextQuestion();

    // indicate langague has changed
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
    printText(str,350,450);
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
            str = "Correct"
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
            str = "Wrong"
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
}