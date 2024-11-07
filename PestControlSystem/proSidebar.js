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

const chartOptions = {
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
    tooltips: {
        enabled: false,
    },
    elements: {
        point: {
            radius: 0,
        },
        line: {
            tension: 0.1,
        },
    },
    scales: {
        xAxes: [{
            gridLines: {
                display: true,
                color: "rgba(0, 0, 0, 0.1)",
            },
            ticks: {
                display: true,
                fontColor: "#aaa",
            },
        }],
        yAxes: [{
            gridLines: {
                display: true,
                color: "rgba(0, 0, 0, 0.1)",
            },
            ticks: {
                display: true,
                fontColor: "#aaa",
                suggestedMin: 0,
                suggestedMax: 10,
            },
        }],
    },
};

var ctx1 = document.getElementById('chart1').getContext('2d');
var chart1 = new Chart(ctx1, {
    type: "line",
    data: {
        labels: [1, 2, 1, 3, 5, 4, 7],
        datasets: [
            {
                backgroundColor: "rgba(101, 116, 205, 0.1)",
                borderColor: "rgba(101, 116, 205, 0.8)",
                borderWidth: 2,
                data: [1, 2, 1, 3, 5, 4, 7],
            },
        ],
    },
    options: chartOptions,
});

var ctx2 = document.getElementById('chart2').getContext('2d');
var chart2 = new Chart(ctx2, {
    type: "line",
    data: {
        labels: [2, 3, 2, 9, 7, 7, 4],
        datasets: [
            {
                backgroundColor: "rgba(246, 109, 155, 0.1)",
                borderColor: "rgba(246, 109, 155, 0.8)",
                borderWidth: 2,
                data: [2, 3, 2, 9, 7, 7, 4],
            },
        ],
    },
    options: chartOptions,
});

var ctx3 = document.getElementById('chart3').getContext('2d');
var chart3 = new Chart(ctx3, {
    type: "line",
    data: {
        labels: [2, 5, 1, 3, 2, 6, 7],
        datasets: [
            {
                backgroundColor: "rgba(246, 153, 63, 0.1)",
                borderColor: "rgba(246, 153, 63, 0.8)",
                borderWidth: 2,
                data: [2, 5, 1, 3, 2, 6, 7],
            },
        ],
    },
    options: chartOptions,
});

function generateCalendar(year, month) {
    const calendarElement = document.getElementById('calendar');
    const currentMonthElement = document.getElementById('currentMonth');
    
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    calendarElement.innerHTML = '';
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    currentMonthElement.innerText = `${monthNames[month]} ${year}`;
    
    const firstDayOfWeek = firstDayOfMonth.getDay();

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'text-center font-semibold';
        dayElement.innerText = day;
        calendarElement.appendChild(dayElement);
    });

    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyDayElement = document.createElement('div');
        calendarElement.appendChild(emptyDayElement);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'text-center py-2 border cursor-pointer';
        dayElement.innerText = day;

        const currentDate = new Date();
        if (year === currentDate.getFullYear() && month === currentDate.getMonth() && day === currentDate.getDate()) {
            dayElement.classList.add('bg-blue-500', 'text-white');
        }

        calendarElement.appendChild(dayElement);
    }
}

const currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();
generateCalendar(currentYear, currentMonth);

document.getElementById('prevMonth').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentYear, currentMonth);
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentYear, currentMonth);
});

function showModal(selectedDate) {
    const modal = document.getElementById('myModal');
    const modalDateElement = document.getElementById('modalDate');
    modalDateElement.innerText = selectedDate;
    modal.classList.remove('hidden');
}

function hideModal() {
    const modal = document.getElementById('myModal');
    modal.classList.add('hidden');
}

const dayElements = document.querySelectorAll('.cursor-pointer');
dayElements.forEach(dayElement => {
    dayElement.addEventListener('click', () => {
        const day = parseInt(dayElement.innerText);
        const selectedDate = new Date(currentYear, currentMonth, day);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = selectedDate.toLocaleDateString(undefined, options);
        showModal(formattedDate);
    });
});

document.getElementById('closeModal').addEventListener('click', () => {
    hideModal();
});
