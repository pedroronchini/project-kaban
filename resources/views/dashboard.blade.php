<x-app-layout>
    <x-slot name="header">
        <div class="flex items-center justify-between">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ __('Dashboard') }}
            </h2>
            <button class="bg-blue-600 text-white px-4 py-2 rounded text-sm" data-bs-toggle="modal" data-bs-target="#createBoardModal">+ Novo Quadro</button>
        </div>
    </x-slot>

    <div id="breezeDashboard" class="py-6">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div id="boardsList" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Quadros carregados via AJAX -->
            </div>
        </div>
    </div>

    <!-- Modal criar quadro -->
    <div class="modal fade" id="createBoardModal" tabindex="-1">
      <div class="modal-dialog">
        <form id="createBoardForm" class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Criar Quadro</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Nome do Quadro</label>
              <input id="boardName" class="form-control" required />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Cancelar</button>
            <button class="btn btn-primary" type="submit">Criar</button>
          </div>
        </form>
      </div>
    </div>
</x-app-layout>
