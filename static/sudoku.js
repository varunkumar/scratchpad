//test function
function test() {
    alert('Inside Su|do|ku');
}

//Timer functions
var sec=0;
var timerId=0;
var isStopped;

function startTimer() {
    sec=0;
    isStopped=false;
    displayTimer();
    if (!timerId)
        timerId=setTimeout("countUp()",1000);
}

function stopTimer() {
    isStopped=true;
    if(timerId) {
        clearTimeout(timerId);
        timerId=0;
        sec=0;
    }
}

function countUp() {
    if (!isStopped) {
        sec++;
        displayTimer();
        timerID = setTimeout("countUp()", 1000);
    }
}

function displayTimer() {
    var timer=document.getElementById("timer");
    var ss=sec%60;
    var mm=Math.floor(sec/60);
    var hh=Math.floor(mm/60);
    
    mm=mm%60;
    
    if(ss<=9)
        ss="0"+ss;
    else
        ss=ss.toString();
    
    if(mm<=9)
        mm="0"+mm;
    else
        mm=mm.toString();
        
    if(hh<=9)
        hh="0"+hh;
    else
        hh=hh.toString();
    timer.innerHTML=hh + " : " + mm + " : " + ss;
}

// Su|do|ku utility functions
var Template;

function getDataFromCells(read_only) {
    //if read_only, return only read_only cells
    var cells = newCells();
    
    for (var i=0;i<9;i++) {
        for (var j=0;j<9;j++) {
            try {
                var cell=document.getElementById("cell_" + i + "_" + j);
                if (null!=cell) {
                    if (read_only && cell.readOnly)
                        cells[i][j]={value:cell.value, read_only:cell.readOnly};
                    else if (read_only)
                        cells[i][j]={value:0, read_only:false};
                    else
                        cells[i][j]={value:cell.value, read_only:cell.readOnly};
                }
                else
                    cells[i][j]={value:0, read_only:false};
            } catch (e) {
                cells[i][j]={value:0, read_only:false};
            }
        }
    }
    
    return cells;
}

function setDataToCells(cells) {
    for (var i=0;i<9;i++) {
        for (var j=0;j<9;j++) {
            var cell=document.getElementById("cell_" + i + "_" + j);
            if (null!=cell) {
                if(cells[i][j].value != 0)
                    cell.value = cells[i][j].value;
                else
                    cell.value = "";
                cell.readOnly = cells[i][j].read_only;
                if(cells[i][j].read_only)
                    cell.style.backgroundColor = "#E8EEF7";
                else
                    cell.style.backgroundColor = "";
            }
        }
    }
}

function stringify(cells) {
    var str="";
    for (var i=0;i<9;i++) {
        for (var j=0;j<9;j++) {
            str += cells[i][j].value;
        }
        str += "\n";
    }
    return str;
}

//used in generation of new puzzle
function generateTransformer() {
    var values="123456789";
    var seq=[];
    while (values.length > 1) {
        var pos=Math.floor(Math.random()*values.length);
        var data=values.substring(pos,pos+1);
        seq.push(data);
        values=values.replace(data,"");
    }
    seq.push(values);
    return seq;
}

function transformTemplate(template,seq) {
    var result = newCells();
                
    for (var x=0;x<3;x++) {
        for (var y=0;y<3;y++) {
            for (var i=0;i<3;i++) {
                for (var j=0;j<3;j++) {
                    var ind=template[x*3+i][y*3+j].value;
                    result[x*3+i][y*3+j] = {value: seq[--ind], read_only: true};
                }
            }
        }
    }
    return result;
}

function newCells() {
    var cells = new Array();
    for (var i=0;i<9;i++) {
        cells[i] = new Array();
        for (var j=0;j<9;j++) {
            cells[i][j]={value:0, read_only:false, color:"#000000"};
        }
    }
    return cells;
}

