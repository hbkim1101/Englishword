init_position={};

function Click(e){

    if (["d8"].includes(e.id)){
        Move("pawn_w", e.id, 1);
    }
    else if (["a8", "b1", "b7", "d3", "d5", "f3", "f5", "g2", "h1"].includes(e.id)){
        Move("bishop_w", e.id, 1);
    }
    else if (["c6", "d7"].includes(e.id)){
        Move("knight_w", e.id, 1);
    }
    else if (["b2", "c4", "d2", "f7", "g8", "h2"].includes(e.id)){
        Move("queen_w", e.id, 1);
    }
    else if (["h4"].includes(e.id)){
        Move("king_w", e.id, 1);
    }
    else if (["g6"].includes(e.id)){
        Move("pawn_b", e.id, 1);
    }
    else if (["a4", "b3", "c2"].includes(e.id)){
        Move("bishop_b", e.id, 1);
    }
    else if (["f4", "g1", "g5"].includes(e.id)){
        Move("knight_b", e.id, 1);
    }
    else if (["a3", "a7", "a5", "b4", "b6", "c1", "c3", "c7", "c8", "d4", "d6", "f8"].includes(e.id)){
        Move("queen_b", e.id, 1);
    }
    else if (["b5"].includes(e.id)){
        Move("king_b", e.id, 1);
    }
    else if (e.id == "a6"){
        if ($("#step1").prop("checked") == false){
            Move("queen_w", e.id, 1);
        }
        else{
            Move("knight_w", e.id, 1);
        }
    }
    else if (e.id == "h5"){
        if ($("#step2").prop("checked") == false){
            Move("queen_b", e.id, 1);
        }
        else{
            Move("bishop_b", e.id, 1);
        }
    }
}

var doing = {};

function Move(ID, position, type){
    if (doing[ID] == 1){
        return
    }
    ID = '#' + ID;
    position = '#' +position;
    var top = $(position).offset().top + Number($(position).css("width").slice(0,-2))/2 + Number($(position).css("padding").slice(0,-2)) - Number($(ID).css("width").slice(0,-2))/2;
    var left = $(position).offset().left + Number($(position).css("width").slice(0,-2))/2 +  Number($(position).css("padding").slice(0,-2)) - Number($(ID).css("width").slice(0,-2))/2;
    $(ID).css("top", top);
    $(ID).css("left", left);
    if (type == 0){
        init_position[ID.slice(1)] = [top, left];
        doing[ID.slice(1)] = 0;
    }
    else if (type == 1){
        doing[ID.slice(1)] += 1;
        $(ID).css("opacity", 0);
        setTimeout(() => {
            $(ID).css("top", init_position[ID.slice(1)][0]);
            $(ID).css("left", init_position[ID.slice(1)][1]);
            $(ID).css("opacity", 1);
            $(ID).css("transition-duration", "0s, 0s, 0.2s");
            $(ID).css("transition-delay", "0s");
            setTimeout(() => {
                $(ID).css("transition-duration", '');
                $(ID).css("transition-delay", '');
                doing[ID.slice(1)] -= 1;
            }, 200)
        }, 500)
    }
    else{

    }
}