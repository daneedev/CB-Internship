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

        // Avatar edit functionality
        const avatarEdit = document.querySelector('.avatar-edit');
        avatarEdit.addEventListener('click', function() {
            alert('Avatar upload functionality would be implemented here');
        });

        // Action button functionality
        const actionButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                alert(`${this.textContent} functionality would be implemented here`);
            });
        });

        // Business item click functionality
        const businessItems = document.querySelectorAll('.business-item');
        businessItems.forEach(item => {
            item.addEventListener('click', function() {
                const businessName = this.querySelector('h4').textContent;
                alert(`Navigate to ${businessName} dashboard`);
            });
        });
    });