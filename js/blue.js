var board = new Array();
var level = 1;
var clickNum=0;
var historyRec = 0;


documentWidth = 460/level;
cellSideLength = 0.9 * documentWidth ;
cellSpace = 0.05 *documentWidth;
cellInnerSpace = 0.05 *documentWidth;

function getTop(i,j){
	return (cellSpace + i*( 2*cellSpace + cellSideLength )).toFixed(2);
}
function getLeft(i,j){
	return (cellSpace + j*( 2*cellSpace + cellSideLength )).toFixed(2);
}
function getHeight(i,j){
	return cellSideLength.toFixed(2);
}
function levelup(){
	level++;
	if (historyRec<level) {
		historyRec=level;
		$("#historyRec").html("历史最高：LV"+level+"("+clickNum+"click)");		
	}
	documentWidth = 460/level;
	cellSideLength = 0.9 * documentWidth ;
	cellSpace = 0.05 *documentWidth;
}
function changeColor(row,column){
	if(board[row][column] == 1){
		board[row][column] = 0;
		return 'rgb(245, 232, 208)';
	}else{
		board[row][column] = 1;
		return 'rgb(242, 177, 121)';
	}
	
}


function reagin(){
	level = 0;
	clickNum=0;
	board = new Array();
	levelup();
	newgame();
	$("#clickNum").html("点击总数：0");
}
function refresh(){
	for(var i=0;i<board.length;i++){ 
    	for(var j=0;j<board[i].length;j++){ 
    		board[i][j] = 0;
    		$("#"+i+"-"+j).css('background', 'rgb(245, 232, 208)' );
     	}
   	}
}
function rule(){
	alert("游戏规则：\n 1.将所有白色方块翻面到橙色则通过关卡 \n 2.点击方块可将方块翻面   \n 3.每点击一个方块，会将其周围的方块翻面" )
}



$(document).ready(function(){
	newgame();
});

function newgame(){
	
	generateblock();
	
	dianji();
}


function generateblock(){
	var ol = '';
	$("#level").html("当前关卡："+level);
	$("#container").empty();
	for(var i=0; i<level;i++){
		board[i] = new Array();
		for (var j=0;j<level;j++) {
			board[i][j] = 0;
			ol += '<div class="block" id="'+i+'-'+j+'" Row="'+i+'" column="'+j+'" style="top:'+getTop(i,j)+'px;left:'+getLeft(i,j)+'px;height:'+getHeight(i,j)+'px;width:'+getHeight(i,j)+'px;"></div>'
		}
	}
		
	$("#container").append(ol);
}


function dianji(){
	$(".block").click(function(){
		
		clickNum++;
		$("#clickNum").html("点击总数："+clickNum);
		
		var row = $(this).attr("row");
		var column = $(this).attr("column");
		$(this).css('background', changeColor(row,column) );
		
		chainReaction(row,column);
		
		if( isover() ){
			
			alert("恭喜你，通过第"+level+"关！！！");
			levelup();
			newgame();
		}
		
	});
}
	
	
function isover(){
	var count = 0;
	var total = board.length * board.length;
	for(var i=0;i<board.length;i++){ 
    	for(var j=0;j<board[i].length;j++){ 
    		count += board[i][j];
     	}
   	}
	if (count==total) 
		return true;
	else
		return false;
}



function chainReaction(i,j){
	i= parseInt(i);
	j=parseInt(j);
	if(i>0){
		var k=i-1;
		$("#"+k+"-"+j).css('background',  changeColor(k,j) );
	}
	if(i<board.length-1){
		var k=i+1;
		$("#"+k+"-"+j).css('background',  changeColor(k,j) );
	}
	if(j>0){
		var k=j-1;
		$("#"+i+"-"+k).css('background',  changeColor(i,k) );
	}
	if(j<board.length-1){
		var k=j+1;
		$("#"+i+"-"+k).css('background',  changeColor(i,k) );
	}
}