//Generate a new probelem
function generate(level) {
    //level 1 -> easy, 2 -> medium, 3 -> hard
    if (null==level)
        level=2;
    if(level<1 || level>3)
        level=2;
    var cells = newCells();
                
    var max=Math.floor(Math.random()*5)+(4-level)*10;
    
    cells[0][1]={value:2, read_only:false, color:"#000000"};
    cells[0][5]={value:5, read_only:false, color:"#000000"};
    cells[0][7]={value:3, read_only:false, color:"#000000"};
    cells[0][8]={value:1, read_only:false, color:"#000000"};
    cells[1][1]={value:3, read_only:false, color:"#000000"};
    cells[1][4]={value:4, read_only:false, color:"#000000"};
    cells[1][7]={value:8, read_only:false, color:"#000000"};
    cells[1][8]={value:7, read_only:false, color:"#000000"};
    cells[2][2]={value:6, read_only:false, color:"#000000"};
    cells[2][7]={value:5, read_only:false, color:"#000000"};
    
    
    var template=solution(cells,false);
    //randomizing the transformation
    do
    {
        var transformer=generateTransformer();
        template.cells=transformTemplate(template.cells,transformer);
    } while (Math.floor(Math.random()*9)!=1);
    Template=template;
    
    cells = newCells();
    var ind=0;
    while(ind<max) {
        var i=Math.floor(Math.random()*9);
        var j=Math.floor(Math.random()*9);
        if (cells[i][j].value == 0) {
            cells[i][j].value=template.cells[i][j].value;
            cells[i][j].read_only=true;
            //cells[i][j].color="#999999";
            ind++;
        }
    }
    
    setDataToCells(cells);
    startTimer();
}

//generate event handler
function generate_click_event(event) {
    var level=getLevel();
    generate(level);
}

//get levels from radio button
function getLevel() {
    var level=2;
    var radio=document.getElementById('chkEasy');
    if(null!=radio) {
        if (radio.checked)
            return 1;
    }
    
    radio=document.getElementById('chkMedium');
    if(null!=radio) {
        if (radio.checked)
            return 2;
    }
    
    radio=document.getElementById('chkhard');
    if(null!=radio) {
        if (radio.checked)
            return 3;
    }
    
    return level;
}

//solve event handler
function solve_click_event(event) {
    if (null!=Template)
       setDataToCells(Template.cells); 
    stopTimer();
}

//Solve the current problem
function solution(data,verbose) {
    
    var cells = newCells();
    //cloning the data;
    for (var i=0;i<9;i++) {
        for (var j=0;j<9;j++) {
            cells[i][j]={value:data[i][j].value, read_only:data[i][j].read_only};
        }
    }
    
    var myStack = [];
    for (var i=0;i<9;i++) {
        for (var j=0;j<9;j++) {
            if (!cells[i][j].read_only) {
                if (null == cells[i][j].possible_values)
                    cells[i][j].possible_values = possible_values(cells,i,j,0);
                
                if(cells[i][j].possible_values.length > 0) {
                    cells[i][j].value = cells[i][j].possible_values.substring(0,1);
                    cells[i][j].possible_values = cells[i][j].possible_values.substring(1);
                    myStack.push({x:i, y:j, possible_values:cells[i][j].possible_values});
                } else {
                    //backtrack
                    cells[i][j].value=0; 
                    cells[i][j].possible_values=null;
                    var obj=myStack.pop();
                    if (null!=obj) {
                        i=obj.x; j=obj.y-1;
                        cells[i][j+1].possible_values=obj.possible_values;
                    } else {
                        if(verbose)
                            alert("No solution!");
                        return {status: 0};
                    }
                }
            }
        }
    }
    
    if (verbose)
        alert("Done!");
    return {status: 1, cells: cells};
}

