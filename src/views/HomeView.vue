<template>
  <div class="home">
    <div id="loading" v-if="loading">
      <img
        class="loading_img"
        src="./../assets/loading.gif"
        alt="loading..."
        width="200"
      />
    </div>
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
      <a :href="crossSessionLink">Cross Link</a>
      <br>
      <a :href="naughtSessionLink">Naught Link</a>
    </div>
  </div>
</template>

<script>
import {ref, watch, onMounted} from 'vue'
import appConfig from '@/config/app'
import {writeSessionData, updateSessionData, onSessionData, getTurnSessionData} from '@/firebase'
import {generateNewSession} from '@/session'
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'HomeView',
  components: {
    // HelloWorld
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const M = appConfig.M
    const N = appConfig.N
    const K = appConfig.K
    const SCAN_DIRECTION_OPERATOR = appConfig.SCAN_DIRECTION_OPERATOR

    const CROSS = 'cross'
    const NAUGHT = 'naught'
    const turn = ref(CROSS)
    const isGameOver = ref('')
    const board = ref([])
    const placed = ref(0)
    const mounted = ref(false)
    const turnSession = ref('')
    const session = ref('')
    const loading = ref(true)

    const crossSessionLink = ref('')
    const naughtSessionLink = ref('')
    
    // Prepare board
    for (var i = 1; i <= M; i++) {
      var column = []
      for (var j = 1; j <= N; j++) {
        column.push({
          'column': i,
          'row': j,
          'occupied': null
        })
      }
      board.value.push(column)
    }

    const generateSessionLink = (session, turnSession) => {
      return `${window.location.origin}?session=${session}&turn=${turnSession}`
    }

    const prepareNewSession = () => {
      var newSession = generateNewSession()

      session.value = newSession['session']
      turnSession.value = CROSS

      crossSessionLink.value = generateSessionLink(newSession['session'], newSession['crossSession'])
      naughtSessionLink.value = generateSessionLink(newSession['session'], newSession['naughtSession'])

      // Update to database
      writeSessionData(session.value, turn.value, isGameOver.value, board.value, placed.value, newSession['crossSession'], newSession['naughtSession'])

      router.push({query: {...{'session': newSession['session'], 'turn': newSession['crossSession']}}})
    }

    var sessionQuery = route.query.session
    var turnQuery = route.query.turn

    if (!sessionQuery || !turnQuery) {
      prepareNewSession()
    } else {
      session.value = sessionQuery
      getTurnSessionData(sessionQuery, turnQuery)
        .then((snapshot) => {
          if (snapshot.exists()) { turnSession.value = snapshot.val() }
          else { prepareNewSession() }

          onSessionData(session.value, (snapshot) => {
            const data = snapshot.val()
            turn.value = data.turn
            isGameOver.value = data.isGameOver
            board.value = data.board
            placed.value = data.placed
            crossSessionLink.value = generateSessionLink(session.value, data.cross)
            naughtSessionLink.value = generateSessionLink(session.value, data.naught)

          }, {onlyOnce: true})
        })
        .catch(() => {
          prepareNewSession()
        });
    }
    
    const place = (cell) => {
      if (!isGameOver.value && !cell['occupied'] && turnSession.value === turn.value) {
        cell['occupied'] = turn.value === CROSS ? CROSS : NAUGHT 
        turn.value = turn.value === CROSS ? NAUGHT : CROSS
        placed.value++
      }
    }

    onSessionData(session.value, (snapshot) => {
      const data = snapshot.val()
      turn.value = data.turn
      isGameOver.value = data.isGameOver
      board.value = data.board
      placed.value = data.placed
      crossSessionLink.value = generateSessionLink(session.value, data.cross)
      naughtSessionLink.value = generateSessionLink(session.value, data.naught)
    })
    
    onMounted (() => {
      mounted.value = true
      loading.value = false
    })

    watch(board, (state) => {
      // No execution before mounted
      if (!mounted.value) { return } 

      // Update to database
      updateSessionData(session.value, turn.value, isGameOver.value, board.value, placed.value)

      if (placed.value < (K * 2 - 1)) { return }
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

              // Update to database
              updateSessionData(session.value, turn.value, isGameOver.value, board.value, placed.value)

              return
            }
          })
        })
      });
    }, {deep: true})

    return {
      // Value
      board,
      isGameOver,
      loading,
      crossSessionLink,
      naughtSessionLink,
      
      // Functions
      place,
    }   
  },

}
</script>

<style>
html {
  width: 1750px;
}

.wrapper {
  width: 1750px;
  margin: 0 auto;
  display: grid;
  grid-gap: 0;
  grid-template-columns: repeat(25, 70px);
  grid-template-rows: 40px repeat(25, 70px) 40px;
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
  grid-column-end: 26;
  grid-row-start: 1;
  grid-row-end: 1;
}
.bottom {
  grid-column-start: 1;
  grid-column-end: 9;
  grid-row-start: 10;
  grid-row-end: 10;
}

#loading {
  position: absolute;
  z-index: 1000;
  background-color: white;
  height: 100vh;
  width: 100vw;
  text-align: center;
  line-height: 100vh;
}
.loading_img {
  position: relative;
  margin: auto;
  margin-top: 20%;
}
</style>