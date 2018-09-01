import React, { Component } from 'react';
import './App.css';

'use strict';

function TurnDisplay(props){
  return(
      <div className="display">
        { props.isBlackTurn ? "黒" : "白"} のターンです
      </div>
  );
};

function OthelloSideBar(props){
  return(
      <div className="sidebar">
        <TurnDisplay isBlackTurn={ props.isBlackTurn } />
          <p>黒:{ props.score.black }</p>
          <p>白:{ props.score.white }</p>
          <button onClick={ props.pass }>パスします</button>
      </div>
  );
};

function OthelloSpot(props){
  let className = props.condition.isBlack ? "disc black-disc" : "disc white-disc" ;
  className += props.condition.hasDisc ? " " : " hidden" ;
  return(
    <div
        className="board-spot"
        onClick={ () => props.placeDisc( props.condition ) }
      >
      <div className={ className } >
      </div>
    </div>
  )
}

function OthelloBoard(props){
  let spots = [];
  for( let i = 0 ; i < 64 ; i++ ){
    spots.push((
      <OthelloSpot
        key={ i }
        condition={ props.boardcondition[i] }
        placeDisc={ props.placeDisc }
      />
    ));
  }

  return(
    <div className="board">
    { spots }
    </div>
  )
}

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      boardcondition:[] ,
      isBlackTurn : true ,
      isBlack : true ,
      hasDisc : false ,
      score:{
        black: 0 ,
        white: 0
      }
    };
    this.placeDisc = this.placeDisc.bind(this);
    this.isRevercible = this.isRevercible.bind(this);
    this.pass = this.pass.bind(this);
  }

  //Initial boardcondition
  componentWillMount(){
    let _boardcondition = [];
    for( let i = 0 ; i < 64 ; i++ ){
      _boardcondition.push({
        id: i ,
        hasDisc: false ,
        isBlack: false
      });
    }

    _boardcondition[27].hasDisc = true ;
    _boardcondition[27].isBlack = true ;
    _boardcondition[28].hasDisc = true ;
    _boardcondition[28].isBlack = false ;
    _boardcondition[35].hasDisc = true ;
    _boardcondition[35].isBlack = false ;
    _boardcondition[36].hasDisc = true ;
    _boardcondition[36].isBlack = true ;

    const boardcondition = _boardcondition.slice();
    this.setState({
      boardcondition: boardcondition
    });
  }

  isRevercible( boardcondition , condition ){
    if( typeof boardcondition === "undefined" ||
        typeof condition === "undefined" ){
      return{
        result: false ,
        isSameColor: false
      }
    }

    if( !boardcondition.hasDisc ){
      return{
        result: false ,
        isSameColor: false
      }
    }

    if( boardcondition.hasDisc && boardcondition.isBlack !== this.state.isBlackTurn){
      return{
        result: true ,
        isSameColor: false
      }
    }else if( boardcondition.hasDisc && boardcondition.isBlack === this.state.isBlackTurn ){
      return{
        result : false ,
        isSameColor: true
      }
    }
  }

  placeDisc(condition){
    if( condition.hasDisc ){
      return;
    }

    //Search
    let temp = [] ;
    let ref = [] ;
    const boardcondition = this.state.boardcondition.slice();

    const id = condition.id ;
    let check = 0 ;

    //上方向の探索
    check = id ;
    if( this.isRevercible( boardcondition[check-8] , condition ) ){
        while( check - 8 >= 0 ){
          check -= 8 ;
          let result = this.isRevercible( boardcondition[check] , condition)
          if( result.result ){
            temp.push( boardcondition[check].id );
          }else{
            if( result.isSameColor ){
              ref = ref.concat( temp );
            }
            break ;
          }
        }
    }
    temp.splice( 0 , temp.length );
    //下方向の探索
    check = id ;
    if( this.isRevercible( boardcondition[check+8] , condition ) ){
        while( check + 8 <= 63 ){
          check += 8 ;
          let result = this.isRevercible( boardcondition[check] , condition);
          if( result.result ){
            temp.push( boardcondition[check].id );
          }else{
            if( result.isSameColor ){
              ref = ref.concat( temp );
            }
            break ;
          }
        }
    }
    temp.splice( 0 , temp.length );
    //左方向の探索
    check = id ;
    if( this.isRevercible( boardcondition[check-1] , condition ) ){
        while(  check - 1 >= Math.floor((condition.id / 8)) * 8  ){
          check -= 1 ;
          let result = this.isRevercible( boardcondition[check] , condition)
          if( result.result ){
            temp.push( boardcondition[check].id );
          }else{
            if( result.isSameColor ){
              ref = ref.concat( temp );
            }
            break ;
          }
        }
    }
    temp.splice( 0 , temp.length );
    //右方向の探索
    check = id ;
    if( this.isRevercible( boardcondition[check+1] , condition ) ){
        while( check + 1 <= Math.floor((condition.id / 8)) * 8 + 7 ){
          check += 1 ;
          let result = this.isRevercible( boardcondition[check] , condition)
          if( result.result ){
            temp.push( boardcondition[check].id );
          }else{
            if( result.isSameColor ){
              ref = ref.concat( temp );
            }
            break ;
          }
        }
    }
    temp.splice( 0 , temp.length );
    //右上方向の探索
    check = id ;
    if( this.isRevercible( boardcondition[check-7] , condition ) ){
        while( check - 7 >= 0 ){
          if( !(check - Math.floor(check / 8 ) * 8 < 7 &&
              check / 8 > 0) ){
            break ;
          }
          check -= 7 ;
          let result = this.isRevercible( boardcondition[check] , condition)
          if( result.result ){
            temp.push( boardcondition[check].id );
          }else{
            if( result.isSameColor ){
              ref = ref.concat( temp );
            }
            break ;
          }
        }
    }
    temp.splice( 0 , temp.length );
    //左上方向の探索
    check = id ;
    if( this.isRevercible( boardcondition[check-9] , condition ) ){
        while( check - 9 >= 0 ){
          if( !(check - Math.floor(check / 8 ) * 8 > 0 &&
              check / 8 > 0) ){
            break ;
          }
          check -= 9 ;
          let result = this.isRevercible( boardcondition[check] , condition)
          if( result.result ){
            temp.push( boardcondition[check].id );
          }else{
            if( result.isSameColor ){
              ref = ref.concat( temp );
            }
            break ;
          }
        }
    }
    temp.splice( 0 , temp.length );
    //右下方向の探索
    check = id ;
    if( this.isRevercible( boardcondition[check+9] , condition ) ){
        while( check + 9 <= 63 ){
          if( !(check - Math.floor(check / 8 ) * 8 < 7 &&
              check / 8 < 7 ) ){
            break ;
          }
          check += 9 ;
          let result = this.isRevercible( boardcondition[check] , condition)
          if( result.result ){
            temp.push( boardcondition[check].id );
          }else{
            if( result.isSameColor ){
              ref = ref.concat( temp );
            }
            break ;
          }
        }
    }
    temp.splice( 0 , temp.length );
    //左下方向の探索
    check = id ;
    if( this.isRevercible( boardcondition[check+7] , condition ) ){
        while( check + 7 <= 63 ){
          if( !( check - Math.floor(check / 8 ) * 8 > 0 &&
              check / 8 < 7 ) ){
            break ;
          }
          check += 7 ;
          let result = this.isRevercible( boardcondition[check] , condition)
          if( result.result ){
            temp.push( boardcondition[check].id );
          }else{
            if( result.isSameColor ){
              ref = ref.concat( temp );
            }
            break ;
          }
        }
    }
    temp.splice( 0 , temp.length );

    if( ref.length === 0 ){
      return ;
    }

    if( this.state.isBlackTurn ){
      boardcondition[condition.id].isBlack = true ;
      boardcondition[condition.id].hasDisc = true ;
    }else{
      boardcondition[condition.id].isBlack = false ;
      boardcondition[condition.id].hasDisc = true ;
    }

    console.log(ref);

    ref.forEach( (id)=>{
      boardcondition[id].isBlack = !boardcondition[id].isBlack;
    });

    let score = {
      black:0 ,
      white:0
    };
    boardcondition.forEach( (condition)=>{
      if( condition.hasDisc ){
        if( condition.isBlack ){
          score.black += 1 ;
        }else{
          score.white += 1 ;
        }
      }
    });

    console.log( score );

    this.setState({
      boardcondition : boardcondition ,
      isBlackTurn : !this.state.isBlackTurn ,
      score: score
    });

  }

  pass(){
    this.setState({
      isBlackTurn : !this.state.isBlackTurn
    });
  }

  render() {
    return(
      <div className="container">
        <OthelloBoard
          boardcondition={ this.state.boardcondition }
          placeDisc={ this.placeDisc }
        />
        <OthelloSideBar
          isBlackTurn={ this.state.isBlackTurn}
          score={ this.state.score }
          pass={ this.pass }
        />
      </div>
    )
  }
}

export default App;
