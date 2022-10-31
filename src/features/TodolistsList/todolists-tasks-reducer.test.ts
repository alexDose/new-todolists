import {tasksReducer, TasksStateType} from "./tasks-reducer";
import {addTodolistAC, TodolistDomainType, todolistsReducer} from "./todolists-reducer";
import {TodolistType} from "../../api/todolists-api";
import {v1} from "uuid";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodolistDomainType> = []

    const todolist: TodolistType = {
        id: v1(),
        title: "New todolist",
        addedDate: "",
        order: 0
    }

    const action = addTodolistAC({todolist})

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolist.id)
    expect(idFromTodolists).toBe(action.payload.todolist.id)
})
