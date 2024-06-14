function initAudio() {
    myAudio.src = "audio/0.mp3";
    myAudio.addEventListener("ended", function() {
        let r = prevSong;
        while (r == prevSong ) {
            r = Math.floor(Math.random() * 7);
        }
        myAudio.src = "audio/" + r + ".mp3";
        myAudio.play();
    });

    myVideo.addEventListener("ended", function() {
        score ++;
        nextQuestion();
    });
    myVideo.addEventListener('play', function() {
        var $this = this; //cache
        (function loop() {
        if (!$this.paused && !$this.ended) {
            if (myVideo.src.includes("320")) {
                ctx.drawImage($this, 150, 125);
            } else {
                ctx.drawImage($this, 0, 0);
            }
            setTimeout(loop, 1000 / 30); // drawing at 30fps
        }
        })();
    }, 0);
}

function playJoke() {
    myAudio2.pause(); 
    myAudio2.volume = 0.6;  
    let l = lang;
    if (l == "GR") {
        // German translation exists
    } else {
        l = "EN";
    }
    myAudio2.src = "audio/jokes/" + l + "/"+ jokes[jokesI] + ".mp3";
    myAudio2.play();
    jokesI ++;
    if (jokesI > jokes.length) {
        jokesI = 0;
        shuffle(jokes);
    }
}

function musicOnOff() {
    if (myAudio.paused) {
        myAudio.play();
        musicMuted = 0;
    } else {
        myAudio.pause();
        myAudio2.pause();
        musicMuted = 1;
    }
}

function fjson(text) {
    // fix open trivia strings
    let s = text.replaceAll("&quot;", "\"");
    s = s.replaceAll("&#039;", "'");
    s = s.replaceAll("&amp;", "&");
    s = s.replaceAll("Ã©", "é"); //Ã© charat: 195, © charat: 169
    s = s.replaceAll("&eacute;", "é");
    s = s.replaceAll("&egrave;", "è");
    s = s.replaceAll("&Eacute;", "É");
    s = s.replaceAll("&Egrave;", "È");

    s = s.replaceAll("&aacute;", "á");
    s = s.replaceAll("&agrave;", "à");
    s = s.replaceAll("&auml;", "ä");
    s = s.replaceAll("&Aacute;", "Á");
    s = s.replaceAll("&Agrave;", "À");
    s = s.replaceAll("&Auml;", "Ä");

    s = s.replaceAll("&oacute;", "ó");
    s = s.replaceAll("&ograve;", "ò");
    s = s.replaceAll("&Oacute;", "Ó");
    s = s.replaceAll("&Ograve;", "Ò");

    s = s.replaceAll("&ntilde;", "ñ");
    s = s.replaceAll("&Ntilde;", "Ñ");

    s = s.replaceAll("&deg;", "°");
    s = s.replaceAll("&rdquo;", "\"");
    s = s.replaceAll("&ldquo;", "\"");
    s = s.replaceAll("&rsquo;", "\'");
    s = s.replaceAll("&lsquo;", "\'");

    // letters missin from font: ō
    
    return s;
}

function wrapText(text, maxWidth) {
    if (text.length >= maxWidth) {
        //console.log("maxWidth: " + maxWidth);
        let i = maxWidth;
        let x;
        let pre;
        let post;

        if (text.charAt(i) == " ") {
            // if space at maxWidth 
            x = i;
        } else {
            // else find nearest previous space
            while (text.charAt(i) != " ") {
                i --;
                x = i;
            }
        }
        let fullText = text;
        pre = text.slice(0, x);
        post = text.slice(x+1);
        text = pre + "\n" + post;

        // wrap to a third line if needed
        if (post.length >= maxWidth) {
            i = maxWidth+pre.length+2;
            if (text.charAt(i) == " ") {
                x = i;
            } else {
                while (text.charAt(i) != " ") {
                    i --;
                    x = i;
                    //console.log("text.charAt(i): " + text.charAt(i) +", i: "+i );
                }
            }
            pre = text.slice(0, x);
            post = text.slice(x+1);
            text = pre + "\n" + post;
        }
    }
    return text
}

function printText(text, x ,y) {
    if (typeof text !== 'undefined') {
        let textArray = text.split("\n");
        ctx.fillText(textArray[0], x, y);
        if (typeof textArray[1] !== 'undefined') {
            if (textArray[0] != textArray[1]) {
                ctx.fillText(textArray[1], x, y+18);
            }
        }
        if (typeof textArray[2] !== 'undefined') {
            if (textArray[0] != textArray[2]) {
                ctx.fillText(textArray[2], x, y+36);
            }
        }
    }
}

function setLSL1Color() {
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
}

function shuffle(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  function printCredits() {
    let credStrArray = getCredLang();
    ctx.clearRect(0, 0, c.width, c.height);
    
    let col = 200;
    for (let i = 0; i < credStrArray.length; i++) {
        ctx.fillStyle = "rgb("+(col-(5*i))+", 0, 0)";
        printText(credStrArray[i], 8, (i * 20)+42);
    }
    for (let i = 0; i < credStrArray.length; i++) {
        ctx.fillStyle = "rgb(255, 255, 255)";
        printText(credStrArray[i], 10, (i * 20)+40);
    }
  }

  function getCredLang() {
    let array;
    switch (lang) {
        case "FR":
            array = ["TrivialQuest v0.4.0 Juin 2024",
                "par DoomLazer",
                "",
                "Les questions de sc\u00e8ne SQ3 sont extraites de OpenTDB.com",
                "appels d'API.",
                "LSL3 Questions espagnoles du LSL3PnC de Pakolmo.",
                "LSL1VGA questions en fran\u00e7ais traduites par Hrvg.",
                "LSL3 versions fran\u00e7aise, espagnole, allemande et", 
                "polonaise par Sierra On-Line.",
                "Larry's Casino CyberLarry 2000 Anglais et Allemand",
                "par Sierra On-line.",
                "Un merci sp\u00e9cial \u00e0 Threepwang.",
                "Un merci sp\u00e9cial \u00e0 Sierra On-Line et \u00e0 ses fans.",
                "",
                "Les traductions sont incompl\u00e8tes.",
                "N'h\u00e9sitez pas \u00e0 me contacter si vous \u00eates en mesure",
                "de m'aider \u00e0 les am\u00e9liorer.",
                "",
                "Cliquez pour revenir \u00e0 l'\u00e9cran titre."];
            break;
        default:
            array = ["TrivialQuest v0.4.0 June 2024",
                    "by DoomLazer",
                    "",
                    "\"SQ3 scene\" questions are pulled from OpenTDB.com API calls.",
                    "LSL3 Spanish questions from Pakolmo's LSL3PnC.",
                    "LSL1VGA French questions translated by Hrvg.",
                    "LSL3 French, Spanish, German and Polish versions by Sierra On-Line.",
                    "Larry's Casino CyberLarry 2000 English and German by Sierra On-line.",
                    "Special thanks to Threepwang.",
                    "Extra special thanks to Sierra On-Line and its fans.",
                    "",
                    "Translations are incomplete.",
                    "Please contact me if you're able to help improve them.",
                    "",
                    "Click to return to title screen."];
    }
    return array;
  }