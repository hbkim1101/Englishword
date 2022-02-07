var part_name = "DAY";

var test;
var Flatform;
var Q;
var Q_dup;
var R = [];
var R_dup = {};
var question, answer, answer_T
var score = 0, init_score, skip_count;
var K = [];
var E = [];
var A = {};
var D = {};
var K_E = {};
var E_K = {};
var K_ans = {};
var E_ans = {};
var S = {};
var W = [], W_a = [];
var part_selected = []; lng_selected = "KOREAN";
var flg;
var dup = -1;
var message = '';

var tst = 0;
function test(){
    if (tst == 0){
        $('#test').css("top","40vh");
        $('#test').css("transform", "scale(1)");
        tst = 1;
    }
    else{
        $('#test').css("top",'');
        $('#test').css("transform", '');
        tst = 0;
    }
}

function Selected(ID, T) {
    ID = ID.slice(0,4) +'_' + ID.slice(4);
    if (T == true) {
        part_selected.push(ID);
        part_selected.sort();
    }
    else {
        var idx = part_selected.indexOf(ID);
        part_selected.splice(idx, 1);
    }
}

function START() {
    document.getElementById("question-box").innerHTML = '';
    document.getElementById("input-answer").value = '';
    document.getElementById("input-answer").placeholder = '';

    var not_Uld = [];
    for (p of part_selected) {
        if (document.getElementById(p) === null) {
            not_Uld.push(p);
        }
    }
    if (not_Uld.length !== 0) {
        var not_uploaded = '※아직 업로드되지 않았습니다.※\n\n';
        for (n of not_Uld) {
            not_uploaded += part_name + ' ' + n.slice(5) + ', ';
            var idx = part_selected.indexOf(n);
            part_selected.splice(idx, 1);
            $('#'+n.replace('_', '')).prop("checked", false);
            $('#'+n.replace('_', '')).next().css("background",'');
        }
        not_uploaded = not_uploaded.slice(0, not_uploaded.length - 2)

        alert(not_uploaded);
    }
    var Text = '';
    for (p of part_selected) {
        Text += document.getElementById(p).contentDocument.getElementsByTagName("pre")[0].innerText;
    }
    Build_list(Text);
    if (lng_selected=="KOREAN"){
        Q = Object.keys(A).slice();
    }
    /*
    Q_dup = { ...D };
    R = [];
    R_dup = {};*/
    score = 0;
    init_score = Q.length;
    skip_count = 0;
    W = [];
    W_a = [];
    shuffle(Q);
    Question();
}

function Build_list(Text) {
    K = []; E = []; K_E = {}; K_ans = {}; S = {};
    var i = 0;
    Text = Text.split(/\n|\r/);
    var ln = 'E';
    var pf;
    for (f of Text) {
        if (f === '') {
            break;
        }
        if (ln === 'E') {
            E.push(f);
            ln = 'K';
            if (lng_selected === "ENGLISH") {
                E_ans[f] = Manufact_E(f);
            }
            pf = f;
        }
        else {
            K.push(f);
            if (pf in K_E) {
                if (typeof (K_E[pf]) === "string") {
                    K_E[f] = [K_E[f], pf];
                    D[f] = '';
                }
                else {
                    K_E[f].push(pf)
                }
            }
            else {
                K_E[f] = pf;
            }

            if (pf in E_K) {
                E_K[pf] = E_K[pf] + ' ' +f;
                console.log(pf);
            }
            else{
                E_K[pf] =f;
            }
            ln = 'E';
            if (lng_selected === "KOREAN") {
                /*K_ans[f] = Manufact_K(f);*/
                Manufact1(pf, E_K[pf]);
            }
        }
    }/*
    var a = 0;
    while (true) {
        if (a >= Object.keys(D).length) {
            break;
        }
        var d = Object.keys(D)[a];
        var dl = K_E[d].length;
        K_E[d] = new Set(K_E[d]);
        K_E[d] = [...K_E[d]];
        dl -= K_E[d].length;
        var c = 0;
        var b = 0;
        while (true) {
            if (c === dl) {
                break;
            }
            if (K[b] === d) {
                K.splice(b, 1);
                c++;
                continue;
            }
            b++;
        }
        if (K_E[d].length === 1) {
            K_E[d] = K_E[d][0];
            delete D[d];
            continue;
        }
        var l = 0;
        while (true) {
            var f = true;
            for (i = 0; i < K_E[d].length; i++) {
                var com = K_E[d][i].slice(0, l);
                var C = K_E[d].slice(0, i).concat(K_E[d].slice(i + 1));
                for (k of C) {
                    if (k.slice(0, l) === com) {
                        f = false;
                    }
                }
            }
            if (f === true) {
                K_E[d].push(l);
                break;
            }
            else {
                l++;
            }
        }
        D[d] = K_E[d];
        a++;
    }*/
}

