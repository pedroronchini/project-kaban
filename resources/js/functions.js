export function activateDrag() {
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

export function escapeHtml(text) {
    return $('<div>').text(text).html();
}
