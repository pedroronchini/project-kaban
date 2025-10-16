import { escapeHtml, activateDrag } from './functions';

$(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    // Se estamos na página dashboard
    if ($('#breezeDashboard').length) {
        // Carrega os quadros
        boards.loadBoards();

        // Ao clicar editar abre o modal
        $(document).on('click', '.btn-edit-board', function() {
            const id = $(this).data('id');
            const name = $(this).data('name');
            const description = $(this).data('description');

            $('#editBoardId').val(id);
            $('#editBoardName').val(name);
            $('#editBoardDescription').val(description);

            $('#editBoardModal').modal('show');
        });

        // Ao clicar em excluir, abre o confirm
        $(document).on('click', '.btn-delete-board', function() {
            if (!confirm('Tem certeza que deseja excluir este quadro?')) return;

            const id = $(this).data('id');

            $.ajax({
                url: `/api/boards/${id}`,
                method: 'DELETE',
                success: () => {
                    boards.loadBoards();
                },
                error: (xhr) => {
                    alert('Erro ao excluir quadro');
                    console.error(xhr.responseText);
                }
            })
        })
        // Cria um quadro
        $('#createBoardForm').on('submit', function (e) {
            e.preventDefault();

            const name = $('#boardName').val().trim();
            const description = $('#boardDescription').val().trim();

            if (!name) return;

            $.post('/api/boards', { name, description })
                .done(() => {
                    $('#boardName').val('');
                    $('#boardDescription').val('');
                    $('#createBoardModal').modal('hide');
                    boards.loadBoards();
                })
                .fail(err => alert('Erro: ' + (err.responseJSON?.message || err.statusText)));
        });

        // Edita o quadro
        $('#editBoardForm').on('submit', function(e) {
            e.preventDefault();
            const id = $('#editBoardId').val();
            const name = $('#editBoardName').val();
            const description = $('#editBoardDescription').val();

            $.ajax({
                url: `/api/boards/${id}`,
                method: 'PUT',
                data: {
                    name,
                    description
                },
                success: () => {
                    boards.loadBoards();
                    $('#editBoardModal').modal('hide');
                },
                error: (xhr) => {
                    alert('Erro ao atualizar quadro');
                    console.error(xhr.responseText);
                }
            });
        });
    }

    // Se estamos dentro de um quadro
    if ($('#kanbanBoardContainer').length) {
        const boardId = $('#kanbanBoardContainer').data('board-id');

        // Carrega os dados daquele board
        boards.loadBoard(boardId);

        $('#createColumnForm').on('submit', function (e) {
            e.preventDefault();

            const name = $('#columnName').val().trim();
            const order = $('#kanbanBoardContainer').attr("data-next_order");

            if (!name) return;

            $.post(`/api/boards/${boardId}/categories`, { name, order })
                .done(() => {
                    $('#columnName').val('');
                    $('#createColumnModal').addClass('hidden');
                    $('#createColumnModal').modal('hide')
                    boards.loadBoard(boardId);
                })
                .fail(err => alert('Erro: ' + (err.responseJSON?.message || err.statusText)));
        });

        // Criar task
        $('#kanbanBoardContainer').on('submit', '.createTaskForm', function (e) {
            e.preventDefault();

            const $f = $(this);
            const columnId = $f.data('column-id');
            const title = $f.find('.taskTitle').val().trim();

            if (!title) return;

            $.post(`/api/columns/${columnId}/tasks`, { title })
                .done(() => boards.loadBoard(boardId));
        });
    }
});



