function searchForSpecialChars() {
    lang = "GR";
    let holder = [];
    for (let i = 155; i < 156; i++) {
        let s = "data/" + lang + "/lsl3/text." + i;
        console.log("Searching file: " + s);
        fetch(s)
        //.then(response => response.text())
        .then(response => response.arrayBuffer())
        .then((buffer) => {

                let decoder = new TextDecoder("iso-8859-1");
                let data = decoder.decode(buffer);
                //console.log(data);
                let x2=0;
                for (let x of data) {
                    if (data.charCodeAt(x2) > 0) {
                        console.log("x: " + x + " charat: " + data.charCodeAt(x2));
                        let st = x+" - "+data.charCodeAt(x2).toString(16) + " - " + i;
                        if (!holder.includes(st)) {
                            holder.push(st);
                        }
                    }
                    x2 ++;
                }
                console.log(holder);
            }
        )
    }
}

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
}

function musicOnOff() {
    if (myAudio.paused) {
        myAudio.play();
    } else {
        myAudio.pause();
    }
}

function fjson(text) {
    let s = text.replaceAll("&quot;", "\"");
    s = s.replaceAll("&#039;", "'");
    s = s.replaceAll("&#amp;", "&");
    return s;
}

function wrapText(text, maxWidth) {
    if (text.length >= maxWidth) {
        console.log("maxWidth: " + maxWidth);
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