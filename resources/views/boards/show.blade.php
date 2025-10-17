<x-app-layout>
    <x-slot name="header">
        <div class="flex items-center justify-between">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ $board->name }}
            </h2>
            <button class="bg-blue-600 text-white px-4 py-2 rounded text-sm" data-bs-toggle="modal"
                data-bs-target="#createColumnModal">Nova Coluna</button>
        </div>
    </x-slot>

    <div id="kanbanBoardContainer" class="p-6 d-flex justify-center" style="background-color: #767676;"
        data-board-id="{{ $board->id }}">
        <!-- Carregado via AJAX -->
    </div>

    <!-- Modal criar coluna -->
    <div class="modal fade" id="createColumnModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <form id="createColumnForm" class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Criar Coluna</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <input id="columnName" class="form-control" placeholder="Nome da coluna..." required />
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Cancelar</button>
                    <button class="btn btn-primary" type="submit">Criar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal criar tarefa -->
    <div class="modal fade" id="createTaskModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <form id="createTaskForm" class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Criar Tarefa</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="taskTitle" class="form-label">Nome da tarefa</label>
                        <input id="taskTitle" class="form-control" required />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Descrição</label>
                        <textarea id="taskDescription" class="form-control"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Cancelar</button>
                    <button class="btn btn-primary" type="submit">Criar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal editar categoria -->
    <div class="modal fade" id="editCategoryModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <form id="editCategoryForm" class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar Coluna</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="editIdCategory">
                    <input id="editCategoryName" class="form-control" placeholder="Nome da tarefa..." required />
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Cancelar</button>
                    <button class="btn btn-primary" type="submit">Salvar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal tarefa -->
    <!-- Modal Detalhes da Task -->
    <div class="modal fade" id="taskModal" tabindex="-1" aria-labelledby="taskModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <form id="taskForm">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="taskModalLabel">Detalhes da Tarefa</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="taskId">

                        <div class="mb-3">
                            <label for="taskTitle" class="form-label">Título</label>
                            <input type="text" class="form-control" name="taskTitle" id="taskTitle" required>
                        </div>

                        <div class="mb-3">
                            <label for="taskDescription" class="form-label">Descrição</label>
                            <textarea class="form-control" name="taskDescription" id="taskDescription"></textarea>
                        </div>

                        <div class="mb-3">
                            <label for="taskCategory" class="form-label">Mover para</label>
                            <select class="form-select" id="taskCategory">

                            </select>
                        </div>

                    </div>
                    <div class="modal-footer d-flex justify-content-between">
                        <button type="button" class="btn btn-danger btn-delete-task">Excluir</button>
                        <div>
                            <button type="button" class="btn btn-secondary"
                                data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Salvar alterações</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>

</x-app-layout>
