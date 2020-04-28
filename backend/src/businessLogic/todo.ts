import {ToDoAccess} from '../dataLayer/todoAccess'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import {TodoItem} from "../models/TodoItem";
import {TodoUpdate} from "../models/TodoUpdate";
import * as uuid from 'uuid'
import { parseUserId } from '../auth/utils'
import * as Jimp from 'jimp'

const todoAccess = new ToDoAccess()


export async function getAllTodo(token: string): Promise<TodoItem[]> {
    return todoAccess.getAllTodo(parseUserId(token));
}

export async function createTodo(newTodo: CreateTodoRequest, token: string): Promise<TodoItem> {
    const timestamp = new Date().toISOString()
    return todoAccess.createTodo({
        todoId: uuid.v4(),
        userId: parseUserId(token),
        createdAt: timestamp,
        ...newTodo,
        done: false,
        attachmentUrl: null
    });
}

export async function updateTodo(updateTodo: UpdateTodoRequest, todoId: string): Promise<TodoUpdate> {
    return todoAccess.updateTodo(updateTodo, todoId);
}

export async function deleteToDo(todoId: string): Promise<string> {
    return todoAccess.deleteTodo(todoId);
}

export async function generateUploadUrl(todoId: string): Promise<string> {
    return todoAccess.generateUploadUrl(todoId);
}

export async function deleteFromS3(key: string): Promise<string> {
    return todoAccess.deleteFromS3(key)
}

export async function greyImage(url: string, key: string): Promise<Buffer> {
    return await Jimp.read(url)
                    .then((image) => {
                    console.log( "Before resizing")
                    return image.greyscale().getBufferAsync("image/jpeg", (err,buffer) => {
                            console.log(err,'Error');
                            return buffer
                            })
                    })
                    .then((image) => {
                    console.log('Buffer',image)
                    return this.uploadToS3(image,key);
                    }) 
                    .catch(err => {
                        throw err;
                    })
                    .finally(() => {
                        console.info("Function ran successfully")
                    })
}