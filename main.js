// use local strages
let STRAGE_KEY = 'todos-vuejs-demo';
let todoStrage = {
  fetch: function() {
    let todos = JSON.parse(
      localStorage.getItem(STRAGE_KEY) || '[]'
    );
    todos.forEach(function(todo, index) {
      todo.id = index + 1;
    });
    todoStrage.uid = todos.length;
    return todos;
  },
  save: function(todos) {
    localStorage.setItem(STRAGE_KEY, JSON.stringify(todos))
  }
};

const app = new Vue({
  el: "#app",
  
  data: {
    todos: [],
    options: [
      { value: -1, label: 'すべて' },
      { value: 0, label: '作業中' },
      { value: 1, label: '完了' },
    ],
    current: -1,
  },

  computed: {
    computedTodos: function() {
      return this.todos.filter(function(el) {
        return this.current < 0 ? true : this.current === el.state
      }, this)
    },
    labels() {
      return this.options.reduce(function(a, b) {
        return Object.assign(a, { [b.value]: b.label })
      }, {});
    },
  },

  // ストレージへの保存の自動化
  watch: { 
    todos: {
      handler: function(todos) {
        todoStrage.save(todos);
      },
      deep: true
    },
  },

  // ライフサイクルハック
  created() {
    this.todos = todoStrage.fetch(); // インスタンス化した際にデータ取得
  },

  methods: {
    // create
    doAdd: function() {
      let comment = this.$refs.comment;
      if(!comment.value.length) {
        return;
      }
      this.todos.push({
        id: todoStrage.uid++,
        comment: comment.value,
        state: 0,
      });
      comment.value = '';
    },
    // update
    doChangeState: function(item) {
      item.state = item.state ? 0 : 1;
    },
    // delete
    doRemove: function(item) {
      let index = this.todos.indexOf(item);
      this.todos.splice(index, 1);
    }
  },
})
