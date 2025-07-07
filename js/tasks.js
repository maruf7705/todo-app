// Task-related DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const taskFilters = document.querySelectorAll('.task-filter');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');

// Task functions
function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;
    
    const newTask = {
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
        order: tasks.length
    };
    
    tasks.unshift(newTask);
    taskInput.value = '';
    saveData();
    updateTaskList();
    updateStats();
    showToast('Task added');
}

function toggleTaskComplete(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveData();
        updateTaskList();
        updateStats();
        showToast(task.completed ? 'Task completed' : 'Task marked incomplete');
    }
}

function deleteTask(taskId) {
    showConfirmModal('Are you sure you want to delete this task?', () => {
        tasks = tasks.filter(task => task.id !== taskId);
        saveData();
        updateTaskList();
        updateStats();
        showToast('Task deleted');
    });
}

function updateTaskList() {
    let filteredTasks = [];
    if (currentFilter === 'all') {
        filteredTasks = [...tasks];
    } else if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    filteredTasks.sort((a, b) => a.order - b.order);
    
    if (filteredTasks.length === 0) {
        emptyState.classList.remove('hidden');
        taskList.innerHTML = '';
        taskList.appendChild(emptyState);
    } else {
        emptyState.classList.add('hidden');
        taskList.innerHTML = '';
        
        filteredTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item flex items-center justify-between p-3 bg-white rounded-lg shadow-xs border border-gray-100 hover:shadow-sm transition-shadow cursor-move`;
            taskElement.dataset.id = task.id;
            taskElement.draggable = true;
            
            taskElement.innerHTML = `
                <div class="flex items-center">
                    <button class="complete-btn mr-3 w-5 h-5 rounded-full border ${task.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-300'}" 
                            aria-label="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                        <i class="fas fa-check text-xs ${task.completed ? 'block' : 'hidden'}"></i>
                    </button>
                    <span class="${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}">${task.text}</span>
                </div>
                <button class="delete-btn text-gray-400 hover:text-red-500 transition-colors" aria-label="Delete task">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            
            taskList.appendChild(taskElement);
            
            const completeBtn = taskElement.querySelector('.complete-btn');
            const deleteBtn = taskElement.querySelector('.delete-btn');
            
            completeBtn.addEventListener('click', () => toggleTaskComplete(task.id));
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            
            taskElement.addEventListener('dragstart', handleDragStart);
            taskElement.addEventListener('dragover', handleDragOver);
            taskElement.addEventListener('drop', handleDrop);
            taskElement.addEventListener('dragend', handleDragEnd);
        });
    }
}

function updateStats() {
    const activeTasks = tasks.filter(task => !task.completed).length;
    const completedTasks = tasks.filter(task => task.completed).length;
    
    activeCount.textContent = activeTasks;
    completedCount.textContent = completedTasks;
}

function updateTaskFilters() {
    taskFilters.forEach(filter => {
        if (filter.dataset.filter === currentFilter) {
            filter.classList.add('bg-indigo-500', 'text-white');
            filter.classList.remove('text-gray-600', 'hover:bg-gray-100');
        } else {
            filter.classList.remove('bg-indigo-500', 'text-white');
            filter.classList.add('text-gray-600', 'hover:bg-gray-100');
        }
    });
}

let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const afterElement = getDragAfterElement(taskList, e.clientY);
    if (afterElement == null) {
        taskList.appendChild(draggedItem);
    } else {
        taskList.insertBefore(draggedItem, afterElement);
    }
}

function handleDrop(e) {
    e.preventDefault();
}

function handleDragEnd() {
    this.classList.remove('dragging');
    
    const taskElements = Array.from(taskList.querySelectorAll('.task-item'));
    taskElements.forEach((element, index) => {
        const taskId = element.dataset.id;
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.order = index;
        }
    });
    
    saveData();
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Event listeners for tasks
document.addEventListener('DOMContentLoaded', () => {
    if (addTaskBtn) addTaskBtn.addEventListener('click', addTask);
    if (taskInput) taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    if (clearCompletedBtn) clearCompletedBtn.addEventListener('click', () => {
        showConfirmModal('Are you sure you want to clear all completed tasks?', () => {
            tasks = tasks.filter(task => !task.completed);
            saveData();
            updateTaskList();
            updateStats();
            showToast('Completed tasks cleared');
        });
    });
    taskFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            currentFilter = filter.dataset.filter;
            updateTaskFilters();
            updateTaskList();
            updateStats();
        });
    });
    updateTaskList();
    updateStats();
    updateTaskFilters();
});