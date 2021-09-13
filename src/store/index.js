import Vuex from 'vuex'
import Vue from 'vue'

import {getItem} from "../utils/storage";

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        isLogin:false,
        user:{
            username:''
        }
    },
    getters:{
      username(state){
          return state.user.username ||getItem('username')
      }
    },
    mutations:{
        changeLogin(state,value){
            state.isLogin = value
        },
        setUsername(state,value){
            state.user.username = value
        }
    }
})