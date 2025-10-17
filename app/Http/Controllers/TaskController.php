<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Throwable;

class TaskController extends Controller
{
    public function index($category_id)
    {
        try {
            $category = Category::findOrFail($category_id);

            $tasks = $category->tasks()->orderBy('order')->get();

            return response()->json($tasks, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Categoria não encontrada'], 404);
        } catch (Throwable $e) {
            return response()->json(['error' => 'Erro ao listar tarefas'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'category_id' => 'required|exists:categories,id',
                'title' => 'required|string|max:150',
                'description' => 'nullable|string|max:1000',
                'order' => 'nullable|integer',
            ]);

            $task = Task::create($validated);

            return response()->json($task, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Erro de validação', 'details' => $e->errors()], 422);
        } catch (Throwable $e) {
            return response()->json(['error' => 'Erro ao criar tarefa'], 500);
        }
    }

    public function show($id) {
        try {
            $task = Task::findOrFail($id);

            return response()->json($task, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Tarefa não encontrada'], 404);
        } catch (Throwable $e) {
            return response()->json(['error' => 'Erro ao buscar tarefa'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $task = Task::findOrFail($id);

            $validated = $request->validate([
                'title' => 'required|string|max:150',
                'description' => 'nullable|string|max:1000',
                'category_id' => 'nullable|integer',
            ]);

            $task->update($validated);

            return response()->json($task, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Tarefa não encontrada'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Erro de validação', 'details' => $e->errors()], 422);
        } catch (Throwable $e) {
            return response()->json(['error' => 'Erro ao atualizar tarefa'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $task = Task::findOrFail($id);
            $task->delete();

            return response()->json(['message' => 'Tarefa excluída com sucesso'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Tarefa não encontrada'], 404);
        } catch (Throwable $e) {
            return response()->json(['error' => 'Erro ao excluir tarefa'], 500);
        }
    }

    public function reorder(Request $request)
    {
        try {
            $validated = $request->validate([
                'category_id' => 'required|exists:categories,id',
                'order' => 'required|array',
                'order.*' => 'integer|exists:tasks,id',
            ]);

            foreach ($validated['order'] as $index => $taskId) {
                Task::where('id', $taskId)->update([
                    'category_id' => $validated['category_id'],
                    'order' => $index,
                ]);
            }

            return response()->json(['message' => 'Tarefas reordenadas com sucesso'], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Erro de validação', 'details' => $e->errors()], 422);
        } catch (Throwable $e) {
            return response()->json(['error' => 'Erro ao reordenar tarefas'], 500);
        }
    }
}