//find the possible values for a cell
function possible_values(cells, x, y, area) {
    //area = 0->all cases, 1 -> hori, 2 -> vert, 3 -> region
    var values="123456789";
    if (area==1 || area==0) {
        for (var j=0;j<9;j++) {
            values=values.replace(cells[x][j].value,"");
        }
    }
    
    if(area==2 || area==0) {
        for (var i=0;i<9;i++) {
            values=values.replace(cells[i][y].value,"");
        }
    } 
    
    if(area==3 || area==0) {
        var regionX=Math.floor(x/3)*3;
        var regionY=Math.floor(y/3)*3;
        for (var i=regionX;i<regionX+3;i++) {
            for (var j=regionY;j<regionY+3;j++) {
                values=values.replace(cells[i][j].value,"");
            }
        }
    }
    return values;
}

//Check whether the solution is valid
function checkSolution(cells,x,y,area) {
    //area = 0->all cases, 1 -> hori, 2 -> vert, 3 -> region
    if (cells[x][y].value=="0")
        return false;
        
    var values="";
    if (area==1 || area==0) {
        for (var j=0;j<9;j++) {
            if (values.indexOf(cells[x][j].value)!=-1)
                return false;
            values += cells[x][j].value;
        }
    }
    
    values="";
    if(area==2 || area==0) {
        for (var i=0;i<9;i++) {
            if (values.indexOf(cells[i][y].value)!=-1)
                return false;
            values += cells[i][y].value;
        }
    } 
    
    values="";
    if(area==3 || area==0) {
        var regionX=Math.floor(x/3)*3;
        var regionY=Math.floor(y/3)*3;
        for (var i=regionX;i<regionX+3;i++) {
            for (var j=regionY;j<regionY+3;j++) {
                if (values.indexOf(cells[i][j].value)!=-1)
                    return false;
                values += cells[i][j].value;
            }
        }
    }
    return true;
}

//submit event handler
function submit_click_event() {
    var cells=getDataFromCells(false);
    for(var i=0;i<9;i++) {
        for(var j=0;j<9;j++) {
            if (cells[i][j].value != Template.cells[i][j].value) {
                alert("Aah! Something is wrong. Please check.");
                return;
            }
        }
    }
    stopTimer();
    alert("You are done buddy! :-)");
}

// START of UI functions
//key press event handler for each cell
function validate(event) {
    if((event.charCode >= 49 && event.charCode <= 58) || (event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 9))
        return true;
    else
        return false;
}

//create cells
function createCell(x, y, value, border) {
    var textBox = document.createElement("input");
    textBox.id = "cell_" + x + "_" + y;
    if (value != 0)
    {
        textBox.value = value;
        textBox.readOnly="true";
    }
    textBox.type = "text";
    textBox.style.width = "10px";
    textBox.style.height = "18px";
    textBox.style.border = border.toString() + "px solid";
    //textBox.style.borderColor = "#999999";
    textBox.align="center";
    textBox.maxLength = 1;
    textBox.onkeypress = validate;
    textBox.onclick = textBox.select;
    return textBox;
}

//create line break
function createBr() {
    var br = document.createElement("br");
    return br;
}

//create spacer
function createSpacer() {
    var spacer = document.createElement("span");
    spacer.innerHTML = " | ";
    return spacer;
}

//create board
function createBoard(border,txtBorder) {
    var board = document.createElement("table");
    board.style.border = "5px solid #C3D9FF";
    board.cellSpacing="0";
    var innerBoard = new Array(9);
    for (var i=0; i<3; i++) {
        var tr = document.createElement("tr");
        for(var j=0;j<3;j++) {
            innerBoard[i*3+j] = document.createElement("table");
            innerBoard[i*3+j].style.border = "" + border + "px solid #C3D9FF"; //#E0ECFF
            innerBoard[i*3+j].broder = border;
            innerBoard[i*3+j].cellSpacing="-2";
            var row;
            for(var x=0;x<3;x++) {
                row = document.createElement("tr");
                for(var y=0;y<3;y++) {
                    var td=document.createElement("td");
                    td.style.border = "" + txtBorder + "px solid #E0ECFF";
                    td.align="center";
                    td.id="td_" + (i*3)+x + "_" + (j*3)+y;
                    //td.appendChild(createSpacer());
                    td.appendChild(createCell((i*3)+x,(j*3)+y,0,0));
                    //td.appendChild(createSpacer());
                    row.appendChild(td);
                }
                innerBoard[i*3+j].appendChild(row);
            }
            var td=document.createElement("td");
            td.appendChild(innerBoard[i*3+j]);
            tr.appendChild(td);
        }
        board.appendChild(tr);
    }
    return board;
}

