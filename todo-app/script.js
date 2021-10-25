const form= document.getElementById("form");
const input= document.getElementById("input");
const list=document.getElementById("list");

form.addEventListener('submit', (e)=> {
e.preventDefault();

const todoTxt = input.value;
if(todoTxt)
{
    const todos= document.createElement("li");
    todos.innerText=todoTxt;
    list.appendChild(todos); 

    todos.addEventListener('click',()=>{
        todos.classList.toggle("completed");
    }); 
    todos.addEventListener('contextmenu',(ev)=>{
        ev.preventDefault();
        todos.remove();
    }); 
    input.value= ' ';
}

});