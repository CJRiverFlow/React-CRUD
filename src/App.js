import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import gif from './loading-gif.gif';
import axios from 'axios';

import ListItem from './ListItem';

class App extends Component {

  constructor(){
    super();
    this.state = {
      newTodo: '',
      editing:false,
      editingIndex:null,
      notification:null,

      todos: [],
      loading:true
      }

      this.apiUrl='https://5c4c89a0756460001488756e.mockapi.io';
      //para usar mockapi installar axious: npm i axios --save

      this.handle = this.handle.bind(this);
      this.addTodo = this.addTodo.bind(this);
      this.deleteTodo = this.deleteTodo.bind(this);
      this.updateTodo = this.updateTodo.bind(this);
      this.alert = this.alert.bind(this);
  }

  //Life cycles, Didmount as soon as the component is mounted
  async componentDidMount(){
      const response = await axios.get(`${this.apiUrl}/Todos`);
      console.log(response);
      setTimeout(() =>  {
          this.setState({
          todos:response.data,
          loading:false
        })
      }, 1000);
  }


  //Funciones

  handle(event){
    this.setState({
      newTodo:  event.target.value
    });
  };


async addTodo(){

    const response = await axios.post(`${this.apiUrl}/Todos`,{
        name:this.state.newTodo
    });

    const todos = this.state.todos;
    todos.push(response.data);

    this.setState({
      todos: todos,
      newTodo: ''
    });
    this.alert('To do added successfully');
  }

async deleteTodo(index){

    const todos = this.state.todos;
    const item = todos[index];

    await axios.delete(`${this.apiUrl}/Todos/${item.id}`);

    delete todos[index];

    this.setState({todos});
    this.alert('To do deleted successfully');

}

editTodo(index){
    const todo = this.state.todos[index];

    this.setState({
        editing:true,
        newTodo:todo.name,
        editingIndex:index
    })

}

async updateTodo(){
    const todo = this.state.todos[this.state.editingIndex];

    const response = await axios.put(`${this.apiUrl}/Todos/${todo.id}`,{
      name:this.state.newTodo
    })


    const todos = this.state.todos;
    todos[this.state.editingIndex] =  response.data;

    this.setState({
      todos,
      editing:false,
      editingIndex:null,
      newTodo:''
    });
    this.alert('To do updated successfully');
}

alert(notification){
  this.setState({
    notification
  });

  setTimeout(()=>{
    this.setState({
      notification:null
    })
  },2000)

}


  render() {
    //console.log(this.state.newTodo);
    return (
      <div className="App">

        <header className="App-header">

        <img src={logo} className="App-logo" alt="logo" />
        </header>

        <div className = "container">
          <h2 className="text center p-4">TO-DOs App</h2>

          {//notificaciones dependiendo de la opcion elejida
            this.state.notification &&

            <div className="alert mt-3 alert-success">
                <p className="text-center">{this.state.notification}</p>
            </div>

          }


          <input
              type="text"
              name= "todo"
              className="my-4 form-control"
              placeholder="Add a new todo"
              onChange ={this.handle}
              value={this.state.newTodo}
            />

          <button
              onClick={this.state.editing ? this.updateTodo: this.addTodo}
              className="btn-success mb-3 form-control"
              disabled = {this.state.newTodo.length < 3}>
              {this.state.editing ? "Update To Do":"Add To Do"}
          </button>

          {
            this.state.loading &&
            <img src={gif} alt="Downloading data" />
          }

          {
            	 (!this.state.editing || this.state.loading) &&

               <ul className="list-group">
                   {this.state.todos.map((item,index)=>{

                   return <ListItem
                    key={item.id}
                    item = {item}
                    editTodo = {() => {this.editTodo(index)}}
                    deleteTodo = {() => {this.deleteTodo(index)}}
                    />

                   })}
               </ul>
          }

        </div>


      </div>
    );
  }
}

export default App;
