//variables
let paint = document.querySelector('#paint');
let pA = document.getElementById("paint_area");
paint.height= pA.clientHeight;
paint.width= pA.clientWidth;
let ctx = paint.getContext("2d");//1370x600
console.log(ctx.globalCompositeOperation);
let x = 0;
let y = 0;
let rgb = [250, 0, 0];
let rect = paint.getBoundingClientRect();
let isDrawing = false;
let isDrawingText = false;
let isDrawingImage = false;
let imgData=0;
let frames=[ctx.getImageData(0, 0, pA.clientWidth, pA.clientHeight)];
let presentFrame=0;
let pixel = 0;

//lockedcanvas
let l_canvas = document.querySelector('#locked_frame');
l_canvas.height= pA.clientHeight;
l_canvas.width= pA.clientWidth;
let l_ctx = l_canvas.getContext("2d");
let locked=false;

const buttons=[document.getElementById("Brush"),document.getElementById("Eraser"),
                document.getElementById("Shapes"),document.getElementById("multicolor"),
                document.getElementById("Fill")];

//default values
var activeButton=0;
var shapeSelected="";
var txtfont="Times New Roman"; 
//textentry variables
var textEntry = document.getElementById("textEntry");

var textButton = document.getElementById("txtB");

var span = document.getElementsByClassName("close")[0];

var ok = document.getElementsByClassName("ok")[0];

//imageentry variables
var imageEntry = document.getElementById("imageEntry");

var imageButton = document.getElementById("imgB");

var span_img = document.getElementsByClassName("close1")[0];

var ok_img = document.getElementsByClassName("ok_img")[0];

//Font button variable
var fontBtn = document.getElementById("Fonts");


//slider defaults
slider = document.getElementById("size_in_px");
slider_value = document.getElementById("range_display");
let wheel = 1;
//lets make default width to 1
slider.value=1
slider_value.innerHTML = slider.value;

//let's add the mouse event


paint.addEventListener('wheel', e => {
    if(wheel>=1 && wheel<=20){
        wheel = wheel - (e.deltaY/100);
    }
    if(wheel<1){wheel = 1;}
    else if(wheel>20){wheel=20;}
    slider.value = wheel;
    slider_value.innerHTML = slider.value;
    //console.log(wheel);

})

paint.addEventListener('mousedown', e => {
    
    if(presentFrame!=frames.length-1){
        frames.splice(presentFrame+1,frames.length);
    }
    x = e.clientX - rect.left;
    y = e.clientY - rect.top; // to get the cursor position relative to the canvas
    if(activeButton == 4){
        pixel = ctx.getImageData(x, y, 1, 1);
        var pxData = [pixel.data[0],pixel.data[1],pixel.data[2]]; 
        fillArea(x,y,pxData);
        console.log("filled");
    }
    
    else{
        isDrawing = true;
        isDrawingText = false;
        if(activeButton == 2){
            imgData = ctx.getImageData(0, 0, pA.clientWidth, pA.clientHeight);
        
        }
    }
})

