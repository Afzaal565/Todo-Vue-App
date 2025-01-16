import { defineStore } from 'pinia';
import { ref } from "vue";
import { useFetch } from '@/composable/useFetch';
import type { Task } from '@/types';

export const useTaskStore = defineStore('task', () => {
    // ==================States======================//

    const task = ref<Task>();
    const taskForm = ref<{
        task_name: string;
        description: string;
    }>({
        task_name: '',
        description: '',
    });

    const taskList = ref<Task[]>([]);
    const taskLoading = ref<boolean|any>(false);
    const taskErrors = ref<any>();
    const taskSuccess = ref<boolean|any>(false);


    // ===================Getters====================//


    //======================Actions==================//
    const getTasks = async () => {

        taskLoading.value = true;

        const { data, error, loading, fetchData } = useFetch('/tasks');

        try {
            await fetchData();
            if (data.value) {
                // Store the fetched component in the components object
                taskList.value = data.value.data;
            } else {
                taskErrors.value = 'No data found';
            }
            taskErrors.value = null;
        } catch (err) {
            taskErrors.value = error.value;
        } finally {
            taskLoading.value = false;
        }
    };

    const addTask = async () => {
        const { data, error, errorList, loading, fetchData } = useFetch('/tasks', {
            method: 'POST',
            // headers: {
            //     Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('authToken')),
            // },
            body: taskForm.value,

        });
        taskLoading.value = loading;
        try {
            await fetchData();
            if (error.value) {
                taskErrors.value = errorList.value;
                throw new Error(errorList.value);
            }
            else if (data?.value.status == 'error') {
                console.log(data.value);

                taskErrors.value = { error: [data.value.data?.errorInfo] };
            }
            else if (data.value.status == 'success') {
                task.value = data.value?.data;
                taskErrors.value = null;
            } else {
                taskErrors.value = ['No data found'];
            }
            taskErrors.value = null;
        } catch (err) {
            taskErrors.value = errorList.value;
        } finally {
            taskLoading.value = false;
        }
    }


    const updateTask = async (taskId?: number ) => {
        const { data, error, errorList, loading, fetchData } = useFetch(`/tasks/${taskId}`, {
            method: 'PUT',
            // headers: {
            //     Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('authToken')),
            // },
            body: taskForm.value,

        });
        taskLoading.value = loading;
        try {
            await fetchData();
            if (error.value) {
                taskErrors.value = errorList.value;
                throw new Error(errorList.value);
            }
            else if (data?.value.status == 'error') {
                console.log(data.value);

                taskErrors.value = { error: [data.value.data?.errorInfo] };
            }
            else if (data.value.status == 'success') {
                task.value = data.value?.data;
                taskErrors.value = null;
            } else {
                taskErrors.value = ['No data found'];
            }
            taskErrors.value = null;
        } catch (err) {
            taskErrors.value = errorList.value;
        } finally {
            taskLoading.value = false;
        }
    }
    

    const deleteTask = async (taskId?: number ) => {
        const { data, error, errorList, loading, fetchData } = useFetch(`/tasks/${taskId}`, {
            method: 'DELETE',
            // headers: {
            //     Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('authToken')),
            // },

        });
        taskLoading.value = loading;
        try {
            await fetchData();
            if (error.value) {
                taskErrors.value = errorList.value;
                throw new Error(errorList.value);
            }
            else if (data?.value.status == 'error') {
                console.log(data.value);

                taskErrors.value = { error: [data.value.data?.errorInfo] };
            }
            else if (data.value.status == 'success') {
                task.value = data.value?.data;
                taskErrors.value = null;
            } else {
                taskErrors.value = ['No data found'];
            }
            taskErrors.value = null;
        } catch (err) {
            taskErrors.value = errorList.value;
        } finally {
            taskLoading.value = false;
        }
    }

    ///========================Returns===================================///
    return {
        getTasks,
        task,
        taskList,
        taskErrors,
        taskLoading,
        taskSuccess,
        taskForm,
        addTask,
        updateTask,
        deleteTask
    };
});
