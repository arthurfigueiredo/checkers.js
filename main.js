window.addEventListener('load',function(){

	App.init();

	var checkerboard = document.getElementById('checkerboard'),
		squares = document.querySelectorAll('.square-allowed');

	// para cada casa do tabuleiro adiciona o evento de click
	App.each(squares,function(current){
		current.addEventListener('click',function(){

			// se pode mover para o novo quadrado e tem uma peca selecionada e nao tem uma peca nesse quadrado
			// executa o movimento
			// passa a vez
			if(!App.hasPieceOnThatSquare(current.dataset.col,current.dataset.row) && App.hasAnotherSelectedPiece() && App.canMoveToThatSquare(this)){
				App.movePiece(this);

				App.changePlayer();
			}

			// remove todas as pecas selecionadas a cada click
			App.each(squares,function(current){
				current.classList.remove('selected');
			});

			// verifica se pode selecionar a peca
			if(App.canSelectPiece(this)){
				this.classList.toggle('selected');
			}

		});

	});

});

// objeto literal utilizado para representar todo escopo desta aplicacao
var App = {};

/*
	Contantes de configuracao da aplicacao
*/
App.config = {
	COLUMNS: 8,
	ROWS: 8,
	PLAYER1: 'one',
	PLAYER2: 'two'
};


/*
	inicializa a aplicacao
*/	
App.init = function(){

	// cria o tabuleiro
	App.createCheckerboard();
	// insere as pecas no mesmo
	App.createPieces();
	// inicializa o turno do primeiro jogador
	App.changePlayer();

};

/*
	Cria as casas do tabuleiro
*/
App.createCheckerboard = function(){
	
	var content = '',
		classes = '';

	for (var i = 1; i <= App.config.COLUMNS; i++) {
		for (var j = 1; j <= App.config.ROWS; j++) {
			classes = '';
			if((j % 2 == 0 && i % 2 != 0) || (i % 2 == 0 && j % 2 != 0)){
				classes = 'square-allowed';
			}
			content += '<div data-col="'+ j +'"  data-row="'+ i +'" class="square '+ classes +'"></div>';
		}	
	}
	
	checkerboard.innerHTML = content;
};

/*
	Cria e insere no tabuleiro as pecas de cada jogador
*/
App.createPieces = function(){
	var squaresAllowed = document.querySelectorAll('.square-allowed');

	var size = squaresAllowed.length;

	while( size-- ){
		if( size < 12){
			squaresAllowed[size].innerHTML = '<div class="piece player-one-piece"></div>';
		} else if (size > 19) {
			squaresAllowed[size].innerHTML = '<div class="piece player-two-piece"></div>';
		}
	}
};

/*
	Sempre que invocada esta funcao muda o jogador da vez
*/
App.changePlayer = function(){
	if(App._player == App.config.PLAYER1){
		App._player = App.config.PLAYER2;
	} else {
		App._player = App.config.PLAYER1;
	}

	// apos mudar o jogador da vez verifica se tem um vencedor
	App.winnerChecker();

	// escreve na tela o jogador da vez
	document.getElementById('player-turn').innerHTML = 'Turn: Player '+App._player;
};

/*
	Verifica se uma peca pode ser selecionada para movimento
*/
App.canSelectPiece = function(square){
	// para que uma peca possa ser movimentada ela precisa pertencer ao jogador da vez
	// e precisa ter movimentos disponiveis  
	return App.isPieceOfCurrentPlayer(square) && App.canMoveThisPiece(square);
};

/*
	Verifica se tem uma peca no quadrado determinado passando a coluna e linha
*/
App.hasPieceOnThatSquare = function(col,row){
	var hasPiece = document.querySelector(
		'[data-col="'+ (+col) +'"][data-row="'+ (+row) +'"] .piece'
	);
	return hasPiece;
};

/*
	Verifica se tem uma peca do adversario no quadrado determinado passando a coluna e linha
*/
App.isEnemyOnThatSquare = function(col,row){
	var hasPiece = document.querySelector(
				'[data-col="'+ (+col) +'"][data-row="'+ (+row) +'"] .player-'+ (App._player == App.config.PLAYER1 ? App.config.PLAYER2 : App.config.PLAYER1) +'-piece'
	);
	return hasPiece;
};

/*
	Verifica se a peca pode ser movimentada
*/
App.canMoveThisPiece = function(square){
	if(square.querySelector('.piece').classList.contains('queen')){
		return true;
	}
	if(App._player == App.config.PLAYER1){
		if(!App.hasPieceOnThatSquare(+square.dataset.col-1,+square.dataset.row+1)
			||
			!App.hasPieceOnThatSquare(+square.dataset.col+1,+square.dataset.row+1)
			||
			(
				App.isEnemyOnThatSquare(+square.dataset.col-1,+square.dataset.row+1)
				&&
				!App.hasPieceOnThatSquare(+square.dataset.col-2,+square.dataset.row+2)
			)
			||
			(
				App.isEnemyOnThatSquare(+square.dataset.col+1,+square.dataset.row+1)
				&&
				!App.hasPieceOnThatSquare(+square.dataset.col+2,+square.dataset.row+2)
			)){
				return true;
			}
	} else {
		if(!App.hasPieceOnThatSquare(+square.dataset.col-1,+square.dataset.row-1)
			||
			!App.hasPieceOnThatSquare(+square.dataset.col+1,+square.dataset.row-1)
			||
			(
				App.isEnemyOnThatSquare(+square.dataset.col-1,+square.dataset.row-1)
				&&
				!App.hasPieceOnThatSquare(+square.dataset.col-2,+square.dataset.row-2)
			)
			||
			(
				App.isEnemyOnThatSquare(+square.dataset.col+1,+square.dataset.row-1)
				&&
				!App.hasPieceOnThatSquare(+square.dataset.col+2,+square.dataset.row-2)
			)){
				return true;
			}
	}
	return false;
};

