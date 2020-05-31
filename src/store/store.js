import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
axios.defaults.baseURL = 'http://localhost:8000/api'

export const store = new Vuex.Store({
  state:{
    filter: 'all',
    todos: [

    ]
  },
  getters:{
    remaining(state) {
      return state.todos.filter(todo => !todo.completed).length
    },
    anyRemaining(state,getters) {
      return getters.remaining != 0
    },
    todosFiltered(state) {
      if (state.filter == 'all') {
        return state.todos
      } else if (state.filter == 'active') {
        return state.todos.filter(todo => !todo.completed)
      } else if (state.filter == 'completed') {
        return state.todos.filter(todo => todo.completed)
      }

      return state.todos
    },
    showClearCompletedButton(state) {
      return state.todos.filter(todo => todo.completed).length > 0
    }
  },
  mutations:{//harus dengan nama mutations
    addTodo(state,todo){
      state.todos.push({
        id:todo.id,
        title:todo.title,
        completed:false,
        editing:false
      })
    },
    updateTodo(state, todo){
      const index = state.todos.findIndex((item) => item.id == todo.id)
      state.todos.splice(index, 1, {
        'id': todo.id,
        'title': todo.title,
        'completed': todo.completed,
        'editing': todo.editing,
      })
    },
    deleteTodo(state,id){
      const index = state.todos.findIndex((item) => item.id == id)
      state.todos.splice(index, 1)
    },
    allChecked(state,checked){
      state.todos.forEach(todo => (todo.completed = checked))
    },
    updateFilter(state, filter){
      state.filter = filter
    },
    clearCompleted(state){
      state.todos = state.todos.filter(todo => !todo.completed)
    },
    retreiveTodos(state,todos){
      state.todos = todos
    }
  },

  actions:{
    retreiveTodos(context){
      axios.get('/todos')
        .then(response => {
          context.commit('retreiveTodos',response.data)
        })
        .catch(error => {console.log(error)})
    },
    addTodo(context,todo){
      axios.post('/todos',{
        title: todo.title,
        completed: false
      })
        .then(response => {
          context.commit('addTodo',response.data)
        })
        .catch(error => {console.log(error)})
    },
    updateTodo(context, todo){
      axios.patch('/todos/' + todo.id,{
        title: todo.title,
        completed: todo.completed
      })
        .then(response => {
          context.commit('updateTodo',response.data)
        })
        .catch(error => {console.log(error)})
    },
    deleteTodo(context,id){
      axios.delete('/todos/' + id)
        .then(response => {
          context.commit('deleteTodo',id)
        })
        .catch(error => {console.log(error)})
    },
    allChecked(context,checked){
      axios.patch('/todosCheckAll',{
        completed: checked
      })
        .then(response => {
          context.commit('allChecked',checked)
        })
        .catch(error => {console.log(error)})

    },
    updateFilter(context, filter){
      context.commit('updateFilter',filter)
    },
    clearCompleted(context){
      const completed = context.state.todos
        .filter(todo => todo.completed)
        .map(todo => todo.id)
      axios.delete('/todosDeleteCompleted',{
        data:{
          todos:completed
        }
      })
        .then(response => {
          context.commit('clearCompleted')
        })
        .catch(error => {console.log(error)})
    }
  }
})

