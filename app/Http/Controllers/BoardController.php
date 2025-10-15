<?php

namespace App\Http\Controllers;

use App\Models\Board;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Auth\Access\AuthorizationException;
use Throwable;

class BoardController extends Controller
{
    public function index()
    {
        try {
            $boards = Board::where('user_id', Auth::id())->get();

            return response()->json($boards, 200);
        } catch (Throwable $e) {
            return response()->json(['error' => 'Erro ao listar quadros', 'details' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'description' => 'nullable|string|max:500',
            ]);

            $board = Board::create([
                'user_id' => Auth::id(),
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
            ]);

            return response()->json($board, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Erro de validação', 'details' => $e->errors()], 422);
        } catch (Throwable $e) {
            return response()->json(['error' => 'Erro ao criar quadro', 'details' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $board = Board::with('categories.tasks')->findOrFail($id);

            return response()->json($board, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Quadro não encontrado'], 404);
        } catch (AuthorizationException $e) {
            return response()->json(['error' => 'Acesso negado'], 403);
        } catch (Throwable $e) {
            return response()->json(['error' => 'Erro ao buscar quadro'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $board = Board::findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'description' => 'nullable|string|max:500',
            ]);

            $board->update($validated);

            return response()->json($board, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Quadro não encontrado'], 404);
        } catch (AuthorizationException $e) {
            return response()->json(['error' => 'Acesso negado'], 403);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Erro de validação', 'details' => $e->errors()], 422);
        } catch (Throwable $e) {
            return response()->json(['error' => 'Erro ao atualizar quadro'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $board = Board::findOrFail($id);

            $board->delete();

            return response()->json(['message' => 'Quadro excluído com sucesso'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Quadro não encontrado'], 404);
        } catch (AuthorizationException $e) {
            return response()->json(['error' => 'Acesso negado'], 403);
        } catch (Throwable $e) {
            return response()->json(['error' => 'Erro ao excluir quadro'], 500);
        }
    }
}
