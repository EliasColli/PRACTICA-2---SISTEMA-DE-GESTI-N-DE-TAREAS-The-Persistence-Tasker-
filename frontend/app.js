const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {

        const tasks = ref([]);
        const newTask = ref('');
        const loading = ref(false);

        const fetchTasks = async () => {
            loading.value = true;
            const response = await fetch('http://localhost:3000/tasks');
            tasks.value = await response.json();
            loading.value = false;
        };

        const addTask = async () => {
            if (!newTask.value.trim()) return;

            const response = await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newTask.value })
            });

            const data = await response.json();
            tasks.value.push(data);
            newTask.value = '';
        };

        const deleteTask = async (id) => {
            await fetch(`http://localhost:3000/tasks/${id}`, {
                method: 'DELETE'
            });

            tasks.value = tasks.value.filter(task => task.id !== id);
        };

        onMounted(fetchTasks);

        return {
            tasks,
            newTask,
            loading,
            addTask,
            deleteTask
        };
    }
}).mount('#app');