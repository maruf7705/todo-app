// Time tracking DOM elements
const timeBlockDesc = document.getElementById('timeBlockDesc');
const startTime = document.getElementById('startTime');
const endTime = document.getElementById('endTime');
const timeBlockNotes = document.getElementById('timeBlockNotes');
const durationDisplay = document.getElementById('durationDisplay');
const addTimeBlockBtn = document.getElementById('addTimeBlockBtn');
const timeBlocksList = document.getElementById('timeBlocksList');
const totalTrackedTime = document.getElementById('totalTrackedTime');
const exportBtn = document.getElementById('exportBtn');

// Time block functions
function calculateDuration() {
    const start = startTime.value;
    const end = endTime.value;
    
    if (!start || !end) return;
    
    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);
    
    let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    
    if (totalMinutes < 0) {
        totalMinutes += 24 * 60;
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    durationDisplay.textContent = `${hours}h ${minutes}m`;
}

function addTimeBlock() {
    const description = timeBlockDesc.value.trim();
    const notes = timeBlockNotes.value.trim();
    const start = startTime.value;
    const end = endTime.value;
    
    if (!description) {
        showToast('Please enter a description');
        return;
    }
    
    if (!start || !end) {
        showToast('Please select start and end times');
        return;
    }
    
    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);
    let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    
    if (totalMinutes < 0) {
        totalMinutes += 24 * 60;
    }
    
    if (totalMinutes <= 0) {
        showToast('End time must be after start time');
        return;
    }
    
    const newBlock = {
        id: Date.now().toString(),
        description,
        start,
        end,
        duration: totalMinutes,
        notes,
        date: new Date().toISOString().split('T')[0]
    };
    
    timeBlocks.unshift(newBlock);
    saveData();
    updateTimeBlocksList();
    showToast('Time block added');
    
    timeBlockDesc.value = '';
    timeBlockNotes.value = '';
    durationDisplay.textContent = '0h 0m';
}

function deleteTimeBlock(blockId) {
    showConfirmModal('Are you sure you want to delete this time block?', () => {
        timeBlocks = timeBlocks.filter(block => block.id !== blockId);
        saveData();
        updateTimeBlocksList();
        showToast('Time block deleted');
    });
}

function exportData() {
    if (tasks.length === 0 && timeBlocks.length === 0) {
        showToast('No data to export');
        return;
    }
    
    let exportText = '=== TaskFlow Pro Export ===\n\n';
    
    exportText += '--- TASKS ---\n';
    if (tasks.length === 0) {
        exportText += 'No tasks\n\n';
    } else {
        tasks.forEach((task, index) => {
            exportText += `${index + 1}. [${task.completed ? '✓' : ' '}] ${task.text}\n`;
        });
        exportText += '\n';
    }
    
    exportText += '--- TIME BLOCKS ---\n';
    if (timeBlocks.length === 0) {
        exportText += 'No time blocks\n';
    } else {
        timeBlocks.forEach((block, index) => {
            const hours = Math.floor(block.duration / 60);
            const minutes = block.duration % 60;
            exportText += `${index + 1}. ${block.start} - ${block.end} (${hours}h ${minutes}m): ${block.description}`;
            if (block.notes) {
                exportText += ` | Notes: ${block.notes}`;
            }
            exportText += '\n';
        });
    }
    
    const totalMinutes = timeBlocks.reduce((sum, block) => sum + block.duration, 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    
    exportText += `\nTotal tracked time: ${totalHours}h ${remainingMinutes}m\n`;
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TaskFlow_Export_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Data exported');
}

function updateTimeBlocksList() {
    if (timeBlocks.length === 0) {
        timeBlocksList.innerHTML = `
            <div class="text-center py-8 text-gray-400">
                <i class="fas fa-hourglass-half text-3xl mb-2"></i>
                <p>No time blocks recorded yet</p>
            </div>
        `;
    } else {
        const today = new Date().toISOString().split('T')[0];
        const todaysBlocks = timeBlocks.filter(block => block.date === today);
        
        if (todaysBlocks.length === 0) {
            timeBlocksList.innerHTML = `
                <div class="text-center py-8 text-gray-400">
                    <i class="fas fa-hourglass-half text-3xl mb-2"></i>
                    <p>No time blocks for today</p>
                </div>
            `;
            totalTrackedTime.textContent = '0h 0m';
            return;
        }
        
        timeBlocksList.innerHTML = '';
        
        const totalMinutes = todaysBlocks.reduce((sum, block) => sum + block.duration, 0);
        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;
        totalTrackedTime.textContent = `${totalHours}h ${remainingMinutes}m`;
        
        todaysBlocks.forEach(block => {
            const hours = Math.floor(block.duration / 60);
            const minutes = block.duration % 60;
            
            const blockElement = document.createElement('div');
            blockElement.className = 'bg-white rounded-lg p-3 shadow-xs border border-gray-100';
            blockElement.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <div class="font-medium">${block.description}</div>
                        <div class="text-sm text-gray-500 mt-1">
                            ${block.start} - ${block.end} • ${hours}h ${minutes}m
                        </div>
                        ${block.notes ? `<div class="text-sm mt-2 text-gray-600">${block.notes}</div>` : ''}
                    </div>
                    <button class="delete-block-btn text-gray-400 hover:text-red-500 transition-colors" aria-label="Delete time block">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            
            timeBlocksList.appendChild(blockElement);
            
            const deleteBtn = blockElement.querySelector('.delete-block-btn');
            deleteBtn.addEventListener('click', () => deleteTimeBlock(block.id));
        });
    }
}

// Event listeners for time tracker
document.addEventListener('DOMContentLoaded', () => {
    if (addTimeBlockBtn) addTimeBlockBtn.addEventListener('click', addTimeBlock);
    if (startTime) startTime.addEventListener('change', calculateDuration);
    if (endTime) endTime.addEventListener('change', calculateDuration);
    if (exportBtn) exportBtn.addEventListener('click', exportData);

    // Set default time values
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    if (startTime) startTime.value = `${hours}:${minutes}`;
    if (endTime) endTime.value = `${hours}:${minutes}`;

    updateTimeBlocksList();
    calculateDuration();
});