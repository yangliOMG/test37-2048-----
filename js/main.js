var board = new Array();
var hasConflicted = new Array();

$(document).ready(function(){
	prepareForMobile();
	newgame();
});

function prepareForMobile(){

    if( documentWidth > 500 ){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }

    $('#grid-container').css('width',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
}

function newgame(){
	init();
	
	generateOneNumber();
	generateOneNumber();
}


function init(){ ///背景块位置
	for( var i=0; i<4 ; i++){
		for(var j=0; j<4 ; j++){
			
			var gridCell = $("#grid-cell-"+i+"-"+j);
			gridCell.css('top', getPosTop(i,j));
			gridCell.css('left', getPosLeft(i,j));
		}
	}
	
	for( var i=0; i<4 ; i++){
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for(var j=0; j<4 ; j++){
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}
		
	}
	updateBoardView();
}


function updateBoardView(){//刷新各个格子数字
	$('.number-cell').remove();
	for( var i=0; i<4 ; i++){
		for(var j=0; j<4 ; j++){
			$('#grid-container').append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell = $('#number-cell-'+i+'-'+j);

			if(board[i][j]==0 ){ //初始化数字格
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPosTop(i,j)+50);
				theNumberCell.css('left',getPosLeft(i,j)+50);
			}else{
				theNumberCell.css('width',cellSideLength);
				theNumberCell.css('height',cellSideLength);
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ));
				theNumberCell.css('color',getNumberColor( board[i][j] ));
				theNumberCell.text( board[i][j] );
				
				if ( board[i][j] >1000)
					theNumberCell.css('font-size','42px');
			}
			
			hasConflicted[i][j] = false;
		}
	}
}

function generateOneNumber(){
		
		if( nospace( board ))
			return false;
		
		//随机一个位置
		var randx = parseInt( Math.floor(Math.random() *4) );
		var randy = parseInt( Math.floor(Math.random() *4) );
		
		
		var times = 0;
	   	while( times < 50 ){
	        if( board[randx][randy] ==0 )
	            break;
	
	        randx = parseInt( Math.floor( Math.random()  * 4 ) );
	        randy = parseInt( Math.floor( Math.random()  * 4 ) );
	
	        times ++;
	    }
	    if( times == 50 ){
	        for( var i = 0 ; i < 4 ; i ++ )
	            for( var j = 0 ; j < 4 ; j ++ ){
	                if( board[i][j] == 0 ){
	                    randx = i;
	                    randy = j;
	                }
	            }
	    }
      
		
		//随机一个数字
		var randNumber = Math.random() <0.5 ? 2:1;
		
		//显示
		board[randx][randy] = randNumber;
		showNumberWithAnimation( randx, randy, randNumber );
	return true;
	
}


$(document).keydown(function(event){
	event.preventDefault();////!!!!!!!!!!!!!!!!!!
	switch( event.keyCode){
		case 37:
			if( moveLeft() ){
				setTimeout( "generateOneNumber()" , 200);
			}
			isgameover();
			break;
		case 38:
			if( moveTop() ){
				setTimeout( "generateOneNumber()" , 200);
			}
			isgameover();
			break;
		case 39:
			if( moveRight() ){
				setTimeout( "generateOneNumber()" , 200);
			}
			isgameover();
			break;
		case 40:
			if( moveDown() ){
				setTimeout( "generateOneNumber()" , 200);
			}
			isgameover();
			break;
		default:
			break;
	}
});

//----------兼容手机
document.addEventListener('touchstart',function(event){
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});
document.addEventListener('touchend',function(event){
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;

    if( Math.abs( deltax ) < 0.1*documentWidth && Math.abs( deltay ) < 0.1*documentWidth )
        return;

    if( Math.abs( deltax ) >= Math.abs( deltay ) ){

        if( deltax > 0 ){
            //move right
            if( moveRight() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
        else{
            //move left
            if( moveLeft() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }
    else{
        if( deltay > 0 ){
            //move down
            if( moveDown() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
        else{
            //move up
            if( moveTop() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }
});
//---------------

function isgameover(){
	if( !canMoveLeft(board) && !canMoveTop(board) && !canMoveRight(board) && !canMoveDown(board) )
		setTimeout( alert("gameover") , 200);
}




function moveLeft(){
	if( !canMoveLeft(board) )
		return false;
	
	for( var i=0; i<4 ; i++){
		for(var j=1; j<4 ; j++){
			if( board[i][j] != 0 ){
				
				for( var k = 0; k<j; k++){
					if( board[i][k]==0 && noBlockHorizontal(i,k,j,board) ){
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if( board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k] ){
						showMoveAnimation(i,j,i,k);
						board[i][k] += board[i][j];
						board[i][j] =0;
						
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout( "updateBoardView()" , 200);
	return true;
}
function moveTop(){
	if( !canMoveTop(board) )
		return false;
	
	for( var i=1; i<4 ; i++){
		for(var j=0; j<4 ; j++){
			if( board[i][j] != 0 ){
				
				for( var k = 0; k<i; k++){
					if( board[k][j]==0 && noBlockVertical(k,i,j,board) ){
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if( board[k][j] == board[i][j] && noBlockVertical(k,i,j,board) && !hasConflicted[k][j] ){
						showMoveAnimation(i,j,k,j);
						board[k][j] += board[i][j];
						board[i][j] =0;
						
						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout( "updateBoardView()" , 200);
	return true;
}
function moveRight(){
	if( !canMoveRight(board) )
		return false;
	
	for( var i=0; i<4 ; i++){
		for(var j=2; j>=0 ; j--){
			if( board[i][j] != 0 ){
				
				for( var k = 3; k>j; k--){
					if( board[i][k]==0 && noBlockHorizontal(i,j,k,board) ){
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if( board[i][k] == board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k] ){
						showMoveAnimation(i,j,i,k);
						board[i][k] += board[i][j];
						board[i][j] =0;
						
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout( "updateBoardView()" , 200);
	return true;
}
function moveDown(){
	if( !canMoveDown(board) )
		return false;
	
	for( var i=2; i>=0 ; i--){
		for(var j=0; j<4 ; j++){
			if( board[i][j] != 0 ){
				
				for( var k = 3; k>i; k--){
					if( board[k][j]==0 && noBlockVertical(i,k,j,board) ){
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if( board[k][j] == board[i][j] && noBlockVertical(i,k,j,board) && !hasConflicted[k][j] ){
						showMoveAnimation(i,j,k,j);
						board[k][j] += board[i][j];
						board[i][j] =0;
						
						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout( "updateBoardView()" , 200);
	return true;
}