//create buttons
function createButtons() {
    var container=document.createElement('div');
    
    var btnGenerate=document.createElement('a');
    btnGenerate.innerHTML="Generate";
    btnGenerate.id="btnGenerate";
    btnGenerate.href="javascript:void(0)";
    btnGenerate.onclick=generate_click_event;
    
    var btnSubmit=document.createElement('a');
    btnSubmit.innerHTML="Submit";
    btnSubmit.id="btnSubmit";
    btnSubmit.href="javascript:void(0)";
    btnSubmit.onclick=submit_click_event;
    
    var btnSolve=document.createElement('a');
    btnSolve.innerHTML="Solve";
    btnSolve.id="btnSolve";
    btnSolve.href="javascript:void(0)";
    btnSolve.onclick=solve_click_event;
    
    container.appendChild(btnSolve);
    container.appendChild(createSpacer());
    container.appendChild(btnSubmit);
    container.appendChild(createSpacer());
    container.appendChild(btnGenerate);
    
    return container;
}

//create text in paras
function createText(txt) {
    var ele=document.createElement("span");
    ele.innerHTML=txt;
    return ele;
}

//create radio buttons for levels
function createLevelChoser() {
    var container=document.createElement('table');
    var row,td;
    
    row=document.createElement('tr');
    td=document.createElement('td');
    var chkEasy=document.createElement('input');
    chkEasy.type='radio';
    chkEasy.id='chkEasy';
    chkEasy.value='Easy';
    chkEasy.name='level';
    td.appendChild(chkEasy);
    row.appendChild(td);
    td=document.createElement('td');
    td.innerHTML='&nbsp;Easy';
    row.appendChild(td);
    container.appendChild(row);
    
    row=document.createElement('tr');
    td=document.createElement('td');
    var chkMedium=document.createElement('input');
    chkMedium.type='radio';
    chkMedium.id='chkMedium';
    chkMedium.value='Medium';
    chkMedium.name='level';
    chkMedium.checked=true;
    td.appendChild(chkMedium);
    row.appendChild(td);
    td=document.createElement('td');
    td.innerHTML='&nbsp;Medium';
    row.appendChild(td);
    container.appendChild(row);
    
    row=document.createElement('tr');
    td=document.createElement('td');
    var chkHard=document.createElement('input');
    chkHard.type='radio';
    chkHard.id='chkHard';
    chkHard.value='Hard';
    chkHard.name='level';
    td.appendChild(chkHard);
    row.appendChild(td);
    td=document.createElement('td');
    td.innerHTML='&nbsp;Hard';
    row.appendChild(td);
    container.appendChild(row);
    
    return container;
}

//create timer
function createTimer() {
    var timer=document.createElement("div");
    timer.id="timer";
    return timer;
}

//init
function init(border,txtBorder) {
    var centerEle = document.createElement("center");
    centerEle.appendChild(createBoard(border,txtBorder));
    centerEle.appendChild(createTimer());
    centerEle.appendChild(createLevelChoser());
    centerEle.appendChild(createBr());
    centerEle.appendChild(createButtons());
    /*centerEle.appendChild(createBr());
    centerEle.appendChild(createText("Varun - I m What I m"));*/
    return centerEle;
}
// END of UI functions