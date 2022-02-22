/*공통인 거 묶기*/
function Part_name(p){
    if (part_name == "DAY"){
        p = part_name + ' ' + p.slice(5);
    }
    else if (part_name == "Step"){
        p = part_name + p.slice(4).replace('_',' ');
    }
    return p
}

var test;
var Flatform;
var Q_list;
var Q;
var R = [];

var question, answer, answer_T
var score = 0, init_score, skip_count;
var level;
var opportunity;
var section_start=[];
var section_start_int;
var section_length;
var section_repeat = 0;
var section_repeat_t = false;

var K = [];
var E = []; /*중복 X*/
var E_D = []; /*중복 O*/
var A = {};
var E_I = {};

var S = {};
var W = [], W_a = [];
var part_selected = []; lng_selected = "KOREAN";
var flg;
var dup = -1;
var message = '';

var tst = 0;



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
function deepCopy(obj) {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
  
    let copy = {};
    for (let key in obj) {
      copy[key] = deepCopy(obj[key]);
    }
    return copy;
  }



window.onload = function(){
    level = Number($("#level").val());
    opportunity = Number($("#opportunity").val()) + 1;
}

function Option(){
    if (tst == 0){
        $('#option_window').css("top","40vh");
        $('#option_window').css("transform", "scale(1)");
        $('#option_window').css("transition", "0.5s");
        $('#option_window').children('table').css("opacity", "1");
        $('#option_window').children('table').css("transition", "0.2s");
        $('#option').css("opacity", 0);
        $('#option').css("transition", "0.2s");
        $('#close').css("opacity", 1);
        $('#close').css("transition", "1s");
        tst = 1;
    }
    else{
        $('#option_window').css("top",'');
        $('#option_window').css("transform", '');
        $('#option_window').css("transition", '');
        $('#option_window').children('table').css("opacity", '');
        $('#option_window').children('table').css("transition", '');
        $('#option').css("opacity", '');
        $('#option').css("transition", '');
        $('#close').css("opacity", '');
        $('#close').css("transition", '');
        $(".search_result").detach();
        $("#section_start_search_window").css("display", '');
        $("#section_start_search_window").find("input").val('');
        tst = 0;
    }
}

function Checking(e){
    if ($(e).prop("checked") == true){
        for (t of $(e).parent().children().slice(2)){
            $(t).prop("disabled", false);
        }
        $(e).next().css("color", "black");
        if (e.id == "section"){
            var tag = "<tr><td id='section_repeat_td' style='height:5vh'>\
            <div style='position:relative; width:inherit; height: inherit;'>\
            <input id='section_repeat' type='checkbox' style='position: absolute; top:44%; left: 10.5%; transform: translateY(-50%); z-index: 3;' onchange='section_repeat_t=this.checked;'>\
            <div id='section_title' style='position: absolute; top:46%; left: 15%; transform: translateY(-50%); width: 15vh;'>이전 반복</div>\
            </div></td></tr>"
            $(e).parent().parent().parent().after(tag);
            $(e).parent().parent().css("border-bottom", '0');
        }
    }
    else{
        for (t of $(e).parent().children().slice(2)){
            $(t).prop("disabled", true);
        }
        $(e).next().css("color", "gray");
        if (e.id == "section"){
            $("#section_start").html("시작");
            $("#section_start").css("background-color", '');
            $("#section_start").css("border-color", '');
            $("#section_length").val('');
            $("#section_length").prop("placeholder", "길이");
            section_start=[];
            $("#section_start_search_window").css("display", '');
            $(e).parent().parent().parent().next().detach();
            $(e).parent().parent().css("border-bottom", '');
        }
    }
}

function Selected(ID, T) {
    if ($("#section_start").html() != "시작"){
        $("#section_start").html("시작");
        $("#section_start").css("background-color", '');
        $("#section_start").css("border-color", '');
        $("#section_length").val('');
        $("#section_length").prop("placeholder", "길이");
        section_start=[];
    }
    ID = ID.slice(0,part_name.length+1) +'_' + ID.slice(part_name.length+1);
    if (T == true) {
        part_selected.push(ID);
        part_selected.sort();
    }
    else {
        var idx = part_selected.indexOf(ID);
        part_selected.splice(idx, 1);
    }
    if ($("#section_start_search_window").css("display") == "block"){
        K=[]; E=[]; E_D=[]; E_I=[];
        for (p of part_selected) {
            if (document.getElementById(p) != null) {
                Build_list(p);
            }
        }
        Search($("#section_start_search_window").find("input").val());
    }
}

