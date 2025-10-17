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
        $(document).on('click', '.btn-edit-board', function () {
            const id = $(this).data('id');
            const name = $(this).data('name');
            const description = $(this).data('description');

            $('#editBoardId').val(id);
            $('#editBoardName').val(name);
            $('#editBoardDescription').val(description);

            $('#editBoardModal').modal('show');
        });

        // Ao clicar em excluir, abre o confirm
        $(document).on('click', '.btn-delete-board', function () {
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
            });
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
        $('#editBoardForm').on('submit', function (e) {
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

        // Abre o modal de criar a tarefa
        $(document).on('click', '.btn-new-task', function () {
            const id = $(this).data('card-id');

            $('#createTaskForm').attr('data-id_category', id);

            $('#createTaskModal').modal('show');
        });

        // Abre o modal de editar a tarefa
        $(document).on('click', '.task-item', function () {
            const id = $(this).data('task-id');

            boards.getCategories(boardId);

            $.getJSON(`/api/tasks/${id}`, data => {
                if (data) {
                    const {
                        id,
                        title,
                        description,
                        category_id
                    } = data;

                    $('#taskId').val(id);
                    $('#taskForm').find('input[name=taskTitle]').val(title);
                    $('#taskForm').find('textarea[name=taskDescription]').val(description);
                    $('#taskCategory').val(category_id);

                    $('#taskModal').modal('show');
                } else {
                    alert('Ocorreu um erro ao carregar a tarefa');
                }
            });
        });

        // Abre o modal de editar a coluna|categoria
        $(document).on('click', '.btn-edit-category', function () {
            const id =  $(this).data('id_category');
            const name = $(this).data('name_category');

            $('#editIdCategory').val(id);
            $('#editCategoryName').val(name);

            $('#editCategoryModal').modal('show');
        });

        // Ao clicar em excluir coluna|categoria abre o confirm
        $(document).on('click', '.btn-delete-category', function () {
            if (!confirm('Tem certeza que deseja excluir esta coluna?')) return;

            const id = $(this).data('id_category');

            $.ajax({
                url: `/api/categories/${id}`,
                method: 'DELETE',
                success: () => {
                    boards.loadBoard(boardId);
                },
                error: (xhr) => {
                    alert('Erro ao excluir coluna');
                    console.error(xhr.responseText);
                }
            })
        });

        // Ao clicar em excluir tarefa abre o confirm
        $(document).on('click', '.btn-delete-task', function () {
            if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

            const id = $('#taskId').val();

            $.ajax({
                url: `/api/tasks/${id}`,
                method: 'DELETE',
                success: () => {
                    boards.loadBoard(boardId);
                    $('#taskModal').modal('hide');
                },
                error: (xhr) => {
                    alert('Erro ao excluir tarefa');
                    console.error(xhr.responseText);
                }
            });
        });

        // Cria as categorias|colunas
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
        $('#createTaskForm').on('submit', function (e) {
            e.preventDefault();

            const category_id = $(this).data('id_category');
            const title = $('#taskTitle').val();
            const description = $('#taskDescription').val();
            const order = $(this).data('order_task');

            if (!title) return;

            $.post(`/api/categories/${category_id}/tasks`, {
                category_id,
                title,
                description,
                order
             })
                .done(() => {
                    boards.loadBoard(boardId);
                    $('#createTaskModal').modal('hide');
                });
        });

        // Edita as categorias|colunas
        $('#editCategoryForm').on('submit', function (e) {
            e.preventDefault();

            const id = $('#editIdCategory').val();
            const name = $('#editCategoryName').val();

            $.ajax({
                url: `/api/categories/${id}`,
                method: 'PUT',
                data: { name },
                success: () => {
                    boards.loadBoard(boardId);
                    $('#editCategoryModal').modal('hide');
                },
                error: (xhr) => {
                    alert('Erro ao atualizar a coluna');
                    console.error(xhr.responseText);
                }
            })
        });

        // Editar tarefa
        $('#taskForm').on('submit', function (e) {
            e.preventDefault();

            const id = $('#taskId').val();
            const title = $(this).find('input[name=taskTitle]').val();
            const description = $(this).find('textarea[name=taskDescription]').val();
            const category_id = $('#taskCategory').val();

            $.ajax({
                url: `/api/tasks/${id}`,
                method: 'PUT',
                data: {
                    title,
                    description,
                    category_id
                },
                success: () => {
                    boards.loadBoard(boardId);
                    $('#taskModal').modal('hide');
                },
                error: (xhr) => {
                    alert('Erro ao atualizar tarefa');
                    console.error(xhr.responseText);
                }
            })
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
                                <button class="btn btn-sm btn-outline-secondary me-1 btn-edit-board" data-id="${id}" data-name="${name}" data-description="${description}" title="Editar" >
                                    <span class="material-symbols-outlined">edit</span>
                                </button>
                                <button class="btn btn-sm btn-outline-danger btn-delete-board" data-id="${id}" title="Excluir">
                                    <span class="material-symbols-outlined">delete</span>
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
                $('#kanbanBoardContainer').attr("data-next_order", categories.length);


                const html = `
                    <div class="container-fluid py-4" style="min-height: 100vh;">
                        <div class="d-flex flex-row flex-nowrap overflow-auto gap-3 px-2">
                            ${categories.map(category => {
                                $('#createTaskForm').attr('data-order_task', category.tasks.length);

                                return `
                                    <div class="card shadow-lg flex-shrink-0 bg-white" style="width: 18rem; border-radius: 1rem;">
                                        <div class="card-header d-flex justify-content-between align-items-center">
                                            <h6 class="mb-0">${category.name}</h6>
                                            <div class="dropdown">
                                                <button class="btn btn-light btn-sm" type="button" id="dropdownMenuCategoriesButton${category.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <span class="material-symbols-outlined">more_vert</span>
                                                </button>
                                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuCategoriesButton${category.id}">
                                                    <li>
                                                        <button type="button" class="dropdown-item btn-edit-category" data-id_category="${category.id}" data-name_category="${category.name}">
                                                            Editar
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" class="dropdown-item btn-delete-category" data-id_category="${category.id}">
                                                            Excluir
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="card-body p-2 task-list" style="max-height: 70vh; overflow-y: auto;" data-category-id="${category.id}">
                                            ${category.tasks.map(task =>  `
                                                    <div class="card mb-2 border-0 shadow-sm cursor-pointer transition-all duration-200 task-item" data-task-id="${task.id}">
                                                        <div class="card-body py-2 px-3">
                                                            <h6 class="fw-semibold mb-1">${task.title}</h6>
                                                            ${task.description && task.description != null ? `<p class="text-muted small mb-0">${task.description}</p>` : ''}
                                                        </div>
                                                    </div>
                                                `
                                            ).join('')}
                                        </div>

                                        <div class="card-footer bg-transparent border-top">
                                            <button class="btn btn-primary w-100 btn-sm rounded-pill btn-new-task" data-card-id="${category.id}">
                                                + Adicionar tarefa
                                            </button>
                                        </div>
                                    </div>
                                `}).join('')}
                        </div>
                    </div>
                `;

                $('#kanbanBoardContainer').html(html);
                activateDrag();
            } else {
                $('#kanbanBoardContainer').html('<p class="text-gray-500 p-4">Nenhuma categoria encontrada</p>');
                $('#kanbanBoardContainer').attr("data-next_order", 0);
            }
        });
    },

    getCategories: (boardId) => {
        $.getJSON(`/api/boards/${boardId}/categories`, data => {
            let html = '';

            data.forEach(category => {
                const {
                    id,
                    name
                } = category;

                html += `<option value="${id}">${name}</option>`;
            });

            $('#taskCategory').html(html);
        });
    }
}
