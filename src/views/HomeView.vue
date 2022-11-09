<template>
  <div class="home">
    <div class="container">
      <div class="wrapper">
        <div class="top">
          <div class="wrapper-inner">
            <div class="box-inner">A</div>
            <div class="box-inner">B</div>
            <div class="box-inner">C</div>
            <div class="box-inner">D</div>
            <div class="box-inner">E</div>
            <div class="box-inner">F</div>
            <div class="box-inner">G</div>
            <div class="box-inner">H</div>
          </div>
        </div>
        <div v-for="(col, c) in board" :key="c">
          <div class="box" 
              :class="{cross: cell.occupied === 'cross', naught: cell.occupied === 'naught'}"
              v-for="(cell, key) in col" :key="key"
              @click="place(cell)">
              <img v-if="cell.occupied === 'cross'" src="./../assets/cross.png" alt="cross"/>
              <img v-if="cell.occupied === 'naught'" src="./../assets/naught.png" alt="naught"/>
          </div>
        </div>
      </div>
      <p v-if="isGameOver">
        GAME OVER! '{{ isGameOver }}' wins.
      </p>
    </div>
  </div>
</template>

<script>
import {ref, watch} from 'vue'

export default {
  name: 'HomeView',
  components: {
    // HelloWorld
  },
  setup() {
    const CROSS = 'cross'
    const NAUGHT = 'naught'
    const turn = ref(CROSS)
    const isGameOver = ref(undefined)
    const board = ref([])
    const placed = ref(0)

    const M = 8
    const N = 8
    const K = 5
    const SCAN_DIRECTION_OPERATOR = [
      {'column': 0, 'row': -1}, // North
      {'column': 1, 'row': -1}, // North East
      {'column': 1, 'row': 0}, // East
      {'column': 1, 'row': 1}, // South East
      {'column': 0, 'row': 1}, // South
      {'column': -1, 'row': 1}, // South West
      {'column': -1, 'row': 0}, // West
      {'column': -1, 'row': -1}, // North West
    ]
    
    const place = (cell) => {
      if (!isGameOver.value && !cell['occupied']) {
        cell['occupied'] = turn.value === CROSS ? NAUGHT : CROSS
        turn.value = turn.value === CROSS ? NAUGHT : CROSS
        placed.value++
      }
    }

    watch(board, (state) => {
      console.log(placed.value)
      if (placed.value < 9) { return }
      
      // scanning direction started with north
      state.forEach(col => {
        col.forEach(cell => {
          SCAN_DIRECTION_OPERATOR.forEach(d => {
            var point = 0
            var winTurn = cell.occupied

            var column = undefined
            var row = undefined
            
            for (let win = K - 1; win >= 0; win--) {
              column = cell.column + (d.column * win) - 1 // -1 = minus array index
              row = cell.row + (d.row * win) - 1 // -1 = minus array index
              if (!board.value[column] || !board.value[column][row]) { break }
              if (board.value[column][row] && board.value[column][row].occupied && board.value[column][row].occupied === winTurn) { point++ }
            }

            if (point === K) {
              isGameOver.value = winTurn
              return
            }
          })
        })
      });
    }, {deep: true})
    
    
    for (var i = 1; i <= M; i++) {
      var column = []
      for (var j = 1; j <= N; j++) {
        column.push({
          'column': i,
          'row': j,
          'occupied': undefined
        })
      }
      board.value.push(column)
    }

    return {
      // Value
      board,
      isGameOver,
      
      // Functions
      place,
    }   
  },

}
</script>

<style>
.wrapper {
  width: 560px;
  margin: 0 auto;
  display: grid;
  grid-gap: 0;
  grid-template-columns: repeat(8, 70px);
  grid-template-rows: 40px repeat(8, 70px) 40px;
  grid-auto-flow: row;
}
.wrapper-inner{
  display: grid;
  grid-gap: 0;
  grid-template-columns: repeat(8, auto);
  grid-template-rows: auto;
  grid-auto-flow: row;
  align-items: strech;
}

.box {
  /* padding: 20px; */
  font-size: 150%;
  /* background-color: #b5915f; */
  height: 68px;
  width: 68px;
  background-color: #ffffff;
  border: 1px solid black;
  color: #000;
  text-align: center;
}

.cross img {
  width: 68px;
  height: 68px;
}

.naught img {
  width: 68px;
  height: 68px;
}

.box-inner{
  text-align: center;
  align-self: center;
}
.top,
.bottom{
  display: grid;
  align-items: stretch;
  background-color: #7d694c;
}
.top {
  grid-column-start: 1;
  grid-column-end: 9;
  grid-row-start: 1;
  grid-row-end: 1;
}
.bottom {
  grid-column-start: 1;
  grid-column-end: 9;
  grid-row-start: 10;
  grid-row-end: 10;
}
</style>