function Section_start_search(){
    if (Object(part_selected).length == 0){
        alert("선택된 항목이 없습니다.")
        return
    }
    if ($("#section_start_search_window").css("display") == "none"){
        $("#section_start_search_window").css("display", "block");
        $("#section_start_search_window").find("input").focus();
        K=[]; E=[]; E_D=[]; E_I=[];
        for (p of part_selected) {
            if (document.getElementById(p) != null) {
                Build_list(p);
            }
        }
    }
    else{
        $(".search_result").detach();
        $("#section_start_search_window").css("display", '');
        $("#section_start_search_window").find("input").val('');
    }
}

function Search(text){
    $(".search_result").detach();
    if (text == ''){
        return
    }
    if (isNaN(text) == false){
        var num = Number(text)-1;
        if ((num < E_D.length)&&(num >= 0)){
            var Re = $("<tr class='search_result'><td id=search_" + E_D[num] + '|' + E_I[E_D[num]][num] + " onclick='Search_select(this)'>" + E_D[num] + ' ' + Part_name(E_I[E_D[num]][num]) + "</td></tr>");
            $("#section_start_search_window").children("table").append(Re);
        }
    }
    var U = [];
    for (e_d of E_D){
        if (e_d.includes(text)){
            if (U.includes(e_d) == false){
                U.push(e_d)
            }
        }
    }
    U.sort();
    for (u of U){
        for (p of Object.values(E_I[u])){
            var Re = $("<tr class='search_result'><td id=search_" + u.replaceAll(' ', '_') + '|' + p + " onclick='Search_select(this)'>" + u + ' ' + Part_name(p) + "</td></tr>");
            $("#section_start_search_window").children("table").append(Re);
        }
    }
    /*if (E.includes(text)){
        for (p of Object.values(E_I[text])){
            var Re = $("<tr class='search_result'><td id=search_" + text + '|' + p + " onclick='Search_select(this)'>" + text + ' ' + Part_name(p) + "</td></tr>");
            $("#section_start_search_window").children("table").append(Re);
        }
    }*/
}
function Search_select(e){
    if (e == undefined){
        return
    }
    section_start=e.id.slice(7).split('|');
    section_start_int=Number(Object.keys(E_I[section_start[0].replaceAll('_', ' ')])[Object.values(E_I[section_start[0].replaceAll('_', ' ')]).indexOf(section_start[1])]);
    var tag = section_start_int+1;
    $("#section_start").html(tag);
    $("#section_start").css("background-color", "rgb(232 240 254)");
    $("#section_start").css("border-color", "rgb(201 218 248)");
    
    Section_start_search();
    $("#section_length").focus();
}

function START() {
    K=[]; E=[]; E_D=[]; E_I=[]; A=[];
    document.getElementById("question-box").innerHTML = '';
    document.getElementById("input-answer").value = '';
    document.getElementById("input-answer").placeholder = '';

    
    $("#section_start_search_window").css("display", '');
    
    var not_Uld = [];
    if (Object(part_selected).length == 0){
        alert("선택된 항목이 없습니다.")
        return
    }
    if ($("#section").prop("checked") == true){
        if (section_start.length == 0){
            alert("구간을 입력해 주세요.");
            return;
        }
    }
    for (p of part_selected) {
        if (document.getElementById(p) === null) {
            not_Uld.push(p);
        }
    }
    if (not_Uld.length !== 0) {
        var not_uploaded = '※아직 업로드되지 않았습니다.※\n\n';
        if (book_name == "VV2200"){
            for (n of not_Uld) {
                not_uploaded += Part_name(n) + ', ';
                var idx = part_selected.indexOf(n);
                $('#'+n.replace('_', '')).prop("checked", false);
                part_selected.splice(idx, 1);
                $('#'+n.replace('_', '')).next().css("color",'');
            }
        }
        else if (book_name == "ALLTIME"){
            var step1_T = false;
            var step2_T = false;
            for (n of not_Uld) {
                if (n[4] == '1'){
                    step1_T = true;
                }
                else{
                    step2_T = true;
                }
                not_uploaded += Part_name(n) + ', ';
                var idx = part_selected.indexOf(n);
                part_selected.splice(idx, 1);
                $('#'+n.replace('_', '')).prop("checked", false);
                $('#'+n.replace('_', '')).next().css("background-color",'');
            }
            if (step1_T == true){
                $("#step1").prop("checked", false);
                $("#a6").children("label").css("background-color", '');
            }
            if (step2_T == true){
                $("#step2").prop("checked", false);
                $("#h5").children("label").css("background-color", '');
            }
        }

        not_uploaded = not_uploaded.slice(0, not_uploaded.length - 2)
        alert(not_uploaded);
    }
    if (Object(part_selected).length == 0){
        return
    }
    bsi = 0;
    for (p of part_selected) {
        Build_list(p);
    }
    for (i=0;i<E.length;i++){
        Manufact1(E[i], K[i]);
        K[i] = K[i].replaceAll('|', '');
    }

    if (lng_selected=="KOREAN"){
        if ($("#section").prop("checked") == true){
            if (section_start_int+section_length > E_D.length){
                section_length = E_D.length - section_start_int;
                $("#section_length").val(section_length);
            }
            Q = E_D.slice(section_start_int,section_start_int+section_length);
        }
        else{
            Q = E_D.slice();
        }
    }

    score = 0;
    init_score = Q.length;
    skip_count = 0;
    W = [];
    W_a = [];
    shuffle(Q);
    Question();
}

