const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const counter = document.getElementById('counter');
const clearDoneBtn = document.getElementById('clear-done');
const filterButtons = document.querySelectorAll('.filter');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function render() {
  list.innerHTML = '';

  const visible = tasks.filter(function (task) {
    if (currentFilter === 'active') return !task.done;
    if (currentFilter === 'done') return task.done;
    return true;
  });

  visible.forEach(function (task) {
    const li = document.createElement('li');
    if (task.done) li.classList.add('done');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', function () {
      task.done = checkbox.checked;
      save();
      render();
    });

    const text = document.createElement('span');
    text.textContent = task.text;

    const del = document.createElement('button');
    del.textContent = '✕';
    del.className = 'delete';
    del.addEventListener('click', function () {
      tasks = tasks.filter(function (t) {
        return t.id !== task.id;
      });
      save();
      render();
    });

    li.append(checkbox, text, del);
    list.appendChild(li);
  });

  const left = tasks.filter(function (t) {
    return !t.done;
  }).length;
  counter.textContent = 'Залишилось: ' + left + ' з ' + tasks.length;
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const text = input.value.trim();
  if (text === '') return;

  tasks.push({ id: Date.now(), text: text, done: false });
  input.value = '';
  save();
  render();
});

clearDoneBtn.addEventListener('click', function () {
  tasks = tasks.filter(function (t) {
    return !t.done;
  });
  save();
  render();
});

filterButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');
    render();
  });
});

render();