paint.addEventListener('mousemove', e => {
    width = document.getElementById("size_in_px").value;
    if(isDrawing === true){

        if(activeButton != 1 && activeButton != 3){
            style = document.getElementById("color_ip").value;
            //console.log(style);
        }
        else if(activeButton == 1){style = "#000"}
        else if(activeButton == 3){
            var temp_rbg=get_rgb(rgb);
            rgb = temp_rbg;
            style = `rgba(${rgb[0]},${rgb[1]},${rgb[2]})`;
        }    

        //width common for brushes and eraser    
         
        if(activeButton!=2 && activeButton!=5){
            lineDraw(ctx,x,y,e.clientX - rect.left,e.clientY - rect.top,style,width);
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
        else if(activeButton==2){
            
            if(shapeSelected == "Line"){
                
                ctx.putImageData(imgData, 0, 0);
                lineDraw(ctx,x,y,e.clientX - rect.left,e.clientY - rect.top,style,width);
            }
            else if(shapeSelected == "Circle"){
                ctx.putImageData(imgData, 0, 0);
                var r=0;
                if(Math.abs(e.clientX - rect.left-x) > Math.abs(e.clientY - rect.top-y)){
                    r = Math.abs(e.clientX - rect.left-x)
                }
                else{r = Math.abs(e.clientY - rect.top-y)}
                
                circleDraw(ctx,x,y,r,style,width);
            }
            else if(shapeSelected == "Square"){
                ctx.putImageData(imgData, 0, 0);
                w = e.clientX - rect.left-x;
                h = e.clientY - rect.top-y;
                squareDraw(ctx,x,y,w,h,style,width);
            }
        }
 
        
        
        //let's try it
    }
    else if(isDrawingText === true){
        ctx.putImageData(imgData, 0, 0);
        //console.log("px ".concat(txtfont));
        txtWidth = document.getElementById("size_in_px").value*10;
        txtStyle = document.getElementById("color_ip").value;
        textDraw(ctx,e.clientX - rect.left,e.clientY - rect.top,document.getElementById("te").value,txtWidth,"px ".concat(txtfont),txtStyle);
    }
    else if(isDrawingImage === true){
        ctx.putImageData(imgData, 0, 0);
        imgDraw(ctx,e.clientX - rect.left,e.clientY - rect.top,width);
    }
})

paint.addEventListener('mouseup', e => {
    addFrame(ctx.getImageData(0, 0, pA.clientWidth, pA.clientHeight));
    presentFrame=frames.length-1;
    //console.log(presentFrame);
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
    isDrawing = false;
    isDrawingText=false;
    isDrawingImage=false;
    x = 0;
    y = 0;
    if(activeButton == 5){ctx.globalCompositeOperation = 'source-over';}
})
paint.addEventListener('touchstart', e => {
    
    if(presentFrame!=frames.length-1){
        frames.splice(presentFrame+1,frames.length);
    }
    x = e.touches[0].clientX - rect.left;
    y = e.touches[0].clientY - rect.top; // to get the cursor position relative to the canvas
    if(activeButton == 4){
        pixel = ctx.getImageData(x, y, 1, 1);
        var pxData = [pixel.data[0],pixel.data[1],pixel.data[2]]; 
        fillArea(x,y,pxData);
        console.log("filled");
    }
    
    else{
        if(!isDrawingText){
            isDrawing = true;
        }
        //isDrawingText = false;
        if(activeButton == 2){
            imgData = ctx.getImageData(0, 0, pA.clientWidth, pA.clientHeight);
        
        }
    }
})

paint.addEventListener('touchmove', e => {

    if(isDrawing === true){

        width = document.getElementById("size_in_px").value;


        if(activeButton != 1 && activeButton != 3){
            style = document.getElementById("color_ip").value;
            //console.log(style);
        }
        else if(activeButton == 1){style = "#000";}
        else if(activeButton == 3){
            var temp_rbg=get_rgb(rgb);
            rgb = temp_rbg;
            style = `rgba(${rgb[0]},${rgb[1]},${rgb[2]})`;
        }    


        
        if(activeButton!=2 && activeButton!=5){
            lineDraw(ctx,x,y,e.touches[0].clientX - rect.left,e.touches[0].clientY - rect.top,style,width);
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        }
        else if(activeButton==2){
            
            if(shapeSelected == "Line"){
                
                ctx.putImageData(imgData, 0, 0);
                lineDraw(ctx,x,y,e.touches[0].clientX - rect.left,e.touches[0].clientY - rect.top,style,width);
            }
            else if(shapeSelected == "Circle"){
                ctx.putImageData(imgData, 0, 0);
                var r=0;
                if(Math.abs(e.touches[0].clientX - rect.left-x) > Math.abs(e.touches[0].clientY - rect.top-y)){
                    r = Math.abs(e.touches[0].clientX - rect.left-x)
                }
                else{r = Math.abs(e.touches[0].clientY - rect.top-y)}
                
                circleDraw(ctx,x,y,r,style,width);
            }
            else if(shapeSelected == "Square"){
                ctx.putImageData(imgData, 0, 0);
                w = e.touches[0].clientX - rect.left-x;
                h = e.touches[0].clientY - rect.top-y;
                squareDraw(ctx,x,y,w,h,style,width);
            }
        }
 
        
        
        //let's try it
    }
    else if(isDrawingText === true){
        ctx.putImageData(imgData, 0, 0);
        //console.log("px ".concat(txtfont));
        txtWidth = document.getElementById("size_in_px").value*10;
        txtStyle = document.getElementById("color_ip").value;
        textDraw(ctx,e.touches[0].clientX - rect.left,e.touches[0].clientY - rect.top,document.getElementById("te").value,txtWidth,"px ".concat(txtfont),txtStyle);
    }
})

paint.addEventListener('touchend', e => {
    addFrame(ctx.getImageData(0, 0, pA.clientWidth, pA.clientHeight));
    presentFrame=frames.length-1;
    //console.log(presentFrame);
    x = e.touches[0].clientX - rect.left;
    y = e.touches[0].clientY - rect.top;
    isDrawing = false;
    isDrawingText = false;
    x = 0;
    y = 0;
    if(activeButton == 5){ctx.globalCompositeOperation = 'source-over';}
})

//Now we will add the function for different button
function brush(){
    active(0);
    
}
function multicolor(){
    active(3);
}
function eraser(){
    active(1);
    
}
function fill(){
    active(4);
}
function Clear(){
    ctx.clearRect(0,0,paint.width,paint.height);
    addFrame(ctx.getImageData(0, 0, pA.clientWidth, pA.clientHeight));
    presentFrame=frames.length-1;
}

function Line(){
    shapeSelected="Line";
    active(2);
}

function Circle(){
    shapeSelected="Circle";
    active(2);
}

function Square(){
    shapeSelected="Square";
    active(2);
}
function get_rgb(rgba){
    var arr=rgba
    if(arr[0] == 250 && arr[1]!=250 && arr[2]==0){
        arr[1]+=5;
    }
    else if(arr[1] == 250 && arr[0]!=0){
        arr[0]-=5;
    }
    else if(arr[1] == 250 && arr[2]!=250){
        arr[2]+=5;
    }
    else if(arr[2] == 250 && arr[1]!=0){
        arr[1]-=5;
    }
    else if(arr[2] == 250 && arr[0]!=250){
        arr[0]+=5;
    }
    else if(arr[0] == 250 && arr[2]!=0){
        arr[2]-=5;
    }
    return arr;
}
//undo/redo can be done not more than 5 times
function undo(){
    if(presentFrame!=0){
        presentFrame-=1;
        ctx.putImageData(frames[presentFrame], 0, 0);
    }
    else{alert("limit exceeded");}
}

function redo(){
    if(presentFrame!=5){
        presentFrame+=1;
        ctx.putImageData(frames[presentFrame], 0, 0);
    }
    else{alert("limit exceeded");}
}
function setFont(fnt){
    fontBtn.style.fontFamily = fnt;
    if(fnt == 'Lobster, cursive' || fnt == 'Times New Roman'){
        fontBtn.style.fontSize = "18px";    
    }
    else{
    fontBtn.style.fontSize = "15px";
    }
    txtfont = fnt;
}
function addFrame(fr){
    frames.push(fr);
    if(frames.length == 7){frames.shift()}

}
function lineDraw(ctx,x1,y1,x2,y2,styleColor,wd){
    
    ctx.beginPath();
    ctx.strokeStyle = styleColor;
    if(styleColor == "#000"){ 
        ctx.lineWidth = wd*5;
        ctx.globalCompositeOperation='destination-out';
    }
    else{
        ctx.lineWidth = wd;
        ctx.globalCompositeOperation='source-over';
    }
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.lineCap = ctx.lineJoin = 'round';
    ctx.shadowColor = styleColor;
    ctx.stroke();
    ctx.closePath();
}
function circleDraw(ctx,x,y,radius,styleColor,wd){
    ctx.beginPath();
    ctx.strokeStyle = styleColor;
    ctx.lineWidth = wd;
    ctx.arc(x,y,radius,0,2*Math.PI);
    ctx.lineCap = ctx.lineJoin = 'round';
    ctx.shadowColor = styleColor;
    ctx.stroke();
    ctx.closePath();
}
function squareDraw(ctx,x,y,w,h,styleColor,wd){
    ctx.beginPath();
    ctx.strokeStyle = styleColor;
    ctx.lineWidth = wd;
    ctx.rect(x, y, w, h);
    ctx.lineCap = ctx.lineJoin = 'round';
    ctx.shadowColor = styleColor;
    ctx.stroke();
}
function textDraw(ctx,x,y,txt,wd,font,styleColor){
    fontstyle = wd.toString().concat(font);
    ctx.font = fontstyle;
    ctx.fillStyle = styleColor;
    ctx.fillText(txt, x, y);
}

function imgDraw(ctx,x,y,wd){
    var tempimg = document.getElementById("img");
    ctx.drawImage(tempimg,x,y, (tempimg.width/10)*wd , (tempimg.height/10)*wd );
}

function active(n){
    buttons[activeButton].classList.remove("active");
    buttons[n].classList.add("active");
    activeButton = n;
}

slider.oninput = function() {
  slider_value.innerHTML = this.value;  
}

textButton.onclick = function() {
  textEntry.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  textEntry.style.display = "none";
}
  
ok.onclick = function() {
  textEntry.style.display = "none";
  imgData=ctx.getImageData(0,0,pA.clientWidth, pA.clientHeight);
  isDrawingText = true;
  //console.log(document.getElementById("te").value);
}

imageButton.onclick = function() {
  imageEntry.style.display = "block";
}

span_img.onclick = function() {
  imageEntry.style.display = "none";
}

ok_img.onclick = function() {
  imageEntry.style.display = "none";
  imgData=ctx.getImageData(0,0,pA.clientWidth, pA.clientHeight);
  isDrawingImage = true;
  //console.log(document.getElementById("imge").value);
}

function download(){
    const D_img = paint.toDataURL();
    const link = document.createElement("a");
    link.href = D_img;
    link.download = "canvas.png";
    link.click();
}

function fillArea(cx,cy,data){
    
    ctx.fillStyle = document.getElementById("color_ip").value;
    ctx.fillRect(cx,cy,1,1);
    fillup(cx,cy,data);
    filldown(cx,cy,data);
    fillleft(cx,cy,data);
    fillright(cx,cy,data);
    fillleftup(cx,cy,data);
    fillrightup(cx,cy,data);
    fillleftdown(cx,cy,data);
    fillrightdown(cx,cy,data);


    function fillup(x,y,data){
        if(x>0 && y>0 && x<1360 && y<600){
            var temppx=ctx.getImageData(x,y-1,1,1).data;
            if(areEqual(temppx,data)){
                ctx.fillRect(x,y-1,1,1);
                fillup(x,y-1,data);
            }
        }
    }
    function filldown(x,y,data){
        if(x>0 && y>0 && x<1360 && y<600){
            var temppx=ctx.getImageData(x,y+1,1,1).data;
            if(areEqual(temppx,data)){
                ctx.fillRect(x,y+1,1,1);
                filldown(x,y+1,data);
            }
        }
    }
    function fillleft(x,y,data){
        if(x>0 && y>0 && x<1360 && y<600){
            var temppx=ctx.getImageData(x-1,y,1,1).data;
            if(areEqual(temppx,data)){
                ctx.fillRect(x-1,y,1,1);
                fillleft(x-1,y,data);
            }
        }
    }
    function fillright(x,y,data){
            if(x>0 && y>0 && x<1360 && y<600){
            var temppx=ctx.getImageData(x+1,y,1,1).data;
            if(areEqual(temppx,data)){
                ctx.fillRect(x+1,y,1,1);
                fillright(x+1,y,data);
            }

        }
    }
    function fillrightup(x,y,data){
            if(x>0 && y>0 && x<1360 && y<600){
            var temppx=ctx.getImageData(x+1,y-1,1,1).data;
            if(areEqual(temppx,data)){
                ctx.fillRect(x+1,y-1,1,1);
                fillup(x+1,y-1,data);
                fillright(x+1,y-1,data);
                fillrightup(x+1,y-1,data);
            }
            else{
                fillup(x+1,y-1,data);
                fillright(x+1,y-1,data);
            }
        }
    }
    function fillleftup(x,y,data){
            if(x>0 && y>0 && x<1360 && y<600){
            var temppx=ctx.getImageData(x-1,y-1,1,1).data;
            if(areEqual(temppx,data)){
                ctx.fillRect(x-1,y-1,1,1);
                fillup(x-1,y-1,data);
                fillleft(x-1,y-1,data);
                fillleftup(x-1,y-1,data);
            }
            else{
                fillup(x-1,y-1,data);
                fillleft(x-1,y-1,data);
            }
        }
    }
    function fillrightdown(x,y,data){
        if(x>0 && y>0 && x<1360 && y<600){
            var temppx=ctx.getImageData(x+1,y+1,1,1).data;
            if(areEqual(temppx,data)){
                ctx.fillRect(x+1,y+1,1,1);
                filldown(x+1,y+1,data);
                fillright(x+1,y+1,data);
                fillrightdown(x+1,y+1,data);
            }
            else{
                fillright(x+1,y+1,data);
                filldown(x+1,y+1,data);
            }
        }
    }
    function fillleftdown(x,y,data){
            if(x>0 && y>0 && x<1360 && y<600){
            var temppx=ctx.getImageData(x-1,y+1,1,1).data;
            if(areEqual(temppx,data)){
                ctx.fillRect(x-1,y+1,1,1);
                fillleft(x-1,y+1,data);
                filldown(x-1,y+1,data);
                fillleftdown(x-1,y+1,data);
            }
            else{
                fillleft(x-1,y+1,data);
                filldown(x-1,y+1,data);
            }
        }
    }
    function areEqual(x,y){
        if(x[0]==y[0] && x[1]==y[1] && x[2]==y[2]){return true;}
        else{return false;}    
    }
}
function preview(input){
    var reader = new FileReader();
    reader.onload = function(e){
        document.getElementById("imgview").setAttribute("src",e.target.result);
        document.getElementById("img").setAttribute("src",e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
}


function lock_unlock(){
    
    if(!locked){
        console.log(locked)
        temp_img=ctx.getImageData(0,0,pA.clientWidth, pA.clientHeight);
        l_ctx.putImageData(temp_img,0,0);

        locked=true;
        document.getElementById("lu").innerHTML='<i class="fas fa-lock"></i>';
    }
    else{
        console.log(locked)
        temp_img=l_ctx.getImageData(0,0,pA.clientWidth, pA.clientHeight);
        temp_img2=ctx.getImageData(0,0,pA.clientWidth, pA.clientHeight);
        l_ctx.clearRect(0,0,l_canvas.width,l_canvas.height);
        ctx.putImageData(temp_img,0,0);
        //ctx.globalCompositeOperation='destination-over';
        //ctx.putImageData(temp_img2,0,0);
        //ctx.globalCompositeOperation='source-over';
        locked=false;
        document.getElementById("lu").innerHTML='<i class="fas fa-lock-open"></i>';
    }
}




//Bucket fill algo-1
/*
function fillArea(cx,cy,data){
    
    ctx.fillStyle = document.getElementById("color_ip").value;
    var temppx=ctx.getImageData(cx,cy,1,1).data;
    if(areEqual(temppx,data)){
        ctx.fillRect(cx,cy,1,1);
        fillArea(cx-1,cy-1,data);
        fillArea(cx,cy-1,data);
        fillArea(cx+1,cy-1,data);
        fillArea(cx-1,cy,data);
        fillArea(cx,cy,data);
        fillArea(cx,cy+1,data);
        fillArea(cx-1,cy+1,data);
        fillArea(cx,cy+1,data);
        fillArea(cx+1,cy+1,data);
    }



    function areEqual(x,y){
        if(x[0]==y[0] && x[1]==y[1] && x[2]==y[2]){return true;}
        else{return false;}    
    }
}

*/


//BUCKET FILL ALGO-2
/*
function fillArea(cx,cy,data){
    var stack = [[cx,cy]];
    while(stack.length){
        var top = getTop(stack[0],data);
        //console.log(cx,cy,top[0],top[1]);
        fillandupdate(top,data);
        stack.shift();
    }
    function areEqual(x,y){
        if(x[0]==y[0] && x[1]==y[1] && x[2]==y[2]){return true;}
        else{return false;}    
    }
    function getTop(start,ar){
        //var temppx = ctx.getImageData(start[0],start[1],1,1);
        //var temparr = [temppx.data[0],temppx.data[1],temppx.data[2]];
        loop=true;
        var tempy = start[1];
        var temparr = [];
        temparr.push(ar[0]);
        temparr.push(ar[1]);
        temparr.push(ar[2]);
        while(areEqual(temparr,ar) && loop){
            if(tempy>0){
                tempy=tempy-1;
            }
            else{loop = false;}
            var temppx = ctx.getImageData(start[0],tempy,1,1);
            temparr[0] = temppx.data[0];
            temparr[1] = temppx.data[1];
            temparr[2] = temppx.data[2];
        }
        left=ctx.getImageData(start[0]-1,tempy,1,1);
        right=ctx.getImageData(start[0]+1,tempy,1,1);
        if(areEqual(left,ar)){
            stack.push([start[0]-1,tempy]);
        }
        if(areEqual(right,ar)){
            stack.push([start[0]+1,tempy]);
        }
        return [start[0],tempy+1];
    }
    function fillandupdate(px,ar){
        ctx.fillStyle = document.getElementById("color_ip").value;
        var leftcheck = false;
        var rightcheck = false;
        var tempy = px[1];
        var temparr = [];
        temparr.push(ar[0]);
        temparr.push(ar[1]);
        temparr.push(ar[2]);
        while(areEqual(temparr,ar)){
            ctx.fillRect(px[0],px[1],1,1);

            if(checkleft(px,ar)){stack.push([px[0]-1,tempy]);}
            if(checkright(px,ar)){stack.push([px[0]+1,tempy]);}
            tempy=tempy+1;
            var temppx = ctx.getImageData(px[0],tempy,1,1);
            temparr[0] = temppx.data[0];
            temparr[1] = temppx.data[1];
            temparr[2] = temppx.data[2];
        }
        function checkleft(a,ar){
            var left = ctx.getImageData(a[0]-1,a[1],1,1).data;

            var leftup = ctx.getImageData(a[0]-1,a[1]-1,1,1).data;
            if(areEqual(left,ar) && !(areEqual(leftup,ar))){return true;}
            return false;
        }
        function checkright(a,ar){
            var right = ctx.getImageData(a[0]+1,a[1],1,1).data;
            var rightup = ctx.getImageData(a[0]+1,a[1]-1,1,1).data;
            if(areEqual(right,ar) && !(areEqual(rightup,ar))){return true;}
            return false;
        }
    }
}
*/