function Build_list(part) {
    var i = 0;
    var Text = document.getElementById(part).contentDocument.getElementsByTagName("pre")[0].innerText;
    Text = Text.split(/\n|\r/);
    var ln = 'E';
    var e, k;
    for (f of Text) {
        if (f === '') {
            break;
        }
        if (ln === 'E') {
            ln = 'K';
            e = f;
        }
        else {
            ln = 'E';
            k = f;
            E_D.push(e);
            if (E.includes(e)){
                if (Object.values(E_I[e]).includes(part)){
                    break
                }
                
                E_I[e][E_D.length-1] = part;
                if (K[E.indexOf(e)] != k){
                    K[E.indexOf(e)] += ' ' + K;
                }
            }
            else{
                E.push(e);
                K.push(k);
                E_I[e] = {};
                E_I[e][E_D.length-1] = part;
            }
        }
    }
}

function Manufact1(eng, kor){
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
            if (eng in A){
                if (lbl in A[eng]){
                    A[eng][lbl].concat(U);
                }
                else{
                    A[eng][lbl] = U;
                }
            }
            else{
                A[eng]={};
                A[eng][lbl] = U;
            }
            break
        }
        else if ((kor[i] == '[') && (['[명]', '[동]', '[형]', '[부]', '[전]', '[구]'].includes(kor.slice(i, i + 3)))){
            if (lbl.length != 0){
                U[j].push(text.slice(0,text.length-1));
                text = '';
                Manufact2(U);
                if (eng in A){
                    if (lbl in A[eng]){
                        A[eng][lbl].concat(U);
                    }
                    else{
                        A[eng][lbl] = U;
                    }
                }
                else{
                    A[eng]={};
                    A[eng][lbl] = U;
                }
                U=[[]];
                j = 0;
            }

            lbl = kor.slice(i, i + 3);
            i += 3;
        }
        else if (kor[i] == ';') {
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
                r1 = T.slice(0, con['()'][0]);
                r2 = T.slice(con['()'][1] + 1);
                r3 = r1 + T.slice(con['()'][0] + 1, con['()'][1]) + r2;
                r4 = r1 + r2;
                r4 = r4.replace('  ', ' ');
                if (r4[0] == ' '){
                    r4 = r4.slice(1);
                }
                if (r4[r4.length-1] == ' '){
                    r4 = r4.slice(0, -1)
                }
                L[k].push(r3);
                L[k].push(r4);
                L[k].splice(t, 1);
                continue;
            }

            if (con['[]'].length != 0) {
                var j = con['[]'][0];
                while (true) {
                    j--;
                    if (T[j] == '|') {
                        break;
                    }
                }
                r1 = T.slice(0, j);
                r2 = T.slice(con['[]'][1] + 1);
                r3 = r1 + T.slice(j + 1, con['[]'][0]) + r2;
                L[k].push(r3);
                for (r of T.slice(con['[]'][0] + 1, con['[]'][1]).split('/')){
                    L[k].push(r1 + r + r2);
                }
                L[k].splice(t, 1);
                continue;
            }
            t++;
        }
    }
}

