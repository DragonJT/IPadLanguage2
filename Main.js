
function CreateCanvas(){
    var canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    document.body.style.margin = '0px';
    document.body.style.overflow = 'hidden';
    return canvas.getContext('2d');
}

function FileLoader(oninput){
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => { 
        var file = e.target.files[0]; 
        var reader = new FileReader()
        reader.onload = function() {
            oninput(reader.result);
        }
        reader.readAsText(file)
    }
    input.click();
}

function FileSaver(filename, text){
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function Load(){
    FileLoader(f=>{
        cursor = 0; 
        text = f;
    });
}

function Save(){
    FileSaver('file.png', text);
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
var run_obj;
var cursor = 0;

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
    return CreateButtons(['tab', 'space', 'new-line', '<-', 'run', 'stop', 'left-arrow', 'right-arrow', 'fast-left', 'fast-right', 'save', 'load'], 'rgb(255,150,200)');
}

function Update(){
    function Insert(c){
        text = text.substring(0, cursor) + c + text.substring(cursor);
        cursor+=c.length;
    }

    function Backspace(){
        if(cursor > 0){
            text = text.substring(0, cursor-1) + text.substring(cursor);
            cursor--;
        }
    }

    var button = DrawButtons([...GetLowerCase(), ...GetUpperCase(), ...GetDigit(), ...GetOperator(), ...GetPunctuation(), ...GetWS()]);
    if(button){
        if(button == 'tab'){
            Insert('\t');
        }
        else if(button == 'space'){
            Insert(' ');
        }
        else if(button == 'left-arrow'){
            if(cursor>0){
                cursor--;
            }
        }
        else if(button == 'right-arrow'){
            if(cursor<text.length){
                cursor++;
            }
        }
        else if(button == 'fast-left'){
            cursor-=10;
            if(cursor<0){
                cursor = 0;
            }
        }
        else if(button == 'fast-right'){
            cursor+=10;
            if(cursor>text.length){
                cursor = text.length;
            }
        }
        else if(button == 'save'){
            Save();
        }
        else if(button == 'load'){
            Load();
        }
        else if(button == 'new-line'){
            Insert('\n');
        }
        else if(button == 'run'){
            run_obj = new Function('ctx', text)(ctx);
        }
        else if(button == 'stop'){
            run_obj = undefined;
        }
        else if(button == '<-'){
            Backspace();
        }
        else{
            Insert(button);
        }
    }

    var x = 0;
    var y = ctx.canvas.height*0.55;
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    var i = 0;
    if(cursor==0){
        ctx.fillStyle = 'white';
        ctx.fillRect(x,y,2,18);
    }
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
            ctx.fillText(c, x, y+18);
            x+=ctx.measureText(c).width;
        }
        i++;
        if(i==cursor){
            ctx.fillStyle = 'white';
            ctx.fillRect(x,y,2,18);
        }
    }

    clicked = false;
    if(run_obj && run_obj.Update){
        run_obj.Update();
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
    mousex = e.pageX;
    mousey = e.pageY;
    mousedown = true;
    clicked = true;
}

function TouchEnd(){
    mousex = undefined;
    mousey = undefined;
    mousedown = false;
}

addEventListener('mousedown',MouseDown);
addEventListener('mousemove',MouseMove);
addEventListener('mouseup', MouseUp);
addEventListener('touchstart', TouchStart);
addEventListener('touchend', TouchEnd);
addEventListener('resize', Resize);

addEventListener('dragover', (e) => {
    e.preventDefault()
});
addEventListener('drop', (e) => {
    if(e.dataTransfer){
        var file = e.dataTransfer.files[0];
        var reader = new FileReader()
        reader.onload = function() {
            cursor = 0; 
            text = reader.result;
        }
        reader.readAsText(file)
        e.preventDefault()
    }
});

Update();