function Manufact1(eng, kor){
    A[eng]={};
    var i = 0;
    var j = 0;
    var lbl = '';
    var sts = 0;
    var text = '';
    var U = [[]];

    while (true){
        if (i >= kor.length){
            U[j].push(text);
            Manufact2(U);
            A[eng][lbl] = U;
            break
        }
        else if ((kor[i] == '[') && (['[명]', '[동]', '[형]', '[부]', '[전]', '[구]'].includes(kor.slice(i, i + 3)))){
            if (lbl.length != 0){
                U[j].push(text.slice(0,text.length-1));
                text = '';
                Manufact2(U);
                A[eng][lbl] = U;
                U=[[]];
            }

            lbl = kor.slice(i, i + 3);
            i += 3;
        }
        else if (kor[1] == ';') {
            U[j].push(text);
            text = '';
            i++;

            U.push([]);
            j++;
        }
        else if ((kor[i] == ',') && (sts == 0)) {
            U[j].push(text);
            text = '';
            i++;
        }
        else {
            text += kor[i];
            if ((kor[i] == '(') || (kor[i] == '[')) {
                sts = 1;
            }
            else if ((kor[i] == ')') || (kor[i] == ']')) {
                sts = 0;
            }
        }
        i++;
    }
}

function Manufact2(L){
    for (k = 0; k < L.length; k++) {
        var t = 0;
        while (t !== L[k].length) {
            var T = L[k][t]
            var con = { '()': [], '[]': [] };
            var r1, r2, r3, r4;

            var i = 0;
            var f;
            for (f of T) {
                if (f == '(' || f == ')') {
                    con['()'].push(i);
                }
                else if (f == '[' || f == ']') {
                    con['[]'].push(i);
                }
                i++;
            }
            if (con['()'].length != 0) {
                r1 = T.substring(0, con['()'][0]);
                r2 = T.substring(con['()'][1] + 1);
                r3 = r1 + T.substring(con['()'][0] + 1, con['()'][1]) + r2;
                if (con['()'][0] - 1 >= 0 && T[con['()'][0] - 1] == ' ') {
                    r1 = r1.substring(0, r1.length - 1);
                }
                else if (con['()'][1] + 1 < T.length && T[con['()'][1] + 1] == ' ') {
                    r2 = r2.substring(1);
                }
                r4 = r1 + r2;
                L[k].push(r3);
                L[k].push(r4);
                L[k].shift();
                continue;
            }

            if (con['[]'].length != 0) {
                var j = con['[]'][0];
                while (true) {
                    j--;
                    if (T[j] == ' ' || j == 0) {
                        if (j == 0) {
                            j--;
                        }
                        break;
                    }
                }
                r1 = T.substring(0, j + 1);
                r2 = T.substring(con['[]'][1] + 1);
                r3 = r1 + T.substring(j + 1, con['[]'][0]) + r2;
                r4 = r1 + T.substring(con['[]'][0] + 1, con['[]'][1]) + r2;
                L[k].push(r3);
                L[k].push(r4);
                L[k].shift();
                t--;
            }
            t++;
        }
    }
}

function shuffle(array) { array.sort(() => Math.random() - 0.5); }
function Indexof(str, searchvalue) {
    var result = [];
    var i = 0;
    while (i + searchvalue.length <= str.length) {
        if (str.substr(i, searchvalue.length) === searchvalue) {
            result.push(i);
        }
        i++;
    }
    return result;
}
function list_Count(list,value){
    var count = 0;
    for(var i=0; i < list.length; i++) {
        if(list[i] === value){
          count++;
        }
    }
    return count;
}