function Question() {
    document.getElementById("input-answer").placeholder = '';
    if (lng_selected === "KOREAN") {
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
        if (lng_selected === "KOREAN") {
            ans = ans.split(/, |,/);
            T = true;
            var U_T = {};
            var i = 0;
            for (ans_i of ans) {
                var t = false;
                for (a of Object.keys(answer)) {
                    if (i == 0){
                        U_T[a] = [];
                    }
                    for (a_i = 0; a_i < answer[a].length; a_i++) {
                        if (i == 0){
                            U_T[a].push([]);
                        }
                        for (j = 0; j < answer[a][a_i].length; j++){
                            if (i == 0){
                                U_T[a][a_i].push(Number(answer_T[a][a_i][j]));
                            }
                            if (ans_i === answer[a][a_i][j]) {
                                answer_T[a][a_i][j] = 1;
                                t = true;
                                if (i != 0){
                                    break;
                                }
                            }
                        }
                        if (t === true && i != 0) {
                            break;
                        }
                    }
                    if (t === true && i != 0) {
                        break;
                    }
                }
                i++;
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
            if (scr === true) {
                if (T === true){
                    Success()
                }
                else{
                    alert("잘못된 답안이 포함되어 있습니다.")
                    answer_T = U_T;
                }
            }
            else {
                W_a.push(ans);
                var T1 = true;
                var T2 = false;

                message = "오답입니다.\n\n 맞은 개수 / 전체 개수"
                for (t of Object.keys(T_list)){
                    var n_max = 0;
                    for (a  of answer[t]){
                        n_max += a.length;
                    }
                    message += '\n' + t + ":  " + list_Count(T_list[t], true) + " / " + T_list[t].length + '(' + n_max + ')';
                    if (T_list[t].includes(true) == 0){
                        T1 = false;
                    }
                    else{
                        T2 = true;
                    }
                }
                if ((T1 == true) && (level <= 1)){
                    Success();
                }
                else if ((T2 == true) && (level == 0)){
                        Success();
                }
                    
                else{
                    document.getElementById("input-answer").value = '';
                    oprt += 1;
                    if (oprt >= opportunity) {
                        message += "\n\n" + opportunity + "번 모두 실패하셨습니다.";
                        alert(message);
                        return Skip();
                    }
                    else {
                        message += "\n\n남은 기회: " + (opportunity - oprt);
                        alert(message);
                    }
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
        message += K[E.indexOf(Q[0])];
    }
    message += "\n\n정답입니다!";
    alert(message);
    oprt = 0;
    hint = 0;
    score += 1;
    W_a = [];
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
        if ($("#section").prop("checked") == true && section_start_int+section_length < E_D.length){
            message = Part_name(E_I[E_D[section_start_int+section_length]][section_start_int+section_length]);
            message += ' ' + E_D[section_start_int+section_length];
            if (confirm(message)){
                var pre_start = section_start_int;
                var pre_length = section_length;
                section_start_int += section_length;
                section_repeat++;
                if (section_repeat_t == true){
                    if (section_start_int+section_length > E_D.length){
                        section_length = E_D.length - section_start_int;
                    }
                    Q = E_D.slice(section_start_int-section_length, section_start_int+section_length);
                    $("#section_start").html(pre_start+1);
                    $("#section_length").val(pre_length+section_length);
                }   
                else{
                    if (section_start_int+section_length > E_D.length){
                        section_length = E_D.length - section_start_int;
                    }
                    Q = E_D.slice(section_start_int, section_start_int+section_length);
                    $("#section_start").html(section_start_int+1);
                    $("#section_length").val(section_length);
                }
                $("#section_start").css("background-color", "rgb(232 240 254)");
                $("#section_start").css("border-color", "rgb(201 218 248)");
                
                score = 0;
                init_score = Q.length;
                skip_count = 0;
                R = [];
                shuffle(Q)
                Question();
            }
        }
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
        if (Q.length > 1){
            while (true) {
                shuffle(Q);
                if (Q[0] != R[R.length-1]){
                    break
                }
            }
        }
        R = [];
        W = [];
        W_a = [];
        Question();
    }
}

function Skip() {
    if (lng_selected === "ENGLISH") {
        alert("정답: " + answer[0]);
    }
    else if (lng_selected === "KOREAN") {
        alert("정답: " + K[E.indexOf(question)]);
    }
    oprt = 0;
    hint = 0;
    R.push(Q[0]);
    if (lng_selected === "ENGLISH") {
        W.push([question, answer[0], W_a]);
    }
    else if (lng_selected === "KOREAN") {
        W.push([question, K[E.indexOf(question)], W_a]);
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
            answer[0].slice(0, document.getElementById("input-answer").placeholder.length + 1);
    }
    else if (lng_selected === "KOREAN") {
        document.getElementById("input-answer").placeholder =
        K[E.indexOf(question)].slice(0, document.getElementById("input-answer").placeholder.length + 1);
    }
    document.getElementById("input-answer").focus();
}