/*
	Verifica se a peca atual selecionada pode ser movida para o quadrado informado
*/
App.canMoveToThatSquare = function(square){
	
	var current = document.querySelector(".selected");
	if(current.querySelector('.piece').classList.contains('queen')){
		return true;
	}

	if(App._player == App.config.PLAYER1){
		if (+current.dataset.col == square.dataset.col){
			return false;
		} else if(+current.dataset.row >= square.dataset.row){
			return false;
		} else if(+current.dataset.row+3 <= square.dataset.row){
			return false;
		} else if(+current.dataset.row+2 == square.dataset.row && (!App.isEnemyOnThatSquare(+current.dataset.col-1,+current.dataset.row+1) && !App.isEnemyOnThatSquare(+current.dataset.col+1,+current.dataset.row+1))){
			return false;
		} else if(+current.dataset.row+1 == square.dataset.row && !(+current.dataset.col+1 == square.dataset.col || +current.dataset.col-1 == square.dataset.col)){
			return false;
		}
	} else {
		if (+current.dataset.col == square.dataset.col){
			return false;
		} else if(+current.dataset.row <= square.dataset.row){
			return false;
		} else if(+current.dataset.row-3 >= square.dataset.row){
			return false;
		} else if(+current.dataset.row-2 == square.dataset.row && (!App.isEnemyOnThatSquare(+current.dataset.col-1,+current.dataset.row-1) && !App.isEnemyOnThatSquare(+current.dataset.col+1,+current.dataset.row-1))){
			return false;
		} else if(+current.dataset.row-1 == square.dataset.row && !(+current.dataset.col+1 == square.dataset.col || +current.dataset.col-1 == square.dataset.col)){
			return false;
		}
	}

	return true;
};

/*
	Move a peca selecionada para o quadrado informado
*/
App.movePiece = function(square){
	// come todas as pecas
	App.eatPieces(square);
	// transfere a peca para o quadrado
	square.appendChild(document.querySelector('.selected .piece'));	
	// verifica se a peca se transformou em uma rainha
	App.queenChecker(square);
};

/*
	Come as pecas do adversario
*/
App.eatPieces = function(square){
	var oldSquare = document.querySelector('.selected');

	if(App._player == App.config.PLAYER1){
		if(document.querySelector(
			'[data-col="'+ (+square.dataset.col+1) +'"][data-row="'+ (+square.dataset.row-1) +'"] .player-two-piece,[data-col="'+ (+square.dataset.col-1) +'"][data-row="'+ (+square.dataset.row-1) +'"] .player-two-piece'
		)){
			if(oldSquare.dataset.col == +square.dataset.col-2){
				document.querySelector(
					'[data-col="'+ (+square.dataset.col-1) +'"][data-row="'+ (+square.dataset.row-1) +'"] .player-two-piece'
				).remove();
			} else if (oldSquare.dataset.col == +square.dataset.col+2){
				document.querySelector(
					'[data-col="'+ (+square.dataset.col+1) +'"][data-row="'+ (+square.dataset.row-1) +'"] .player-two-piece'
				).remove();
			}
		}
	} else {
		if(document.querySelector(
			'[data-col="'+ (+square.dataset.col+1) +'"][data-row="'+ (+square.dataset.row+1) +'"] .player-one-piece,[data-col="'+ (+square.dataset.col-1) +'"][data-row="'+ (+square.dataset.row+1) +'"] .player-one-piece'
		)){
			if(oldSquare.dataset.col == +square.dataset.col-2){
				document.querySelector(
					'[data-col="'+ (+square.dataset.col-1) +'"][data-row="'+ (+square.dataset.row+1) +'"] .player-one-piece'
				).remove();	
			} else if (oldSquare.dataset.col == +square.dataset.col+2){
				document.querySelector(
					'[data-col="'+ (+square.dataset.col+1) +'"][data-row="'+ (+square.dataset.row+1) +'"] .player-one-piece'
				).remove();
			}
		}
	}
};

/*
	Verifica se a peca do quadrado passado no parametro e do jogador da vez
*/
App.isPieceOfCurrentPlayer = function(square){
	return square.querySelector('.player-'+App._player+'-piece');
};

/*
	Retorna se tem outra peca selecionada em jogo
*/
App.hasAnotherSelectedPiece = function(){
	return document.querySelectorAll(".selected").length;
};

/*
	No final de cada turno chama essa funcao para verificar se tem um vencedor,
	caso todas as pecas de um dos jogadores forem eliminadas o outro jogador e o vencedor
*/
App.winnerChecker = function(){
	if(document.querySelectorAll('.player-one-piece').length == 0){
		alert('Player two is the winner');
	} else if (document.querySelectorAll('.player-two-piece').length == 0){
		alert('Player one is the winner');
	}
};
/*
	Verifica se as pecas de um dos jogadores alcansou a extremidade do tabuleiro do adversario formando uma rainha
*/
App.queenChecker = function(square){
	if ((App._player == App.config.PLAYER1 && square.dataset.row == 8) || (App._player == App.config.PLAYER2 && square.dataset.row == 1)){
			square.querySelector('.piece').classList.add('queen');
	}
};

/*
	Funcao que criei para auxiliar em algumas manimupalacoes em javascript, semelhante a um array_map 
	(nao utilizei o nativo do js por causa de alguns browsers);
*/
App.each = function(arr,callback){
	var size = arr.length;

	while( size-- ){
		callback(arr[size]);
	}
};

/*
	Funcoes que criei para remover um elemento, utilizado quando uma peca e eliminada
*/
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};