const menuItems = document.querySelectorAll('.menu-item');

const activeMenu = localStorage.getItem('activeMenu') || 'customers';

menuItems.forEach(item => {
    if (item.getAttribute('data-menu') === activeMenu) {
        item.classList.add('active');
    }
});

menuItems.forEach(item => {
    item.addEventListener('click', function() {
        menuItems.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
        localStorage.setItem('activeMenu', this.getAttribute('data-menu'));
    });
});

const searchInput = document.getElementById('searchInput');
const activityLog = document.getElementById('activityLog');
const rows = Array.from(activityLog.getElementsByTagName('tr'));
let currentPage = 0;
const entriesPerPage = 8;

function updatePagination() {
    const start = currentPage * entriesPerPage;
    const end = start + entriesPerPage;
    const paginatedRows = rows.slice(start, end);
    activityLog.innerHTML = '';
    paginatedRows.forEach(row => activityLog.appendChild(row));

    document.getElementById('paginationInfo').innerText = `Showing ${start + 1} to ${Math.min(end, rows.length)} of ${rows.length} entries`;
}

updatePagination();

searchInput.addEventListener('keyup', function() {
    const filter = searchInput.value.toLowerCase();
    const filteredRows = rows.filter(row => {
        const cells = row.getElementsByTagName('td');
        return Array.from(cells).some(cell => cell.innerHTML.toLowerCase().includes(filter));
    });
    activityLog.innerHTML = '';
    filteredRows.forEach(row => activityLog.appendChild(row));

    const filteredCount = filteredRows.length;
    document.getElementById('paginationInfo').innerText = `Showing 1 to ${filteredCount} of ${filteredCount} entries`;
});

let sortOrder = 'newest';
document.getElementById('sortButton').addEventListener('click', function() {
    sortOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
    this.querySelector('span').innerText = sortOrder === 'newest' ? 'Sort by Newest' : 'Sort by Oldest';
    this.querySelector('.sort-arrow').innerText = sortOrder === 'newest' ? '▼' : '▲';

    const sortedRows = [...rows].sort((a, b) => {
        const dateA = new Date(a.cells[2].innerHTML);
        const dateB = new Date(b.cells[2].innerHTML);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    activityLog.innerHTML = '';
    sortedRows.forEach(row => activityLog.appendChild(row));
    updatePagination();
});

document.getElementById('prevButton').addEventListener('click', function() {
    if (currentPage > 0) {
        currentPage--;
        updatePagination();
    }
});

document.getElementById('nextButton').addEventListener('click', function() {
    if ((currentPage + 1) * entriesPerPage < rows.length) {
        currentPage++;
        updatePagination();
    }
});