const boards = {
    loadBoards: () => {
        $('#boardsList').html('<p class="text-gray-500">Carregando...</p>');

        $.getJSON('/api/boards', boards => {

            if (!boards.length) {
                $('#boardsList').html('<p class="text-gray-500">Nenhum quadro criado.</p>');
                return;
            }

            $('#boardsList').html('');

            boards.forEach(board => {
                const {
                    id,
                    name,
                    description,
                    created_at
                } = board;

                $('#boardsList').append(`
                    <div class="bg-white shadow-sm rounded p-4 flex flex-col justify-between">
                        <div>
                            <h3 class="text-lg font-semibold">${escapeHtml(name)}</h3>
                            <p class="text-sm text-gray-500">${description != null && description ? description : ''}</p>
                            <p class="text-sm text-gray-500">Criado em ${new Date(created_at).toLocaleDateString()}</p>
                        </div>
                        <div class="mt-3">
                            <a href="/boards/${id}" class="text-blue-600 hover:underline text-sm">Abrir quadro →</a>

                            <div class="mt-3">
                                <button class="btn btn-sm btn-outline-secondary me-1 btn-edit-board" data-id="${id}" data-name="${name}" data-description="${description}" >
                                    Editar
                                </button>
                                <button class="btn btn-sm btn-outline-danger btn-delete-board" data-id="${id}">
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                `);
            });
        });
    },

    loadBoard: (id) => {
        $('#kanbanBoardContainer').html('<p class="text-gray-500 p-4">Carregando...</p>');

        $.getJSON(`/api/boards/${id}`, data => {
            const {
                id,
                user_id,
                name,
                description,
                created_at,
                updated_at,
                categories
            } = data;

            if (categories.length > 0) {
                const html = `
                    <div class="container-fluid py-4 bg-light" style="background-color: #e2e8f0; min-height: 100vh;">
                        <div class="d-flex flex-row flex-nowrap overflow-auto gap-3 px-2">
                            ${categories.map(category => {
                                const columns = `
                                    <div class="card shadow-lg flex-shrink-0 bg-white" style="width: 18rem; border-radius: 1rem; box-shadow: inset 0 0 20px rgba(0,0,0,0.05);">
                                        <div class="card-header fw-bold text-center bg-light border-bottom">${category.name}</div>
                                        <div class="card-body p-2 task-list" style="max-height: 70vh; overflow-y: auto;" data-category-id="${category.id}">
                                            ${category.tasks.map(task => {
                                                const {
                                                    id,
                                                    title,
                                                    description,
                                                    created_at
                                                } = task;

                                                const taskDescription = task.description && task.description != null ? `<p class="text-muted small mb-0">${description}</p>` : '';

                                                const htmlTask = `
                                                    <div class="card mb-2 border-0 shadow-sm cursor-pointer transition-all duration-200" data-task-id="${id}">
                                                        <div class="card-body py-2 px-3">
                                                            <h6 class="fw-semibold mb-1">${title}</h6>
                                                            ${taskDescription}
                                                        </div>
                                                    </div>
                                                `;

                                                return htmlTask;
                                            })}
                                        </div>

                                        <div class="card-footer bg-transparent border-top">
                                            <button class="btn btn-primary w-100 btn-sm rounded-pill btn-new-task" data-card-id="${category.id}">
                                                + Adicionar card
                                            </button>
                                        </div>
                                    </div>
                                `;

                                return columns;
                            })}
                        </div>
                    </div>
                `;

                $('#kanbanBoardContainer').html(html);
                activateDrag();
            } else {
                $('#kanbanBoardContainer').html('<p class="text-gray-500 p-4">Nenhuma categoria encontrada</p>');
                $('#kanbanBoardContainer').attr("data-next_order", 0);
            }
            console.log(data)
        });
    },

    renderBoard: (data) => {
        console.log(data)
            // const columns = data.columns || [];
            // const html = `
            //     <div class="flex items-center justify-between mb-4">
            //     <h2 class="text-2xl font-semibold">${escapeHtml(data.board.name)}</h2>
            //     <button id="btnAddColumn" class="bg-blue-600 text-white px-3 py-1 rounded text-sm" data-bs-toggle="modal" data-bs-target="#createColumnModal">+ Coluna</button>
            //     </div>
            //     <div class="flex gap-4 overflow-x-auto" id="kanbanColumnsRoot">
            //     ${columns.map(col => `
            //         <div class="bg-gray-50 rounded p-3 min-w-[250px] flex flex-col" data-column-id="${col.id}">
            //         <div class="font-semibold mb-2">${escapeHtml(col.name)}</div>
            //         <div class="kanban-tasks flex-1 mb-2" data-column-id="${col.id}">
            //             ${col.tasks.map(t => `<div class="bg-white p-2 mb-2 rounded shadow-sm kanban-task" data-task-id="${t.id}">${escapeHtml(t.title)}</div>`).join('')}
            //         </div>
            //         <form class="createTaskForm" data-column-id="${col.id}">
            //             <input type="text" class="taskTitle border rounded w-full text-sm p-1" placeholder="Nova task..." />
            //         </form>
            //         </div>
            //     `).join('')}
            //     </div>
            // `;
            // $('#kanbanBoardContainer').html(html);
            // activateDrag();
    }
}
