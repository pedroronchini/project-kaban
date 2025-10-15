<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Auth\Access\AuthorizationException;
use Throwable;

class CategoryController extends Controller
{
    public function index($board_id)
    {
        try {
            $board = Board::findOrFail($board_id);

            $categories = $board->categories()->with('tasks')->orderBy('order')->get();

            return response()->json($categories, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Quadro não encontrado'], 404);
        } catch (AuthorizationException $e) {
            return response()->json(['error' => 'Acesso negado'], 403);
        } catch (Throwable $e) {
            return response()->json(['error' => 'Erro ao listar categorias'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'board_id' => 'required|exists:boards,id',
                'name' => 'required|string|max:100',
                'order' => 'nullable|integer',
            ]);

            $board = Board::findOrFail($validated['board_id']);

            $category = Category::create($validated);

            return response()->json($category, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Erro de validação', 'details' => $e->errors()], 422);
        } catch (Throwable $e) {
            return response()->json(['error' => 'Erro ao criar categoria'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $category = Category::findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'order' => 'nullable|integer',
            ]);

            $category->update($validated);

            return response()->json($category, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Categoria não encontrada'], 404);
        } catch (AuthorizationException $e) {
            return response()->json(['error' => 'Acesso negado'], 403);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Erro de validação', 'details' => $e->errors()], 422);
        } catch (Throwable $e) {
            return response()->json(['error' => 'Erro ao atualizar categoria'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $category = Category::findOrFail($id);

            $category->delete();

            return response()->json(['message' => 'Categoria excluída com sucesso'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Categoria não encontrada'], 404);
        } catch (AuthorizationException $e) {
            return response()->json(['error' => 'Acesso negado'], 403);
        } catch (Throwable $e) {
            return response()->json(['error' => 'Erro ao excluir categoria'], 500);
        }
    }
}
