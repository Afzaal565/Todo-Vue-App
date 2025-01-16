<script setup lang="ts">
import { onMounted, ref, toRef } from 'vue'
import { useTaskStore } from '@/stores/task'

const taskStore = useTaskStore();

const taskList = toRef(taskStore, 'taskList');
const taskForm = toRef(taskStore, 'taskForm');
const task = toRef(taskStore, 'task');

const resetRef = ref();


onMounted(async () => {
    await taskStore.getTasks();
})

const tasks = ref<string[]>([])
const newTask = ref('')

const saveTask = async () => {
    if (taskForm.value.task_name !== null) {
        await taskStore.addTask();
        taskList.value.push(task?.value);
        window.setTimeout(() => {
            resetRef.value.click();
        }, 500);
    }
}

const removeTask = (index: number) => {
    tasks.value.splice(index, 1)
}
</script>
<template>
    <div class="container">
        <form @submit.prevent="saveTask">
            <div class="mb-3">
                <label for="task-name" class="form-label">Task Name</label>
                <input type="text" v-model="taskForm.task_name" class="form-control" id="task-name"
                    placeholder="enter task name">
            </div>
            <div class="mb-3">
                <label for="task-desc" class="form-label">Description</label>
                <textarea class="form-control" v-model="taskForm.description" id="task-desc" rows="3"></textarea>
            </div>
            <div class="mb-3">
                <button type="submit" class="btn btn-primary">Save Changes</button>
                <button type="reset" ref="resetRef" class="btn btn-primary">Cancel</button>
            </div>
        </form>

        <h1>Todo List</h1>

        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Task Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr v-for="(item, key) in taskList">
                        <th scope="row">{{ key + 1 }}</th>
                        <td>{{ item?.task_name }}</td>
                        <td>{{ item?.description }}</td>
                        <td>
                            <button class="btn btn-primary">Edit</button>
                            <button class="btn btn-danger">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>


    </div>
</template>



<style scoped>
/* Additional scoped styles if needed */
</style>