function Question() {
    document.getElementById("input-answer").placeholder = '';
    if (lng_selected === "ENGLISH") {
        question = Q[0];
        if (typeof (K_E[Q[0]]) === "object") {
            var r = [];
            for (i = 0; i < Q_dup[Q[0]].length - 1; i++) {
                r.push(i);
            }
            shuffle(r);
            dup = r[0];
            answer = E_ans[Q_dup[Q[0]][dup]];
            document.getElementById("input-answer").placeholder = Q_dup[Q[0]][dup].slice(0, Q_dup[Q[0]][Q_dup[Q[0]].length - 1]);
        }
        else {
            dup = -1;
            answer = E_ans[K_E[Q[0]]];
        }
        console.log(answer);
        document.getElementById("question-box").innerHTML = question;
        document.getElementById("input-answer").value = '';
        document.getElementById("input-answer").focus();
    }
    else if (lng_selected === "KOREAN") {
        question = Q[0];
        answer = A[Q[0]];
        answer_T = {};
        for (a of Object.keys(answer)){
            var u = [];
            for (a_i of answer[a]){
                var u_i = [];
                for (i of a_i){
                    u_i.push(0);
                }
                u.push(u_i)
            }
            answer_T[a]=u;
        }
        console.log(answer);
        document.getElementById("question-box").innerHTML = question;
        document.getElementById("input-answer").value = '';
        document.getElementById("input-answer").placeholder = '';
        document.getElementById("input-answer").focus();
    }
}

var oprt = 0;
function Input() {
    var ans = document.getElementById("input-answer").value;
    if (ans === '') {
        message = "총 개수: " + init_score;
        message += "\n남은 개수: " + Q.length;
        alert(message);
    }
    else if (ans === "dvl") {
        document.getElementById("count").style.display = "block";
        setTimeout(function () {
            document.getElementById("count").style.display = "none";
            document.getElementById("develop").innerHTML = '';
        }, 3000);
    }
    else if (ans === 'E') {
        return Enter();
    }
    else if (ans === 'S') {
        if (W_a.length === 0) {
            W_a.push("SKIP");
        }
        skip_count++;
        return Skip();
    }
    else if (ans === 'H') {
        return Hint();
    }
    else {
        if (lng_selected === "ENGLISH") {
            if (answer.includes(ans)) {
                Success()
            }
            else {
                var F_e = true;
                var f_e = false;
                for (a of E_ans[answer[0]]) {
                    if (ans.replace(/ /gi, '') === a.replace(/ /gi, '')) {
                        f_e = true;
                        break;
                    }
                }
                console.log(f_e);
                if (f_e === false) {
                    F_e = false;
                }
                if (F_e === true) {
                    alert("띄어쓰기를 확인해주세요.");
                }
                else {
                    W_a.push(ans);
                    document.getElementById("input-answer").value = '';
                    oprt += 1;
                    if (oprt === 3) {
                        alert("오답입니다.\n\n3번 모두 실패하셨습니다.");
                        return Skip();
                    } else {
                        message = "오답입니다.\n\n남은 기회: " + (3 - oprt);
                        alert(message);
                    }
                }
            }
        }
        else if (lng_selected === "KOREAN") {
            ans = ans.split(/, |,/);
            T = true;
            for (ans_i of ans) {
                var t = false;
                for (a of Object.keys(answer)) {
                    for (a_i = 0; a_i < answer[a].length; a_i++) {
                        for (j = 0; j < answer[a][a_i].length; j++){
                            if (ans_i === answer[a][a_i][j]) {
                                answer_T[a][a_i][j] = 1;
                                t = true;
                                break;
                            }
                        }
                        if (t === true) {
                            break;
                        }
                    }
                    if (t === true) {
                        break;
                    }
                }
                if (t === false) {
                    T = false;
                }
            }
            var scr = true;
            var T_list = {};
            for (a_T of Object.keys(answer_T)) {
                var u = [];
                for (a_t of answer_T[a_T]){
                    if (a_t.includes(1) == 0){
                        scr = false;
                        u.push(false);
                    }
                    else{
                        u.push(true);
                    }
                }
                T_list[a_T]=u;
            }
            console.log(T, scr);
            console.log(T_list);
            if (T === true && scr === true) {
                Success()
            }
            else {
                W_a.push(ans);
                var T = true;

                message = "오답입니다.\n\n 맞은 개수 / 전체 개수"
                for (t of Object.keys(T_list)){
                    var n_max = 0;
                    for (a  of answer[t]){
                        n_max += a.length;
                    }
                    message += '\n' + t + ":  " + list_Count(T_list[t], true) + " / " + T_list[t].length + '(' + n_max + ')';
                    if (T_list[t].includes(true) == 0){
                        T = false;
                    }
                }
                if ((T == true) && (false)){
                    Success();
                }

                document.getElementById("input-answer").value = '';
                oprt += 1;
                if (oprt === 3) {
                    message += "\n\n3번 모두 실패하셨습니다.";
                    alert(message);
                    return Skip();
                }
                else {
                    message += "\n\n남은 기회: " + (3 - oprt);
                    alert(message);
                }
            }
        }
    }
}

