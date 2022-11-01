import {v1} from "uuid";
import {
    addTodolistAC, changeTodolistFilterAC,
    changeTodolistTitleAC, fetchTodolistsTC, FilterValuesType, removeTodolistTC,
    TodolistDomainType,
    todolistsReducer
} from "./todolists-reducer";

let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType>

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()

    startState = [
        {id: todolistId1, title: "What to learn", entityStatus: "idle", filter: "all", addedDate: "", order: 0},
        {id: todolistId2, title: "What to buy", entityStatus: "idle", filter: "all", addedDate: "", order: 0}
    ]
})

test("correct todolist should be removed", () => {

    const endState = todolistsReducer(startState, removeTodolistTC.fulfilled({id: todolistId1}, 'requestId', todolistId1))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test("correct todolist should be added", () => {

    const todolist = {
            id: v1(),
            title: "New todolist",
            addedDate: "",
            order: 0
    }

    const endState = todolistsReducer(startState, addTodolistAC({todolist}))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(todolist.title)
    expect(endState[2].filter).toBe("all")
})

test("correct todolist should change its name", () => {

    const newTodolistTitle = "New Todolist"

    const action = changeTodolistTitleAC({id: todolistId2, title: newTodolistTitle})

    const endState = todolistsReducer(startState, action)

    expect(endState[0].title).toBe("What to learn")
    expect(endState[1].title).toBe(newTodolistTitle)
})

test("correct filter of todolist should be changed", () => {

    const newFilter: FilterValuesType = "completed"

    const action = changeTodolistFilterAC({filter: newFilter, id: todolistId2})

    const endState = todolistsReducer(startState, action)

    expect(endState[0].filter).toBe("all")
    expect(endState[1].filter).toBe(newFilter)
})

test("todolists should be set to the state", () => {

    const action = fetchTodolistsTC.fulfilled({todolists: startState}, 'requestId')

    const endState = todolistsReducer([], action)

    expect(endState.length).toBe(2)
})

