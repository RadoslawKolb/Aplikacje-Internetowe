document.todo={
    tasks:[
        ["task 1","2024-10-15"],
        ["task 2",undefined]
    ],

    draw:function(){
        let ul=document.getElementById('myUl');
        ul.innerHTML='';

        this.tasks.forEach((task,index)=>{
            let li=document.createElement('li');
            
            //tekst i mozliwosc edycji
            let taskText=document.createElement('span');
            taskText.textContent=task[0];
            taskText.setAttribute('contenteditable',true);

            //data
            let taskDate=document.createElement('input');
            taskDate.type='date';
            taskDate.value=task[1] || '';

            //zmiania daty
            taskDate.onchange=()=> this.updateTaskDate(index,taskDate.value);

            //usuwanie
            let deleteBtn=document.createElement('button');
            deleteBtn.textContent = '🗑️';
            deleteBtn.classList.add('deleteBtn');
            deleteBtn.onclick=()=>this.deleteTask(index);

            //dodawanie elementow

            li.appendChild(taskText);
            li.appendChild(taskDate);
            li.appendChild(deleteBtn);
            
            ul.appendChild(li);
        });
    },

    addTask:function(taskText,taskDate){
        if(taskText.length >=3 && taskText.length<=255){
            this.tasks.push([taskText,taskDate || undefined]);
            this.saveTasks();
            this.draw();
        }else{
            alert("tekst musi sie miescic w ramach od 3 do 255 znakow.");
        }
        
    },
    deleteTask:function(index){
        this.tasks.splice(index,1);
        this.saveTasks();
        this.draw();
    },

    updateTaskDate:function(index,date){
        this.tasks[index][1]=date;
        this.saveTasks();
    },

    saveTasks:function(){
        localStorage.setItem('tasks',JSON.stringify(this.tasks));
    },

    loadTasks:function(){
        let storedTasks=localStorage.getItem('tasks');
        if(storedTasks){
            this.tasks=JSON.parse(storedTasks);
        }
    }

};
document.todo.draw();