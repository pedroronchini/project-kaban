import './bootstrap';

import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.start();


$(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    // Se estamos na página dashboard
    if ($('#breezeDashboard').length) {
        loadBoards();

        $('#createBoardForm').on('submit', function (e) {
            e.preventDefault();
            const name = $('#boardName').val().trim();
            if (!name) return;
            $.post('/api/boards', { name })
                .done(() => {
                    $('#boardName').val('');
                    $('#createBoardModal').modal('hide');
                    loadBoards();
                })
                .fail(err => alert('Erro: ' + (err.responseJSON?.message || err.statusText)));
        });
    }

    function loadBoards() {
        $('#boardsList').html('<p class="text-gray-500">Carregando...</p>');
        $.getJSON('/api/boards', boards => {
            if (!boards.length) {
                $('#boardsList').html('<p class="text-gray-500">Nenhum quadro criado.</p>');
                return;
            }
            $('#boardsList').html('');
            boards.forEach(b => {
                $('#boardsList').append(`
          <div class="bg-white shadow-sm rounded p-4 flex flex-col justify-between">
            <div>
              <h3 class="text-lg font-semibold">${escapeHtml(b.name)}</h3>
              <p class="text-sm text-gray-500">Criado em ${new Date(b.created_at).toLocaleDateString()}</p>
            </div>
            <div class="mt-3">
              <a href="/boards/${b.id}" class="text-blue-600 hover:underline text-sm">Abrir quadro →</a>
            </div>
          </div>
        `);
            });
        });
    }

    // Se estamos dentro de um quadro
    if ($('#kanbanBoardContainer').length) {
        const boardId = $('#kanbanBoardContainer').data('board-id');
        loadBoard(boardId);

        $('#createColumnForm').on('submit', function (e) {
            e.preventDefault();
            const name = $('#columnName').val().trim();
            if (!name) return;
            $.post(`/api/boards/${boardId}/columns`, { name })
                .done(() => {
                    $('#columnName').val('');
                    $('#createColumnModal').addClass('hidden');
                    loadBoard(boardId);
                })
                .fail(err => alert('Erro: ' + (err.responseJSON?.message || err.statusText)));
        });

        // criar task
        $('#kanbanBoardContainer').on('submit', '.createTaskForm', function (e) {
            e.preventDefault();
            const $f = $(this);
            const columnId = $f.data('column-id');
            const title = $f.find('.taskTitle').val().trim();
            if (!title) return;
            $.post(`/api/columns/${columnId}/tasks`, { title })
                .done(() => loadBoard(boardId));
        });

        function loadBoard(id) {
            $('#kanbanBoardContainer').html('<p class="text-gray-500 p-4">Carregando...</p>');
            $.getJSON(`/api/boards/${id}/full`, data => renderBoard(data));
        }

        function renderBoard(data) {
            const columns = data.columns || [];
            const html = `
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-semibold">${escapeHtml(data.board.name)}</h2>
          <button id="btnAddColumn" class="bg-blue-600 text-white px-3 py-1 rounded text-sm" data-bs-toggle="modal" data-bs-target="#createColumnModal">+ Coluna</button>
        </div>
        <div class="flex gap-4 overflow-x-auto" id="kanbanColumnsRoot">
          ${columns.map(col => `
            <div class="bg-gray-50 rounded p-3 min-w-[250px] flex flex-col" data-column-id="${col.id}">
              <div class="font-semibold mb-2">${escapeHtml(col.name)}</div>
              <div class="kanban-tasks flex-1 mb-2" data-column-id="${col.id}">
                ${col.tasks.map(t => `<div class="bg-white p-2 mb-2 rounded shadow-sm kanban-task" data-task-id="${t.id}">${escapeHtml(t.title)}</div>`).join('')}
              </div>
              <form class="createTaskForm" data-column-id="${col.id}">
                <input type="text" class="taskTitle border rounded w-full text-sm p-1" placeholder="Nova task..." />
              </form>
            </div>
          `).join('')}
        </div>
      `;
            $('#kanbanBoardContainer').html(html);
            activateDrag();
        }

        function activateDrag() {
            $('.kanban-tasks').sortable({
                connectWith: '.kanban-tasks',
                stop: function (e, ui) {
                    const taskId = ui.item.data('task-id');
                    const newCol = ui.item.closest('.kanban-tasks').data('column-id');
                    const order = [];
                    ui.item.closest('.kanban-tasks').find('.kanban-task').each(function (i, el) {
                        order.push({ id: $(el).data('task-id'), position: i });
                    });
                    $.ajax({
                        url: '/api/tasks/reorder',
                        method: 'PATCH',
                        contentType: 'application/json',
                        data: JSON.stringify({ column_id: newCol, order })
                    });
                }
            }).disableSelection();
        }
    }

    function escapeHtml(text) {
        return $('<div>').text(text).html();
    }
});

