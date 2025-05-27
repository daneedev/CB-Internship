    document.addEventListener('DOMContentLoaded', function() {
        // Edit button functionality
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const row = this.closest('.info-row');
                const label = row.querySelector('.info-label').textContent;
                alert(`Edit ${label} functionality would be implemented here`);
            });
        });

    });