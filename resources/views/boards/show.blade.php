<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ $board->name }}
        </h2>
    </x-slot>

    <div id="kanbanBoardContainer" class="p-6" data-board-id="{{ $board->id }}">
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
</x-app-layout>
