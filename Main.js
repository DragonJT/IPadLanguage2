
function CreateCanvas(){
    var canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    document.body.style.margin = '0px';
    document.body.style.overflow = 'hidden';
    return canvas.getContext('2d');
}

var ctx = CreateCanvas();

function DrawButton(x,y,w,h,name,color){
    var mouseover = mousex > x && mousex < x+w && mousey > y && mousey < y+h;
    if(mouseover){
        ctx.fillStyle = 'white';
        if(mousedown){
            ctx.fillStyle = 'rgb(150,200,255)';
        }
        ctx.fillRect(x,y,w,h);
    }
    var fontSize = Math.floor(h*0.6);
    ctx.fillStyle = color;
    if(mouseover){
        ctx.fillStyle = 'black';
    }
    ctx.font = fontSize+'px Arial';
    ctx.fillText(name, x, y+fontSize);    
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgb(0,100,255)';
    ctx.strokeRect(x,y,w,h);
    return clicked && mouseover;
}

function DrawButtons(buttons){
    var w = Math.ceil(Math.sqrt(buttons.length));
    var h = w;
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
    var deltax = ctx.canvas.width/w;
    var deltay = (ctx.canvas.height/h*0.5);
    var i = 0;
    var result;
    for(var y=0;y<h;y++){
        for(var x=0;x<w;x++){
            if(i<buttons.length){
                if(DrawButton(x*deltax, y*deltay, deltax, deltay, buttons[i].name, buttons[i].color)){
                    result = buttons[i].name;
                }
                i++;

            }
        }
    }
    return result;
}

var mousex;
var mousey;
var clicked;
var mousedown = false;
var text = '';
var run_func;
var running = false;

function CreateButtons(buttons, color){
    return buttons.map(b=>{return {name:b, color}});
}

function GetLowerCase(){
    return CreateButtons(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '_'], 'rgb(200,200,200)');
}

function GetUpperCase(){
    return CreateButtons(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'], 'rgb(255,200,150)');
}

function GetDigit(){
    return CreateButtons(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], 'rgb(200,255,150)');
}

function GetOperator(){
    return CreateButtons(['+', '-', '*', '/', '>', '<'], 'rgb(150,200,255)');
}

function GetPunctuation(){
    return CreateButtons(['(', ')', '{', '}', '[', ']', '=', ';', '.', ',', "'", '"'], 'rgb(200,150,255');
}

function GetWS(){
    return CreateButtons(['tab', 'space', 'new-line', '<-', 'run', 'stop'], 'rgb(255,150,200)');
}

function Update(){
    var button = DrawButtons([...GetLowerCase(), ...GetUpperCase(), ...GetDigit(), ...GetOperator(), ...GetPunctuation(), ...GetWS()]);
    if(button){
        if(button == 'tab'){
            text+='\t';
        }
        else if(button == 'space'){
            text+=' ';
        }
        else if(button == 'new-line'){
            text+='\n';
        }
        else if(button == 'run'){
            run_func = new Function('ctx', text);
            running = true;
        }
        else if(button == 'stop'){
            running = false;
        }
        else if(button == '<-'){
            text=text.substring(0, text.length-1);
        }
        else{
            text+=button;
        }
    }

    var x = 0;
    var y = ctx.canvas.height*0.55;
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    for(var c of text){
        if(c=='\t'){
            x+=ctx.measureText(' ').width*4;
        }
        else if(c=='\n'){
            y+=30;
            x=0;
        }
        else if(c==' '){
            x+=ctx.measureText(' ').width;
        }
        else{
            ctx.fillText(c, x, y);
            x+=ctx.measureText(c).width;
        }
    }

    clicked = false;
    ctx.fillText(clicked+","+mousedown+","+mousex+","+mousey, x, y);
    if(running){
        run_func(ctx);
    }
    requestAnimationFrame(Update);
}

function MouseDown(){
    clicked = true;
    mousedown = true;
}

function MouseUp(){
    mousedown = false;
}

function MouseMove(e){
    mousex = e.clientX;
    mousey = e.clientY;
}

function Resize(){
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}

function TouchStart(e){
    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    mousex = touch.pageX;
    mousey = touch.pageY;
    mousedown = true;
    clicked = true;
}

function TouchEnd(e){
    mousedown = false;
}

addEventListener('mousedown',MouseDown);
addEventListener('mousemove',MouseMove);
addEventListener('mouseup', MouseUp);
addEventListener('touchstart', TouchStart);
addEventListener('touchend', TouchEnd);
addEventListener('resize', Resize);
Update();