function Success() {
    message = '정답: ';
    if (lng_selected === "ENGLISH") {
        message += answer[0];
    }
    else if (lng_selected === "KOREAN") {
        message += E_K[Q[0]];
    }
    message += "\n\n정답입니다!";
    alert(message);
    oprt = 0;
    hint = 0;
    score += 1;
    if (dup !== -1) {
        Q_dup[Q[0]].splice(dup, 1);
    }
    Q.shift();
    if (Q.length === 0) {
        return Complete();
    }
    return Question();
}

function Complete() {
    document.getElementById("question-box").innerHTML = '';
    document.getElementById("input-answer").value = '';
    document.getElementById("input-answer").placeholder = '';
    message = '';
    message += "총 개수: " + init_score + "\n"
    message += "맞힌 개수: " + score;
    if (score === init_score) {
        message += "\n\n모두 맞혔습니다!";
        alert(message);
    }
    else {
        if (skip_count !== 0) {
            message += "\n틀린 개수: " + (init_score - score - skip_count);
            message += "\n넘어간 개수: " + skip_count;
        }
        message += "\n\n계속 하시겠습니까?"
        message += "\n\n※오답 목록※"
        for (U_w of W) {
            message += "\n· " + U_w[0] + " | " + U_w[1];
            message += "  → " + U_w[2].join(", ");
        }
        if (confirm(message)) { }
        else {
            return;
        }
        score = 0;
        init_score = R.length;
        skip_count = 0;
        Q = R.slice();
        Q_dup = { ...R_dup };
        R = [];
        R_dup = {};
        Question();
    }
}

function Skip() {
    if (lng_selected === "ENGLISH") {
        alert("정답: " + answer[0]);
    }
    else if (lng_selected === "KOREAN") {
        alert("정답: " + E_K[Q[0]]);
    }
    oprt = 0;
    hint = 0;
    R.push(Q[0]);
    if (dup !== -1) {
        if (Q[0] in R_dup) {
            R_dup[Q[0]].splice(R_dup[Q[0]].length - 2, 0, Q_dup[Q[0]][dup]);
        }
        else {
            R_dup[Q[0]] = [Q_dup[Q[0]][dup], Q_dup[Q[0]][Q_dup[Q[0]].length - 1]];
        }
        Q_dup[Q[0]].splice(dup, 1);
    }
    if (lng_selected === "ENGLISH") {
        W.push([question, answer[0], W_a]);
    }
    else if (lng_selected === "KOREAN") {
        W.push([question, answer, W_a]);
    }
    Q.shift();
    W_a = [];
    if (Q.length === 0) {
        return Complete();
    }
    return Question();
}
var hint = 0;
function Hint() {
    hint++;
    document.getElementById("input-answer").value = '';
    if (lng_selected === "ENGLISH") {
        document.getElementById("input-answer").placeholder =
            answer[0].substring(0, document.getElementById("input-answer").placeholder.length + 1);
    }
    else if (lng_selected === "KOREAN") {
        document.getElementById("input-answer").placeholder =
            answer.substring(0, document.getElementById("input-answer").placeholder.length + 1);
    }
    document.getElementById("input-answer").focus();
}