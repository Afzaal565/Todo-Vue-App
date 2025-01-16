<script setup lang="ts">
import { onMounted, ref, toRef } from 'vue'
import { useTaskStore } from '@/stores/task'

const taskStore = useTaskStore();

const taskList = toRef(taskStore, 'taskList');
const taskForm = toRef(taskStore, 'taskForm');
const task = toRef(taskStore, 'task');

const resetRef = ref();
const isEdit = ref<boolean>(false);

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

const editTask = (item: Task) => {
    task.value = item;
    isEdit.value = true;
    taskForm.value.task_name = item.task_name;
    taskForm.value.description = item.description;
}

const removeTask = async (item?: Task) => {
    if (item) {
        await taskStore.deleteTask(item.id);
        taskList.value = taskList.value.filter((task) => task.id !== item.id);
    }
}


const updateTask = async () => {
    if (taskForm.value.task_name !== null) {
        await taskStore.updateTask(task.value?.id);
        await taskStore.getTasks();
        window.setTimeout(() => {
            resetRef.value.click();
        }, 500);
    }
}

const reset = async () => {
    taskForm.value.task_name = null;
    taskForm.value.description = null;
    task.value = null;
    isEdit.value = false;
}


</script>
<template>
    <div class="container">
        <form>
            <div class="row">
                <div class="col-12 mb-3">
                    <label for="task-name" class="form-label">Task Name</label>
                    <input type="text" v-model="taskForm.task_name" class="form-control" id="task-name"
                        placeholder="enter task name">
                </div>
                <div class="col-12 mb-3">
                    <label for="task-desc" class="form-label">Description</label>
                    <textarea class="form-control" v-model="taskForm.description" id="task-desc" rows="3"></textarea>
                </div>
                <div class="col-12 mb-3">
                    <button v-if="!isEdit" type="button" class="btn btn-primary float-end"
                        :disabled="taskForm.task_name == ''" @click="saveTask">Save
                        Changes</button>
                    <button v-else type="button" class="btn btn-primary float-end" :disabled="taskForm.task_name == ''"
                        @click="updateTask">Update
                        Changes</button>
                    <button type="reset" ref="resetRef" class="btn btn-danger float-end me-2"
                        @click="reset">Cancel</button>
                </div>
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
                            <button class="btn btn-primary me-2 " @click="editTask(item)">Edit</button>
                            <button class="btn btn-danger" @click="removeTask(item)">Delete</button>
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
